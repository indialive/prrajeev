<script lang="ts">
	import Section from '$lib/components/Section.svelte';
	import Container from '$lib/components/Container.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.post.title.rendered} | P R Rajeev</title>
</svelte:head>

<Section>
	<Container width="narrow">
		<article class="article">
			<a class="article__back" href="/articles">All articles</a>
			<header class="article__header">
				<time datetime={data.post.date}>{new Date(data.post.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
				<h1>{@html data.post.title.rendered}</h1>
			</header>
			<div class="article__body">{@html data.post.content.rendered}</div>
		</article>
	</Container>
</Section>

<style>
	@layer components {
		.article { display: grid; gap: var(--section-space-s); }
		.article__back { justify-self: start; }
		.article__header { display: grid; gap: var(--space-s); }
		.article__header time { color: var(--text-muted); font-size: var(--font-size-meta); }
		.article__body { max-inline-size: var(--text-width); }
		.article__body :global(:is(p, ul, ol, blockquote) + :is(p, ul, ol, blockquote)) { margin-block-start: var(--space-m); }
		.article__body :global(:is(h2, h3)) { margin-block: var(--space-l) var(--space-s); }
		.article__body :global(pre) { padding: var(--space-m); border-radius: var(--radius-m); background: var(--code-bg); color: var(--code-text); }
	}
</style>