---
name: add-partner
description: Add a strategic partner, media partner, or sponsor logo to the Scrum Day Nigeria website. Use when the user asks to add a partner, sponsor, or their logo to the site.
---

# Add a Partner or Sponsor

Partners/sponsors live as individual Markdown files in `src/content/partners/`, validated against
the `partners` schema in `src/content.config.ts`.

## Steps

1. Ask for: organization name, `type` (`strategic`, `media`, `sponsor`, or `community`), their
   logo, and their website URL. If `type` is `sponsor`, also ask for `tier`
   (`platinum`/`gold`/`silver`/`bronze`) if relevant.
2. Place the logo under `src/assets/partners/<kebab-name>.svg` (or `.png`) — prefer SVG if the
   partner can provide one. If no logo is available yet, use
   `../../assets/placeholders/logo.svg` as a temporary placeholder.
3. Create `src/content/partners/<kebab-case-name>.md`:

   ```md
   ---
   name: "Organization Name"
   type: "strategic" # strategic | media | sponsor | community
   tier: "gold" # optional, sponsors only
   logo: "../../assets/partners/<kebab-name>.svg"
   url: "https://partner-website.com"
   hero: true # optional — also show the logo in the homepage hero's "In partnership with" row
   order: 3
   ---
   ```

4. Run `npm run build` to confirm the entry validates.
5. Tell the user which section (`Strategic Partners`, `Media Partners`, or `Sponsors`) it'll
   appear under on the homepage `Partners` section — grouping is automatic based on `type`.
