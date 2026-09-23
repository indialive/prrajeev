<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLDivElement> & {
		children: Snippet;
		width?: 'narrow' | 'default' | 'wide';
	};

	let { children, width = 'default', class: className, ...attributes }: Props = $props();
</script>

<div {...attributes} class={['container', className]} data-width={width}>
	{@render children()}
</div>
