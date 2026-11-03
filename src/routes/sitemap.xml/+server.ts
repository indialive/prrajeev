import type { RequestHandler } from './$types';
import { getSitemapEntries } from '$lib/server/wordpress';
import { SITE_URL } from '$lib/seo';

const escapeXml = (value: string) =>
	value.replace(
		/[&<>"']/g,
		(char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]!
	);

export const GET: RequestHandler = async ({ fetch }) => {
	const entries = await getSitemapEntries(fetch);
	const body = entries
		.map(
			({ path, modified }) =>
				`<url><loc>${escapeXml(SITE_URL + path)}</loc>${modified ? `<lastmod>${escapeXml(modified)}Z</lastmod>` : ''}</url>`
		)
		.join('');
	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`,
		{ headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'no-cache' } }
	);
};
