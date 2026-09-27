import { getFeaturedArticle, resolveNow } from '$lib/server/homepage';
import type { PageServerLoad } from './$types';
import {
	resolveSeo,
	getPage,
	previewHome,
	usePreviewContent,
	type HomeFields
} from '$lib/server/wordpress';

export const load: PageServerLoad = async ({ fetch }) => {
	if (usePreviewContent())
		return {
			home: previewHome,
			seo: undefined,
			featuredArticle: undefined,
			now: await resolveNow(previewHome, fetch)
		};
	const [page, featuredArticle] = await Promise.all([
		getPage<HomeFields>('home', fetch),
		getFeaturedArticle(fetch)
	]);
	const [seo, now] = await Promise.all([resolveSeo(page.acf, fetch), resolveNow(page.acf, fetch)]);
	return { home: page.acf, featuredArticle, seo, now };
};
