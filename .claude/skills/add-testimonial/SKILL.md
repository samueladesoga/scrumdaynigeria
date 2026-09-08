---
name: add-testimonial
description: Add an attendee testimonial/quote to the Scrum Day Nigeria website. Use when the user asks to add a testimonial, review, or quote from a past attendee.
---

# Add a Testimonial

Testimonials live as individual Markdown files in `src/content/testimonials/`, validated against
the `testimonials` schema in `src/content.config.ts`. The Markdown body is the quote itself.

## Steps

1. Ask for: the person's name, role, company (optional), a headshot (optional), and the quote
   text.
2. If a headshot is provided, place it under `src/assets/testimonials/<kebab-name>.jpg`.
3. Create `src/content/testimonials/<kebab-case-name>.md`:

   ```md
   ---
   name: "Full Name"
   role: "Their Title"
   company: "Their Company" # optional
   image: "../../assets/testimonials/<kebab-name>.jpg" # optional
   order: 2
   ---

   The quote text goes here as the Markdown body.
   ```

4. Run `npm run build` to confirm it validates.
5. This section is hidden automatically on the homepage if no testimonial files exist, so adding
   the first one is what makes the section appear.
