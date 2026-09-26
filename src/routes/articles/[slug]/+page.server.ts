import type { PageServerLoad } from './$types';
import { resolveSeo, getPost } from '$lib/server/wordpress';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const post = await getPost(params.slug, fetch);
	return { post, seo: await resolveSeo(post.acf, fetch) };
};
