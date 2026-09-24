<template>
  <section class="tickets-section" id="tickets" aria-labelledby="tickets-title">
    <div class="container tickets-wrap">
      <h2 id="tickets-title">GET YOUR TICKET</h2>
      <p class="tickets-subtitle">{{ subtitle }}</p>

      <div v-if="categories.length > 1" class="ticket-tabs" role="tablist" aria-label="Ticket categories">
        <button
          v-for="(category, index) in categories"
          :key="category.key"
          type="button"
          class="ticket-tab"
          :class="{ active: index === activeCategoryIndex }"
          :aria-selected="index === activeCategoryIndex"
          role="tab"
          @click="activeCategoryIndex = index"
        >
          {{ category.label }}
        </button>
      </div>

      <div class="ticket-grid" aria-live="polite">
        <article
          v-for="card in activeCategory.cards"
          :key="card.id"
          class="ticket-card"
          :class="{ 'ticket-card--bands': card.bands }"
        >
          <div class="card-notch card-notch-top" aria-hidden="true"></div>
          <div class="card-header">
            <p class="card-dates">{{ card.dates }}</p>
            <p v-if="badgeFor(card)" class="card-save">{{ badgeFor(card) }}</p>
          </div>

          <!-- Attendee-count ticket: picker + live price, and the band table alongside. -->
          <div v-if="card.bands" class="band-layout">
            <div class="band-main">
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-copy">{{ card.description }}</p>

              <div class="attendee-picker">
                <label class="picker-label" :for="`attendees-${card.id}`">How many attendees?</label>
                <div class="stepper">
                  <button
                    type="button"
                    class="stepper-btn"
                    aria-label="Fewer attendees"
                    :disabled="countFor(card) <= 1"
                    @click="setCount(card, countFor(card) - 1)"
                  >&minus;</button>
                  <input
                    :id="`attendees-${card.id}`"
                    class="stepper-input"
                    type="number"
                    inputmode="numeric"
                    min="1"
                    :max="maxCount(card)"
                    :value="countFor(card)"
                    @change="setCount(card, $event.target.value)"
                  />
                  <button
                    type="button"
                    class="stepper-btn"
                    aria-label="More attendees"
                    :disabled="countFor(card) >= maxCount(card)"
                    @click="setCount(card, countFor(card) + 1)"
                  >+</button>
                  <span v-if="countFor(card) >= maxCount(card)" class="stepper-plus">or more</span>
                </div>
              </div>

              <template v-if="quoteFor(card).band">
                <div class="card-pricing">
                  <div>
                    <p class="price-label">{{ quoteFor(card).band.label }}</p>
                    <p class="price-note">
                      <template v-if="quoteFor(card).earlyBirdEnds">Early bird ends {{ quoteFor(card).earlyBirdEnds }}</template>
                      <template v-else>{{ rangeLabel(quoteFor(card).band) }}</template>
                    </p>
                  </div>
                  <div class="price-values">
                    <p v-if="quoteFor(card).oldPrice" class="price-old">{{ money(card, quoteFor(card).oldPrice) }}</p>
                    <p class="price-new">
                      {{ money(card, quoteFor(card).price) }}<span v-if="countFor(card) > 1" class="price-unit"> / person</span>
                    </p>
                  </div>
                </div>

                <div v-if="countFor(card) > 1" class="price-total">
                  <span>Total for {{ countFor(card) }} attendees</span>
                  <strong>{{ money(card, quoteFor(card).price * countFor(card)) }}</strong>
                </div>

                <a
                  v-if="quoteFor(card).url"
                  class="card-cta"
                  :href="quoteFor(card).url"
                  target="_blank"
                  rel="noopener noreferrer"
                >{{ card.ctaLabel }} &rarr;</a>
                <span v-else class="card-cta is-pending" aria-disabled="true">{{ card.pendingLabel }}</span>

                <p v-if="countFor(card) > 1" class="cta-hint cta-hint-qty">
                  <span aria-hidden="true">&#9432;</span>
                  On the Paystack page, set the quantity to <strong>{{ countFor(card) }}</strong> before you pay.
                </p>
              </template>

              <template v-else>
                <div class="card-pricing quote-pricing">
                  <p class="price-label">Groups of {{ maxCount(card) }}+</p>
                  <p class="price-new">Let's talk</p>
                </div>
                <a class="card-cta" :href="quoteMailto(card)">Contact us for pricing &rarr;</a>
                <p class="cta-hint">We'll put together a quote for your team.</p>
              </template>
            </div>

            <div class="band-side">
              <p class="band-side-title">Pricing per person</p>
              <ul class="band-list">
                <li v-for="band in card.bands" :key="band.min">
                  <button
                    type="button"
                    class="band-row"
                    :class="{ active: quoteFor(card).band === band }"
                    :aria-pressed="quoteFor(card).band === band"
                    @click="setCount(card, band.min)"
                  >
                    <span class="band-range">{{ rangeLabel(band) }}</span>
                    <span class="band-price">
                      <s v-if="priceFor(band).oldPrice">{{ money(card, priceFor(band).oldPrice) }}</s>
                      {{ money(card, priceFor(band).price) }}
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    class="band-row"
                    :class="{ active: !quoteFor(card).band }"
                    :aria-pressed="!quoteFor(card).band"
                    @click="setCount(card, maxCount(card))"
                  >
                    <span class="band-range">{{ maxCount(card) }}+ people</span>
                    <span class="band-price band-price-quote">Contact us</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <!-- Static ticket (fixed price or free registration). -->
          <template v-else>
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-copy">{{ card.description }}</p>

            <div class="card-pricing">
              <div>
                <p class="price-label">{{ card.priceLabel }}</p>
                <p v-if="card.priceNote" class="price-note">{{ card.priceNote }}</p>
              </div>
              <div class="price-values">
                <p v-if="card.oldPrice" class="price-old">{{ card.oldPrice }}</p>
                <p class="price-new">{{ card.price }}</p>
              </div>
            </div>

            <a v-if="card.url" class="card-cta" :href="card.url" target="_blank" rel="noopener noreferrer">{{ card.ctaLabel }} &rarr;</a>
            <span v-else class="card-cta is-pending" aria-disabled="true">{{ card.pendingLabel }}</span>
          </template>

          <div class="card-notch card-notch-bottom" aria-hidden="true"></div>
        </article>
      </div>

      <div v-if="included.length" class="included-block">
        <p class="included-title">Included with ticket</p>
        <div class="included-list">
          <span v-for="item in included" :key="item" class="included-item">&#10003; {{ item }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';

