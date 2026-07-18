// This file is the single source of truth for every project section.
// Studio identity fields below match the live fromtheplace.github.io site.
// Everything inside PROJECTS is placeholder content in the correct shape.
// Replace heroVideo, shortsIds and gallery with the real project.json values
// and this becomes a drop-in swap, no component changes needed.

export const studio = {
  name: 'from the place',
  tagline: 'Creation + Capture x Production - visual narratives and multimedia experiences.',
  eyebrow: 'Creating',
  headline: 'Design, Audio & Motion Graphics',
  location: 'Otepoti / Dunedin, NZ',
  disciplines: ['Design', 'Video', 'Audio', 'Print'],
  contact: 'blamboxcity@gmail.com',
  services: [
    'Graphic / Poster Design',
    'Offset / Digital / Screen Print',
    'Podcast Production',
    'Multicam Live Video',
    'Video & Motion Graphics',
    'Event Videography',
    'Video Editing & Post Production',
    'Live Audio Production',
  ],
}

// PLACEHOLDER PROJECT DATA
// id must be unique and URL-safe, it is used as the section anchor and nav key.
// heroVideo is a muted looping full-screen background clip for the project.
// shortsIds is an array of YouTube video IDs (Shorts), first one autoplays
// the moment the project becomes the active section.
// gallery is an array of still images shown further down the section.
export const PROJECTS = [
  {
    id: 'placeholder-01',
    title: 'Project One',
    client: 'Client Name',
    year: '2024',
    role: 'Direction, Capture, Edit',
    description:
      'One short line describing the story of this project and what from the place was brought in to make.',
    heroVideo: '/videos/placeholder-01.mp4',
    poster: '/images/placeholder-01-poster.jpg',
    shortsIds: ['dQw4w9WgXcQ', 'jNQXAC9IVRw'],
    gallery: ['/images/placeholder-01-a.jpg', '/images/placeholder-01-b.jpg', '/images/placeholder-01-c.jpg'],
    href: '/projects/placeholder-01',
  },
  {
    id: 'placeholder-02',
    title: 'Project Two',
    client: 'Client Name',
    year: '2024',
    role: 'Video & Motion Graphics',
    description:
      'One short line describing the story of this project and what from the place was brought in to make.',
    heroVideo: '/videos/placeholder-02.mp4',
    poster: '/images/placeholder-02-poster.jpg',
    shortsIds: ['jNQXAC9IVRw', 'dQw4w9WgXcQ'],
    gallery: ['/images/placeholder-02-a.jpg', '/images/placeholder-02-b.jpg'],
    href: '/projects/placeholder-02',
  },
  {
    id: 'placeholder-03',
    title: 'Project Three',
    client: 'Client Name',
    year: '2023',
    role: 'Event Videography, Live Audio',
    description:
      'One short line describing the story of this project and what from the place was brought in to make.',
    heroVideo: '/videos/placeholder-03.mp4',
    poster: '/images/placeholder-03-poster.jpg',
    shortsIds: ['dQw4w9WgXcQ'],
    gallery: ['/images/placeholder-03-a.jpg', '/images/placeholder-03-b.jpg', '/images/placeholder-03-c.jpg'],
    href: '/projects/placeholder-03',
  },
]
