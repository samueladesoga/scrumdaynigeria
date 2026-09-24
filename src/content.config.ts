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

// A payment/registration link, or "" while the page doesn't exist yet (the button then shows
// `pendingLabel` and is disabled, so nobody lands on a broken page).
const actionUrl = z.union([z.string().url(), z.literal('')]).default('');

// One price band of an attendee-count ticket: `min`–`max` attendees pay `price` per person via
// their own payment page. An optional early-bird price/page applies up to and including `until`.
const priceBand = z.object({
  label: z.string(), // e.g. "Individual", "Group booking"
  min: z.number().int().min(1),
  max: z.number().int().min(1),
  price: z.number().positive(), // per person, in `currency` units (not kobo)
  url: actionUrl,
  earlyBird: z
    .object({
      price: z.number().positive(),
      until: z.coerce.date(), // last day of early-bird pricing (Lagos time)
      url: actionUrl,
    })
    .optional(),
});

// Ticket tiers shown in the pricing section, grouped by `category`.
// A tier with `bands` gets an attendee-count picker; one without is a static card.
const ticketTiers = defineCollection({
  loader: file('./src/content/ticket-tiers.yaml'),
  schema: z
    .object({
      id: z.string(),
      category: z.string().default('general'), // groups tiers under a tab
      categoryLabel: z.string().default('General'),
      dates: z.string(), // e.g. "24 MAR"
      badge: z.string().optional(), // e.g. "FREE"; attendee tiers show "EARLY BIRD" automatically
      title: z.string(),
      description: z.string(),
      currency: z.string().default('NGN'),
      bands: z.array(priceBand).optional(),
      // Static-card pricing (ignored when `bands` is set) — display strings.
      priceLabel: z.string().default('Standard'),
      priceNote: z.string().optional(),
      oldPrice: z.string().optional(),
      price: z.string().optional(),
      url: actionUrl, // static cards only; attendee tiers use each band's url
      ctaLabel: z.string().default('Buy Ticket'),
      pendingLabel: z.string().default('Available soon'), // button text while the url is ""
      order: z.number().default(99),
    })
    .superRefine((tier, ctx) => {
      // Bands must run contiguously from 1 attendee with no gaps or overlaps.
      tier.bands?.forEach((band, i) => {
        const expectedMin = i === 0 ? 1 : tier.bands![i - 1].max + 1;
        if (band.min !== expectedMin || band.max < band.min) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['bands', i],
            message: `Band "${band.label}" must start at ${expectedMin} attendee(s) and end at or after its start`,
          });
        }
      });
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
    ticketUrl: z.string(), // where every "Get Tickets" button points — an on-page anchor or an external URL
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
