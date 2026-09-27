import { getFeaturedArticle } from '$lib/server/homepage';
import type { PageServerLoad } from './$types';
import {
	resolveSeo,
	getPage,
	previewHome,
	usePreviewContent,
	type HomeFields
} from '$lib/server/wordpress';

export const load: PageServerLoad = async ({ fetch }) => {
	if (usePreviewContent()) return { home: previewHome, seo: undefined, featuredArticle: undefined };
	const [page, featuredArticle] = await Promise.all([
		getPage<HomeFields>('home', fetch),
		getFeaturedArticle(fetch)
	]);
	return { home: page.acf, featuredArticle, seo: await resolveSeo(page.acf, fetch) };
};
