import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const code = ts.transpileModule(fs.readFileSync('src/lib/seo.ts', 'utf8'), {
	compilerOptions: { module: ts.ModuleKind.CommonJS }
}).outputText;
const exports = {};
vm.runInNewContext(code, { exports });
test('metadata text decodes WordPress entities and removes markup', () => {
	assert.equal(
		exports.plainText('<p>ServiceNow &amp; &#x1F4D8; &mdash; guidance&nbsp;</p>'),
		'ServiceNow & \u{1F4D8} \u2014 guidance'
	);
	assert.equal(exports.plainText('&#1114112; &#0;'), '');
});
test('structured data cannot close its script element', () => {
	const value = { name: '</script><script>alert(1)</script>' };
	const serialized = exports.jsonLd(value);
	assert.equal(serialized.includes('<'), false);
	assert.deepEqual(JSON.parse(serialized), value);
});
