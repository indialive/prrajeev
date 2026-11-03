import { error, isHttpError } from '@sveltejs/kit';
import { wordpressFetch } from './wordpress-cache';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import type {
	WordPressImage,
	SeoFields,
	SiteFields,
	HomeFields,
	WordPressPage,
	WordPressPost,
	MediaResponse,
	WordPressCourse
} from './wordpress-types';
export type {
	WordPressImage,
	SeoFields,
	MenuItem,
	SiteFields,
	RawSiteFields,
	HomeFields,
	WordPressPage,
	WordPressPost,
	AboutFields,
	ContactFields,
	CourseFields,
	WordPressCourse
} from './wordpress-types';

export async function resolveSeo(fields: SeoFields | undefined, fetcher: typeof fetch) {
	const text = (value: unknown) =>
		typeof value === 'string' ? value.trim() || undefined : undefined;
	return {
		title: text(fields?.seo_title),
		description: text(fields?.seo_description),
		image: await resolveImage(fields?.seo_image, fetcher, 'large')
	};
}

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
const NO_ENDPOINT = 'Set WORDPRESS_API_URL to your WordPress /wp-json/wp/v2 endpoint.';

/** Public routes for WordPress content; drives the sitemap. Pages map by slug, other types by prefix. */
const pageRoutes: Record<string, string> = {
	home: '/',
	'about-me': '/about-me',
	contact: '/contact',
	mentorship: '/mentorship',
	'technical-consultation': '/consultation'
};
const collectionRoutes = {
	posts: { prefix: '/articles', ignore: ['hello-world'] },
	courses: { prefix: '/courses', ignore: [] as string[] }
};
const indexRoutes = ['/articles', '/courses'];

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
		const settings = (await response.json()) as { site_icon_url?: string };
		const url = settings.site_icon_url;
		if (!url) return undefined;
		return ['https:', 'http:'].includes(new URL(url).protocol) ? url : undefined;
	} catch (cause) {
		if (isHttpError(cause, 503) || cause instanceof TypeError) return undefined;
		throw cause;
	}
}

/** Fetch JSON from a collection path (e.g. `/posts?per_page=12`); throws if WordPress is not configured. */
async function wp<T>(
	path: string,
	fetcher: typeof fetch
): Promise<{ data: T; response: Response }> {
	const base = apiBase();
	if (!base) throw new Error(NO_ENDPOINT);
	const response = await wordpressFetch(base + path, fetcher);
	return { data: (await response.json()) as T, response };
}

/** First item of a slug query, or a 404. */
async function wpBySlug<T>(
	type: string,
	slug: string,
	fields: string,
	notFound: string,
	fetcher: typeof fetch
): Promise<T> {
	const { data } = await wp<T[]>(
		`/${type}?slug=${encodeURIComponent(slug)}&_fields=${fields}`,
		fetcher
	);
	if (!data[0]) error(404, notFound);
	return data[0];
}

export function hasWordPress(): boolean {
	return Boolean(apiBase());
}

export function getPage<T>(slug: string, fetcher: typeof fetch): Promise<WordPressPage<T>> {
	return wpBySlug('pages', slug, 'id,slug,title,content,acf', 'Page not found', fetcher);
}

export function usePreviewContent(): boolean {
	return dev && !hasWordPress();
}

export async function getPosts(fetcher: typeof fetch): Promise<WordPressPost[]> {
	const { data } = await wp<WordPressPost[]>(
		'/posts?per_page=12&_fields=id,slug,date,title,excerpt,featured_media',
		fetcher
	);
	return data;
}

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
			return (await response.json()) as MediaResponse;
		});
		requests.set(url, pending);
	}
	return pending;
}
export function getPost(
	slug: string,
	fetcher: typeof fetch
): Promise<WordPressPost & { content: { rendered: string } }> {
	return wpBySlug(
		'posts',
		slug,
		'id,slug,date,title,excerpt,content,acf',
		'Article not found',
		fetcher
	);
}

export async function getCourses(fetcher: typeof fetch): Promise<WordPressCourse[]> {
	const { data } = await wp<WordPressCourse[]>(
		'/courses?per_page=100&_fields=id,slug,title,content,excerpt,acf',
		fetcher
	);
	return data;
}

export async function getCourse(slug: string, fetcher: typeof fetch): Promise<WordPressCourse> {
	const course = await wpBySlug<WordPressCourse>(
		'courses',
		slug,
		'id,slug,title,content,excerpt,featured_media,acf',
		'Course not found',
		fetcher
	);
	return { ...course, image: await resolveImage(course.featured_media, fetcher, 'large') };
}

type SitemapEntry = { path: string; modified?: string };

/** Every published item of a content type, following WordPress pagination. */
async function listSlugs(type: string, fetcher: typeof fetch) {
	const items: Array<{ slug: string; modified_gmt: string }> = [];
	for (let page = 1; ; page++) {
		const { data, response } = await wp<typeof items>(
			`/${type}?per_page=100&page=${page}&_fields=slug,modified_gmt`,
			fetcher
		);
		if (!Array.isArray(data)) break;
		items.push(...data);
		if (page >= Number(response.headers.get('x-wp-totalpages') || 1)) break;
	}
	return items;
}

export async function getSitemapEntries(fetcher: typeof fetch): Promise<SitemapEntry[]> {
	if (!apiBase()) return [];
	const toEntries = (type: string): Promise<SitemapEntry[]> =>
		listSlugs(type, fetcher).then((items) =>
			items.flatMap(({ slug, modified_gmt }) => {
				const collection = collectionRoutes[type as keyof typeof collectionRoutes];
				const path = collection
					? collection.ignore.includes(slug)
						? undefined
						: `${collection.prefix}/${encodeURIComponent(slug)}`
					: pageRoutes[slug];
				return path ? [{ path, modified: modified_gmt }] : [];
			})
		);
	const groups = await Promise.all(
		['pages', ...Object.keys(collectionRoutes)].map((type) =>
			toEntries(type).catch((cause) => {
				console.error(`Sitemap: skipping ${type}`, cause);
				return [];
			})
		)
	);
	return [...indexRoutes.map((path) => ({ path })), ...groups.flat()];
}
