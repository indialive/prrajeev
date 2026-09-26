export const SITE_URL = 'https://prrajeev.com';

const entities: Record<string, string> = {
	amp: '&',
	lt: '<',
	gt: '>',
	quot: '"',
	apos: "'",
	nbsp: ' ',
	hellip: '\u2026',
	ndash: '\u2013',
	mdash: '\u2014',
	rsquo: '\u2019',
	lsquo: '\u2018',
	rdquo: '\u201d',
	ldquo: '\u201c'
};

export function plainText(value: string | undefined): string {
	return (value || '')
		.replace(/<[^>]*>/g, ' ')
		.replace(/&#(x[\da-f]+|\d+);/gi, (_, code: string) => {
			const number = code[0].toLowerCase() === 'x' ? parseInt(code.slice(1), 16) : Number(code);
			return number > 0 && number <= 0x10ffff ? String.fromCodePoint(number) : '';
		})
		.replace(
			/&(amp|lt|gt|quot|apos|nbsp|hellip|ndash|mdash|rsquo|lsquo|rdquo|ldquo);/g,
			(_, name: string) => entities[name]
		)
		.replace(/\s+/g, ' ')
		.trim();
}

export function jsonLd(value: unknown): string {
	return JSON.stringify(value).replace(/</g, '\\u003c');
}
