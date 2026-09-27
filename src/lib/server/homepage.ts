import { isHttpError } from '@sveltejs/kit';
import { plainText } from '$lib/seo';
import { getPosts, resolveImage, type HomeFields } from './wordpress';

export async function getFeaturedArticle(fetcher: typeof fetch) {
	try {
		const posts = await getPosts(fetcher);
		const post = posts.find(
			(post) =>
				post.slug !== 'hello-world' && !/\[Draft article:/i.test(plainText(post.excerpt.rendered))
		);
		if (!post) return undefined;
		const excerpt = plainText(post.excerpt.rendered);
		const words = excerpt.split(/\s+/);
		return {
			id: post.id,
			slug: post.slug,
			title: plainText(post.title.rendered),
			excerpt:
				words.length > 15
					? words
							.slice(0, 15)
							.join(' ')
							.replace(/[,:;.!?]+$/, '') + '\u2026'
					: excerpt,
			image: (await resolveImage(post.featured_media, fetcher, 'large')) || undefined
		};
	} catch (cause) {
		if (isHttpError(cause, 503)) return undefined;
		throw cause;
	}
}

const text = (value: unknown) =>
	typeof value === 'string' ? value.trim() || undefined : undefined;

export function resourceUrl(value: unknown): string | undefined {
	const input = text(value);
	if (!input) return undefined;
	try {
		const url = new URL(input);
		return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password
			? url.href
			: undefined;
	} catch {
		return undefined;
	}
}

export function spotifyEmbedUrl(value: unknown): string | undefined {
	const input = text(value);
	if (!input) return undefined;
	try {
		const url = new URL(input);
		if (
			url.protocol !== 'https:' ||
			url.hostname !== 'open.spotify.com' ||
			url.username ||
			url.password ||
			url.port
		)
			return undefined;
		const match =
			/^\/(?:intl-[a-z]{2}(?:-[a-z]{2})?\/)?(track|album|playlist)\/([A-Za-z0-9]{22})\/?$/.exec(
				url.pathname
			);
		return match ? 'https://open.spotify.com/embed/' + match[1] + '/' + match[2] : undefined;
	} catch {
		return undefined;
	}
}

export async function resolveNow(fields: HomeFields, fetcher: typeof fetch) {
	async function preview(kind: 'learning' | 'making') {
		const image = await resolveImage(fields[`now_${kind}_image`], fetcher);
		const result = {
			note: text(fields[`now_${kind}`]),
			title: text(fields[`now_${kind}_title`]),
			context: text(kind === 'learning' ? fields.now_learning_source : fields.now_making_status),
			url: resourceUrl(fields[`now_${kind}_url`]),
			image: image || undefined
		};
		return Object.values(result).some(Boolean) ? result : undefined;
	}
	const [learning, making] = await Promise.all([preview('learning'), preview('making')]);
	const note = text(fields.now_listening);
	const embedUrl = spotifyEmbedUrl(fields.now_listening_spotify_url);
	return { learning, making, listening: note || embedUrl ? { note, embedUrl } : undefined };
}
