<script lang="ts">
	let { path }: { path: string } = $props();
</script>

<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
	{#if path === '/'}
		<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />
	{:else if path === '/about-me'}
		<circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" />
	{:else if path === '/articles'}
		<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 1V4z" /><path d="M5 20a3 3 0 0 1 3-3h11M9 8h6M9 12h6" />
	{:else if path === '/mentorship'}
		<path d="m2 10 10-5 10 5-10 5-10-5zM6 12v5c3 3 9 3 12 0v-5M22 10v6" />
	{:else if path === '/consultation'}
		<path d="M4 5h13a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H9l-5 3V8a3 3 0 0 1 3-3zM8 10h8M8 14h5" />
	{:else if path === '/contact'}
		<rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" />
	{:else if path === '/courses'}
		<path d="M4 5h8a3 3 0 0 1 3 3v12H7a3 3 0 0 0-3 1V5zM20 5h-5v15h2a3 3 0 0 1 3 1V5z" />
	{:else}
		<circle cx="12" cy="12" r="8" />
	{/if}
</svg>

<style>
	@layer components {
		.nav-icon { inline-size: 1.25rem; block-size: 1.25rem; flex: none; }
	}
</style>