"use client"

import { BotIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AgentArchetypeId, PublicAgentArchetype } from "@/lib/agents/types"

interface ArchetypePickerProps {
  archetypes: PublicAgentArchetype[]
  activeId: AgentArchetypeId
  onSelect: (id: AgentArchetypeId) => void
}

export function ArchetypePicker({ archetypes, activeId, onSelect }: ArchetypePickerProps) {
  return (
    <Card className="glow-border">
      <CardHeader>
        <CardTitle>Choose a Configured Agent</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {archetypes.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => onSelect(a.id)}
              className={`flex flex-col gap-1.5 rounded-lg p-3 text-left transition-colors ${
                a.id === activeId ? "border border-primary/40 bg-secondary/40" : "glow-border-hover"
              }`}
            >
              <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <BotIcon className="size-4 text-primary" />
                {a.name}
              </span>
              <span className="text-xs text-muted-foreground">{a.tagline}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
