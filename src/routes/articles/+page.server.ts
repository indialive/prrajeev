import type { PageServerLoad } from './$types';
import { getPosts } from '$lib/server/wordpress';

export const load: PageServerLoad = async ({ fetch }) => {
	const posts = await getPosts(fetch);
	return { posts: posts.filter((post) => post.slug !== 'hello-world') };
};