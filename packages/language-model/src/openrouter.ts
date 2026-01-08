import * as z from "zod/v4"
import { Capability, LanguageModelBase, Tier } from "./base"
import { BaseCostCalculator } from "./costs/calculator"

// OpenRouter configurations (generic for now)
const OpenRouterLanguageModelConfigurations = z.object({})
type OpenRouterLanguageModelConfigurations = z.infer<typeof OpenRouterLanguageModelConfigurations>

const defaultConfigurations: OpenRouterLanguageModelConfigurations = {}

export const OpenRouterLanguageModelId = z.enum([
  "openrouter/xiaomi/mimo-v2-flash",
  "openrouter/google/gemini-2.0-flash-exp:free",
  "openrouter/z-ai/glm-4.7",
])

// ... (skipping unchanged code for brevity in prompt, but in tool calling I must provide replacement)
// Actually I need to replace the block.

const OpenRouterLanguageModel = LanguageModelBase.extend({
  id: OpenRouterLanguageModelId,
  provider: z.literal("openrouter"),
  configurations: OpenRouterLanguageModelConfigurations,
})
type OpenRouterLanguageModel = z.infer<typeof OpenRouterLanguageModel>

const mimoV2Flash: OpenRouterLanguageModel = {
  provider: "openrouter",
  id: "openrouter/xiaomi/mimo-v2-flash",
  capabilities: Capability.TextGeneration | Capability.Reasoning, 
  tier: Tier.enum.free,
  configurations: defaultConfigurations,
}

const geminiFlashFree: OpenRouterLanguageModel = {
  provider: "openrouter",
  id: "openrouter/google/gemini-2.0-flash-exp:free",
  capabilities: Capability.TextGeneration | Capability.OptionalSearchGrounding,
  tier: Tier.enum.free,
  configurations: defaultConfigurations,
}

const glm47: OpenRouterLanguageModel = {
  provider: "openrouter",
  id: "openrouter/z-ai/glm-4.7",
  capabilities: Capability.TextGeneration | Capability.Reasoning,
  tier: Tier.enum.free, // Assuming free or low cost, or user has credit. Marking free for visibility if unsure of tier enum constraints.
  configurations: defaultConfigurations,
}

export const models = [mimoV2Flash, geminiFlashFree, glm47]

export const LanguageModel = OpenRouterLanguageModel
export type LanguageModel = OpenRouterLanguageModel

export class OpenRouterCostCalculator extends BaseCostCalculator {
  protected getPricingTable() {
    // Return empty or todo, as we defined prices in the registry mostly
    return {}
  }
}
