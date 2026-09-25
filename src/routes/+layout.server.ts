import type { LayoutServerLoad } from './$types';
import {
	getPage,
	previewSite,
	resolveImage,
	usePreviewContent,
	type SiteFields
} from '$lib/server/wordpress';

export const load: LayoutServerLoad = async ({ fetch }) => {
	if (usePreviewContent()) return { site: previewSite };

	const page = await getPage<SiteFields>('site-settings', fetch);
	const site = { ...page.acf };
	[site.avatar, site.portrait] = await Promise.all([
		resolveImage(site.avatar, fetch),
		resolveImage(site.portrait, fetch)
	]);
	return { site };
};