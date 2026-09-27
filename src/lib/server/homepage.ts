import { isHttpError } from '@sveltejs/kit';
import { plainText } from '$lib/seo';
import { getPosts, resolveImage } from './wordpress';

export async function getFeaturedArticle(fetcher: typeof fetch) {
	try {
		const posts = await getPosts(fetcher);
		const post = posts.find(
			(post) =>
				post.slug !== 'hello-world' && !/\[Draft article:/i.test(plainText(post.excerpt.rendered))
		);
		if (!post) return undefined;
		return {
			id: post.id,
			slug: post.slug,
			title: plainText(post.title.rendered),
			excerpt: plainText(post.excerpt.rendered),
			image: (await resolveImage(post.featured_media, fetcher, 'large')) || undefined
		};
	} catch (cause) {
		if (isHttpError(cause, 503)) return undefined;
		throw cause;
	}
}
