import type { PageServerLoad } from './$types';
import { getPage, type ContactFields, type HomeFields } from '$lib/server/wordpress';

export const load: PageServerLoad = async ({ fetch }) => {
	const [contact, home] = await Promise.all([
		getPage<ContactFields>('contact', fetch),
		getPage<HomeFields>('home', fetch)
	]);
	return { contact: contact.acf, home: home.acf };
};