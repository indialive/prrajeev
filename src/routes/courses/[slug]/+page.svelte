<script lang="ts">
	import Section from '$lib/components/Section.svelte';
	import Container from '$lib/components/Container.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let course = $derived(data.course);
	let fields = $derived(course.acf);
	let image = $derived(course.image || undefined);
	let showBar = $state(true);

	onMount(() => {
		const footer = document.querySelector('.site-footer');
		if (!footer) return;
		const observer = new IntersectionObserver(([entry]) => {
			showBar = !entry.isIntersecting;
		});
		observer.observe(footer);
		return () => observer.disconnect();
	});
</script>

<Section>
	<Container>
		<article class="course">
			<nav class="course__breadcrumbs" aria-label="Breadcrumb">
				<a href="/courses">Courses</a>
				<span aria-hidden="true">/</span>
				<span aria-current="page">{@html course.title.rendered}</span>
			</nav>

			<header class="course__header">
				<p class="course__eyebrow">Guided learning</p>
				<h1>{@html course.title.rendered}</h1>
				{#if fields.short_intro}<p class="course__lead">{fields.short_intro}</p>{/if}
				{#if fields.format || fields.time_commitment || fields.fee_note}
					<dl class="course__summary">
						{#if fields.format}<div>
								<dt>Format</dt>
								<dd>{fields.format}</dd>
							</div>{/if}
						{#if fields.time_commitment}<div>
								<dt>Time</dt>
								<dd>{fields.time_commitment}</dd>
							</div>{/if}
						{#if fields.fee_note}<div>
								<dt>Fee</dt>
								<dd>{fields.fee_note}</dd>
							</div>{/if}
					</dl>
				{/if}
			</header>

			<div class="course__body">
				{#if image?.url}
					<figure class="course__cover">
						<img
							src={image.url}
							srcset={image.srcset}
							sizes="(max-width: 60rem) 100vw, 65vw"
							alt={image.alt || ''}
							width={image.width || 960}
							height={image.height || 540}
						/>
					</figure>
				{/if}

				{#if course.content.rendered.trim()}
					<section class="course__section" aria-labelledby="course-overview">
						<h2 id="course-overview">Overview</h2>
						<div class="course__prose">{@html course.content.rendered}</div>
					</section>
				{/if}
				{#if fields.audience}
					<section class="course__section" aria-labelledby="course-audience">
						<h2 id="course-audience">Who this is for</h2>
						<p>{fields.audience.replace(/&lt;\/?p&gt;|<[^>]+>/g, '')}</p>
					</section>
				{/if}
				{#if fields.learning_topics?.length}
					<section class="course__section" aria-labelledby="course-topics">
						<h2 id="course-topics">What we will cover</h2>
						<ol class="course__topics">
							{#each fields.learning_topics as item}
								<li>{item.topic}</li>
							{/each}
						</ol>
					</section>
				{/if}
				{#if fields.prerequisites}
					<section class="course__section" aria-labelledby="course-prerequisites">
						<h2 id="course-prerequisites">Before you begin</h2>
						<p>{fields.prerequisites.replace(/&lt;\/?p&gt;|<[^>]+>/g, '')}</p>
					</section>
				{/if}
				{#if fields.mentor_note}
					<aside class="course__note">
						<p class="course__eyebrow">A note from Rajeev</p>
						<p>{fields.mentor_note}</p>
					</aside>
				{/if}
				{#if fields.faqs?.length}
					<section class="course__section" aria-labelledby="course-faqs">
						<h2 id="course-faqs">Questions</h2>
						{#each fields.faqs as item}
							<details class="course__faq">
								<summary>{item.question}</summary>
								<p>{item.answer}</p>
							</details>
						{/each}
					</section>
				{/if}
			</div>
			<div class="course__bar" data-visible={showBar}>
				<div class="course__bar-copy">
					<strong>{@html course.title.rendered}</strong>
					<span>Learning and conversation on Microsoft Teams</span>
				</div>
				<a class="course__contact" href="/contact"
					>Ask about this course <span aria-hidden="true">&#8599;</span></a
				>
			</div>
		</article>
	</Container>
</Section>

<style>
	@layer components {
		.course {
			display: grid;
			gap: var(--section-space-m);
			max-inline-size: var(--home-content-width);
			margin-inline: auto;
			padding-block-end: calc(var(--section-space-l) + var(--space-xl));
		}
		.course__breadcrumbs {
			display: flex;
			flex-wrap: wrap;
			gap: var(--space-xs);
			color: var(--text-muted);
			font-size: var(--font-size-meta);
		}
		.course__breadcrumbs a {
			color: var(--text-link);
			text-decoration: none;
		}
		.course__breadcrumbs a:hover {
			text-decoration: underline;
		}
		.course__header {
			display: grid;
			justify-items: start;
			gap: var(--space-s);
			max-inline-size: var(--text-width);
		}
		.course__header h1 {
			line-height: 1.15;
		}
		.course__eyebrow {
			color: var(--aqua);
			font-size: var(--font-size-meta);
			letter-spacing: 0.08em;
			text-transform: uppercase;
		}
		.course__lead {
			color: var(--text-body);
			font-size: var(--font-size-lead);
		}
		.course__summary {
			display: flex;
			flex-wrap: wrap;
			gap: var(--space-l);
			margin-block-start: var(--space-m);
		}
		.course__summary div {
			display: grid;
			gap: var(--space-2xs);
			min-inline-size: 8rem;
		}
		.course__summary dt {
			color: var(--text-muted);
			font-size: var(--font-size-meta);
		}
		.course__summary dd {
			margin: 0;
			color: var(--text-main);
			font-size: var(--font-size-small);
		}
		.course__body {
			display: grid;
			gap: var(--section-space-m);
			min-inline-size: 0;
			padding-block-end: var(--section-space-s);
		}
		.course__cover {
			overflow: hidden;
			aspect-ratio: 16 / 9;
			border: var(--border-width) solid var(--border-default);
			border-radius: var(--radius-l);
			background: var(--surface-raised);
		}
		.course__cover img {
			inline-size: 100%;
			block-size: 100%;
			object-fit: cover;
		}
		.course__section {
			display: grid;
			gap: var(--space-m);
			padding-block-start: var(--section-space-s);
			border-block-start: var(--border-width) solid var(--border-default);
		}
		.course__section h2 {
			font-size: var(--h3);
		}
		.course__prose {
			display: grid;
			gap: var(--space-m);
			max-inline-size: var(--text-width);
		}
		.course__prose :global(ul),
		.course__prose :global(ol) {
			padding-inline-start: var(--space-l);
		}
		.course__prose :global(a) {
			overflow-wrap: anywhere;
		}
		.course__topics {
			display: grid;
			gap: 0;
			padding: 0;
			list-style: none;
			counter-reset: topic;
		}
		.course__topics li {
			display: grid;
			grid-template-columns: 2.5rem minmax(0, 1fr);
			align-items: baseline;
			gap: var(--space-s);
			padding-block: var(--space-s);
			border-block-end: var(--border-width) solid var(--border-default);
			counter-increment: topic;
		}
		.course__topics li::before {
			content: counter(topic, decimal-leading-zero);
			color: var(--aqua);
			font-size: var(--font-size-meta);
			font-variant-numeric: tabular-nums;
		}
		.course__note {
			display: grid;
			gap: var(--space-s);
			padding: var(--space-l);
			border-inline-start: 2px solid var(--border-accent);
			border-radius: var(--radius-s);
			background: var(--surface-accent);
		}
		.course__faq {
			padding-block: var(--space-s);
			border-block-end: var(--border-width) solid var(--border-default);
		}
		.course__faq summary {
			cursor: pointer;
			color: var(--text-main);
			font-weight: var(--weight-semibold);
		}
		.course__faq p {
			margin-block-start: var(--space-s);
		}
		.course__bar {
			position: fixed;
			z-index: 5;
			inset-block-end: var(--space-m);
			inset-inline-start: calc(var(--shell-sidebar-width) + var(--gutter));
			inset-inline-end: var(--gutter);
			max-inline-size: var(--home-content-width);
			margin-inline: auto;
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: var(--space-m);
			padding: var(--space-s) var(--space-m);
			border: var(--border-width) solid color-mix(in oklch, var(--aqua) 32%, var(--border-default));
			border-radius: var(--radius-l);
			background: color-mix(in oklch, var(--surface-raised) 84%, transparent);
			box-shadow: 0 1rem 2.5rem color-mix(in oklch, var(--surface-page) 45%, transparent);
			backdrop-filter: blur(1rem) saturate(125%);
		}
		.course__bar[data-visible='false'] {
			visibility: hidden;
			pointer-events: none;
		}
		.course__bar-copy {
			display: grid;
			gap: var(--space-2xs);
			min-inline-size: 0;
		}
		.course__bar-copy strong {
			color: var(--text-main);
			font-size: var(--font-size-small);
			font-weight: var(--weight-semibold);
		}
		.course__bar-copy span {
			color: var(--text-muted);
			font-size: var(--font-size-meta);
		}
		.course__contact {
			display: inline-flex;
			align-items: center;
			justify-content: space-between;
			gap: var(--space-m);
			flex: none;
			padding: var(--space-xs) var(--space-m);
			border: var(--border-width) solid var(--border-accent);
			border-radius: var(--radius-m);
			color: var(--text-link);
			font-size: var(--font-size-small);
			font-weight: var(--weight-semibold);
			text-decoration: none;
		}
		.course__contact:hover {
			background: var(--surface-accent);
		}
		@media (max-width: 52rem) {
			.course__bar {
				inset-inline-start: var(--gutter);
			}
		}
		@media (max-width: 40rem) {
			.course__bar {
				gap: var(--space-s);
				padding: var(--space-s);
			}
			.course__bar-copy {
				display: none;
			}
			.course__contact {
				inline-size: 100%;
				gap: var(--space-xs);
				padding: var(--space-xs) var(--space-s);
			}
		}
	}
</style>
