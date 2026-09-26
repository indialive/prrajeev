<script lang="ts">
	import { page } from '$app/state';
	import { SITE_URL, plainText, jsonLd } from '$lib/seo';

	const pages: Record<string, [string, string]> = {
		'/': [
			'P R Rajeev - ServiceNow developer and mentor',
			'ServiceNow development, mentorship and technical consultation with P R Rajeev.'
		],
		'/about-me': ['About me', 'About P R Rajeev and his ServiceNow work.'],
		'/articles': ['Articles', 'ServiceNow articles and notes by P R Rajeev.'],
		'/courses': [
			'Courses',
			'Explore guided ServiceNow courses taught through Microsoft Teams by P R Rajeev.'
		],
		'/contact': [
			'Contact',
			'Contact P R Rajeev about ServiceNow mentorship or technical consultation.'
		],
		'/mentorship': ['Mentorship', 'Explore ServiceNow mentorship with P R Rajeev.'],
		'/consultation': [
			'Technical consultation',
			'Discuss your ServiceNow technical questions with P R Rajeev.'
		],
		'/design-system': ['Design system preview', 'Internal design system preview.']
	};
	let data = $derived(page.data);
	let path = $derived(page.url.pathname.replace(/\/$/, '') || '/');
	let canonical = $derived(SITE_URL + (path === '/' ? '/' : path));
	let detail = $derived(data.post || data.course);
	let base = $derived(pages[path] || ['Page', 'ServiceNow development with P R Rajeev.']);
	let defaultTitle = $derived(
		page.error
			? `${page.status} | P R Rajeev`
			: detail
				? `${plainText(detail.title.rendered)} | P R Rajeev`
				: path === '/'
					? base[0]
					: `${base[0]} | P R Rajeev`
	);
	let summary = $derived(
		plainText(
			data.post?.excerpt.rendered ||
				data.post?.content.rendered ||
				data.course?.acf.short_intro ||
				data.course?.excerpt.rendered ||
				(path === '/' ? data.home?.hero_intro : undefined) ||
				data.about?.intro ||
				data.contact?.intro
		)
	);
	let defaultDescription = $derived(
		(summary && !/^\[.*\]$/.test(summary)
			? summary
			: detail
				? plainText(detail.title.rendered) + ' - ServiceNow guidance with P R Rajeev.'
				: base[1]
		).slice(0, 160)
	);
	let title = $derived((!page.error && data.seo?.title) || defaultTitle);
	let description = $derived((!page.error && data.seo?.description) || defaultDescription);
	let image = $derived(
		(!page.error && data.seo?.image) ||
			data.course?.image ||
			data.site?.portrait ||
			data.site?.avatar ||
			undefined
	);
	let noindex = $derived(
		Boolean(page.error) || page.url.hostname !== 'prrajeev.com' || path === '/design-system'
	);
	let schema = $derived.by(() => {
		const person = {
			'@type': 'Person',
			'@id': SITE_URL + '/#person',
			name: 'P R Rajeev',
			url: SITE_URL + '/',
			...(data.site?.linkedin_url ? { sameAs: [data.site.linkedin_url] } : {})
		};
		const website = {
			'@type': 'WebSite',
			'@id': SITE_URL + '/#website',
			url: SITE_URL + '/',
			name: 'P R Rajeev',
			publisher: { '@id': person['@id'] }
		};
		const entity = data.post
			? {
					'@type': 'BlogPosting',
					headline: plainText(data.post.title.rendered),
					datePublished: data.post.date,
					author: { '@id': person['@id'] },
					mainEntityOfPage: canonical
				}
			: data.course
				? {
						'@type': 'Course',
						name: plainText(data.course.title.rendered),
						description: defaultDescription,
						provider: { '@id': person['@id'] }
					}
				: {
						'@type':
							path === '/about-me'
								? 'ProfilePage'
								: path === '/contact'
									? 'ContactPage'
									: 'WebPage',
						name: defaultTitle,
						description: defaultDescription,
						url: canonical,
						isPartOf: { '@id': website['@id'] },
						...(path === '/about-me' ? { mainEntity: { '@id': person['@id'] } } : {})
					};
		return { '@context': 'https://schema.org', '@graph': [person, website, entity] };
	});
	let structuredData = $derived(
		'<script type="application/ld+json">' + jsonLd(schema) + '<' + '/script>'
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow'} />
	<meta property="og:type" content={data.post ? 'article' : 'website'} />
	<meta property="og:site_name" content="P R Rajeev" />
	<meta property="og:locale" content="en_IN" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta
		name="twitter:card"
		content={image?.width && image.width >= 600 ? 'summary_large_image' : 'summary'}
	/>
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{#if image?.url}
		<meta property="og:image" content={image.url} />
		<meta property="og:image:alt" content={image.alt || 'P R Rajeev'} />
		<meta name="twitter:image" content={image.url} />
		<meta name="twitter:image:alt" content={image.alt || 'P R Rajeev'} />
	{/if}
	{#if !page.error}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- Serialized JSON-LD escapes all opening angle brackets. -->
		{@html structuredData}
	{/if}
</svelte:head>
