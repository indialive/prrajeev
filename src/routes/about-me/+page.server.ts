import type { PageServerLoad } from './$types';
import { getPage, type AboutFields } from '$lib/server/wordpress';

export const load: PageServerLoad = async ({ fetch }) => {
	const page = await getPage<AboutFields>('about-me', fetch);
	return { about: page.acf };
};