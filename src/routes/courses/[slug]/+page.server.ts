import type { PageServerLoad } from './$types';
import { resolveSeo, getCourse } from '$lib/server/wordpress';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const course = await getCourse(params.slug, fetch);
	return { course, seo: await resolveSeo(course.acf, fetch) };
};
