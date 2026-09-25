<script lang="ts">
	import '$lib/styles/global.css';
	import favicon from '$lib/assets/favicon.svg';
	import SiteShell from '$lib/components/SiteShell.svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<SiteShell site={data.site}>
	{@render children()}
</SiteShell>
