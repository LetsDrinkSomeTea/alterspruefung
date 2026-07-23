/**
 * Value Object representing the statutory minimum age for the unsupervised
 * purchase of distilled spirits under § 9 JuSchG (Jugendschutzgesetz).
 *
 * Modelled as an immutable value object so that the number 18 can never be
 * accidentally mutated into, say, 17 by a rogue subsystem. Defensive
 * programming is not paranoia when the legal drinking age is at stake.
 */
export class LegalDrinkingAge {
  private constructor(public readonly years: number) {
    Object.freeze(this);
  }

  /** The canonical German legal drinking age for spirits. */
  public static forSpirits(): LegalDrinkingAge {
    return new LegalDrinkingAge(18);
  }

  /** Beer and wine are permitted from 16 under § 9 Abs. 1 Nr. 1 JuSchG. */
  public static forBeerAndWine(): LegalDrinkingAge {
    return new LegalDrinkingAge(16);
  }

  public equals(other: LegalDrinkingAge): boolean {
    return this.years === other.years;
  }

  public toString(): string {
    return `${this.years} Jahre`;
  }
}