const props = defineProps({
  tiers: { type: Array, required: true },
  included: { type: Array, default: () => [] },
  contactEmail: { type: String, required: true },
  eventName: { type: String, default: 'Scrum Day Nigeria' },
  // Build time, so the server render and hydration agree; swapped for the visitor's clock on
  // mount so early-bird pricing expires on time even if the site isn't rebuilt.
  renderedAt: { type: Number, required: true },
  subtitle: { type: String, default: 'Secure your seat for a full day of talks, panels, and hands-on sessions.' },
});

const now = ref(props.renderedAt);
onMounted(() => {
  now.value = Date.now();
});

const categories = computed(() => {
  const map = new Map();
  for (const tier of props.tiers) {
    if (!map.has(tier.category)) {
      map.set(tier.category, { key: tier.category, label: tier.categoryLabel, cards: [] });
    }
    map.get(tier.category).cards.push(tier);
  }
  return Array.from(map.values());
});

const activeCategoryIndex = ref(0);
const activeCategory = computed(() => categories.value[activeCategoryIndex.value] || { cards: [] });

// ---- Attendee-count pricing ------------------------------------------------

const counts = reactive({});

// One past the last band = "N or more", which is the contact-us state.
const maxCount = (card) => card.bands[card.bands.length - 1].max + 1;
const countFor = (card) => counts[card.id] ?? 1;

const setCount = (card, value) => {
  const n = Math.round(Number(value));
  counts[card.id] = Number.isFinite(n) ? Math.min(Math.max(n, 1), maxCount(card)) : 1;
};

const priceFor = (band) => {
  const eb = band.earlyBird;
  if (eb && now.value < eb.endsAt) {
    return { price: eb.price, oldPrice: band.price, url: eb.url, earlyBirdEndsAt: eb.endsAt };
  }
  return { price: band.price, oldPrice: null, url: band.url, earlyBirdEndsAt: null };
};

const endDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Lagos' });

const quoteFor = (card) => {
  const count = countFor(card);
  const band = card.bands.find((b) => count >= b.min && count <= b.max);
  if (!band) return { band: null };
  const p = priceFor(band);
  return {
    band,
    ...p,
    earlyBirdEnds: p.earlyBirdEndsAt ? endDate.format(p.earlyBirdEndsAt - 1) : null,
  };
};

const hasActiveEarlyBird = (card) => card.bands.some((b) => priceFor(b).earlyBirdEndsAt);
const badgeFor = (card) => (card.bands && hasActiveEarlyBird(card) ? 'EARLY BIRD' : card.badge);

