const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const BUCKET = 'images';

export const getPublicImageUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${cleanPath}`;
};

export const media = {
  home: {
    heroPoster: 'APEC.jpg',
    aboutImage: 'BEACH.jpg',
    featuredProjects: [
      { title: 'Corporate Videos', category: 'Videography', image: 'TWM3.jpg' },
      { title: 'Graduation Photoshoot', category: 'Photography', image: 'GRAD5.jpg' },
      { title: 'Sporting Events', category: 'Events', image: 'KUMULS.jpg' },
      { title: 'Company Branding', category: 'Branding', image: '6.png' },
    ],
  },
  about: {
    hero: '2026 Content/0J3A2407.JPG',
    story: '2026 Content/CWL_BTS_8.jpg',
  },
  services: {
    hero: 'Team.jpg',
  },
  booking: {
    hero: '2026 Content/Interview1 .jpg',
  },
  contact: {
    hero: '2026 Content/PATZ.jpg',
  },
  gallery: {
    hero: 'colourRun07.jpg',
  },
} as const;

export { SUPABASE_URL };
