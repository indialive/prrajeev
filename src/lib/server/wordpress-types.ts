// Shapes of WordPress REST/ACF responses; re-exported from ./wordpress.

export type WordPressImage = {
	url?: string;
	srcset?: string;
	alt?: string;
	width?: number;
	height?: number;
};

export type SeoFields = {
	seo_title?: string | null | false;
	seo_description?: string | null | false;
	seo_image?: unknown;
};

export type MenuItem = {
	section: 'primary' | 'help';
	label: string;
	path: string;
};

export type SiteFields = {
	brand_name?: string;
	tagline?: string;
	site_logo?: WordPressImage | false;
	avatar?: WordPressImage | false;
	portrait?: WordPressImage | false;
	contact_email?: string;
	linkedin_url?: string;
	whatsapp_url?: string;
	footer_note?: string;
	menu_items?: MenuItem[];
};

export type RawSiteFields = Omit<SiteFields, 'avatar' | 'site_logo' | 'portrait'> & {
	avatar?: WordPressImage | number | string | null | false;
	site_logo?: WordPressImage | number | string | null | false;
	portrait?: WordPressImage | number | string | null | false;
};

export type HomeFields = {
	hero_kicker?: string;
	hero_heading?: string;
	hero_intro?: string;
	mentorship_heading?: string;
	mentorship_summary?: string;
	consultation_heading?: string;
	consultation_summary?: string;
	writing_note?: string;
	now_learning?: string | null | false;
	now_learning_title?: string | null | false;
	now_learning_source?: string | null | false;
	now_learning_url?: string | null | false;
	now_learning_image?: unknown;
	now_making?: string | null | false;
	now_making_title?: string | null | false;
	now_making_status?: string | null | false;
	now_making_url?: string | null | false;
	now_making_image?: unknown;
	now_listening?: string | null | false;
	now_listening_spotify_url?: string | null | false;
};

export type WordPressPage<T> = {
	id: number;
	slug: string;
	title: { rendered: string };
	content: { rendered: string };
	acf: T & SeoFields;
};

export type WordPressPost = {
	featured_media?: number;
	acf?: SeoFields;
	id: number;
	slug: string;
	date: string;
	title: { rendered: string };
	excerpt: { rendered: string };
};

export type AboutFields = {
	hero_heading?: string;
	intro?: string;
	professional_story?: string;
	development_focus?: string;
	mentorship_focus?: string;
	consultation_focus?: string;
	working_approach?: string;
};

export type ContactFields = {
	hero_heading?: string;
	intro?: string;
	form_intro?: string;
	response_note?: string;
};

export type MediaResponse = {
	source_url: string;
	alt_text: string;
	media_details?: {
		width?: number;
		height?: number;
		sizes?: Record<string, { source_url: string; width: number; height: number }>;
	};
};

export type CourseFields = {
	short_intro?: string;
	audience?: string;
	learning_topics?: Array<{ topic: string }>;
	mentor_note?: string;
	format?: string;
	time_commitment?: string;
	fee_note?: string;
	prerequisites?: string;
	faqs?: Array<{ question: string; answer: string }>;
};

export type WordPressCourse = {
	id: number;
	slug: string;
	title: { rendered: string };
	content: { rendered: string };
	excerpt: { rendered: string };
	featured_media?: number;
	image?: WordPressImage | false;
	acf: CourseFields & SeoFields;
};
