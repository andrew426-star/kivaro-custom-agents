import { NextResponse } from "next/server"

import { AGENT_REGISTRY } from "@/lib/agents/registry"
import { runAgentTurn } from "@/lib/agents/run-turn"
import type { AgentArchetypeId } from "@/lib/agents/types"

const MAX_MESSAGE_CHARS = 500
const MAX_HISTORY_TURNS = 20

export async function POST(request: Request) {
  let archetypeId: AgentArchetypeId
  let history: { role: "user" | "agent"; text: string }[]
  let message: string

  try {
    const body = await request.json()
    archetypeId = body.archetypeId
    history = Array.isArray(body.history) ? body.history : []
    message = typeof body.message === "string" ? body.message.trim() : ""
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const archetype = AGENT_REGISTRY[archetypeId]
  if (!archetype) {
    return NextResponse.json({ error: "Unknown agent archetype." }, { status: 422 })
  }
  if (!message) {
    return NextResponse.json({ error: "No message provided." }, { status: 422 })
  }
  if (message.length > MAX_MESSAGE_CHARS) {
    return NextResponse.json({ error: `Message is too long (max ${MAX_MESSAGE_CHARS} characters).` }, { status: 422 })
  }

  try {
    const result = await runAgentTurn(archetype, history.slice(-MAX_HISTORY_TURNS), message)
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to run the agent." },
      { status: 502 }
    )
  }
}
