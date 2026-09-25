import type { PageServerLoad } from './$types';
import { getPage, previewHome, usePreviewContent, type HomeFields } from '$lib/server/wordpress';

export const load: PageServerLoad = async ({ fetch }) => {
	const home = usePreviewContent() ? previewHome : (await getPage<HomeFields>('home', fetch)).acf;
	return { home };
};
