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
    day: z.string(), // e.g. "2026-03-23" (pre-event) or "2026-03-24" (main day)
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
  site,
};