const rangeLabel = (band) =>
  band.min === band.max ? `${band.min} ${band.min === 1 ? 'person' : 'people'}` : `${band.min}–${band.max} people`;

const formatters = new Map();
const money = (card, amount) => {
  if (!formatters.has(card.currency)) {
    formatters.set(
      card.currency,
      new Intl.NumberFormat('en-NG', { style: 'currency', currency: card.currency, maximumFractionDigits: 0 })
    );
  }
  return formatters.get(card.currency).format(amount);
};

const quoteMailto = (card) => {
  const subject = `Group booking enquiry: ${maxCount(card)}+ attendees`;
  const body = `Hello,\n\nWe'd like to book tickets to ${props.eventName} for a group of ___ people. Please send us pricing.\n\nThanks`;
  return `mailto:${props.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
</script>

<style scoped>
.tickets-section {
  background: #082f33;
  padding: 3rem 0 4.5rem;
  color: #eef1f2;
}

.tickets-wrap {
  text-align: center;
}

.tickets-wrap h2 {
  margin: 0;
  color: #f3f3f3;
  font-family: "Space Grotesk", "Segoe UI", sans-serif;
  font-size: clamp(2.2rem, 4.2vw, 3.5rem);
  line-height: 0.95;
  font-weight: 500;
  letter-spacing: -0.03em;
}

.tickets-subtitle {
  margin: 0.75rem auto 0;
  max-width: 760px;
  color: #d7dbde;
  font-size: clamp(1.1rem, 1.7vw, 1.38rem);
  line-height: 1.25;
}

.ticket-tabs {
  margin: 1.4rem auto 0;
  width: fit-content;
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  padding: 0.28rem;
  border-radius: 999px;
  background: #123f44;
}

.ticket-tab {
  border: 0;
  background: transparent;
  color: #edf0f2;
  border-radius: 999px;
  padding: 0.55rem 0.9rem;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
}

.ticket-tab.active {
  background: var(--brand-primary, #f15b30);
  color: #fff;
}

.ticket-grid {
  margin: 1.85rem auto 0;
  max-width: 1120px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 340px));
  justify-content: center;
  gap: 1rem;
}

.ticket-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #fff;
  color: #24282b;
  border-radius: 3px;
  padding: 1.1rem 1rem 2.2rem;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
  overflow: visible;
}

.card-notch {
  position: absolute;
  left: 50%;
  width: 38px;
  height: 24px;
  background: #082f33;
  transform: translateX(-50%);
  pointer-events: none;
}

.card-notch-top {
  top: -1px;
  border-bottom-left-radius: 999px;
  border-bottom-right-radius: 999px;
}

.card-notch-bottom {
  bottom: 0;
  border-top-left-radius: 999px;
  border-top-right-radius: 999px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
}

.card-dates {
  margin: 0;
  font-size: 0.92rem;
  font-weight: 700;
  color: #3a4044;
}

.card-save {
  margin: 0;
  padding: 0.22rem 0.45rem;
  border-radius: 999px;
  background: var(--brand-lime, #d1e27e);
  color: #1f3d1c;
  font-size: 0.76rem;
  font-weight: 800;
  white-space: nowrap;
}

.card-title {
  margin: 0.65rem 0 0;
  text-align: left;
  font-family: "Space Grotesk", "Segoe UI", sans-serif;
  font-size: clamp(1.45rem, 2vw, 2rem);
  line-height: 1.02;
  letter-spacing: -0.02em;
}

.card-copy {
  margin: 0.85rem 0 0;
  text-align: left;
  color: #2e3539;
  font-size: 1rem;
  line-height: 1.42;
}

.card-pricing {
  margin-top: 1.1rem;
  padding-top: 0.9rem;
  border-top: 1px dotted #d9d9d9;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
}

.price-label {
  margin: 0;
  text-align: left;
  font-size: 1.1rem;
  color: #373d41;
}

.price-note {
  margin: 0.05rem 0 0;
  text-align: left;
  font-size: 0.88rem;
  color: #626a71;
}

.price-values {
  text-align: right;
}

.price-old {
  margin: 0;
  font-size: 1.22rem;
  color: #8d9295;
  text-decoration: line-through;
}

.price-new {
  margin: 0;
  font-size: 1.22rem;
  color: #1e2326;
  font-weight: 700;
}

.card-cta {
  margin-top: 0.9rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 46px;
  border-radius: 999px;
  background: var(--brand-primary, #f15b30);
  color: #fff;
  text-decoration: none;
  font-weight: 800;
  font-size: 1rem;
  position: relative;
  z-index: 1;
}

.included-block {
  margin-top: 2rem;
}

.included-title {
  margin: 0;
  color: #9fa4a8;
  font-size: 1.05rem;
  font-weight: 700;
}

.included-list {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 1.4rem;
  flex-wrap: wrap;
}

.included-item {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: #e9eff2;
  font-size: 0.98rem;
  font-weight: 600;
}

@media (max-width: 760px) {
  .tickets-section {
    padding: 2.4rem 0 3.6rem;
  }

  .ticket-tabs {
    width: 100%;
    justify-content: center;
  }

  .ticket-tab {
    font-size: 0.92rem;
    padding: 0.5rem 0.72rem;
  }

  .ticket-card {
    padding: 0.95rem 0.9rem 2rem;
  }

  .card-title {
    font-size: 1.5rem;
  }

  .card-copy {
    font-size: 0.96rem;
  }

  .card-pricing {
    flex-direction: column;
    align-items: flex-start;
  }

  .price-values {
    text-align: left;
  }
}

/* ---- Attendee-count ticket ---------------------------------------------- */

.ticket-card--bands {
  grid-column: 1 / -1;
  justify-self: center;
  width: 100%;
  max-width: 860px;
  padding: 1.3rem 1.4rem 2.4rem;
}

.band-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: 1.6rem;
  text-align: left;
}

.attendee-picker {
  margin-top: 1.2rem;
}

.picker-label {
  display: block;
  font-size: 0.95rem;
  font-weight: 700;
  color: #2e3539;
}

.stepper {
  margin-top: 0.55rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stepper-btn {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 999px;
  border: 1px solid #cfd4d6;
  background: #fff;
  color: #1e2326;
  font-size: 1.35rem;
  line-height: 1;
  cursor: pointer;
  transition: border-color 160ms ease, background 160ms ease;
}

.stepper-btn:hover:not(:disabled) {
  border-color: #082f33;
  background: #f2f5f5;
}

.stepper-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.stepper-input {
  width: 4.2rem;
  height: 2.75rem;
  border: 1px solid #cfd4d6;
  border-radius: 10px;
  text-align: center;
  font: inherit;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e2326;
  -moz-appearance: textfield;
}

.stepper-input::-webkit-outer-spin-button,
.stepper-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.stepper-btn:focus-visible,
.stepper-input:focus-visible,
.band-row:focus-visible {
  outline: 2px solid var(--brand-primary, #f15b30);
  outline-offset: 2px;
}

.stepper-plus {
  color: #626a71;
  font-size: 0.92rem;
  font-weight: 600;
}

.price-unit {
  font-size: 0.85rem;
  font-weight: 600;
  color: #626a71;
}

.price-total {
  margin-top: 0.7rem;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  color: #373d41;
  font-size: 0.95rem;
}

.price-total strong {
  color: #1e2326;
  font-size: 1.1rem;
}

.quote-pricing {
  align-items: baseline;
}

.card-cta.is-pending {
  background: #e3e6e7;
  color: #6b7378;
  cursor: not-allowed;
}

.cta-hint {
  margin: 0.55rem 0 0;
  text-align: center;
  color: #626a71;
  font-size: 0.85rem;
}

.cta-hint-qty strong {
  color: #1e2326;
}

.band-side {
  border-left: 1px dotted #d9d9d9;
  padding-left: 1.6rem;
}

.band-side-title {
  margin: 0 0 0.7rem;
  color: #626a71;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.band-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.4rem;
}

.band-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  padding: 0.75rem 0.85rem;
  border: 1px solid #e3e6e7;
  border-radius: 10px;
  background: #fafbfb;
  color: #2e3539;
  font: inherit;
  font-size: 0.95rem;
  text-align: left;
  cursor: pointer;
  transition: border-color 160ms ease, background 160ms ease;
}

.band-row:hover {
  border-color: #b9c2c4;
}

.band-row.active {
  border-color: var(--brand-primary, #f15b30);
  background: rgba(241, 91, 48, 0.07);
}

.band-range {
  font-weight: 600;
}

.band-price {
  font-weight: 800;
  color: #1e2326;
  white-space: nowrap;
}

.band-price s {
  margin-right: 0.3rem;
  font-weight: 500;
  color: #8d9295;
}

.band-price-quote {
  color: var(--brand-primary-dark, #d8481f);
}

@media (max-width: 760px) {
  .ticket-card--bands {
    padding: 0.95rem 0.9rem 2.2rem;
  }

  .band-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .band-side {
    border-left: 0;
    border-top: 1px dotted #d9d9d9;
    padding: 1rem 0 0;
  }
}
</style>
