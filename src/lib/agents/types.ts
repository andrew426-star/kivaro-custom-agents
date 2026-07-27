import type { Schema } from "@google/genai"

export type AgentArchetypeId = "portfolio-monitor" | "counterparty-risk" | "investor-query"

export interface ToolDefinition {
  name: string
  description: string
  parameters?: Schema // omit entirely for zero-arg tools
  execute: (args: Record<string, unknown>) => Record<string, unknown>
}

export interface AgentArchetype {
  id: AgentArchetypeId
  name: string
  tagline: string
  systemPrompt: string
  scopeSummary: string
  boundaries: string[]
  tools: ToolDefinition[]
  suggestedProbes: {
    inScope: string[]
    outOfScopeAdjacent: string
    outOfScopeUnrelated: string
  }
}

// The client only ever needs to render the tool's name/description, never
// its `execute` function (which isn't serializable across the Server ->
// Client Component boundary anyway) or its Gemini-specific `parameters`
// schema.
export interface PublicToolDefinition {
  name: string
  description: string
}

export interface PublicAgentArchetype {
  id: AgentArchetypeId
  name: string
  tagline: string
  systemPrompt: string
  scopeSummary: string
  boundaries: string[]
  tools: PublicToolDefinition[]
  suggestedProbes: AgentArchetype["suggestedProbes"]
}

export function toPublicArchetype(archetype: AgentArchetype): PublicAgentArchetype {
  return {
    id: archetype.id,
    name: archetype.name,
    tagline: archetype.tagline,
    systemPrompt: archetype.systemPrompt,
    scopeSummary: archetype.scopeSummary,
    boundaries: archetype.boundaries,
    tools: archetype.tools.map((t) => ({ name: t.name, description: t.description })),
    suggestedProbes: archetype.suggestedProbes,
  }
}

export interface ToolTraceEntry {
  name: string
  args: Record<string, unknown>
}

export interface AgentChatRequest {
  archetypeId: AgentArchetypeId
  history: { role: "user" | "agent"; text: string }[]
  message: string
}

export interface AgentChatResponse {
  reply: string
  guardrailTriggered: boolean
  toolTrace: ToolTraceEntry[]
}
