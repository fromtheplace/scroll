# from the place - cinematic scroll portfolio

A scroll-driven rebuild of the from the place homepage. Every project is a
full-screen section. As you scroll, the background crossfades to that
project's hero film and its YouTube Shorts start autoplaying, muted, with
only one Short ever playing across the whole site at a time.

## Running it

This sandbox has no network access, so dependencies could not be installed
or build-checked here. On your machine:

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a static
`dist/` folder you can deploy anywhere (GitHub Pages, Netlify, Vercel, etc).

## Plugging in the real project data

Everything content-related lives in `src/data/projects.js`. The `studio`
object already matches the live site's copy (name, tagline, location,
disciplines, services, contact). The `PROJECTS` array is placeholder data
in the correct shape, replace each entry with the real project:

```js
{
  id: 'unique-slug',
  title: 'Project Title',
  client: 'Client Name',
  year: '2025',
  role: 'Direction, Capture, Edit',
  description: 'One short line.',
  heroVideo: '/videos/project.mp4',   // full-screen muted looping background
  poster: '/images/project-poster.jpg',
  shortsIds: ['abc123', 'def456'],    // YouTube video IDs, first autoplays
  gallery: ['/images/a.jpg', '/images/b.jpg'],
  href: '/projects/project-slug',
}
```

Hero videos should be compressed, silent-audio-track h264 mp4s (no audio
track needed since they are always muted), ideally under a few MB each so
the crossfade preload stays fast. Keep the same aspect/crop treatment
across all of them so the crossfade doesn't jump.

If your existing site already has a `data.json`, you can load it instead
of the local array by fetching it in `src/data/projects.js` and exporting
the parsed result, the rest of the app only depends on the shape above.

## How the pieces fit together

- `BackgroundVideoManager.jsx` - a global provider rendering two stacked
  `<video>` layers. The inactive layer preloads the next hero video, and
  only crossfades in once `canplaythrough` fires, so there is never a
  black or frozen frame. Adjacent projects' videos are also `<link
  rel="preload">`-hinted a section ahead.
- `useSectionObserver.js` - one IntersectionObserver watches every project
  section and reports which single section counts as "active" right now.
- `ProjectSection.jsx` - a full-screen section. Text and gallery images
  animate in with Framer Motion (opacity + slight translate/scale,
  400-700ms cinematic easing) when the section becomes active.
- `ProjectShorts.jsx` - the reusable Shorts component. Takes an array of
  YouTube IDs. Each Short lazy-loads a real IFrame API player only once
  its container nears the viewport (thumbnail shown until then). A tiny
  global registry in `lib/youtube.js` guarantees only one player across
  the entire page is ever playing, whichever one just called
  `playVideo()` pauses everything else.
- `useLenis.js` - initialises Lenis smooth scrolling, respects
  `prefers-reduced-motion` by skipping entirely.
- `Nav.jsx` - fixed logo, contact, and a reel of index dots that
  highlight the active project and jump on click.

## Notes and things to check on real content

- Swap the placeholder `shortsIds` (currently public test videos) for the
  studio's actual Shorts.
- Add real `heroVideo` files under `public/videos/` and `gallery`/`poster`
  images under `public/images/` (create these folders, they are not
  included since there is no real media to ship yet).
- The reel counter (`01 / 07` etc, top right of each section) is a
  deliberate structural device standing in for a literal film leader
  countdown, since the projects genuinely are a sequence the visitor is
  scrolling through in order.
