import * as z from "zod/v4"
import {
  type AnyLanguageModel,
  defineLanguageModel,
  definePricing,
  type LanguageModelProviderDefinition,
} from "./language-model"

const openRouterProvider = {
  id: "openrouter",
  title: "OpenRouter",
  metadata: {
    website: "https://openrouter.ai",
    documentationUrl: "https://openrouter.ai/docs",
  },
} as const satisfies LanguageModelProviderDefinition<"openrouter">

const reasoningEffortDescription = "Constrains effort on reasoning for reasoning models."
const textVerbosityDescription = "Constrains the verbosity of the model's response."

export const openrouter = {
  "openrouter/xiaomi/mimo-v2-flash": defineLanguageModel({
    provider: openRouterProvider,
    id: "openrouter/xiaomi/mimo-v2-flash",
    name: "Xiaomi MiMo V2 Flash",
    description:
      "Xiaomi MiMo V2 Flash is a high-speed, cost-effective reasoning model with a massive context window, suitable for coding and complex tasks.",
    contextWindow: 256_000,
    maxOutputTokens: 128_000,
    knowledgeCutoff: new Date().getTime(), // Continuous updates typically
    pricing: {
      input: definePricing(0.1),
      output: definePricing(0.3),
    },
    requiredTier: "free",
    configurationOptions: {
      // Generic options, OpenRouter maps these if supported
    },
    defaultConfiguration: {},
    url: "https://openrouter.ai/xiaomi/mimo-v2-flash",
  }),
  // Adding a fallback generic model just in case
  "openrouter/google/gemini-2.0-flash-exp:free": defineLanguageModel({
    provider: openRouterProvider,
    id: "openrouter/google/gemini-2.0-flash-exp:free",
    name: "Gemini 2.0 Flash (Free)",
    description: "Google's experimental fast model via OpenRouter (Free tier).",
    contextWindow: 1_000_000,
    maxOutputTokens: 8192,
    knowledgeCutoff: new Date().getTime(),
    pricing: {
      input: definePricing(0),
      output: definePricing(0),
    },
    requiredTier: "free",
    configurationOptions: {},
    defaultConfiguration: {},
    url: "https://openrouter.ai/google/gemini-2.0-flash-exp:free",
  }),
} as const satisfies Record<string, AnyLanguageModel>
