<script lang="ts">
	import '$lib/styles/global.css';
	import favicon from '$lib/assets/favicon.svg';
	import outfit from '$lib/assets/outfit-latin.woff2?url';
	import Seo from '$lib/components/Seo.svelte';
	import SiteShell from '$lib/components/SiteShell.svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<svelte:head>
	<link rel="preload" href={outfit} as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="icon" href={data.siteIcon || favicon} />
</svelte:head>

<Seo />

<SiteShell site={data.site}>
	{@render children()}
</SiteShell>
