"use client"

import { AlertTriangleIcon, MessageCircleQuestionIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PublicAgentArchetype } from "@/lib/agents/types"

interface ProbeSuggestionsProps {
  archetype: PublicAgentArchetype
  onPick: (text: string) => void
  disabled: boolean
}

export function ProbeSuggestions({ archetype, onPick, disabled }: ProbeSuggestionsProps) {
  return (
    <Card className="glow-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5 text-sm">
          <MessageCircleQuestionIcon className="size-4 text-primary" />
          Try Asking
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs tracking-wide text-muted-foreground uppercase">In scope</span>
          <div className="flex flex-wrap gap-1.5">
            {archetype.suggestedProbes.inScope.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => onPick(q)}
                disabled={disabled}
                className="glow-border-hover rounded-full px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="flex items-center gap-1 text-xs tracking-wide text-accent uppercase">
            <AlertTriangleIcon className="size-3" />
            Out of scope — watch it redirect
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => onPick(archetype.suggestedProbes.outOfScopeAdjacent)}
              disabled={disabled}
              className="glow-border-hover rounded-full border border-accent/30 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
            >
              {archetype.suggestedProbes.outOfScopeAdjacent}
            </button>
            <button
              type="button"
              onClick={() => onPick(archetype.suggestedProbes.outOfScopeUnrelated)}
              disabled={disabled}
              className="glow-border-hover rounded-full border border-accent/30 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
            >
              {archetype.suggestedProbes.outOfScopeUnrelated}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
