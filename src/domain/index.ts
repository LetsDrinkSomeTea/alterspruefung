// Public API of the Domain layer. Nothing outside the domain may reach into
// its internals; everything flows through this barrel, guarded by the
// Dependency Rule (dependencies point inward, toward the domain).
export { CalendarDate } from "./value-objects/CalendarDate.js";
export { LegalDrinkingAge } from "./value-objects/LegalDrinkingAge.js";
export { EligibilityCandidate } from "./entities/EligibilityCandidate.js";
export { EligibilityDatePolicy } from "./services/EligibilityDatePolicy.js";
