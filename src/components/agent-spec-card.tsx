"use client"

import { useState } from "react"
import { ChevronDownIcon, ChevronUpIcon, ShieldCheckIcon, WrenchIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PublicAgentArchetype } from "@/lib/agents/types"

export function AgentSpecCard({ archetype }: { archetype: PublicAgentArchetype }) {
  const [showPrompt, setShowPrompt] = useState(false)

  return (
    <Card className="glow-border">
      <CardHeader>
        <CardTitle>{archetype.name} — Agent Spec</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">{archetype.scopeSummary}</p>

        <div className="flex flex-col gap-1.5">
          <span className="flex items-center gap-1.5 text-xs tracking-wide text-muted-foreground uppercase">
            <WrenchIcon className="size-3.5 text-primary" />
            Tools
          </span>
          <div className="flex flex-wrap gap-1.5">
            {archetype.tools.map((t) => (
              <Badge key={t.name} variant="outline" className="border-primary/30 text-primary">
                {t.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="flex items-center gap-1.5 text-xs tracking-wide text-muted-foreground uppercase">
            <ShieldCheckIcon className="size-3.5 text-primary" />
            Boundaries
          </span>
          <ul className="flex flex-col gap-1">
            {archetype.boundaries.map((b, i) => (
              <li key={i} className="text-xs text-muted-foreground">
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowPrompt((v) => !v)}
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {showPrompt ? <ChevronUpIcon className="size-3.5" /> : <ChevronDownIcon className="size-3.5" />}
            {showPrompt ? "Hide raw system prompt" : "Show raw system prompt"}
          </button>
          {showPrompt && (
            <pre className="mt-2 max-h-64 overflow-auto rounded-lg bg-secondary/40 p-3 text-xs whitespace-pre-wrap text-muted-foreground">
              {archetype.systemPrompt}
            </pre>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
