// Site-wide values used across pages and meta tags.
export const SITE_TITLE = 'Alaa Eddine Ayadi';
export const SITE_DESCRIPTION = 'Personal website of Alaa Eddine Ayadi.';

// The nav bar, the homepage blurbs and the section pages all read from this.
// `slug` is both the URL and the folder name under src/content/blog/.
export const SECTIONS = [
	{ slug: 'yappathons', label: 'Yappathons', blurb: 'Mostly about training, biohacking, philosophy, etc.' },
	{ slug: 'reviews', label: 'Reviews', blurb: "My opinion on other people's work I have checked out." },
	{ slug: 'projects', label: 'Projects', blurb: 'Tech projects I worked on.' },
];

export const SOCIAL_LINKS = [
	{ label: 'Email', href: 'mailto:ayadi.alaa.e@gmail.com' },
	{ label: 'GitHub', href: 'https://github.com/TheAladin' },
	{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/alaa-eddine-ayadi-7bb416227' },
];
