import { COUNTERPARTY_RISK } from "@/lib/agents/counterparty-risk"
import { INVESTOR_QUERY } from "@/lib/agents/investor-query"
import { PORTFOLIO_MONITOR } from "@/lib/agents/portfolio-monitor"
import type { AgentArchetype, AgentArchetypeId } from "@/lib/agents/types"

export const AGENT_REGISTRY: Record<AgentArchetypeId, AgentArchetype> = {
  "portfolio-monitor": PORTFOLIO_MONITOR,
  "counterparty-risk": COUNTERPARTY_RISK,
  "investor-query": INVESTOR_QUERY,
}

export const AGENT_ARCHETYPES: AgentArchetype[] = Object.values(AGENT_REGISTRY)
