<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Section from '$lib/components/Section.svelte';
	import Container from '$lib/components/Container.svelte';
</script>

<Section
	><Container>
		<h1>{page.status === 404 ? 'Page not found' : 'Temporarily unavailable'}</h1>
		<p>{page.error?.message || 'Please try again shortly.'}</p>
		<a href={resolve('/')}>Return home</a>
	</Container></Section
>
