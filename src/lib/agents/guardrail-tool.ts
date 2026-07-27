import { Type } from "@google/genai"

import type { ToolDefinition } from "@/lib/agents/types"

// Shared by every archetype in addition to its own 2 tools. Topic refusal
// is instruction-based and probabilistic like every other guardrail this
// session — this tool makes the moment it fires deterministically
// detectable (guardrailTriggered = true) without any keyword/text
// sniffing, rather than faking the judgment call with a hard denylist.
export const GUARDRAIL_TOOL: ToolDefinition = {
  name: "flagOutOfScope",
  description:
    "Call this before replying whenever the user's request falls outside this agent's defined scope. Then write a brief, polite redirect in your own words explaining what you can help with instead — do not answer the out-of-scope request.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      requestedTopic: {
        type: Type.STRING,
        description: "Short plain-language description of what the user actually asked for.",
      },
    },
    required: ["requestedTopic"],
  },
  execute: (args) => ({ acknowledged: true, requestedTopic: args.requestedTopic ?? "" }),
}
