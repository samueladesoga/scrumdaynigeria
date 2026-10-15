---
name: add-press-mention
description: Add a news article / press coverage link to the Scrum Day Nigeria website's "In the News" section. Use when the user shares a media link, press article, or news coverage of the event.
---

# Add a Press Mention

Press coverage lives as individual Markdown files in `src/content/press/`, validated against the
`press` schema in `src/content.config.ts`, and renders in the homepage "In the News" section
(`src/components/PressSection.astro`) as a card: the article's thumbnail, its headline, and a
"Read full article on <outlet>" link that opens in a new tab.

This is for independent (earned) coverage. Paid or arranged media partners belong in
`src/content/partners/` with `type: media` instead — use the add-partner skill for those.

## Steps

1. Get the article URL. Fetch it to read the exact headline, publish date, and thumbnail
   (`og:image` meta tag) — don't guess them from the URL slug.
2. Download the thumbnail to `src/assets/press/<kebab-case-outlet>.<ext>` (jpg/png/webp).
   Some outlets (Guardian, Techpoint) sit behind Cloudflare and block curl/WebFetch; if so,
   open the article in the user's Chrome to read the metadata, or ask the user for the image.
   Outlets often run the same press-release photo — if the thumbnail repeats one already in
   `src/assets/press/`, use a distinct photo of ours instead (ask the user for event photos),
   picked to match the story, and resize it to ~1400px wide (`sips -Z 1400`).
3. Create `src/content/press/<kebab-case-outlet>.md` (add a suffix like `-2027` if the outlet
   already has a file):

   ```md
   ---
   outlet: "The Guardian"
   headline: "Exact headline as published"
   url: "https://..."
   image: "../../assets/press/<kebab-case-outlet>.jpg"
   date: 2026-03-29 # optional; not displayed, kept for reference
   order: 1 # lower shows first
   ---
   ```

4. Run `npm run build` to confirm it validates.
5. The section is hidden automatically when no press files exist. The kicker text
   ("Coverage of our last edition") is in `PressSection.astro`; update it if coverage of a
   different edition is added.
