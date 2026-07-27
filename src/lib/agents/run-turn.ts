import type { Content, FunctionDeclaration } from "@google/genai"

import { GEMINI_MODEL, getGeminiClient } from "@/lib/gemini-client"
import { GUARDRAIL_TOOL } from "@/lib/agents/guardrail-tool"
import type { AgentArchetype, ToolDefinition, ToolTraceEntry } from "@/lib/agents/types"

const MAX_ROUNDS = 4

function toDeclaration(tool: ToolDefinition): FunctionDeclaration {
  return { name: tool.name, description: tool.description, parameters: tool.parameters }
}

export interface AgentTurnResult {
  reply: string
  guardrailTriggered: boolean
  toolTrace: ToolTraceEntry[]
}

export async function runAgentTurn(
  archetype: AgentArchetype,
  history: { role: "user" | "agent"; text: string }[],
  message: string
): Promise<AgentTurnResult> {
  const contents: Content[] = [
    ...history.map((h) => ({ role: h.role === "user" ? "user" : "model", parts: [{ text: h.text }] })),
    { role: "user", parts: [{ text: message }] },
  ]

  const allTools: ToolDefinition[] = [...archetype.tools, GUARDRAIL_TOOL]
  const toolMap = new Map(allTools.map((t) => [t.name, t.execute]))
  const toolTrace: ToolTraceEntry[] = []
  let guardrailTriggered = false

  const client = getGeminiClient()

  for (let round = 0; round < MAX_ROUNDS; round++) {
    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        systemInstruction: archetype.systemPrompt,
        tools: [{ functionDeclarations: allTools.map(toDeclaration) }],
      },
    })

    const calls = response.functionCalls
    if (!calls?.length) {
      const text = (response.text ?? "").trim()
      if (!text) throw new Error("Agent returned an empty response.")
      return { reply: text, guardrailTriggered, toolTrace }
    }

    // Echo the RAW parts array verbatim (preserves the opaque
    // thoughtSignature field the API requires on the next turn) —
    // reconstructing { functionCall: c } from response.functionCalls
    // drops it and the follow-up call 400s with "missing thought_signature".
    const modelParts = response.candidates?.[0]?.content?.parts
    if (!modelParts) throw new Error("Agent response was missing its content parts.")
    contents.push({ role: "model", parts: modelParts })

    const responseParts = calls.map((call) => {
      const name = call.name ?? ""
      const args = call.args ?? {}
      toolTrace.push({ name, args })
      if (name === "flagOutOfScope") guardrailTriggered = true

      const handler = toolMap.get(name)
      let result: Record<string, unknown>
      try {
        result = handler ? handler(args) : { error: `Unknown tool: ${name}` }
      } catch (err) {
        result = { error: err instanceof Error ? err.message : "Tool execution failed." }
      }
      return { functionResponse: { name, id: call.id, response: result } }
    })
    contents.push({ role: "user", parts: responseParts })
  }

  throw new Error("Agent exceeded maximum tool-call rounds.")
}
