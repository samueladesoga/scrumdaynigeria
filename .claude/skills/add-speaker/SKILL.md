---
name: add-speaker
description: Add a new speaker (keynote, speaker, or panelist) to the Scrum Day Nigeria website. Use when the user asks to add, register, or list a new speaker, or update an existing speaker's details.
---

# Add a Speaker

Speakers live as individual Markdown files in `src/content/speakers/`, validated against the
`speakers` schema in `src/content.config.ts`. Adding a speaker means creating one file — no
component or page code changes are needed.

## Steps

1. Ask the user (if not already given) for: name, role/title, company, headshot image, and
   whether they're a `keynote`, `speaker`, or `panelist`. Optionally: LinkedIn/Twitter URL,
   which learning track (see `src/content/learning-tracks.yaml` for valid `id`s), and a short bio.
2. Get the headshot image file. Place it under `src/assets/speakers/<kebab-name>.jpg` (create the
   `speakers` subfolder under `src/assets` if it doesn't exist yet). If the user has no photo yet,
   use `../../assets/placeholders/avatar.svg` as a temporary placeholder and tell them to replace
   it later.
3. Create `src/content/speakers/<kebab-case-name>.md`:

   ```md
   ---
   name: "Full Name"
   role: "Their Title"
   company: "Their Company"
   image: "../../assets/speakers/<kebab-name>.jpg"
   type: "speaker" # keynote | speaker | panelist
   track: "agentic-flow" # optional — must match an id in learning-tracks.yaml
   linkedin: "https://linkedin.com/in/..." # optional
   order: 5 # controls display order; lower shows first
   featured: false
   ---

   A short bio paragraph goes here (used on the individual speaker's page if/when one exists).
   ```

4. Pick `order` sensibly: keynotes usually get low numbers (1-3), so they show first.
5. Run `npm run build` to confirm the new file passes schema validation (catches typos, missing
   required fields, or a bad image path) before telling the user it's done.
6. Report back the file path you created and remind the user to review names/titles for accuracy.

## Notes

- Never hardcode speaker data into `.astro` components — the whole point of this architecture is
  that content changes never require a code change.
- To remove a speaker, delete their file.
- To reorder, edit the `order` field.
