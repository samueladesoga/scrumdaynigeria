<template>
  <section class="hero-shell" ref="heroRef">
    <div class="hero-radial hero-radial-a" aria-hidden="true"></div>
    <div class="hero-radial hero-radial-b" aria-hidden="true"></div>
    <div class="hero-grid-atmosphere" ref="gridOverlayRef" aria-hidden="true"></div>

    <div class="hero-top container" ref="heroTopRef">
      <h1 class="hero-title" ref="titleRef">
        <img class="hero-title-logo" src="/brand-lockup.svg" alt="Scrum Day Nigeria" />
      </h1>
      <p class="hero-date">{{ displayDate }} &middot; {{ venueName }}, {{ venueAddress }}</p>
      <p class="hero-organizer">
        Organized by
        <img class="organizer-logo" src="/valuehut-logo.svg" alt="ValueHut Consulting Limited" />
      </p>
      <p class="hero-copy">{{ theme }}.</p>

      <div class="hero-actions" ref="actionsRef">
        <a :href="ticketUrl" class="cta cta-primary">
          <span>Get Tickets</span>
          <svg class="cta-icon cta-icon-ticket" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M2.5 6.2a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v1.1a1.25 1.25 0 0 0 0 2.5V11a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1V9.8a1.25 1.25 0 0 0 0-2.5V6.2Z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            <path d="M8 6.7v3.6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          </svg>
        </a>
        <a href="/schedule" class="cta cta-dark">
          <span>View Schedule</span>
          <svg class="cta-icon cta-icon-arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M3 8h8M10 5l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          </svg>
        </a>
      </div>

      <p class="hero-subcopy">{{ expectedParticipants }} people expected to attend</p>

      <div v-if="partnerNames.length" class="support-row" aria-label="Supporting partners">
        <span class="support-label">In partnership with</span>
        <div class="support-logos">
          <span v-for="name in partnerNames" :key="name">{{ name }}</span>
        </div>
      </div>
    </div>

    <div class="hero-marquee" aria-label="Scrum Day Nigeria moments">
      <svg class="marquee-curve" viewBox="0 0 1440 220" preserveAspectRatio="none" role="presentation" aria-hidden="true">
        <path d="M0,0 L0,46 C320,108 1120,108 1440,46 L1440,0 Z"></path>
      </svg>
      <div class="marquee-track">
        <img v-for="(img, i) in [...marqueeImages, ...marqueeImages, ...marqueeImages]" :key="i" :src="img" alt="Scrum Day Nigeria" loading="lazy" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { animate } from 'motion';
import { onMounted, ref } from 'vue';

defineProps({
  displayDate: { type: String, required: true },
  venueName: { type: String, required: true },
  venueAddress: { type: String, required: true },
  theme: { type: String, required: true },
  ticketUrl: { type: String, required: true },
  expectedParticipants: { type: String, required: true },
  partnerNames: { type: Array, default: () => [] },
});

const heroRef = ref(null);
const heroTopRef = ref(null);
const titleRef = ref(null);
const actionsRef = ref(null);
const gridOverlayRef = ref(null);

// Drop event photos into src/assets/hero-marquee/ to have them picked up here automatically.
const marqueeModules = import.meta.glob('../assets/hero-marquee/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
});
const marqueeImages = Object.keys(marqueeModules)
  .sort()
  .map((path) => marqueeModules[path])
  .map((mod) => (typeof mod === 'string' ? mod : mod.src));

