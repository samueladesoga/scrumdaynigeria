// Attendee-count pricing, shared by the tickets section (display) and /api/checkout (charging),
// so what a buyer sees is exactly what Paystack is asked to collect.

export interface PriceBand {
  label: string;
  min: number;
  max: number;
  price: number; // per person, in currency units (not kobo)
  earlyBird?: { price: number; until: Date };
}

// Early bird runs through the whole of its `until` day in Lagos (UTC+1), i.e. ends at 23:00 UTC.
const LAGOS_END_OF_DAY_MS = 23 * 60 * 60 * 1000;

export const earlyBirdEndsAt = (until: Date) => until.getTime() + LAGOS_END_OF_DAY_MS;

export const bandFor = (bands: PriceBand[], count: number) =>
  bands.find((b) => count >= b.min && count <= b.max) ?? null;

/** Per-person price for `count` attendees at time `now`, or null if the group needs a quote. */
export function quote(bands: PriceBand[], count: number, now = Date.now()) {
  const band = bandFor(bands, count);
  if (!band) return null;
  const earlyBird = band.earlyBird && now < earlyBirdEndsAt(band.earlyBird.until);
  const unitPrice = earlyBird ? band.earlyBird!.price : band.price;
  return { band, earlyBird: Boolean(earlyBird), unitPrice, total: unitPrice * count };
}
