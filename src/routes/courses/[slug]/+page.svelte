<script lang="ts">
	import Section from '$lib/components/Section.svelte';
	import Container from '$lib/components/Container.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let course = $derived(data.course);
	let fields = $derived(course.acf);
</script>

<svelte:head>
	<title>{course.title.rendered} | P R Rajeev</title>
	<meta name="description" content={fields.short_intro || 'ServiceNow course information.'} />
</svelte:head>

<Section>
	<Container width="narrow">
		<article class="course">
			<header class="course__header">
				<a href="/courses">All courses</a>
				<p class="course__eyebrow">Course</p>
				<h1>{@html course.title.rendered}</h1>
				{#if fields.short_intro}<p class="course__lead">{fields.short_intro}</p>{/if}
			</header>
			{#if fields.format || fields.time_commitment || fields.fee_note}
				<dl class="course__facts">
					{#if fields.format}<div><dt>Format</dt><dd>{fields.format}</dd></div>{/if}
					{#if fields.time_commitment}<div><dt>Time commitment</dt><dd>{fields.time_commitment}</dd></div>{/if}
					{#if fields.fee_note}<div><dt>Fee</dt><dd>{fields.fee_note}</dd></div>{/if}
				</dl>
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
					<ul>{#each fields.learning_topics as item}<li>{item.topic}</li>{/each}</ul>
				</section>
			{/if}
			{#if fields.prerequisites}
				<section class="course__section" aria-labelledby="course-prerequisites">
					<h2 id="course-prerequisites">Before you begin</h2>
					<p>{fields.prerequisites.replace(/&lt;\/?p&gt;|<[^>]+>/g, '')}</p>
				</section>
			{/if}
			{#if fields.mentor_note}
				<aside class="course__note"><h2>A note from Rajeev</h2><p>{fields.mentor_note}</p></aside>
			{/if}
			{#if fields.faqs?.length}
				<section class="course__section" aria-labelledby="course-faqs">
					<h2 id="course-faqs">Questions</h2>
					{#each fields.faqs as item}
						<details class="course__faq"><summary>{item.question}</summary><p>{item.answer}</p></details>
					{/each}
				</section>
			{/if}
			<a class="course__contact" href="/contact">Ask about this course</a>
		</article>
	</Container>
</Section>

<style>
	@layer components {
		.course { display: grid; gap: var(--section-space-s); }
		.course__header { display: grid; justify-items: start; gap: var(--space-s); }
		.course__eyebrow { color: var(--text-muted); font-size: var(--font-size-meta); letter-spacing: 0.08em; text-transform: uppercase; }
		.course__lead { max-inline-size: var(--text-width); font-size: var(--font-size-lead); }
		.course__facts { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr)); gap: var(--space-m); padding: var(--space-m); border: var(--border-width) solid var(--border-default); border-radius: var(--radius-m); background: var(--surface-raised); }
		.course__facts div { display: grid; gap: var(--space-2xs); }
		.course__facts dt { color: var(--text-muted); font-size: var(--font-size-meta); }
		.course__section { display: grid; gap: var(--space-m); padding-block-start: var(--section-space-s); border-block-start: var(--border-width) solid var(--border-default); }
		.course__section h2, .course__note h2 { font-size: var(--h3); }
		.course__section ul { padding-inline-start: var(--space-l); }
		.course__note { display: grid; gap: var(--space-s); padding: var(--space-l); border-inline-start: var(--border-width) solid var(--border-accent); background: var(--surface-accent); }
		.course__faq { padding-block: var(--space-s); border-block-end: var(--border-width) solid var(--border-default); }
		.course__faq summary { cursor: pointer; font-weight: var(--weight-semibold); }
		.course__faq p { margin-block-start: var(--space-s); }
		.course__contact { justify-self: start; padding: var(--space-xs) var(--space-m); border-radius: var(--radius-s); background: var(--action-primary-bg); color: var(--action-primary-text); text-decoration: none; }
		.course__contact:hover { background: var(--action-primary-bg-hover); }
	}
</style>