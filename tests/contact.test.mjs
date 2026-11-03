import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const code = ts.transpileModule(fs.readFileSync('src/lib/server/contact.ts', 'utf8'), {
	compilerOptions: { module: ts.ModuleKind.CommonJS }
}).outputText;
const exportsObject = {};
const env = {
	SENDGRID_API_KEY: 'test-key',
	CONTACT_FROM: 'Website <website@example.com>',
	CONTACT_TO: 'recipient@example.com',
	TURNSTILE_SITE_KEY: 'site-key',
	TURNSTILE_SECRET_KEY: 'secret-key'
};
vm.runInNewContext(code, {
	exports: exportsObject,
	AbortSignal,
	Response,
	Blob,
	Uint8Array,
	FormData,
	require: () => ({ env })
});
const { validateContact, verifyContactToken, deliverContact, contactReady } = exportsObject;
const valid = () => {
	const form = new FormData();
	for (const [key, value] of Object.entries({
		name: 'Test visitor',
		email: 'visitor@example.com',
		topic: 'Mentorship',
		message: 'A test inquiry about ServiceNow.'
	}))
		form.set(key, value);
	return form;
};
test('valid contact data is accepted and trimmed', () => {
	const form = valid();
	form.set('name', '  Test visitor  ');
	assert.deepEqual(Object.keys(validateContact(form).errors), []);
	assert.equal(validateContact(form).values.name, 'Test visitor');
});
test('server rejects missing, oversized, and invalid values', () => {
	const form = valid();
	form.set('name', 'a'.repeat(101));
	form.set('email', 'bad\r\nBcc: victim@example.com');
	form.set('topic', 'Unknown');
	form.set('message', 'a'.repeat(5001));
	assert.equal(Object.keys(validateContact(form).errors).length, 4);
	assert.equal(Object.keys(validateContact(new FormData()).errors).length, 4);
});
test('files cannot masquerade as contact text fields', () => {
	const form = valid();
	form.set('name', new Blob(['file']), 'name.txt');
	assert.ok(validateContact(form).errors.name);
});
test('spam tokens must succeed with the contact action', async () => {
	for (const payload of [
		{ success: false },
		{ success: true, hostname: 'prrajeev.com', action: 'other' }
	]) {
		assert.equal(await verifyContactToken('token', async () => Response.json(payload)), false);
	}
	assert.equal(
		await verifyContactToken('token', async () =>
			Response.json({ success: true, hostname: 'prrajeev.com', action: 'contact' })
		),
		true
	);
	assert.equal(
		await verifyContactToken('', () => {
			throw new Error('Must not fetch');
		}),
		false
	);
});
test('delivery uses configured recipient, reply-to, and plain text', async () => {
	await deliverContact(validateContact(valid()).values, async (url, options) => {
		assert.equal(url, 'https://api.sendgrid.com/v3/mail/send');
		assert.equal(options.headers.Authorization, 'Bearer test-key');
		const body = JSON.parse(options.body);
		assert.equal(body.personalizations[0].to[0].email, env.CONTACT_TO);
		assert.equal(body.reply_to.email, 'visitor@example.com');
		assert.equal(body.from.email, 'website@example.com');
		assert.equal(body.from.name, 'Website');
		assert.equal(body.content.length, 1);
		assert.equal(body.content[0].type, 'text/plain');
		assert.ok(body.content[0].value.includes('A test inquiry'));
		return new Response(null, { status: 202 });
	});
});
test('provider failure or missing acknowledgement cannot report success', async () => {
	await assert.rejects(
		deliverContact(validateContact(valid()).values, async () => new Response('', { status: 500 }))
	);
	await assert.rejects(
		deliverContact(validateContact(valid()).values, async () => new Response('', { status: 200 }))
	);
});
test('missing configuration disables delivery', () => {
	assert.equal(contactReady(), true);
	delete env.CONTACT_TO;
	assert.equal(contactReady(), false);
});

test('form parsing enforces the byte limit without Content-Length', async () => {
	const request = new Request('https://prrajeev.com/contact', {
		method: 'POST',
		body: new URLSearchParams({ message: 'a'.repeat(25000) })
	});
	await assert.rejects(
		exportsObject.readContactForm(request),
		(error) => error instanceof exportsObject.ContactBodyTooLarge
	);
	const normal = new Request('https://prrajeev.com/contact', {
		method: 'POST',
		body: new URLSearchParams({ name: 'Test visitor' })
	});
	assert.equal((await exportsObject.readContactForm(normal)).get('name'), 'Test visitor');
});
