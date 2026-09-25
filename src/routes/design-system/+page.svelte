<script lang="ts">
	import Section from '$lib/components/Section.svelte';
	import Container from '$lib/components/Container.svelte';

	const swatches = [
		{ label: 'Navy', token: 'primary' },
		{ label: 'Deep navy', token: 'primary-dark' },
		{ label: 'Aqua links', token: 'aqua' },
		{ label: 'Page', token: 'surface-page' },
		{ label: 'Raised surface', token: 'surface-raised' },
		{ label: 'Body text', token: 'text-body' }
	];
</script>

<svelte:head>
	<title>Design system preview | P R Rajeev</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<Section>
	<Container>
		<div class="preview">
			<p class="preview__eyebrow">Design system preview</p>
			<h1>The approved Pen palette</h1>
			<p>Navy surfaces, aqua links, neutral text, and a quiet two layer glow.</p>
			<div class="preview__palette">
				{#each swatches as swatch (swatch.token)}
					<div class="preview__swatch">
						<span style:background={'var(--' + swatch.token + ')'}></span>
						<code>--{swatch.token}</code>
					</div>
				{/each}
			</div>
			<div class="preview__sample">
				<h2>Clear answers to complex questions</h2>
				<p>ServiceNow development, mentorship, and technical consultation.</p>
				<a class="preview__button" href="/contact">Write to me</a>
				<a href="/about-me">Learn more about Rajeev</a>
			</div>
		</div>
	</Container>
</Section>

<style>
	@layer components {
		.preview { display: grid; gap: var(--space-l); }
		.preview__eyebrow { color: var(--text-muted); font-size: var(--font-size-meta); text-transform: uppercase; letter-spacing: 0.08em; }
		.preview__palette { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 10rem), 1fr)); gap: var(--space-m); }
		.preview__swatch { display: grid; gap: var(--space-xs); }
		.preview__swatch span { display: block; block-size: 5rem; border: var(--border-width) solid var(--border-default); border-radius: var(--radius-m); }
		.preview__sample { display: grid; justify-items: start; gap: var(--space-m); padding: var(--space-l); border: var(--border-width) solid var(--border-default); border-radius: var(--radius-m); background: var(--surface-raised); }
		.preview__button { padding: var(--space-xs) var(--space-m); border-radius: var(--radius-m); background: var(--action-primary-bg); color: var(--action-primary-text); text-decoration: none; }
		.preview__button:hover { background: var(--action-primary-bg-hover); }
	}
</style>