import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = ts.transpileModule(fs.readFileSync('src/lib/server/wordpress-cache.ts', 'utf8'), {
	compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
}).outputText;
function setup({ age, cacheFails = false, dev = false } = {}) {
	let saved =
		age === undefined
			? undefined
			: new Response('[{"id":1}]', {
					headers: { 'x-content-stored-at': String(Date.now() - age) }
				});
	let writes = 0;
	const cache = {
		match: async () => saved?.clone(),
		put: async (_, response) => {
			writes++;
			saved = response;
		}
	};
	const exports = {};
	vm.runInNewContext(source, {
		exports,
		Request,
		Response,
		URL,
		AbortSignal,
		Date,
		setTimeout,
		console: { warn() {}, error() {} },
		caches: {
			open: async () => {
				if (cacheFails) throw new Error('Cache offline');
				return cache;
			}
		},
		require: (name) => {
			if (name === '$app/environment') return { dev };
			if (name === '$app/server')
				return { getRequestEvent: () => ({ url: new URL('https://prrajeev.com/') }) };
			if (name === '@sveltejs/kit')
				return {
					error: (status, message) => {
						throw Object.assign(new Error(message), { status });
					}
				};
			throw new Error(name);
		}
	});
	return { fetch: exports.wordpressFetch, writes: () => writes };
}
const url = 'https://cms.prrajeev.com/wp-json/wp/v2/pages?slug=home';
test('cold cache stores valid public JSON and preserves pagination', async () => {
	const state = setup();
	const result = await state.fetch(url, async (_, options) => {
		assert.ok(options.signal instanceof AbortSignal);
		return new Response('[]', { headers: { 'x-wp-totalpages': '2' } });
	});
	assert.equal(await result.text(), '[]');
	assert.equal(result.headers.get('x-wp-totalpages'), '2');
	assert.equal(state.writes(), 1);
});
test('fresh cache avoids upstream requests', async () => {
	const state = setup({ age: 60_000 });
	assert.equal(
		await (
			await state.fetch(url, () => {
				throw new Error('Must not fetch');
			})
		).text(),
		'[{"id":1}]'
	);
});
test('five-minute expiry refreshes content', async () => {
	const state = setup({ age: 301_000 });
	assert.equal(
		await (await state.fetch(url, async () => new Response('[{"id":2}]'))).text(),
		'[{"id":2}]'
	);
});
test('temporary upstream failure serves retained content', async () => {
	const state = setup({ age: 301_000 });
	assert.equal(
		await (await state.fetch(url, async () => new Response('Unavailable', { status: 500 }))).text(),
		'[{"id":1}]'
	);
});
test('expired cache cannot conceal an outage', async () => {
	const state = setup({ age: 3_601_000 });
	await assert.rejects(
		state.fetch(url, async () => {
			throw new Error('Network offline');
		}),
		{ status: 503 }
	);
});
test('malformed JSON does not replace stale content', async () => {
	const state = setup({ age: 301_000 });
	await state.fetch(url, async () => new Response('<html>Upstream error</html>'));
	assert.equal(state.writes(), 0);
});
test('cache failure still allows successful upstream responses', async () => {
	const state = setup({ cacheFails: true });
	assert.equal(await (await state.fetch(url, async () => new Response('[]'))).text(), '[]');
});
test('development bypasses cache', async () => {
	const state = setup({ age: 0, dev: true });
	assert.equal(await (await state.fetch(url, async () => new Response('[]'))).text(), '[]');
	assert.equal(state.writes(), 0);
});

test('cold transient failure retries once within the same deadline', async () => {
	const state = setup();
	let calls = 0;
	let firstSignal;
	const result = await state.fetch(url, async (_, options) => {
		calls++;
		if (calls === 1) {
			firstSignal = options.signal;
			return new Response('', { status: 500 });
		}
		assert.equal(options.signal, firstSignal);
		return new Response('[]');
	});
	assert.equal(calls, 2);
	assert.equal(await result.text(), '[]');
});
test('concurrent cache misses share one upstream request', async () => {
	const state = setup();
	let calls = 0;
	const fetcher = async () => {
		calls++;
		await new Promise((resolve) => setTimeout(resolve, 20));
		return new Response('[]');
	};
	const results = await Promise.all([
		state.fetch(url, fetcher),
		state.fetch(url, fetcher),
		state.fetch(url, fetcher)
	]);
	assert.equal(calls, 1);
	assert.deepEqual(await Promise.all(results.map((response) => response.text())), [
		'[]',
		'[]',
		'[]'
	]);
});
test('permanent upstream errors are not retried', async () => {
	const state = setup();
	let calls = 0;
	await assert.rejects(
		state.fetch(url, async () => {
			calls++;
			return new Response('', { status: 403 });
		}),
		{ status: 503 }
	);
	assert.equal(calls, 1);
});
