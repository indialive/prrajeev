<script lang="ts">
	import Section from '$lib/components/Section.svelte';
	import Container from '$lib/components/Container.svelte';

	const themes = ['default', 'muted', 'primary', 'dark'] as const;
	const colours = ['primary', 'secondary', 'tertiary', 'highlight', 'danger'] as const;
</script>

<svelte:head>
	<title>Design system preview | P R Rajeev</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main>
	<Section aria-labelledby="preview-title">
		<Container>
			<div class="preview__stack">
				<p class="preview__meta">P R RAJEEV / DESIGN SYSTEM PREVIEW</p>
				<h1 id="preview-title">Enterprise expertise.<br />A fresh perspective.</h1>
				<p class="preview__lead">
					Infinite Blue navy, Wasabi green and cool neutrals for ServiceNow expertise, mentorship
					and technical consultation.
				</p>
				<p>
					This is a token specimen, not a proposed homepage. Resize the window to review fluid
					typography and spacing. Fonts use local fallbacks unless installed.
				</p>
				<div class="preview__palette">
					{#each colours as colour}
						<div>
							<div class="preview__swatch" style:background={`var(--${colour})`}></div>
							<code>--{colour}</code>
						</div>
					{/each}
				</div>
				<div class="preview__stack">
					{#each [1, 2, 3, 4, 5, 6] as size}
						<p class="preview__type" style:font-size={`var(--h${size})`}>
							H{size} · Practical knowledge, clearly shared.
						</p>
					{/each}
				</div>
			</div>
		</Container>
	</Section>
	{#each themes as theme}
		<Section {theme} aria-labelledby={`theme-${theme}`}>
			<Container>
				<div class="preview__stack">
					<p class="preview__meta">{theme} theme</p>
					<h2 id={`theme-${theme}`}>Build understanding. Apply it with confidence.</h2>
					<p class="preview__lead">
						ServiceNow development, mentorship and technical consultation.
					</p>
					<p>
						Body text should feel comfortable to read. <span class="preview__muted"
							>Muted text supports the main message.</span
						> <a href="#preview-title">Review the palette</a>.
					</p>
					<div class="preview__actions">
						<a class="preview__button" href="#preview-title">Primary action</a>
						<a class="preview__button" data-variant="accent" href="#preview-title">Accent action</a>
					</div>
					<article class="preview__card preview__stack">
						<h3>Learning through practical examples</h3>
						<p>
							A raised surface with a subtle border and inline code: <code class="preview__inline"
								>current.short_description</code
							>.
						</p>
						<pre class="preview__code"><code
								><span class="preview__comment">// Example syntax colours</span>{'\n'}<span
									class="preview__keyword">const</span
								> topic = <span class="preview__string">'ServiceNow'</span>;{'\n'}<span
									class="preview__function">explain</span
								>(topic);</code
							></pre>
					</article>
					<div class="preview__actions">
						{#each ['info', 'success', 'warning', 'danger'] as status}
							<p style:color={`var(--status-${status})`}>{status} message</p>
						{/each}
					</div>
				</div>
			</Container>
		</Section>
	{/each}
</main>

<style>
	@layer components {
		.preview__stack {
			display: grid;
			gap: var(--space-m);
		}
		.preview__stack > p {
			max-inline-size: var(--text-width);
		}
		.preview__lead {
			font-size: var(--font-size-lead);
		}
		.preview__meta {
			font-size: var(--font-size-meta);
			color: var(--text-muted);
		}
		.preview__muted {
			color: var(--text-muted);
		}
		.preview__palette {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(min(100%, 10rem), 1fr));
			gap: var(--space-m);
			margin-block: var(--space-l);
		}
		.preview__swatch {
			block-size: var(--section-space-m);
			border-radius: var(--radius-m);
		}
		.preview__type {
			font-family: var(--font-heading);
			font-weight: var(--weight-bold);
			line-height: var(--leading-heading);
			color: var(--text-main);
			letter-spacing: var(--tracking-heading);
		}
		.preview__actions {
			display: flex;
			flex-wrap: wrap;
			gap: var(--space-m);
		}
		.preview__button {
			--button-bg: var(--action-primary-bg);
			--button-hover: var(--action-primary-bg-hover);
			--button-text: var(--action-primary-text);
			padding-block: var(--space-xs);
			padding-inline: var(--space-m);
			background: var(--button-bg);
			color: var(--button-text);
			border-radius: var(--radius-m);
			text-decoration: none;
			font-weight: var(--weight-semibold);
			transition: background var(--duration-fast) var(--ease-default);
		}
		.preview__button[data-variant='accent'] {
			--button-bg: var(--action-accent-bg);
			--button-hover: var(--action-accent-bg-hover);
			--button-text: var(--action-accent-text);
		}
		.preview__button:hover {
			background: var(--button-hover);
		}
		.preview__card {
			min-inline-size: 0;
			background: var(--surface-raised);
			padding: var(--space-l);
			border: var(--border-width) solid var(--border-default);
			border-radius: var(--radius-l);
			box-shadow: var(--shadow-s);
		}
		.preview__inline {
			background: var(--code-inline-bg);
			color: var(--code-inline-text);
			font-size: var(--font-size-code);
		}
		.preview__code {
			margin: 0;
			min-inline-size: 0;
			padding: var(--space-m);
			border-radius: var(--radius-m);
			background: var(--code-bg);
			color: var(--code-text);
			font-size: var(--font-size-code);
			line-height: var(--leading-code);
		}
		.preview__comment {
			color: var(--code-comment);
		}
		.preview__keyword {
			color: var(--code-keyword);
		}
		.preview__string {
			color: var(--code-string);
		}
		.preview__function {
			color: var(--code-function);
		}
	}
</style>
