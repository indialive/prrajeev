import type { LayoutServerLoad } from './$types';
import {
	getPage,
	getSiteIcon,
	previewSite,
	resolveImage,
	usePreviewContent,
	type RawSiteFields
} from '$lib/server/wordpress';

export const load: LayoutServerLoad = async ({ fetch }) => {
	if (usePreviewContent()) return { site: previewSite, siteIcon: undefined };

	const page = await getPage<RawSiteFields>('site-settings', fetch);
	const [avatar, site_logo, portrait, siteIcon] = await Promise.all([
		resolveImage(page.acf.avatar, fetch),
		resolveImage(page.acf.site_logo, fetch),
		resolveImage(page.acf.portrait, fetch, 'large'),
		getSiteIcon(fetch)
	]);
	return { site: { ...page.acf, avatar, site_logo, portrait }, siteIcon };
};
