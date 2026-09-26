import type { PageServerLoad } from './$types';
import {
	resolveSeo,
	getPage,
	previewHome,
	usePreviewContent,
	type HomeFields
} from '$lib/server/wordpress';

export const load: PageServerLoad = async ({ fetch }) => {
	if (usePreviewContent()) return { home: previewHome, seo: undefined };
	const page = await getPage<HomeFields>('home', fetch);
	return { home: page.acf, seo: await resolveSeo(page.acf, fetch) };
};
