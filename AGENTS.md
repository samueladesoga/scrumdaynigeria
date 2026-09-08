## Content model

All editable content (speakers, agenda, partners, testimonials, blog posts, site config) lives
under `src/content/` as schema-validated Markdown/YAML — see `src/content.config.ts` for schemas
and `README.md` for the full table. Never hardcode this kind of content into `.astro` components;
add/edit a content file instead, then run `npm run build` to validate it.

Skills exist under `.claude/skills/` for the common content jobs (add-speaker, add-partner,
add-testimonial, publish-blog-post, update-agenda) — prefer using those over ad hoc edits.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
