import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { compile } from 'svelte/compiler';
import { render } from 'svelte/server';
import { pathToFileURL } from 'node:url';

function api() {
	const exports = {};
	let requests = 0;
	const code = ts.transpileModule(fs.readFileSync('src/lib/server/wordpress.ts', 'utf8'), {
		compilerOptions: { module: ts.ModuleKind.CommonJS }
	}).outputText;
	vm.runInNewContext(code, {
		exports,
		URL,
		require(name) {
			if (name === '$env/dynamic/private')
				return { env: { WORDPRESS_API_URL: 'https://cms.example/wp-json/wp/v2' } };
			if (name === '$app/environment') return { dev: false };
			if (name === '@sveltejs/kit')
				return {
					isHttpError: () => false,
					error: () => {
						throw new Error('not found');
					}
				};
			return {
				wordpressFetch: async () => {
					requests++;
					return Response.json({
						source_url: 'https://cms.example/portrait.avif',
						alt_text: 'Approved portrait',
						media_details: { width: 900, height: 900 }
					});
				}
			};
		}
	});
	return { ...exports, count: () => requests };
}

test('image IDs, ACF objects, URLs and unset values share media resolution', async () => {
	const wp = api();
	const fetcher = () => {};
	for (const value of [undefined, null, false, '', '   ', 0, -1, {}])
		assert.equal(await wp.resolveImage(value, fetcher), false);
	assert.equal(
		(await wp.resolveImage(' https://example.com/a.avif ', fetcher)).url,
		'https://example.com/a.avif'
	);
	assert.equal(
		(await wp.resolveImage({ url: 'https://example.com/a.avif', alt: 'Alt' }, fetcher)).alt,
		'Alt'
	);
	const images = await Promise.all(
		[40, { ID: 40 }, { id: 40 }].map((value) => wp.resolveImage(value, fetcher))
	);
	assert.equal(wp.count(), 1);
	assert.equal(images[0].alt, 'Approved portrait');
	await wp.resolveSeo({ seo_image: 40 }, fetcher);
	assert.equal(wp.count(), 1);
	await wp.resolveImage(40, () => {});
	assert.equal(wp.count(), 2);
});

test('SEO text trims populated fields and treats all empty forms as unset', async () => {
	const wp = api();
	for (const value of [undefined, null, false, '', ' \n\t ']) {
		const seo = await wp.resolveSeo(
			{ seo_title: value, seo_description: value, seo_image: value },
			() => {}
		);
		assert.equal(seo.title, undefined);
		assert.equal(seo.description, undefined);
		assert.equal(seo.image, false);
	}
	const seo = await wp.resolveSeo(
		{ seo_title: ' Custom title ', seo_description: ' Approved description ', seo_image: 40 },
		() => {}
	);
	assert.equal(seo.title, 'Custom title');
	assert.equal(seo.description, 'Approved description');
	assert.match(seo.image.url, /portrait.avif$/);
});

test('Page, Post and Course SSR metadata uses overrides and reverts to defaults', async () => {
	const directory = fs.mkdtempSync('tests/.seo-render-');
	try {
		fs.writeFileSync(
			directory + '/seo-utils.mjs',
			ts.transpileModule(fs.readFileSync('src/lib/seo.ts', 'utf8'), {
				compilerOptions: { module: ts.ModuleKind.ESNext }
			}).outputText
		);
		const source = fs
			.readFileSync('src/lib/components/Seo.svelte', 'utf8')
			.replace("import { page } from '$app/state';", 'const page = globalThis.__seoTestPage;')
			.replace("from '$lib/seo'", "from './seo-utils.mjs'");
		fs.writeFileSync(
			directory + '/Seo.mjs',
			compile(source, { generate: 'server', filename: 'Seo.svelte' }).js.code
		);
		const { default: Seo } = await import(
			pathToFileURL(process.cwd() + '/' + directory + '/Seo.mjs')
		);
		const record = {
			title: { rendered: 'Actual content title' },
			date: '2026-09-26',
			excerpt: { rendered: 'Actual content description.' },
			content: { rendered: 'Actual body.' },
			acf: { short_intro: 'Actual course intro.' }
		};
		for (const [path, data] of [
			['/about-me', { about: { intro: 'Actual profile intro.' } }],
			['/articles/example', { post: record }],
			['/courses/example', { course: record }]
		]) {
			const base = { ...data, site: { portrait: { url: 'https://example.com/default.avif' } } };
			globalThis.__seoTestPage = {
				url: new URL('https://prrajeev.com' + path),
				data: {
					...base,
					seo: {
						title: 'CMS title',
						description: 'CMS description',
						image: { url: 'https://example.com/seo.avif', alt: 'CMS alt', width: 900 }
					}
				}
			};
			const populated = render(Seo).head;
			assert.match(populated, /<title>CMS title<\/title>/);
			assert.match(populated, /name="description" content="CMS description"/);
			assert.match(populated, /property="og:image" content="https:\/\/example.com\/seo.avif"/);
			assert.match(populated, /name="twitter:card" content="summary_large_image"/);
			assert.ok(populated.includes('href="https://prrajeev.com' + path + '"'));
			assert.equal((populated.match(/name="description"/g) || []).length, 1);
			globalThis.__seoTestPage = { url: new URL('https://prrajeev.com' + path), data: base };
			const empty = render(Seo).head;
			assert.equal(empty.includes('CMS title'), false);
			assert.equal(empty.includes('seo.avif'), false);
			assert.match(empty, /default.avif/);
		}
	} finally {
		fs.rmSync(directory, { recursive: true });
		delete globalThis.__seoTestPage;
	}
});
