<template>
  <nav class="scroll-nav" :class="{ 'is-visible': isVisible, 'is-open': menuOpen }" aria-label="Section quick navigation">
    <a href="#top" class="logo-pill" aria-label="Back to top">
      <img class="logo-image" src="/brand-icon.png" alt="Scrum Day Nigeria" />
    </a>
    <a v-for="item in nav" :key="item.href" :href="item.href" class="nav-pill nav-pill-link">{{ item.label }}</a>
    <a :href="ticketUrl" :target="ticketUrl.startsWith('http') ? '_blank' : undefined" :rel="ticketUrl.startsWith('http') ? 'noopener noreferrer' : undefined" class="nav-pill nav-pill-cta">Tickets</a>
    <button
      type="button"
      class="menu-toggle"
      :aria-expanded="menuOpen ? 'true' : 'false'"
      aria-controls="scroll-nav-menu"
      :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
      @click="menuOpen = !menuOpen"
    >
      <span class="menu-icon" aria-hidden="true"></span>
    </button>
    <ul id="scroll-nav-menu" class="menu-panel" :hidden="!menuOpen">
      <li v-for="item in nav" :key="item.href">
        <a :href="item.href" @click="menuOpen = false">{{ item.label }}</a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';

defineProps({
  nav: { type: Array, required: true },
  ticketUrl: { type: String, required: true },
});

const isVisible = ref(false);
const menuOpen = ref(false);
let onScroll;
let onResize;
let onKeydown;

onMounted(() => {
  const firstSection = document.querySelector('.hero-shell');

  if (!firstSection) {
    return;
  }

  const updateVisibility = () => {
    const heroBottom = firstSection.getBoundingClientRect().bottom;
    isVisible.value = heroBottom <= 120;
    if (!isVisible.value) menuOpen.value = false;
  };

  onKeydown = (event) => {
    if (event.key === 'Escape') menuOpen.value = false;
  };
  document.addEventListener('keydown', onKeydown);

  onScroll = () => updateVisibility();
  onResize = () => updateVisibility();

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);

  updateVisibility();
});

onBeforeUnmount(() => {
  if (onScroll) {
    window.removeEventListener('scroll', onScroll);
  }

  if (onResize) {
    window.removeEventListener('resize', onResize);
  }

  if (onKeydown) {
    document.removeEventListener('keydown', onKeydown);
  }
});
</script>

<style scoped>
.scroll-nav {
  position: fixed;
  top: 22px;
  left: 50%;
  transform: translateX(-50%) translateY(-12px);
  z-index: 80;
  display: flex;
  align-items: center;
  width: min(1600px, calc(100% - 16px));
  gap: 0.45rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 220ms ease, transform 220ms ease;
}

.scroll-nav.is-visible {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(-50%) translateY(0);
}

.nav-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  text-decoration: none;
  padding: 0.58rem 1rem;
  border-radius: 999px;
  background: #f1f1f1;
  color: #202225;
  font-weight: 700;
  font-size: 0.95rem;
  line-height: 1;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5), 0 8px 18px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
}

.logo-pill {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  text-decoration: none;
  background: rgb(255 255 255 / 92%);
  border: 1px solid rgba(255, 255, 255, 0.5);
  display: grid;
  place-items: center;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.25);
  flex: none;
}

.logo-image {
  width: 34px;
  height: 34px;
  object-fit: contain;
  display: block;
}

.nav-pill-cta {
  margin-left: auto;
  background: var(--brand-primary, #f15b30);
  color: #fff;
}

/* Phone-only menu button and dropdown — hidden on wider screens. */
.menu-toggle,
.menu-panel {
  display: none;
}

@media (max-width: 1280px) {
  .scroll-nav {
    width: calc(100% - 1rem);
    left: 0.5rem;
    transform: translateX(0) translateY(-12px);
    overflow-x: auto;
    top: 10px;
    padding-bottom: 0.25rem;
    scrollbar-width: none;
  }

  .scroll-nav::-webkit-scrollbar {
    display: none;
  }

  .nav-pill-cta {
    margin-left: 0;
  }

  .scroll-nav.is-visible {
    transform: translateX(0) translateY(0);
  }
}

@media (max-width: 900px) {
  .scroll-nav {
    gap: 0.36rem;
  }

  .nav-pill {
    padding: 0.52rem 0.88rem;
    font-size: 0.88rem;
  }

  .logo-pill {
    width: 34px;
    height: 34px;
  }
}

/* Phones: logo + Tickets + menu button; the section links move into a dropdown. */
@media (max-width: 768px) {
  .scroll-nav {
    overflow: visible;
    padding-bottom: 0;
    flex-wrap: wrap;
  }

  .nav-pill-link {
    display: none;
  }

  .nav-pill-cta {
    margin-left: auto;
  }

  .menu-toggle {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border: 0;
    border-radius: 999px;
    background: #f1f1f1;
    color: #202225;
    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5), 0 8px 18px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    flex: none;
  }

  .menu-icon,
  .menu-icon::before,
  .menu-icon::after {
    display: block;
    width: 18px;
    height: 2px;
    border-radius: 2px;
    background: currentColor;
    transition: transform 0.2s ease, background-color 0.2s ease;
  }

  .menu-icon {
    position: relative;
  }

  .menu-icon::before,
  .menu-icon::after {
    content: '';
    position: absolute;
    left: 0;
  }

  .menu-icon::before {
    top: -6px;
  }

  .menu-icon::after {
    top: 6px;
  }

  .is-open .menu-icon {
    background: transparent;
  }

  .is-open .menu-icon::before {
    transform: translateY(6px) rotate(45deg);
  }

  .is-open .menu-icon::after {
    transform: translateY(-6px) rotate(-45deg);
  }

  .menu-panel:not([hidden]) {
    display: grid;
    flex-basis: 100%;
    list-style: none;
    margin: 0.2rem 0 0;
    padding: 0.4rem;
    border-radius: 18px;
    background: #ffffff;
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.22);
  }

  .menu-panel a {
    display: block;
    padding: 0.85rem 1rem;
    border-radius: 12px;
    color: #202225;
    font-weight: 700;
    text-decoration: none;
  }

  .menu-panel a:hover,
  .menu-panel a:focus-visible {
    background: #f6f1e8;
  }
}
</style>
