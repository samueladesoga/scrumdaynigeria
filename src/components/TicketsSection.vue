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
        <article v-for="card in activeCategory.cards" :key="card.id" class="ticket-card">
          <div class="card-notch card-notch-top" aria-hidden="true"></div>
          <div class="card-header">
            <p class="card-dates">{{ card.dates }}</p>
            <p v-if="card.badge" class="card-save">{{ card.badge }}</p>
          </div>

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

          <a class="card-cta" :href="ticketUrl" target="_blank" rel="noopener noreferrer">{{ card.ctaLabel }} &rarr;</a>

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
import { computed, ref } from 'vue';

const props = defineProps({
  tiers: { type: Array, required: true },
  included: { type: Array, default: () => [] },
  ticketUrl: { type: String, required: true },
  subtitle: { type: String, default: 'Secure your seat for a full day of talks, panels, and hands-on sessions.' },
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
</style>
