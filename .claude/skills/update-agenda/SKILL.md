---
name: update-agenda
description: Add, edit, or reorder sessions in the Scrum Day Nigeria conference agenda/schedule. Use when the user asks to update the schedule, agenda, timetable, or add a session/talk/panel.
---

# Update the Agenda

The whole conference schedule lives in one file: `src/content/agenda/agenda.yaml` — an array of
session entries, validated against the `agenda` schema in `src/content.config.ts`. It powers both
the homepage schedule preview and the full `/schedule` page.

## Steps

1. Open `src/content/agenda/agenda.yaml`.
2. To add a session, append an entry:

   ```yaml
   - id: unique-slug-for-this-session # must be unique across the whole file
     day: "2026-03-24" # ISO date, used for grouping/sorting
     dayLabel: "Main Conference Day" # human label shown as the section heading
     startTime: "11:00" # 24h HH:MM, used for sorting within a day
     endTime: "11:45" # optional
     title: "Session Title"
     description: "Optional one-line abstract."
     type: session # keynote | session | panel | break | mixer | registration
     speakerIds: ["sample-keynote-speaker"] # filenames (no .md) from src/content/speakers/
     track: "agentic-flow" # optional, must match an id in learning-tracks.yaml
     location: "Main Hall" # optional
   ```

3. `speakerIds` must match existing filenames in `src/content/speakers/` (without the `.md`
   extension) — if the speaker doesn't exist yet, use the `add-speaker` skill first, or leave
   `speakerIds: []` and fill it in later.
4. Sessions are sorted automatically by `day` then `startTime` — you don't need to keep the file
   in chronological order manually, but doing so makes it easier to scan.
5. To remove a session, delete its entry. To move it, just change `startTime`/`day`.
6. Run `npm run build` after editing — this catches duplicate `id`s, bad dates, or a `speakerIds`
   entry that doesn't resolve to a real speaker file (the page will just silently omit the name,
   so double-check spelling).
