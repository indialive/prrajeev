import { getRequestEvent } from '$app/server';
import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';

const FRESH_MS = 5 * 60 * 1000;
const RETAIN_SECONDS = 60 * 60;
const inFlight = new Map<string, Promise<Response>>();

// Cache only public WordPress JSON, never HTML pages or contact submissions.
export async function wordpressFetch(url: string, fetcher: typeof fetch): Promise<Response> {
	const { platform, url: requestUrl } = getRequestEvent();
	let cache: Cache | undefined;
	try {
		if (!dev && typeof caches !== 'undefined') cache = await caches.open('wordpress-v1');
	} catch {
		console.warn('WordPress cache unavailable');
	}
	const key = new Request(
		new URL('/__wordpress-cache/' + encodeURIComponent(url), requestUrl.origin)
	);
	let cached: Response | undefined;
	try {
		cached = await cache?.match(key);
	} catch {
		console.warn('WordPress cache read failed');
	}
	const stored = Number(cached?.headers.get('x-content-stored-at') || 0);
	if (cached && Date.now() - stored < FRESH_MS) return cached;
	const pending = inFlight.get(key.url);
	if (pending) return (await pending).clone();
	const refresh = async (): Promise<Response> => {
		try {
			// Both attempts share one deadline; retries never double the timeout.
			const signal = AbortSignal.timeout(8000);
			let response: Response | undefined;
			for (let attempt = 0; attempt < 2; attempt++) {
				try {
					response = await fetcher(url, { headers: { Accept: 'application/json' }, signal });
					if (response.ok) break;
					if (cached || (response.status !== 429 && response.status < 500) || attempt === 1)
						throw new Error('Upstream status ' + response.status);
					await response.body?.cancel();
				} catch (cause) {
					if (
						cached ||
						signal.aborted ||
						attempt === 1 ||
						(response && response.status !== 429 && response.status < 500)
					)
						throw cause;
				}
				await new Promise((resolve) => setTimeout(resolve, 150));
			}
			if (!response?.ok) throw new Error('No successful upstream response');
			const body = await response.text();
			const payload: unknown = JSON.parse(body);
			if (
				!payload ||
				typeof payload !== 'object' ||
				(/\/(pages|posts|courses)$/.test(new URL(url).pathname) && !Array.isArray(payload))
			)
				throw new Error('Invalid WordPress JSON payload');
			const result = new Response(body, {
				headers: {
					'Content-Type': 'application/json',
					'Cache-Control': 'public, max-age=' + RETAIN_SECONDS,
					'x-content-stored-at': String(Date.now()),
					'x-wp-totalpages': response.headers.get('x-wp-totalpages') || '1'
				}
			});
			if (cache) {
				const write = cache.put(key, result.clone()).catch(() => {
					console.warn('WordPress cache write failed');
				});
				if (platform?.ctx) platform.ctx.waitUntil(write);
				else await write;
			}
			return result;
		} catch (cause) {
			const endpoint = new URL(url);
			console.error(
				'WordPress request failed',
				endpoint.pathname,
				endpoint.searchParams.get('slug') || '',
				cause instanceof Error ? cause.message : 'Unknown error'
			);
			if (cached && Date.now() - stored < RETAIN_SECONDS * 1000) return cached;
			error(503, 'Content is temporarily unavailable. Please try again shortly.');
		}
	};
	const work = refresh();
	inFlight.set(key.url, work);
	try {
		return (await work).clone();
	} finally {
		inFlight.delete(key.url);
	}
}
