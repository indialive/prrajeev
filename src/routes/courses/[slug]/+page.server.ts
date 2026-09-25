import type { PageServerLoad } from './$types';
import { getCourse } from '$lib/server/wordpress';

export const load: PageServerLoad = async ({ params, fetch }) => {
	return { course: await getCourse(params.slug, fetch) };
};