onMounted(() => {
  const cleanupFns = [];

  if (heroTopRef.value) {
    animate(heroTopRef.value, { opacity: [0, 1], y: [24, 0] }, { duration: 0.8 });
  }

  if (titleRef.value) {
    animate(titleRef.value, { opacity: [0, 1], y: [18, 0] }, { duration: 0.7, delay: 0.15 });
  }

  if (actionsRef.value) {
    animate(actionsRef.value, { opacity: [0, 1], scale: [0.96, 1] }, { duration: 0.55, delay: 0.3 });
  }

  if (heroRef.value && gridOverlayRef.value) {
    const updateGridShift = () => {
      const y = window.scrollY;
      const offsetX = (y * 0.04) % 8;
      const offsetY = (y * 0.03) % 6;
      gridOverlayRef.value.style.transform = `translate3d(${offsetX.toFixed(2)}px, ${offsetY.toFixed(2)}px, 0)`;
    };

    updateGridShift();
    window.addEventListener('scroll', updateGridShift, { passive: true });
    cleanupFns.push(() => window.removeEventListener('scroll', updateGridShift));
  }

  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack && heroRef.value) {
    const loopDistance = () => marqueeTrack.scrollWidth / 3;
    let scrollTimeout;

    const handleScroll = () => {
      const heroRect = heroRef.value.getBoundingClientRect();
      const heroBottom = heroRect.bottom;

      if (heroBottom > 0) {
        const distance = loopDistance();
        if (!distance) return;

        marqueeTrack.style.animation = 'none';

        const scrollOffset = ((window.scrollY * 0.5) % distance + distance) % distance;
        marqueeTrack.style.transform = `translateX(calc(-33.333% + ${scrollOffset}px))`;

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          marqueeTrack.style.animation = '';
          marqueeTrack.style.transform = '';
        }, 1000);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    cleanupFns.push(() => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    });
  }

  return () => {
    cleanupFns.forEach((cleanup) => cleanup());
  };
});
</script>

<style scoped>
.hero-shell {
  background: #ffffff;
  position: relative;
  overflow: visible;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: clamp(4.8rem, 8vw, 7.2rem);
}

.hero-radial {
  position: absolute;
  pointer-events: none;
  z-index: 0;
  border-radius: 999px;
  filter: blur(34px);
  opacity: 0.11;
  will-change: transform;
}

.hero-radial-a {
  left: -12%;
  top: 8%;
  width: min(760px, 68vw);
  height: min(760px, 68vw);
  background: radial-gradient(circle at 44% 42%, rgba(241, 91, 48, 0.18) 0%, rgba(241, 91, 48, 0.1) 34%, rgba(241, 91, 48, 0) 72%);
  animation: hero-radial-drift-a 36s ease-in-out infinite alternate;
}

.hero-radial-b {
  right: -16%;
  top: 24%;
  width: min(680px, 60vw);
  height: min(680px, 60vw);
  background: radial-gradient(circle at 56% 48%, rgba(14, 73, 79, 0.14) 0%, rgba(14, 73, 79, 0.09) 36%, rgba(14, 73, 79, 0) 74%);
  animation: hero-radial-drift-b 28s ease-in-out infinite alternate;
}

@keyframes hero-radial-drift-a {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  100% { transform: translate3d(22px, -16px, 0) scale(1.03); }
}

@keyframes hero-radial-drift-b {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  100% { transform: translate3d(-18px, 20px, 0) scale(1.04); }
}

