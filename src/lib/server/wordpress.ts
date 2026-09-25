import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';

export type WordPressImage = {
	url?: string;
	alt?: string;
	width?: number;
	height?: number;
};

export type MenuItem = {
	section: 'primary' | 'help';
	label: string;
	path: string;
};

export type SiteFields = {
	brand_name?: string;
	tagline?: string;
	site_logo?: WordPressImage | false;
	avatar?: WordPressImage | false;
	portrait?: WordPressImage | false;
	contact_email?: string;
	linkedin_url?: string;
	whatsapp_url?: string;
	footer_note?: string;
	menu_items?: MenuItem[];
};

export type HomeFields = {
	hero_kicker?: string;
	hero_heading?: string;
	hero_intro?: string;
	mentorship_heading?: string;
	mentorship_summary?: string;
	consultation_heading?: string;
	consultation_summary?: string;
	writing_note?: string;
	now_learning?: string;
	now_making?: string;
	now_listening?: string;
};

export type WordPressPage<T> = {
	id: number;
	slug: string;
	title: { rendered: string };
	content: { rendered: string };
	acf: T;
};

export const previewSite: SiteFields = {
	brand_name: 'P R Rajeev',
	tagline: 'ServiceNow developer and mentor',
	footer_note: 'Thanks for visiting.',
	menu_items: [
		{ section: 'primary', label: 'Home', path: '/' },
		{ section: 'primary', label: 'About me', path: '/about-me' },
		{ section: 'primary', label: 'Articles', path: '/articles' },
		{ section: 'help', label: 'Mentorship', path: '/mentorship' },
		{ section: 'help', label: 'Consultation', path: '/consultation' },
		{ section: 'help', label: 'Contact', path: '/contact' }
	]
};

export const previewHome: HomeFields = {
	hero_kicker: 'ServiceNow developer',
	hero_heading: 'Hi, I am Rajeev.',
	hero_intro: '[Add your approved personal introduction.]',
	mentorship_heading: 'Learning ServiceNow?',
	mentorship_summary: '[Explain who you mentor and how you help.]',
	consultation_heading: 'Working through a problem?',
	consultation_summary: '[Describe the technical questions you can help with.]',
	writing_note: '[Introduce your articles when ready.]',
	now_learning: '[What I am learning now]',
	now_making: '[What I am working on now]',
	now_listening: '[Optional personal note]'
};
function apiBase(): string | undefined {
	return env.WORDPRESS_API_URL?.replace(/\/+$/, '');
}

export function hasWordPress(): boolean {
	return Boolean(apiBase());
}

export async function getPage<T>(slug: string, fetcher: typeof fetch): Promise<WordPressPage<T>> {
	const base = apiBase();
	if (!base) {
		throw new Error('Set WORDPRESS_API_URL to your WordPress /wp-json/wp/v2 endpoint.');
	}

	const url = `${base}/pages?slug=${encodeURIComponent(slug)}&_fields=id,slug,title,content,acf`;
	const response = await fetcher(url, { headers: { Accept: 'application/json' } });
	if (!response.ok) {
		throw new Error(`WordPress returned ${response.status} for page ${slug}.`);
	}

	const pages = (await response.json()) as WordPressPage<T>[];
	if (!pages[0]) {
		throw new Error(`Published WordPress page “${slug}” was not found.`);
	}
	return pages[0];
}

export function usePreviewContent(): boolean {
	return dev && !hasWordPress();
}

export type WordPressPost = {
	id: number;
	slug: string;
	date: string;
	title: { rendered: string };
	excerpt: { rendered: string };
};

export async function getPosts(fetcher: typeof fetch): Promise<WordPressPost[]> {
	const base = apiBase();
	if (!base) throw new Error('Set WORDPRESS_API_URL to your WordPress /wp-json/wp/v2 endpoint.');
	const response = await fetcher(base + '/posts?per_page=12&_fields=id,slug,date,title,excerpt', {
		headers: { Accept: 'application/json' }
	});
	if (!response.ok) throw new Error('WordPress returned ' + response.status + ' for articles.');
	return (await response.json()) as WordPressPost[];
}
export type AboutFields = {
	hero_heading?: string;
	intro?: string;
	professional_story?: string;
	development_focus?: string;
	mentorship_focus?: string;
	consultation_focus?: string;
	working_approach?: string;
};

