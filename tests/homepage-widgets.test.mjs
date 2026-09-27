import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const exports = {};
vm.runInNewContext(
	ts.transpileModule(fs.readFileSync('src/lib/server/homepage.ts', 'utf8'), {
		compilerOptions: { module: ts.ModuleKind.CommonJS }
	}).outputText,
	{
		exports,
		URL,
		require(name) {
			return name === './wordpress'
				? {
						resolveImage: async (value) =>
							typeof value === 'number'
								? { url: 'https://cms.example/cover.jpg', alt: 'Cover' }
								: value && typeof value === 'object'
									? value
									: false
					}
				: {};
		}
	}
);
test('resource links accept HTTP(S) and reject unsafe protocols and credentials', () => {
	for (const value of [
		undefined,
		null,
		false,
		'',
		'   ',
		'javascript:alert(1)',
		'data:text/html,x',
		'/relative',
		'https://user:pass@example.com',
		'https://user@example.com'
	])
		assert.equal(exports.resourceUrl(value), undefined);
	assert.equal(
		exports.resourceUrl(' https://example.com/path?q=1 '),
		'https://example.com/path?q=1'
	);
	assert.equal(exports.resourceUrl('http://example.com'), 'http://example.com/');
});
test('Spotify parses exact origins, supported paths and IDs, dropping share parameters', () => {
	const id = '4cOdK2wGLETKBW3PvgPWqT';
	for (const kind of ['track', 'album', 'playlist'])
		for (const prefix of ['', 'intl-en/', 'intl-pt-br/'])
			assert.equal(
				exports.spotifyEmbedUrl(`https://open.spotify.com/${prefix}${kind}/${id}?si=share`),
				`https://open.spotify.com/embed/${kind}/${id}`
			);
	for (const value of [
		null,
		false,
		'',
		'https://open.spotify.com.evil/track/' + id,
		'http://open.spotify.com/track/' + id,
		'https://user@open.spotify.com/track/' + id,
		'https://open.spotify.com:444/track/' + id,
		'https://open.spotify.com/artist/' + id,
		'https://open.spotify.com/track/short',
		'https://open.spotify.com/embed/track/' + id,
		'https://open.spotify.com/track/' + id + '/extra'
	])
		assert.equal(exports.spotifyEmbedUrl(value), undefined);
});
test('empty fields disappear and previews render independently of notes', async () => {
	for (const value of [undefined, null, false, '', '   ']) {
		const result = await exports.resolveNow(
			{
				now_learning: value,
				now_learning_title: value,
				now_making: value,
				now_listening: value,
				now_listening_spotify_url: value
			},
			() => {}
		);
		assert.ok(Object.values(result).every((value) => value === undefined));
	}
	for (const fields of [
		{ now_learning_title: ' Title ' },
		{ now_learning_source: 'Source' },
		{ now_learning_url: 'https://example.com' },
		{ now_learning_image: 54 },
		{ now_learning_image: { url: 'https://example.com/cover', alt: 'Cover' } }
	])
		assert.ok((await exports.resolveNow(fields, () => {})).learning);
	const result = await exports.resolveNow(
		{
			now_learning: ' Note ',
			now_making_status: ' In progress ',
			now_making_url: 'javascript:bad',
			now_listening_spotify_url: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT'
		},
		() => {}
	);
	assert.equal(result.learning.note, 'Note');
	assert.equal(result.making.context, 'In progress');
	assert.equal(result.making.url, undefined);
	assert.ok(result.listening.embedUrl);
});
