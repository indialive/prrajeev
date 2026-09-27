<script lang="ts">
	import { resolve } from '$app/paths';
	import Container from '$lib/components/Container.svelte';
	import Section from '$lib/components/Section.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let featured = $derived(data.featuredArticle);
	let home = $derived(data.home);
	let site = $derived(data.site);
	let portrait = $derived(site.portrait || site.avatar || undefined);
	let hasNow = $derived(Boolean(home.now_learning || home.now_making || home.now_listening));
</script>

<Section>
	<Container>
		<div class="home">
			<section class="home__hero" aria-labelledby="home-title">
				<div class="home__hero-copy">
					{#if home.hero_kicker}<p class="home__eyebrow">{home.hero_kicker}</p>{/if}
					<h1 id="home-title">{home.hero_heading || 'P R Rajeev'}</h1>
					{#if home.hero_intro}<p class="home__lead">{home.hero_intro}</p>{/if}
				</div>
				<div class="home__portrait-feature">
					{#if portrait?.url}
						<img
							class="home__portrait"
							src={portrait?.url}
							srcset={portrait?.srcset}
							sizes="(max-width: 52rem) 40vw, 17.5rem"
							alt={portrait?.alt || 'Portrait of P R Rajeev'}
							width={portrait?.width || 144}
							height={portrait?.height || 144}
							fetchpriority="high"
						/>
					{:else}
						<div class="home__portrait home__portrait--placeholder" aria-hidden="true">PR</div>
					{/if}
				</div>
			</section>

			<section class="home__help" aria-labelledby="help-title">
				<h2 id="help-title">How can I help?</h2>
				<div class="home__cards">
					<article class="home-card">
						<p class="home-card__eyebrow">Mentorship</p>
						<h3>{home.mentorship_heading || 'Learning ServiceNow?'}</h3>
						{#if home.mentorship_summary}<p>{home.mentorship_summary}</p>{/if}
						<a href={resolve('/courses')}>Learn with me <span aria-hidden="true">&#8599;</span></a>
					</article>
					<article class="home-card">
						<p class="home-card__eyebrow">Technical consultation</p>
						<h3>{home.consultation_heading || 'Working through a problem?'}</h3>
						{#if home.consultation_summary}<p>{home.consultation_summary}</p>{/if}
						<a href={resolve('/consultation')}
							>Talk it through <span aria-hidden="true">&#8599;</span></a
						>
					</article>
				</div>
			</section>

			<section class="home__journal" aria-labelledby="writing-title">
				<header class="home__journal-header">
					<div>
						<p class="home__eyebrow">From my desk</p>
						<h2 id="writing-title">Work & writing</h2>
					</div>
					<a href={resolve('/articles')}
						>Explore the journal <span aria-hidden="true">&#8599;</span></a
					>
				</header>
				{#if featured}
					<article class="home-feature" data-image={Boolean(featured.image?.url)}>
						{#if featured.image?.url}
							<img
								class="home-feature__image"
								src={featured.image.url}
								srcset={featured.image.srcset}
								sizes="auto, (max-width: 48rem) calc(100vw - 3rem), 47.5rem"
								width={featured.image.width}
								height={featured.image.height}
								alt={featured.image.alt || ''}
								loading="lazy"
							/>
						{/if}
						<div class="home-feature__story">
							<p class="home-feature__eyebrow">From the journal</p>
							<h3>{featured.title}</h3>
							{#if featured.excerpt}<p class="home-feature__excerpt">{featured.excerpt}</p>{/if}
							<a href={resolve('/articles/[slug]', { slug: featured.slug })}
								>Read the article <span aria-hidden="true">&#8599;</span></a
							>
						</div>
					</article>
				{:else if home.writing_note}
					<p>{home.writing_note}</p>
				{:else}
					<p>Articles will appear here when they are published.</p>
				{/if}
			</section>
			{#if hasNow}
				<section class="home__now" aria-labelledby="now-title">
					<div class="home__now-header">
						<h2 id="now-title">These days</h2>
						<p class="home__now-lede">A note from my desk</p>
					</div>
					<div class="home__now-card">
						<div class="home__now-inner">
							<div class="home__now-grid">
								{#if home.now_learning}
									<div>
										<span
											><svg
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="1.7"
												stroke-linecap="round"
												stroke-linejoin="round"
												aria-hidden="true"
												><path
													d="M12 5v15M3 4h5a4 4 0 0 1 4 2 4 4 0 0 1 4-2h5v15h-5a4 4 0 0 0-4 2 4 4 0 0 0-4-2H3z"
												/></svg
											>Learning</span
										>
										<p>{home.now_learning}</p>
									</div>
								{/if}
								{#if home.now_making}
									<div>
										<span
											><svg
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="1.7"
												stroke-linecap="round"
												stroke-linejoin="round"
												aria-hidden="true"><path d="m8 6-6 6 6 6m8-12 6 6-6 6" /></svg
											>Making</span
										>
										<p>{home.now_making}</p>
									</div>
								{/if}
								{#if home.now_listening}
									<div>
										<span
											><svg
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="1.7"
												stroke-linecap="round"
												stroke-linejoin="round"
												aria-hidden="true"
												><path d="M3 14v-3a9 9 0 0 1 18 0v3" /><rect
													x="3"
													y="12"
													width="4"
													height="9"
													rx="2"
												/><rect x="17" y="12" width="4" height="9" rx="2" /></svg
											>Listening</span
										>
										<p>{home.now_listening}</p>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</section>
			{/if}

			<section class="home__contact" aria-labelledby="contact-title">
				<div>
					<h2 id="contact-title">Not sure which path fits?</h2>
					<p>Just tell me a little about what you need help with. We can start there.</p>
				</div>
				<a href={resolve('/contact')}>Write to me <span aria-hidden="true">&#8599;</span></a>
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
			min-block-size: var(--home-portrait-frame-size);
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
			background: linear-gradient(100deg, var(--text-main) 15%, var(--aqua) 92%);
			background-clip: text;
			-webkit-text-fill-color: transparent;
		}
		.home__lead {
			max-inline-size: var(--text-width);
			margin-block-start: var(--space-m);
			color: var(--text-body);
			font-size: var(--font-size-body);
		}
		.home__portrait-feature {
			position: relative;
			display: grid;
			place-items: center;
			inline-size: var(--home-portrait-frame-size);
			block-size: var(--home-portrait-frame-size);
			flex: none;
			margin-block-start: var(--space-s);
			margin-inline-end: var(--space-xs);
			isolation: isolate;
		}
		.home__portrait-feature::before,
		.home__portrait-feature::after {
			position: absolute;
			inline-size: var(--home-portrait-size);
			block-size: var(--home-portrait-height);
			border-radius: var(--radius-l);
			content: '';
		}
		.home__portrait-feature::before {
			background: color-mix(in oklch, var(--primary-light) 36%, var(--surface-raised));
			transform: translate(-0.65rem, 0.25rem) rotate(-8deg);
		}
		.home__portrait-feature::after {
			background: color-mix(in oklch, var(--aqua) 24%, var(--surface-raised));
			transform: translate(0.6rem, -0.3rem) rotate(7deg);
		}
		.home__portrait {
			position: relative;
			z-index: 1;
			inline-size: var(--home-portrait-size);
			block-size: var(--home-portrait-height);
			border: var(--border-width) solid color-mix(in oklch, var(--white) 45%, transparent);
			border-radius: var(--radius-l);
			box-shadow: 0 0.75rem 2rem color-mix(in oklch, var(--surface-page) 60%, transparent);
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
		.home__help {
			container: home-help / inline-size;
		}
		.home__help h2 {
			margin-block-end: var(--space-m);
			font-size: var(--h3);
		}
		.home__cards {
			display: grid;
			grid-template-columns: 1fr;
			gap: var(--space-m);
		}
		@container home-help (min-width: 45rem) {
			.home__cards {
				grid-template-columns: repeat(2, minmax(0, 1fr));
			}
		}
		.home-card {
			display: grid;
			align-content: start;
			gap: var(--space-xs);
			min-block-size: 17.125rem;
			padding: var(--space-m);
			border: var(--border-width) solid var(--border-strong);
			border-radius: var(--radius-m);
			background: linear-gradient(155deg, var(--surface-card-top), var(--surface-card-bottom));
			box-shadow: var(--shadow-card);
			transition:
				border-color var(--duration-fast) var(--ease-default),
				transform var(--duration-fast) var(--ease-default);
		}
		.home-card:hover {
			border-color: var(--border-accent);
			transform: translateY(-0.1875rem);
		}
		.home-card h3 {
			font-size: var(--h4);
		}
		.home-card p:not(.home-card__eyebrow) {
			color: var(--text-body);
		}
		.home-card a,
		.home__contact a {
			color: var(--text-link);
			font-weight: var(--weight-semibold);
			text-decoration: none;
		}
		.home-card a {
			margin-block-start: var(--space-s);
		}
		.home-card a:hover,
		.home__contact a:hover {
			text-decoration: underline;
		}
		.home__now {
			container-type: inline-size;
			display: grid;
			gap: var(--home-now-gap);
		}
		.home__now-card {
			padding: var(--home-now-inset);
			border: var(--border-width) solid transparent;
			border-radius: var(--home-now-radius);
			background:
				linear-gradient(var(--primary-dark), var(--primary-dark)) padding-box,
				var(--home-glass-rim) border-box;
		}
		.home__now-inner {
			display: grid;
			gap: var(--home-now-gap);
			padding: var(--home-now-padding);
			border: var(--border-width) solid var(--home-glass-border);
			border-radius: calc(var(--home-now-radius) - var(--home-now-inset));
			background: color-mix(in oklch, var(--home-now-background) 91%, transparent);
		}
		.home__now-header {
			display: grid;
			gap: var(--space-xs);
		}
		.home__now-lede {
			color: var(--text-muted);
			font-size: var(--font-size-small);
		}

		.home__now-grid {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: var(--home-now-column-gap);
		}
		.home__now-grid > div {
			display: grid;
			align-content: start;
			gap: var(--home-now-entry-gap);
		}
		@container (max-width: 45rem) {
			.home__now-grid {
				grid-template-columns: 1fr;
			}
		}
		.home__now-grid span {
			display: flex;
			align-items: center;
			gap: var(--space-xs);
			color: var(--text-muted);
			font-size: var(--font-size-meta);
			text-transform: uppercase;
		}
		.home__now-grid svg {
			inline-size: var(--home-now-icon-size);
			block-size: var(--home-now-icon-size);
			color: var(--aqua);
			flex: none;
		}
		.home__now h2 {
			font-size: var(--home-now-heading);
		}
		.home__journal {
			position: relative;
			isolation: isolate;
			padding-block: var(--section-space-m);
			container-type: inline-size;
			display: grid;
			gap: var(--space-xl);
		}
		.home__journal::before {
			position: absolute;
			inset-block: 0;
			inset-inline: calc(-1 * var(--space-m));
			z-index: -1;
			background: var(--home-journal-background);
			content: '';
		}
		.home__journal-header h2 {
			font-size: var(--h1);
		}
		.home__journal-header {
			display: flex;
			justify-content: space-between;
			align-items: end;
			gap: var(--home-now-column-gap);
		}
		.home__journal a {
			color: var(--text-link);
			text-decoration: none;
		}
		.home__journal a:hover {
			text-decoration: underline;
		}
		.home-feature {
			display: grid;
			grid-template-columns: repeat(16, minmax(0, 1fr));
			align-items: start;
		}
		.home-feature__image {
			grid-column: 1 / 12;
			grid-row: 1;
			inline-size: 100%;
			aspect-ratio: var(--home-feature-image-ratio);
			object-fit: cover;
			border-radius: var(--radius-m);
		}
		.home-feature__story {
			position: relative;
			grid-column: 10 / -1;
			grid-row: 1;
			margin-block-start: var(--home-feature-offset);
			display: grid;
			gap: var(--home-feature-gap);
			padding-block-start: var(--home-feature-padding);
			padding-inline-start: var(--home-feature-padding);
			border-block-start: var(--border-width) solid var(--home-feature-border);
			border-inline-start: var(--border-width) solid var(--home-feature-border);
			border-start-start-radius: var(--radius-l);
			background: var(--home-journal-background);
		}
		.home-feature__eyebrow {
			color: var(--aqua);
			font-size: var(--font-size-meta);
			letter-spacing: 0.08em;
			text-transform: uppercase;
		}
		.home-feature h3 {
			font-size: var(--home-feature-heading);
			line-height: 1.08;
			overflow-wrap: anywhere;
		}
		.home-feature__excerpt {
			color: var(--text-body);
		}
		.home-feature__story a {
			padding-block-start: var(--space-xs);
			font-weight: var(--weight-semibold);
		}
		.home-feature[data-image='false'] .home-feature__story {
			grid-column: 1 / -1;
			margin-block-start: 0;
			padding: var(--space-l);
		}
		@container (max-width: 45rem) {
			.home__journal-header {
				flex-direction: column;
				align-items: start;
			}
			.home-feature {
				grid-template-columns: 1fr;
			}
			.home-feature__image {
				grid-column: 1;
				grid-row: auto;
				aspect-ratio: var(--home-feature-mobile-ratio);
			}
			.home-feature__story {
				grid-column: 1;
				grid-row: auto;
				margin-block-start: calc(-1 * var(--home-feature-overlap));
				padding: var(--home-now-gap) var(--home-feature-mobile-padding)
					var(--home-feature-mobile-padding);
				border-inline-start: 0;
				border-start-end-radius: var(--radius-l);
			}
		}
		.home__contact {
			padding-block: var(--section-space-s);
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: var(--space-m);
		}
		.home__contact > div {
			display: grid;
			gap: var(--space-xs);
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
				min-block-size: 0;
			}
			.home__portrait-feature {
				inline-size: var(--home-portrait-frame-size-tablet);
				block-size: var(--home-portrait-frame-size-tablet);
				margin-block-start: 0;
			}
			.home__portrait-feature::before,
			.home__portrait-feature::after,
			.home__portrait {
				inline-size: var(--home-portrait-size-tablet);
				block-size: var(--home-portrait-height-tablet);
			}
			.home__portrait-feature::before {
				transform: translate(-0.3rem, 0.15rem) rotate(-8deg);
			}
			.home__portrait-feature::after {
				transform: translate(0.3rem, -0.15rem) rotate(7deg);
			}
			.home-card {
				min-block-size: 0;
			}
			.home__contact {
				align-items: flex-start;
				flex-direction: column;
			}
		}
		@media (max-width: 30rem) {
			.home__portrait-feature {
				display: none;
			}
		}
	}
</style>
