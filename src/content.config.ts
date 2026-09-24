import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// ---------------------------------------------------------------------------
// People & program content — one Markdown file per entry, editable in place.
// ---------------------------------------------------------------------------

const speakers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/speakers' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      company: z.string(),
      image: image(),
      type: z.enum(['keynote', 'speaker', 'panelist']).default('speaker'),
      track: z.string().optional(),
      linkedin: z.string().url().optional(),
      twitter: z.string().url().optional(),
      order: z.number().default(99),
      featured: z.boolean().default(false),
    }),
});

const partners = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/partners' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      type: z.enum(['strategic', 'media', 'sponsor', 'community']),
      tier: z.enum(['platinum', 'gold', 'silver', 'bronze']).optional(),
      logo: image(),
      url: z.string().url(),
      background: z.string().optional(),
      hero: z.boolean().default(false), // also show this logo in the homepage hero's "In partnership with" row
      order: z.number().default(99),
    }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonials' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      company: z.string().optional(),
      image: image().optional(),
      order: z.number().default(99),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      category: z.string(),
      coverImage: image(),
      author: z.string().default('Scrum Day Nigeria'),
      draft: z.boolean().default(false),
    }),
});

// ---------------------------------------------------------------------------
// Structured data that doesn't need individual files — single YAML sources.
// ---------------------------------------------------------------------------

const agenda = defineCollection({
  loader: file('./src/content/agenda/agenda.yaml'),
  schema: z.object({
    id: z.string(),
    day: z.string(), // e.g. "2027-04-14" (pre-event) or "2027-04-15" (main day)
    dayLabel: z.string(), // e.g. "Pre-Event Mixer" / "Main Conference Day"
    startTime: z.string(), // "09:00"
    endTime: z.string().optional(),
    title: z.string(),
    description: z.string().optional(),
    type: z.enum(['keynote', 'session', 'panel', 'break', 'mixer', 'registration']),
    speakerIds: z.array(z.string()).default([]),
    track: z.string().optional(),
    location: z.string().optional(),
  }),
});

const learningTracks = defineCollection({
  loader: file('./src/content/learning-tracks.yaml'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
    order: z.number().default(99),
  }),
});

const pastEditions = defineCollection({
  loader: file('./src/content/past-editions.yaml'),
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      year: z.number(),
      title: z.string(),
      summary: z.string(),
      attendeeCount: z.string().optional(),
      coverImage: image().optional(),
      link: z.string().optional(),
    }),
});

// The event-day summary cards on the homepage "program" stage (mirrors the
// old site's Pre-Event Mixer / Main Conference Day split).
const programDays = defineCollection({
  loader: file('./src/content/program-days.yaml'),
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      date: z.string(), // display label, e.g. "23 Mar" or "24 Mar"
      title: z.string(),
      description: z.string(),
      image: image(),
      ctaLabel: z.string().default('More Info'),
      ctaHref: z.string().default('/schedule'),
      spotsLabel: z.string().optional(), // e.g. "200+ Spots"
      priceLabel: z.string().optional(), // e.g. "Included with ticket"
      order: z.number().default(99),
    }),
});

// Ticket tiers shown in the pricing section, grouped by `category`.
const ticketTiers = defineCollection({
  loader: file('./src/content/ticket-tiers.yaml'),
  schema: z.object({
    id: z.string(),
    category: z.string().default('general'), // groups tiers under a tab
    categoryLabel: z.string().default('General'),
    dates: z.string(), // e.g. "24 MAR"
    badge: z.string().optional(), // e.g. "EARLY BIRD"
    title: z.string(),
    description: z.string(),
    priceLabel: z.string().default('Standard'),
    priceNote: z.string().optional(),
    oldPrice: z.string().optional(),
    price: z.string(), // display string — keep as text since currency/format may vary
    ctaLabel: z.string().default('Buy Ticket'),
    order: z.number().default(99),
  }),
});

// Full-bleed venue carousel photos.
const venuePhotos = defineCollection({
  loader: file('./src/content/venue-photos.yaml'),
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      image: image(),
      alt: z.string(),
      order: z.number().default(99),
    }),
});

const site = defineCollection({
  loader: file('./src/content/site.yaml'),
  schema: z.object({
    eventName: z.string(),
    theme: z.string(),
    tagline: z.string(),
    eventDate: z.coerce.date(),
    eventEndDate: z.coerce.date().optional(),
    displayDate: z.string(),
    displayTime: z.string(),
    venueName: z.string(),
    venueAddress: z.string(),
    ticketUrl: z.string().url(),
    contactEmail: z.string().email(),
    metrics: z.object({
      days: z.string(),
      expectedParticipants: z.string(),
      speakers: z.string(),
    }),
    preEvent: z
      .object({
        date: z.coerce.date(),
        displayDate: z.string(),
        title: z.string(),
        description: z.string(),
      })
      .optional(),
    whoShouldAttend: z.array(z.string()),
    social: z.object({
      instagram: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      twitter: z.string().url().optional(),
      facebook: z.string().url().optional(),
    }),
    nav: z.array(
      z.object({
        label: z.string(),
        href: z.string(),
      })
    ),
    // Call for speakers — shown in the homepage speakers section while `open` is true and the
    // deadline hasn't passed (checked at build time). Omit the block entirely to hide it.
    callForSpeakers: z
      .object({
        open: z.boolean().default(true),
        url: z.string().url(),
        deadline: z.coerce.date(),
        displayDeadline: z.string(),
        heading: z.string(),
        body: z.string(),
        lookingFor: z.array(z.string()).default([]),
        ctaLabel: z.string().default('Submit a Talk'),
      })
      .optional(),
    // Fallback text after "In partnership with" in the hero, shown until a partner has `hero: true`
    // (then their logos replace it). Omit to hide the line while no hero partners exist.
    heroPartnersNote: z.string().optional(),
    highlightsVideoId: z.string().optional(), // YouTube video id for the "aftermovie" card; omit to hide it
    ticketsIncluded: z.array(z.string()).default([]),
  }),
});

export const collections = {
  speakers,
  partners,
  testimonials,
  blog,
  agenda,
  learningTracks,
  pastEditions,
  programDays,
  ticketTiers,
  venuePhotos,
  site,
};
