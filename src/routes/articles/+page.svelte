<script lang="ts">
	import Section from '$lib/components/Section.svelte';
	import Container from '$lib/components/Container.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Articles | P R Rajeev</title>
	<meta name="description" content="ServiceNow articles and notes by P R Rajeev." />
</svelte:head>

<Section>
	<Container width="narrow">
		<div class="articles">
			<header class="articles__header">
				<p class="articles__eyebrow">From my desk</p>
				<h1>Articles</h1>
				<p>Notes and articles from my work with ServiceNow.</p>
			</header>
			{#if data.posts.length}
				<div class="articles__list">
					{#each data.posts as post (post.id)}
						<article class="articles__item">
							<time datetime={post.date}>{new Date(post.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
							<h2><a href={'/articles/' + post.slug}>{@html post.title.rendered}</a></h2>
							<div class="articles__excerpt">{@html post.excerpt.rendered}</div>
						</article>
					{/each}
				</div>
			{:else}
				<p class="articles__empty">Articles will appear here when they are published.</p>
			{/if}
		</div>
	</Container>
</Section>

<style>
	@layer components {
		.articles { display: grid; gap: var(--section-space-s); }
		.articles__header { display: grid; gap: var(--space-m); }
		.articles__eyebrow { color: var(--text-muted); font-size: var(--font-size-meta); letter-spacing: 0.08em; text-transform: uppercase; }
		.articles__list { display: grid; gap: var(--space-m); }
		.articles__item { display: grid; gap: var(--space-xs); padding: var(--space-l); border: var(--border-width) solid var(--border-default); border-radius: var(--radius-m); background: var(--surface-raised); }
		.articles__item time { color: var(--text-muted); font-size: var(--font-size-meta); }
		.articles__item h2 { font-size: var(--h4); }
		.articles__item h2 a { color: var(--text-main); text-decoration: none; }
		.articles__item h2 a:hover { color: var(--text-link); }
		.articles__excerpt { color: var(--text-body); }
		.articles__empty { padding-block: var(--section-space-s); border-block-start: var(--border-width) solid var(--border-default); }
	}
</style>