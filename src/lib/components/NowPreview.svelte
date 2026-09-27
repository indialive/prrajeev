<script lang="ts">
	import type { WordPressImage } from '$lib/server/wordpress';
	let {
		preview,
		kind
	}: {
		preview: { title?: string; context?: string; url?: string; image?: WordPressImage };
		kind: 'learning' | 'making';
	} = $props();
	let visible = $derived(
		Boolean(preview.title || preview.context || preview.url || preview.image?.url)
	);
</script>

{#snippet content()}
	{#if preview.image?.url}
		<img
			class="now-preview__image"
			src={preview.image.url}
			srcset={preview.image.srcset}
			sizes="3rem"
			width={preview.image.width}
			height={preview.image.height}
			alt={preview.image.alt || ''}
			loading="lazy"
		/>
	{:else}
		<span class="now-preview__image now-preview__placeholder" aria-hidden="true"
			><svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.7"
				stroke-linecap="round"
				stroke-linejoin="round"
				>{#if kind === 'learning'}<path
						d="M12 5v15M3 4h5a4 4 0 0 1 4 2 4 4 0 0 1 4-2h5v15h-5a4 4 0 0 0-4 2 4 4 0 0 0-4-2H3z"
					/>{:else}<path d="m8 6-6 6 6 6m8-12 6 6-6 6" />{/if}</svg
			></span
		>
	{/if}
	<span class="now-preview__copy">
		{#if preview.title}<span class="now-preview__title">{preview.title}</span>{/if}
		{#if preview.context}<span class="now-preview__context">{preview.context}</span>{/if}
		{#if preview.url && !preview.title && !preview.context}<span class="now-preview__title"
				>{kind === 'learning' ? 'Open resource' : 'Open project'}</span
			>{/if}
	</span>
	{#if preview.url}<svg
			class="now-preview__arrow"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.7"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg
		>{/if}
{/snippet}

{#if visible}
	{#if preview.url}<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external URL validated by the server -->
		<a class="now-preview" href={preview.url}>{@render content()}</a>{:else}<div
			class="now-preview"
		>
			{@render content()}
		</div>{/if}
{/if}

<style>
	@layer components {
		.now-preview {
			display: flex;
			align-items: center;
			gap: var(--space-xs);
			min-inline-size: 0;
			min-block-size: var(--home-widget-height);
			padding: var(--home-now-inset);
			border-radius: var(--radius-l);
			background: var(--home-widget-background);
			color: var(--text-body);
			text-decoration: none;
		}
		.now-preview__image {
			inline-size: var(--home-widget-image-size);
			block-size: var(--home-widget-image-size);
			object-fit: cover;
			border-radius: var(--radius-m);
			flex: none;
		}
		.now-preview__placeholder {
			display: grid;
			place-items: center;
			background: var(--primary);
			color: var(--aqua);
		}
		.now-preview__placeholder svg,
		.now-preview__arrow {
			inline-size: var(--home-now-icon-size);
			block-size: var(--home-now-icon-size);
		}
		.now-preview__copy {
			display: grid;
			gap: var(--space-2xs);
			min-inline-size: 0;
			flex: 1;
			overflow-wrap: anywhere;
		}
		.now-preview__title {
			font-size: var(--font-size-small);
			font-weight: var(--weight-semibold);
			line-height: var(--leading-heading);
		}
		.now-preview__context {
			color: var(--text-muted);
			font-size: var(--font-size-meta);
			line-height: var(--leading-heading);
		}
		.now-preview__arrow {
			flex: none;
			color: var(--aqua);
		}
		a.now-preview:is(:hover, :focus-visible) .now-preview__title {
			color: var(--text-link);
			text-decoration: underline;
		}
		@media (max-width: 30rem) {
			.now-preview__image {
				display: none;
			}
			.now-preview {
				padding: var(--space-s);
			}
		}
	}
</style>
