import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import {
	contactReady,
	validateContact,
	verifyContactToken,
	deliverContact,
	readContactForm,
	ContactBodyTooLarge
} from '$lib/server/contact';
import type { Actions, PageServerLoad } from './$types';
import { resolveSeo, getPage, type ContactFields, type HomeFields } from '$lib/server/wordpress';

export const load: PageServerLoad = async ({ fetch }) => {
	const [contact, home] = await Promise.all([
		getPage<ContactFields>('contact', fetch),
		getPage<HomeFields>('home', fetch)
	]);
	return {
		contact: contact.acf,
		seo: await resolveSeo(contact.acf, fetch),
		home: home.acf,
		contactEnabled: contactReady(),
		turnstileSiteKey: env.TURNSTILE_SITE_KEY || ''
	};
};
export const actions: Actions = {
	default: async ({ request, fetch, url }) => {
		if (!contactReady())
			return fail(503, {
				notice: 'Messages are temporarily unavailable. Please use the email link below.'
			});
		let form: FormData;
		try {
			form = await readContactForm(request);
		} catch (cause) {
			if (cause instanceof ContactBodyTooLarge)
				return fail(413, { notice: 'Your message is too large.' });
			return fail(400, { notice: 'Invalid form submission.' });
		}
		const { values, errors, website, token } = validateContact(form);
		if (website) return fail(400, { notice: 'Unable to submit this message.' });
		if (Object.keys(errors).length)
			return fail(400, { values, errors, notice: 'Please check the highlighted fields.' });
		try {
			if (!(await verifyContactToken(token, fetch)))
				return fail(400, {
					values,
					notice: 'Please complete the spam protection check and try again.'
				});
			await deliverContact(values, fetch);
			return { success: true, notice: 'Your message has been accepted for delivery. Thank you.' };
		} catch (cause) {
			console.error(
				'Contact delivery failed',
				cause instanceof Error ? cause.message : 'Unknown error'
			);
			return fail(502, {
				values,
				notice: 'We could not confirm delivery. Please use the email link below.'
			});
		}
	}
};
