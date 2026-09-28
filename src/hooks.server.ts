import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.hostname === 'www.prrajeev.com') {
		redirect(308, 'https://prrajeev.com' + event.url.pathname + event.url.search);
	}
	const response = await resolve(event);
	if (response.status >= 400 || event.request.method !== 'GET')
		response.headers.set('Cache-Control', 'no-store');
	if (
		event.url.hostname !== 'prrajeev.com' ||
		event.url.pathname === '/design-system' ||
		response.status >= 400
	) {
		response.headers.set('X-Robots-Tag', 'noindex');
	}
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

	response.headers.set('X-Frame-Options', 'DENY');

	response.headers.set(
		'Content-Security-Policy',
		"frame-ancestors 'none'; base-uri 'self'; object-src 'none'"
	);

	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

	if (event.url.protocol === 'https:') {
		response.headers.set('Strict-Transport-Security', 'max-age=31536000');
	}
	return response;
};
