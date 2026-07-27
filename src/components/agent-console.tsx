"use client"

import { useState } from "react"
import { AlertTriangleIcon, SendIcon } from "lucide-react"

import { AgentSpecCard } from "@/components/agent-spec-card"
import { ArchetypePicker } from "@/components/archetype-picker"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChatTranscript, type ChatMessage } from "@/components/chat-transcript"
import { ProbeSuggestions } from "@/components/probe-suggestions"
import type { AgentArchetypeId, PublicAgentArchetype } from "@/lib/agents/types"

export function AgentConsole({ archetypes }: { archetypes: PublicAgentArchetype[] }) {
  const [activeId, setActiveId] = useState<AgentArchetypeId>(archetypes[0].id)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const archetype = archetypes.find((a) => a.id === activeId)!

  function switchArchetype(id: AgentArchetypeId) {
    setActiveId(id)
    setMessages([])
    setError(null)
    setInput("")
  }

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", text: trimmed }
    const history = messages.map((m) => ({ role: m.role, text: m.text }))
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/agent-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archetypeId: activeId, history, message: trimmed }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to run the agent.")
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "agent",
          text: data.reply,
          guardrailTriggered: data.guardrailTriggered,
          toolTrace: data.toolTrace,
        },
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to run the agent.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <ArchetypePicker archetypes={archetypes} activeId={activeId} onSelect={switchArchetype} />
      <AgentSpecCard archetype={archetype} />
      <ProbeSuggestions archetype={archetype} onPick={send} disabled={loading} />

      <Card className="glow-border">
        <CardContent className="flex flex-col gap-3">
          <ChatTranscript messages={messages} loading={loading} />

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertTriangleIcon className="size-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send(input)
              }}
              placeholder={`Ask the ${archetype.name}...`}
              disabled={loading}
              className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-60"
            />
            <Button type="button" onClick={() => send(input)} disabled={loading || !input.trim()}>
              <SendIcon />
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
