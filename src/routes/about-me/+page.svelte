<script lang="ts">
	import Section from '$lib/components/Section.svelte';
	import Container from '$lib/components/Container.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let content = $derived(data.about);
</script>

<svelte:head>
	<title>About me | P R Rajeev</title>
	<meta name="description" content={content.intro || 'About P R Rajeev and his ServiceNow work.'} />
</svelte:head>

<Section>
	<Container>
		<article class="about">
			<header class="about__header">
				<p class="about__eyebrow">About me</p>
				<h1>{content.hero_heading || 'About me'}</h1>
				{#if content.intro}<p class="about__lead">{content.intro}</p>{/if}
			</header>
			{#if content.professional_story}
				<section class="about__section" aria-labelledby="about-story">
					<h2 id="about-story">A little about my work</h2>
					<p>{content.professional_story.replace(/&lt;\/?p&gt;|<[^>]+>/g, '')}</p>
				</section>
			{/if}
			{#if content.development_focus || content.mentorship_focus || content.consultation_focus}
				<section class="about__section" aria-labelledby="about-focus">
					<h2 id="about-focus">Where I can help</h2>
					<div class="about__focus">
						{#if content.development_focus}<div class="about__focus-card"><h3>ServiceNow development</h3><p>{content.development_focus}</p></div>{/if}
						{#if content.mentorship_focus}<div class="about__focus-card"><h3>Mentorship</h3><p>{content.mentorship_focus}</p></div>{/if}
						{#if content.consultation_focus}<div class="about__focus-card"><h3>Technical consultation</h3><p>{content.consultation_focus}</p></div>{/if}
					</div>
				</section>
			{/if}
			{#if content.working_approach}
				<section class="about__section" aria-labelledby="about-approach">
					<h2 id="about-approach">How I work</h2>
					<p>{content.working_approach.replace(/&lt;\/?p&gt;|<[^>]+>/g, '')}</p>
				</section>
			{/if}
			<section class="about__section" aria-labelledby="about-contact">
				<h2 id="about-contact">Have a question in mind?</h2>
				<p>Tell me what you are working through. We can start with a conversation.</p>
				<a class="about__contact" href="/contact">Write to me <span aria-hidden="true">&#8599;</span></a>
			</section>
		</article>
	</Container>
</Section>

<style>
	@layer components {
		.about { display: grid; gap: var(--section-space-s); }
		.about__header { display: grid; gap: var(--space-s); }
		.about__eyebrow { color: var(--text-muted); font-size: var(--font-size-meta); letter-spacing: 0.08em; text-transform: uppercase; }
		.about__lead { max-inline-size: var(--text-width); font-size: var(--font-size-lead); line-height: 1.35; }
		.about__section { display: grid; gap: var(--space-s); padding-block-start: var(--section-divider-padding); border-block-start: var(--border-width) solid var(--border-default); }
		.about__section h2 { font-size: var(--h2); }
		.about__focus { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-s); }
		.about__focus-card { display: grid; align-content: start; gap: var(--space-xs); padding: var(--space-m); border: var(--border-width) solid var(--border-default); border-radius: var(--radius-m); background: var(--surface-raised); }
		.about__focus-card h3 { font-size: var(--h4); }
		.about__contact { justify-self: start; color: var(--text-link); font-weight: var(--weight-semibold); text-decoration: none; }
		.about__contact:hover { text-decoration: underline; }
		@media (max-width: 48rem) { .about__focus { grid-template-columns: 1fr; } }
	}
</style>