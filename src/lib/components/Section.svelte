<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLElement> & {
		children: Snippet;
		spacing?: 'compact' | 'default' | 'spacious' | 'none';
	};

	let {
		children,
		spacing = 'default',
		class: className,
		...attributes
	}: Props = $props();
</script>

<!-- Give each section a meaningful heading; aria-labelledby can reference that heading. -->
<section {...attributes} class={['section', className]} data-spacing={spacing}>
	{@render children()}
</section>
