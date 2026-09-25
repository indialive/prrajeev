<script lang="ts">
	import Section from '$lib/components/Section.svelte';
	import Container from '$lib/components/Container.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Courses | P R Rajeev</title>
	<meta name="description" content="Explore ServiceNow courses from P R Rajeev." />
</svelte:head>

<Section>
	<Container width="narrow">
		<div class="courses">
			<header class="courses__header">
				<p class="courses__eyebrow">Learning</p>
				<h1>Courses</h1>
				<p>Explore the courses currently listed here.</p>
			</header>
			{#if data.courses.length}
				<div class="courses__grid">
					{#each data.courses as course (course.id)}
						<article class="courses__card">
							<h2><a href={'/courses/' + course.slug}>{@html course.title.rendered}</a></h2>
							{#if course.acf.short_intro}<p>{course.acf.short_intro}</p>{/if}
							{#if course.acf.format}<p class="courses__meta">Format: {course.acf.format}</p>{/if}
							<a class="courses__more" href={'/courses/' + course.slug}>View course</a>
						</article>
					{/each}
				</div>
			{:else}
				<p>Courses will appear here when they are published.</p>
			{/if}
		</div>
	</Container>
</Section>

<style>
	@layer components {
		.courses { display: grid; gap: var(--section-space-s); }
		.courses__header { display: grid; gap: var(--space-m); }
		.courses__eyebrow { color: var(--text-muted); font-size: var(--font-size-meta); letter-spacing: 0.08em; text-transform: uppercase; }
		.courses__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr)); gap: var(--space-m); }
		.courses__card { display: grid; align-content: start; gap: var(--space-s); padding: var(--space-l); border: var(--border-width) solid var(--border-default); border-radius: var(--radius-m); background: var(--surface-raised); }
		.courses__card h2 { font-size: var(--h4); }
		.courses__card h2 a { color: var(--text-main); text-decoration: none; }
		.courses__card h2 a:hover { color: var(--text-link); }
		.courses__meta { color: var(--text-muted); font-size: var(--font-size-small); }
		.courses__more { justify-self: start; margin-block-start: var(--space-s); }
	}
</style>