export type ContactFields = {
	hero_heading?: string;
	intro?: string;
	form_intro?: string;
	response_note?: string;
};

type MediaResponse = {
	source_url: string;
	alt_text: string;
	media_details?: {
		width?: number;
		height?: number;
		sizes?: Record<string, { source_url: string; width: number; height: number }>;
	};
};

export async function resolveImage(value: unknown, fetcher: typeof fetch): Promise<WordPressImage | false> {
	if (!value) return false;
	if (typeof value === 'object' && 'url' in value) return value as WordPressImage;
	if (typeof value !== 'number') return false;
	const base = apiBase();
	if (!base) return false;
	const response = await fetcher(base + '/media/' + value + '?_fields=source_url,alt_text,media_details');
	if (!response.ok) throw new Error('WordPress returned ' + response.status + ' for media ' + value + '.');
	const media = (await response.json()) as MediaResponse;
	const preferred = media.media_details?.sizes?.medium ?? media.media_details?.sizes?.thumbnail;
	return {
		url: preferred?.source_url || media.source_url,
		alt: media.alt_text,
		width: preferred?.width || media.media_details?.width,
		height: preferred?.height || media.media_details?.height
	};
}

export async function getPost(slug: string, fetcher: typeof fetch): Promise<WordPressPost & { content: { rendered: string } }> {
	const base = apiBase();
	if (!base) throw new Error('Set WORDPRESS_API_URL to your WordPress /wp-json/wp/v2 endpoint.');
	const response = await fetcher(
		base + '/posts?slug=' + encodeURIComponent(slug) + '&_fields=id,slug,date,title,excerpt,content',
		{ headers: { Accept: 'application/json' } }
	);
	if (!response.ok) throw new Error('WordPress returned ' + response.status + ' for article ' + slug + '.');
	const posts = (await response.json()) as Array<WordPressPost & { content: { rendered: string } }>;
	if (!posts[0]) throw new Error('Published article "' + slug + '" was not found.');
	return posts[0];
}
export type CourseFields = {
	short_intro?: string;
	audience?: string;
	learning_topics?: Array<{ topic: string }>;
	mentor_note?: string;
	format?: string;
	time_commitment?: string;
	fee_note?: string;
	prerequisites?: string;
	faqs?: Array<{ question: string; answer: string }>;
};

export type WordPressCourse = {
	id: number;
	slug: string;
	title: { rendered: string };
	content: { rendered: string };
	excerpt: { rendered: string };
	acf: CourseFields;
};

export async function getCourses(fetcher: typeof fetch): Promise<WordPressCourse[]> {
	const base = apiBase();
	if (!base) throw new Error('Set WORDPRESS_API_URL to your WordPress /wp-json/wp/v2 endpoint.');
	const response = await fetcher(base + '/courses?per_page=100&_fields=id,slug,title,content,excerpt,acf', {
		headers: { Accept: 'application/json' }
	});
	if (!response.ok) throw new Error('WordPress returned ' + response.status + ' for courses.');
	return (await response.json()) as WordPressCourse[];
}

export async function getCourse(slug: string, fetcher: typeof fetch): Promise<WordPressCourse> {
	const base = apiBase();
	if (!base) throw new Error('Set WORDPRESS_API_URL to your WordPress /wp-json/wp/v2 endpoint.');
	const response = await fetcher(
		base + '/courses?slug=' + encodeURIComponent(slug) + '&_fields=id,slug,title,content,excerpt,acf',
		{ headers: { Accept: 'application/json' } }
	);
	if (!response.ok) throw new Error('WordPress returned ' + response.status + ' for course ' + slug + '.');
	const courses = (await response.json()) as WordPressCourse[];
	if (!courses[0]) throw new Error('Published course "' + slug + '" was not found.');
	return courses[0];
}