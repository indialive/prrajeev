<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Section from '$lib/components/Section.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let home = $derived(data.home);
	let site = $derived(data.site);
	let portrait = $derived(site.portrait || site.avatar || undefined);
	let hasNow = $derived(Boolean(home.now_learning || home.now_making || home.now_listening));
</script>

<svelte:head>
	<title>{site.brand_name || 'P R Rajeev'} - ServiceNow developer and mentor</title>
	<meta
		name="description"
		content={home.hero_intro || 'ServiceNow development, mentorship and technical consultation with P R Rajeev.'}
	/>
</svelte:head>

<Section>
<Container>
	<div class="home">
		<section class="home__hero" aria-labelledby="home-title">
			<div class="home__hero-copy">
				{#if home.hero_kicker}<p class="home__eyebrow">{home.hero_kicker}</p>{/if}
				<h1 id="home-title">{home.hero_heading || 'P R Rajeev'}</h1>
				{#if home.hero_intro}<p class="home__lead">{home.hero_intro}</p>{/if}
			</div>
			{#if portrait?.url}
				<img
					class="home__portrait"
					src={portrait?.url}
					alt={portrait?.alt || 'Portrait of P R Rajeev'}
					width={portrait?.width || 144}
					height={portrait?.height || 144}
					fetchpriority="high"
				/>
			{:else}
				<div class="home__portrait home__portrait--placeholder" aria-hidden="true">PR</div>
			{/if}
		</section>

		<section class="home__help" aria-labelledby="help-title">
			<h2 id="help-title">How can I help?</h2>
			<div class="home__cards">
				<article class="home-card">
					<p class="home-card__eyebrow">Mentorship</p>
					<h3>{home.mentorship_heading || 'Learning ServiceNow?'}</h3>
					{#if home.mentorship_summary}<p>{home.mentorship_summary}</p>{/if}
					<a href="/mentorship">Learn with me <span aria-hidden="true">&#8599;</span></a>
				</article>
				<article class="home-card">
					<p class="home-card__eyebrow">Technical consultation</p>
					<h3>{home.consultation_heading || 'Working through a problem?'}</h3>
					{#if home.consultation_summary}<p>{home.consultation_summary}</p>{/if}
					<a href="/consultation">Talk it through <span aria-hidden="true">&#8599;</span></a>
				</article>
			</div>
		</section>

		{#if home.writing_note}
			<section class="home__writing" aria-labelledby="writing-title">
				<div>
					<p class="home__eyebrow">From my desk</p>
					<h2 id="writing-title">Work & writing</h2>
				</div>
				<div>
					<p>{home.writing_note}</p>
					<a href="/articles">Read articles <span aria-hidden="true">&#8599;</span></a>
				</div>
			</section>
		{/if}

		{#if hasNow}
			<section class="home__now" aria-labelledby="now-title">
				<h2 id="now-title">These days</h2>
				<div class="home__now-grid">
					{#if home.now_learning}
						<div><span>Learning</span><p>{home.now_learning}</p></div>
					{/if}
					{#if home.now_making}
						<div><span>Making</span><p>{home.now_making}</p></div>
					{/if}
					{#if home.now_listening}
						<div><span>Listening</span><p>{home.now_listening}</p></div>
					{/if}
				</div>
			</section>
		{/if}

		<section class="home__contact" aria-labelledby="contact-title">
			<div>
				<h2 id="contact-title">Not sure which path fits?</h2>
				<p>Just tell me a little about what you need help with. We can start there.</p>
			</div>
			<a href="/contact">Write to me <span aria-hidden="true">&#8599;</span></a>
		</section>
	</div>
</Container>
</Section>

<style>
	@layer components {
		.home {
			display: grid;
			gap: var(--home-section-gap);
			max-inline-size: var(--home-content-width);
			margin-inline: auto;
		}
		.home__hero {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			gap: var(--space-l);
			min-block-size: 14.875rem;
		}
		.home__hero-copy {
			min-inline-size: 0;
			max-inline-size: var(--home-hero-copy-width);
		}
		.home__eyebrow,
		.home-card__eyebrow {
			margin-block-end: var(--space-xs);
			color: var(--text-muted);
			font-size: var(--font-size-meta);
			letter-spacing: 0.08em;
			text-transform: uppercase;
		}
		.home__hero h1 {
			max-inline-size: 17ch;
			line-height: 1.2;
			white-space: pre-line;
		}
		.home__lead {
			max-inline-size: var(--text-width);
			margin-block-start: var(--space-m);
			color: var(--text-body);
			font-size: var(--font-size-body);
		}
		.home__portrait {
			inline-size: var(--home-portrait-size);
			block-size: var(--home-portrait-size);
			flex: none;
			margin-block-start: 2.9375rem;
			margin-inline-end: 0.875rem;
			border: var(--border-width) solid var(--border-strong);
			border-radius: 50%;
			object-fit: cover;
		}
		.home__portrait--placeholder {
			display: grid;
			place-items: center;
			background: linear-gradient(135deg, var(--primary), var(--primary-dark));
			color: var(--text-main);
			font-family: var(--font-heading);
			font-size: var(--h2);
		}
		.home__help h2,
		.home__writing h2,
		.home__now h2 {
			margin-block-end: var(--space-m);
			font-size: var(--h3);
		}
		.home__cards {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: var(--space-m);
		}
		.home-card {
			display: grid;
			align-content: start;
			gap: var(--space-xs);
			min-block-size: 17.125rem;
			padding: var(--space-m);
			border: var(--border-width) solid var(--border-default);
			border-radius: var(--radius-m);
			background: var(--surface-raised);
		}
		.home-card h3 {
			font-size: var(--h4);
		}
		.home-card p:not(.home-card__eyebrow) {
			color: var(--text-body);
		}
		.home-card a,
		.home__writing a,
		.home__contact a {
			color: var(--text-link);
			font-weight: var(--weight-semibold);
			text-decoration: none;
		}
		.home-card a {
			margin-block-start: var(--space-s);
		}
		.home-card a:hover,
		.home__writing a:hover,
		.home__contact a:hover {
			text-decoration: underline;
		}
		.home__writing {
			display: grid;
			grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
			gap: var(--space-l);
			padding-block: var(--space-m);
			border-block: var(--border-width) solid var(--border-default);
		}
		.home__writing p {
			margin-block-end: var(--space-s);
		}
		.home__now {
			padding-block: var(--space-m);
			border-block: var(--border-width) solid var(--border-default);
		}
		.home__now-grid {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: var(--space-m);
		}
		.home__now-grid span {
			color: var(--text-muted);
			font-size: var(--font-size-meta);
			text-transform: uppercase;
		}
		.home__contact {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: var(--space-m);
		}
		.home__contact h2 {
			font-size: var(--h5);
		}
		.home__contact p {
			color: var(--text-muted);
		}
		.home__contact a {
			white-space: nowrap;
		}
		@media (max-width: 48rem) {
			.home__hero {
				align-items: flex-start;
				min-block-size: 14.3125rem;
			}
			.home__portrait {
				inline-size: var(--home-portrait-size-tablet);
				block-size: var(--home-portrait-size-tablet);
				margin-block-start: 0;
			}
			.home__cards,
			.home__writing,
			.home__now-grid {
				grid-template-columns: 1fr;
			}
			.home__contact {
				align-items: flex-start;
				flex-direction: column;
			}
		}
		@media (max-width: 30rem) {
			.home__hero { min-block-size: 18.1875rem; }
			.home__portrait { display: none; }
		}
	}
</style>
