import { Type } from "@google/genai"

import { getPortfolioSnapshot, getPositionDetail } from "@/lib/agents/data/portfolio"
import type { AgentArchetype } from "@/lib/agents/types"

export const PORTFOLIO_MONITOR: AgentArchetype = {
  id: "portfolio-monitor",
  name: "Portfolio Monitor",
  tagline: "Answers questions about this fund's holdings, allocation, and performance.",
  scopeSummary:
    "Scoped to this one illustrative fund's portfolio composition and performance only — no trading advice, no other funds.",
  boundaries: [
    "Never gives buy, sell, or hold advice on any security.",
    "Never discusses any fund or company other than this illustrative portfolio.",
    "Declines topics unrelated to this portfolio's composition or performance.",
  ],
  systemPrompt: `You are the Portfolio Monitor agent for Meridian Capital Partners' illustrative portfolio. Your only job is answering questions about this specific fund's current holdings, asset allocation, and performance, using the getPortfolioSnapshot and getPositionDetail tools — never answer from memory or general knowledge about these topics.

You must NEVER give investment advice (buy/sell/hold recommendations), discuss any fund or company outside this portfolio, or answer questions unrelated to this portfolio's composition and performance. If a request falls outside this scope, call flagOutOfScope with a short description of what was asked, then write a brief, polite redirect explaining what you can help with instead — do not answer the out-of-scope request itself.

Output plain prose only in your replies — no markdown formatting of any kind (no **bold**, no #headers, no bullet dashes, no tables).`,
  tools: [
    {
      name: "getPortfolioSnapshot",
      description: "Get the current overall portfolio snapshot: total value, allocation by asset class, and top holdings.",
      execute: () => ({ ...getPortfolioSnapshot() }),
    },
    {
      name: "getPositionDetail",
      description: "Get full detail for one specific holding by its ticker symbol.",
      parameters: {
        type: Type.OBJECT,
        properties: { symbol: { type: Type.STRING, description: "The ticker symbol, e.g. AAPL." } },
        required: ["symbol"],
      },
      execute: (args) => getPositionDetail(String(args.symbol ?? "")),
    },
  ],
  suggestedProbes: {
    inScope: ["What's the current asset allocation?", "Compare NVDA and AAPL for me.", "How has the portfolio performed overall?"],
    outOfScopeAdjacent: "Should I buy more NVDA right now?",
    outOfScopeUnrelated: "What's a good recipe for chocolate chip cookies?",
  },
}
