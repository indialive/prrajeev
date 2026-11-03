import { env } from '$env/dynamic/private';

export const contactReady = () =>
	Boolean(
		env.SENDGRID_API_KEY &&
		env.CONTACT_FROM &&
		env.CONTACT_TO &&
		env.TURNSTILE_SITE_KEY &&
		env.TURNSTILE_SECRET_KEY
	);
export const topics = ['Mentorship', 'Technical consultation', 'Other'];
export type ContactValues = { name: string; email: string; topic: string; message: string };

export function validateContact(form: FormData) {
	const read = (key: string) =>
		typeof form.get(key) === 'string' ? String(form.get(key)).trim() : '';
	const values: ContactValues = {
		name: read('name'),
		email: read('email'),
		topic: read('topic'),
		message: read('message')
	};
	const errors: Partial<Record<keyof ContactValues, string>> = {};
	if (!values.name || values.name.length > 100 || /[\r\n]/.test(values.name))
		errors.name = 'Enter your name (up to 100 characters).';
	if (
		values.email.length > 254 ||
		!/^[^\s@<>(),;:\\"]+@[^\s@<>(),;:\\"]+\.[^\s@<>(),;:\\"]+$/.test(values.email)
	)
		errors.email = 'Enter a valid email address.';
	if (!topics.includes(values.topic)) errors.topic = 'Choose an enquiry type.';
	if (values.message.length < 10 || values.message.length > 5000)
		errors.message = 'Enter a message between 10 and 5,000 characters.';
	return { values, errors, website: read('website'), token: read('cf-turnstile-response') };
}

export async function verifyContactToken(token: string, fetcher: typeof fetch): Promise<boolean> {
	if (!token || token.length > 2048 || !env.TURNSTILE_SECRET_KEY) return false;
	const response = await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token }),
		signal: AbortSignal.timeout(8000)
	});
	if (!response.ok) return false;
	const result = (await response.json()) as {
		success: boolean;
		hostname?: string;
		action?: string;
	};
	return result.success === true && result.action === 'contact';
}

/** Accepts `a@b.com` or `Name <a@b.com>`, the shape SendGrid wants as { email, name }. */
function parseAddress(value: string): { email: string; name?: string } {
	const match = /^\s*(?:"?([^"<]*?)"?\s*)?<([^>]+)>\s*$/.exec(value);
	return match
		? { email: match[2].trim(), name: match[1]?.trim() || undefined }
		: { email: value.trim() };
}

export async function deliverContact(values: ContactValues, fetcher: typeof fetch): Promise<void> {
	const response = await fetcher('https://api.sendgrid.com/v3/mail/send', {
		method: 'POST',
		headers: {
			Authorization: 'Bearer ' + env.SENDGRID_API_KEY,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			personalizations: [{ to: [{ email: env.CONTACT_TO }] }],
			from: parseAddress(env.CONTACT_FROM!),
			reply_to: { email: values.email, name: values.name },
			subject: values.topic + ' enquiry from ' + values.name,
			content: [
				{
					type: 'text/plain',
					value: `Name: ${values.name}
Email: ${values.email}
Topic: ${values.topic}

${values.message}`
				}
			]
		}),
		signal: AbortSignal.timeout(10000)
	});
	// SendGrid acknowledges an accepted message with 202 and an empty body.
	if (response.status !== 202) throw new Error('Email service status ' + response.status);
}

export class ContactBodyTooLarge extends Error {}

export async function readContactForm(request: Request): Promise<FormData> {
	const limit = 24000;
	if (Number(request.headers.get('content-length')) > limit) throw new ContactBodyTooLarge();
	if (!request.body) return new FormData();
	const reader = request.body.getReader();
	const chunks: Uint8Array<ArrayBuffer>[] = [];
	let size = 0;
	try {
		for (;;) {
			const { done, value } = await reader.read();
			if (done) break;
			size += value.byteLength;
			if (size > limit) {
				await reader.cancel();
				throw new ContactBodyTooLarge();
			}
			chunks.push(new Uint8Array(value));
		}
	} finally {
		reader.releaseLock();
	}
	return new Response(new Blob(chunks), {
		headers: { 'Content-Type': request.headers.get('content-type') || '' }
	}).formData();
}
