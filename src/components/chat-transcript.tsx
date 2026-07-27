import { Loader2Icon, ShieldCheckIcon, WrenchIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"

export interface ChatMessage {
  id: string
  role: "user" | "agent"
  text: string
  guardrailTriggered?: boolean
  toolTrace?: { name: string; args: Record<string, unknown> }[]
}

export function ChatTranscript({ messages, loading }: { messages: ChatMessage[]; loading: boolean }) {
  if (messages.length === 0) {
    return <p className="text-sm text-muted-foreground">Ask this agent something — try one of the suggestions above.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {messages.map((m) => (
        <div key={m.id} className={`flex flex-col gap-1.5 ${m.role === "user" ? "items-end" : "items-start"}`}>
          <div
            className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
              m.role === "user" ? "bg-secondary/60 text-foreground" : "glow-border text-foreground"
            }`}
          >
            {m.text}
          </div>
          {m.role === "agent" && (m.toolTrace?.length || m.guardrailTriggered) && (
            <div className="flex flex-wrap items-center gap-1.5">
              {m.toolTrace?.map((t, i) => (
                <Badge key={i} variant="outline" className="border-primary/30 text-primary">
                  <WrenchIcon className="size-3" />
                  {t.name}
                  {Object.keys(t.args).length > 0 ? `(${Object.values(t.args).join(", ")})` : "()"}
                </Badge>
              ))}
              {m.guardrailTriggered && (
                <Badge variant="outline" className="border-accent/40 text-accent">
                  <ShieldCheckIcon className="size-3" />
                  Boundary enforced
                </Badge>
              )}
            </div>
          )}
        </div>
      ))}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2Icon className="size-4 animate-spin" />
          Thinking...
        </div>
      )}
    </div>
  )
}
