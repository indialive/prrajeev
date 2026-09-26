import { error, isHttpError } from '@sveltejs/kit';
import { wordpressFetch } from './wordpress-cache';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';

export type WordPressImage = {
	url?: string;
	srcset?: string;
	alt?: string;
	width?: number;
	height?: number;
};

export type SeoFields = {
	seo_title?: string | null | false;
	seo_description?: string | null | false;
	seo_image?: unknown;
};
export async function resolveSeo(fields: SeoFields | undefined, fetcher: typeof fetch) {
	const text = (value: unknown) =>
		typeof value === 'string' ? value.trim() || undefined : undefined;
	return {
		title: text(fields?.seo_title),
		description: text(fields?.seo_description),
		image: await resolveImage(fields?.seo_image, fetcher, 'large')
	};
}
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

export type RawSiteFields = Omit<SiteFields, 'avatar' | 'site_logo' | 'portrait'> & {
	avatar?: WordPressImage | number | string | null | false;
	site_logo?: WordPressImage | number | string | null | false;
	portrait?: WordPressImage | number | string | null | false;
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
	acf: T & SeoFields;
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
	const configured = env.WORDPRESS_API_URL?.trim();
	return (configured || (dev ? undefined : 'https://cms.prrajeev.com/wp-json/wp/v2'))?.replace(
		/\/+$/,
		''
	);
}

export async function getSiteIcon(fetcher: typeof fetch): Promise<string | undefined> {
	const base = apiBase();
	if (!base) return undefined;
	const root = base.replace(/\/wp\/v2$/, '');
	try {
		const response = await wordpressFetch(root + '?_fields=site_icon_url', fetcher);
		if (!response.ok) return undefined;
		const settings = (await response.json()) as { site_icon_url?: string };
		const url = settings.site_icon_url;
		if (!url) return undefined;
		return ['https:', 'http:'].includes(new URL(url).protocol) ? url : undefined;
	} catch (cause) {
		if (isHttpError(cause, 503) || cause instanceof TypeError) return undefined;
		throw cause;
	}
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
	const response = await wordpressFetch(url, fetcher);
	if (!response.ok) {
		throw new Error(`WordPress returned ${response.status} for page ${slug}.`);
	}

	const pages = (await response.json()) as WordPressPage<T>[];
	if (!pages[0]) {
		error(404, 'Page not found');
	}
	return pages[0];
}

export function usePreviewContent(): boolean {
	return dev && !hasWordPress();
}

export type WordPressPost = {
	acf?: SeoFields;
	id: number;
	slug: string;
	date: string;
	title: { rendered: string };
	excerpt: { rendered: string };
};

export async function getPosts(fetcher: typeof fetch): Promise<WordPressPost[]> {
	const base = apiBase();
	if (!base) throw new Error('Set WORDPRESS_API_URL to your WordPress /wp-json/wp/v2 endpoint.');
	const response = await wordpressFetch(
		base + '/posts?per_page=12&_fields=id,slug,date,title,excerpt',
		fetcher
	);
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

export async function resolveImage(
	value: unknown,
	fetcher: typeof fetch,
	size: 'medium' | 'large' = 'medium'
): Promise<WordPressImage | false> {
	if (!value) return false;
	if (typeof value === 'string') return value.trim() ? { url: value.trim() } : false;
	if (typeof value === 'object') {
		const image = value as WordPressImage & { ID?: number; id?: number };
		if (typeof image.url === 'string' && image.url.trim())
			return { ...image, url: image.url.trim() };
		value = image.ID || image.id;
	}
	if (typeof value !== 'number' || !Number.isSafeInteger(value) || value <= 0) return false;
	const base = apiBase();
	if (!base) return false;
	let media: MediaResponse;
	try {
		media = await getMedia(base, value, fetcher);
	} catch (cause) {
		if (isHttpError(cause, 503)) return false;
		throw cause;
	}
	if (!media.source_url) return false;
	const preferred =
		media.media_details?.sizes?.[size] ??
		media.media_details?.sizes?.medium ??
		media.media_details?.sizes?.thumbnail;
	const variants = [
		...Object.values(media.media_details?.sizes ?? {}),
		{ source_url: media.source_url, width: media.media_details?.width || 0 }
	];
	const srcset = variants
		.filter(
			(item, index, all) =>
				item.width > 0 && all.findIndex((other) => other.width === item.width) === index
		)
		.map((item) => item.source_url + ' ' + item.width + 'w')
		.join(', ');
	return {
		url: preferred?.source_url || media.source_url,
		srcset: srcset || undefined,
		alt: media.alt_text,
		width: preferred?.width || media.media_details?.width,
		height: preferred?.height || media.media_details?.height
	};
}

// Share pending and completed media lookups within each request-scoped fetch.
const mediaRequests = new WeakMap<typeof fetch, Map<string, Promise<MediaResponse>>>();
function getMedia(base: string, id: number, fetcher: typeof fetch): Promise<MediaResponse> {
	let requests = mediaRequests.get(fetcher);
	if (!requests) mediaRequests.set(fetcher, (requests = new Map()));
	const url = base + '/media/' + id + '?_fields=source_url,alt_text,media_details';
	let pending = requests.get(url);
	if (!pending) {
		pending = wordpressFetch(url, fetcher).then(async (response) => {
			if (!response.ok) throw new Error('WordPress media request failed: ' + response.status);
			return (await response.json()) as MediaResponse;
		});
		requests.set(url, pending);
	}
	return pending;
}
export async function getPost(
	slug: string,
	fetcher: typeof fetch
): Promise<WordPressPost & { content: { rendered: string } }> {
	const base = apiBase();
	if (!base) throw new Error('Set WORDPRESS_API_URL to your WordPress /wp-json/wp/v2 endpoint.');
	const response = await wordpressFetch(
		base +
			'/posts?slug=' +
			encodeURIComponent(slug) +
			'&_fields=id,slug,date,title,excerpt,content,acf',
		fetcher
	);
	if (!response.ok)
		throw new Error('WordPress returned ' + response.status + ' for article ' + slug + '.');
	const posts = (await response.json()) as Array<WordPressPost & { content: { rendered: string } }>;
	if (!posts[0]) error(404, 'Article not found');
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
	featured_media?: number;
	image?: WordPressImage | false;
	acf: CourseFields & SeoFields;
};

export async function getCourses(fetcher: typeof fetch): Promise<WordPressCourse[]> {
	const base = apiBase();
	if (!base) throw new Error('Set WORDPRESS_API_URL to your WordPress /wp-json/wp/v2 endpoint.');
	const response = await wordpressFetch(
		base + '/courses?per_page=100&_fields=id,slug,title,content,excerpt,acf',
		fetcher
	);
	if (!response.ok) throw new Error('WordPress returned ' + response.status + ' for courses.');
	return (await response.json()) as WordPressCourse[];
}

export async function getCourse(slug: string, fetcher: typeof fetch): Promise<WordPressCourse> {
	const base = apiBase();
	if (!base) throw new Error('Set WORDPRESS_API_URL to your WordPress /wp-json/wp/v2 endpoint.');
	const response = await wordpressFetch(
		base +
			'/courses?slug=' +
			encodeURIComponent(slug) +
			'&_fields=id,slug,title,content,excerpt,featured_media,acf',
		fetcher
	);
	if (!response.ok)
		throw new Error('WordPress returned ' + response.status + ' for course ' + slug + '.');
	const courses = (await response.json()) as WordPressCourse[];
	if (!courses[0]) error(404, 'Course not found');
	return { ...courses[0], image: await resolveImage(courses[0].featured_media, fetcher, 'large') };
}
