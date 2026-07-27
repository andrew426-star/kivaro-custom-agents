import { AgentConsole } from "@/components/agent-console"
import { SampleDataBanner } from "@/components/sample-data-banner"
import { AGENT_ARCHETYPES } from "@/lib/agents/registry"
import { toPublicArchetype } from "@/lib/agents/types"

export default function Home() {
  const publicArchetypes = AGENT_ARCHETYPES.map(toPublicArchetype)

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-6 sm:px-8">
      <header className="flex flex-col gap-1 py-2">
        <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
          Custom AI Agent Development
        </span>
        <h1 className="font-heading text-2xl text-gradient-green sm:text-3xl">
          Not One Assistant That Does Everything — Three That Each Do One Thing
        </h1>
        <p className="text-sm text-muted-foreground">
          Each agent below is purpose-built for one fund workflow: its own role, its own small
          toolset, its own explicit boundaries — visible before you even chat with it. Ask it
          something outside its scope and watch it redirect instead of improvising an answer.
        </p>
      </header>

      <SampleDataBanner />
      <AgentConsole archetypes={publicArchetypes} />
    </div>
  )
}
