<script lang="ts">
	import Section from '$lib/components/Section.svelte';
	import Container from '$lib/components/Container.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.title} | P R Rajeev</title>
	<meta name="description" content={'Learn about ' + data.title.toLowerCase() + ' with P R Rajeev.'} />
</svelte:head>

<Section>
	<Container width="narrow">
		<article class="service">
			<p class="service__eyebrow">How I can help</p>
			<h1>{data.title}</h1>
			{#if data.body}
				<div class="service__body">{@html data.body}</div>
			{:else}
				<p>[Add page content in WordPress.]</p>
			{/if}
			<a class="service__contact" href="/contact">Get in touch</a>
		</article>
	</Container>
</Section>

<style>
	@layer components {
		.service { display: grid; justify-items: start; gap: var(--space-l); }
		.service__eyebrow { color: var(--text-muted); font-size: var(--font-size-meta); letter-spacing: 0.08em; text-transform: uppercase; }
		.service__body { max-inline-size: var(--text-width); }
		.service__body :global(p + p) { margin-block-start: var(--space-m); }
		.service__contact { padding: var(--space-xs) var(--space-m); border-radius: var(--radius-s); background: var(--action-primary-bg); color: var(--action-primary-text); text-decoration: none; }
		.service__contact:hover { background: var(--action-primary-bg-hover); }
	}
</style>