import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { resolveSeo, getPage } from '$lib/server/wordpress';

const pages: Record<string, { source: string; title: string }> = {
	mentorship: { source: 'mentorship', title: 'Mentorship' },
	consultation: { source: 'technical-consultation', title: 'Technical consultation' }
};

export const load: PageServerLoad = async ({ params, fetch }) => {
	const config = pages[params.slug];
	if (!config) error(404, 'Page not found');
	const page = await getPage<Record<string, never>>(config.source, fetch);
	return {
		seo: await resolveSeo(page.acf, fetch),
		title: config.title,
		body: page.content.rendered.replace(/&lt;\/?p&gt;/g, '')
	};
};
