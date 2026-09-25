import type { PageServerLoad } from './$types';
import { getCourses } from '$lib/server/wordpress';

export const load: PageServerLoad = async ({ fetch }) => {
	return { courses: await getCourses(fetch) };
};