.hero-grid-atmosphere {
  position: absolute;
  inset: 0 0 28% 0;
  pointer-events: none;
  z-index: 1;
  opacity: 0.35;
  background-image:
    linear-gradient(rgba(26, 44, 56, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(26, 44, 56, 0.055) 1px, transparent 1px),
    radial-gradient(ellipse 62% 46% at 50% 26%, rgba(40, 90, 122, 0.11), transparent 74%);
  background-size: 42px 42px, 42px 42px, 100% 100%;
  background-position: 0 0, 0 0, center;
  transform: translate3d(0, 0, 0);
  will-change: transform;
  mask-image: radial-gradient(ellipse at 50% 34%, #000 44%, rgba(0, 0, 0, 0.05) 76%, transparent 100%);
}

.hero-top {
  position: relative;
  z-index: 2;
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 2.25rem;
}

.hero-date {
  margin: 0 0 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.86rem;
  color: #5d6467;
  font-weight: 600;
}

.hero-organizer {
  margin: 0 0 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.72rem;
  color: #7a8083;
  font-weight: 600;
}

.organizer-logo {
  height: 22px;
  width: auto;
  display: block;
}

.hero-title {
  margin: 0 0 1.3rem;
  display: flex;
  justify-content: center;
}

.hero-title-logo {
  width: clamp(140px, 13vw, 200px);
  height: auto;
  display: block;
}

.hero-copy {
  margin: 0.3rem auto 0;
  max-width: 21ch;
  font-size: clamp(1.7rem, 3.6vw, 2.8rem);
  font-weight: 700;
  line-height: 1.14;
  letter-spacing: -0.01em;
  color: #1c2022;
  font-family: "Space Grotesk", "Segoe UI", sans-serif;
}

.hero-actions {
  margin-top: 1.05rem;
  display: flex;
  justify-content: center;
  gap: 0.48rem;
}

.cta {
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
  padding: 0.66rem 1.1rem 0.66rem 1.24rem;
  font-size: 1.02rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  line-height: 1;
}

.cta-icon {
  width: 1rem;
  height: 1rem;
  flex: none;
  display: block;
}

.cta-icon-ticket {
  width: 1.06rem;
  height: 1.06rem;
  transform: translateY(0.5px);
}

.cta-icon-arrow {
  transform: translateY(0.2px);
}

.cta-primary {
  background: var(--brand-primary, #f15b30);
  color: #fff;
}

.cta-dark {
  background: var(--brand-teal, #0e494f);
  color: #fff;
}

.hero-subcopy {
  margin: 0.5rem 0 0;
  color: #3b4042;
  font-weight: 600;
  font-size: 0.92rem;
}

.support-row {
  margin-top: 1.55rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.support-label {
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #596063;
  font-size: 0.85rem;
}

.support-logos {
  display: flex;
  gap: 1.2rem;
  flex-wrap: wrap;
  justify-content: center;
  color: #303639;
  font-weight: 700;
}

.hero-marquee {
  position: relative;
  overflow: hidden;
  margin-top: auto;
  margin-bottom: -74px;
  background: transparent;
  z-index: 4;
  padding: 0;
  line-height: 0;
  clip-path: polygon(
    0 0, 100% 0, 100% 89%, 92% 85%, 78% 81%, 64% 78%, 50% 76.5%, 36% 78%, 22% 81%, 8% 85%, 0 89%
  );
}

.marquee-curve {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 136px;
  z-index: 2;
  pointer-events: none;
}

.marquee-curve path {
  fill: #ffffff;
}

.marquee-track {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 0;
  width: max-content;
  animation: marquee-slide 28s linear infinite;
  transform: translateX(-33.333%);
  will-change: transform;
}

.marquee-track img {
  width: clamp(230px, 19.6vw, 320px);
  height: 520px;
  object-fit: cover;
  object-position: center 32%;
  filter: saturate(1.02) contrast(1.02);
  position: relative;
  display: block;
}

@keyframes marquee-slide {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@media (max-width: 900px) {
  .hero-date {
    letter-spacing: 0.1em;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .cta {
    width: min(280px, 92vw);
    justify-content: center;
  }

  .hero-marquee {
    margin-bottom: -48px;
    clip-path: polygon(
      0 0, 100% 0, 100% 91%, 92% 87%, 78% 83%, 64% 80%, 50% 78.5%, 36% 80%, 22% 83%, 8% 87%, 0 91%
    );
  }

  .marquee-curve {
    height: 102px;
  }

  .marquee-track img {
    height: 430px;
  }
}

@media (max-width: 640px) {
  .hero-title-logo {
    width: clamp(120px, 34vw, 170px);
  }

  .hero-title {
    margin-bottom: 1.1rem;
  }

  .hero-organizer {
    margin-bottom: 1.3rem;
  }

  .hero-copy {
    max-width: 18ch;
  }

  .hero-radial {
    opacity: 0.09;
    filter: blur(28px);
  }

  .hero-grid-atmosphere {
    inset: 0 0 34% 0;
    opacity: 0.29;
    background-size: 34px 34px, 34px 34px, 100% 100%;
  }

  .marquee-track img {
    width: 58vw;
    height: 340px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-radial {
    animation: none;
    transform: none;
  }

  .hero-grid-atmosphere {
    transform: none !important;
  }
}
</style>
