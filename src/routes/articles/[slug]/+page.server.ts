import type { PageServerLoad } from './$types';
import { getPost } from '$lib/server/wordpress';

export const load: PageServerLoad = async ({ params, fetch }) => {
	return { post: await getPost(params.slug, fetch) };
};