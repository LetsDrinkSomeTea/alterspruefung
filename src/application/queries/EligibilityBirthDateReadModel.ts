/**
 * The read model (DTO) returned to the presentation layer. Denormalised for
 * consumption; the presentation layer must never see a domain object, lest it
 * develop an unhealthy coupling to our business rules.
 */
export interface EligibilityBirthDateReadModel {
  readonly isoDate: string;
  readonly localisedDate: string;
  readonly requiredAgeYears: number;
  readonly headline: string;
  readonly explanation: string;
  readonly computeBackend: string;
}
