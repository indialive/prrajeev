<script lang="ts">
	import { page } from '$app/state';
	import NavIcon from '$lib/components/NavIcon.svelte';
	import type { Snippet } from 'svelte';
	import type { SiteFields, MenuItem } from '$lib/server/wordpress';

	type Props = { site: SiteFields; children: Snippet };
	let { site, children }: Props = $props();
	let menuOpen = $state(false);

	const fallbackMenu: MenuItem[] = [
		{ section: 'primary', label: 'Home', path: '/' },
		{ section: 'primary', label: 'About me', path: '/about-me' },
		{ section: 'primary', label: 'Articles', path: '/articles' },
		{ section: 'help', label: 'Mentorship', path: '/mentorship' },
		{ section: 'help', label: 'Consultation', path: '/consultation' },
		{ section: 'help', label: 'Contact', path: '/contact' }
	];

	let menuItems = $derived(
		site.menu_items?.length
			? site.menu_items.filter((item) => item.path.startsWith('/') && !item.path.startsWith('//'))
			: fallbackMenu
	);

	function isCurrent(path: string): boolean {
		return path === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(path);
	}
</script>

<div class="site-root" data-theme="dark">
<a class="skip-link" href="#main-content">Skip to content</a>

<header class="site-header">
	<a class="site-header__brand" href="/" aria-label="P R Rajeev, home">
		<span class="site-header__mark" aria-hidden="true">PR</span>
		<span class="site-header__name">{site.brand_name || 'P R Rajeev'}</span>
	</a>

	<span class="site-header__tagline">{site.tagline || 'ServiceNow developer & mentor'}</span>
	<a class="site-header__contact" href="/contact">Write to me <span aria-hidden="true">&#8599;</span></a>
	<button
		class="site-header__menu"
		type="button"
		aria-label={menuOpen ? 'Close menu' : 'Open menu'}
		aria-controls="site-sidebar"
		aria-expanded={menuOpen}
		onclick={() => (menuOpen = !menuOpen)}
	>
		<span class="site-header__menu-icon" aria-hidden="true"></span>
	</button>
</header>

<div class="site-frame">
	<aside id="site-sidebar" class="site-sidebar" data-open={menuOpen}>
		<nav class="site-nav" aria-label="Primary navigation">
			<div class="site-nav__group">
				{#each menuItems.filter((item) => item.section === 'primary') as item (item.path)}
					<a
						class="site-nav__link"
						data-active={isCurrent(item.path)}
						aria-current={isCurrent(item.path) ? 'page' : undefined}
						href={item.path}
						onclick={() => (menuOpen = false)}
					>
						<NavIcon path={item.path} />
						<span>{item.label}</span>
					</a>
				{/each}
			</div>
			{#if menuItems.some((item) => item.section === 'help')}
				<div class="site-nav__group">
					<p class="site-nav__label">How I can help</p>
					{#each menuItems.filter((item) => item.section === 'help') as item (item.path)}
						<a
							class="site-nav__link"
							data-active={isCurrent(item.path)}
							aria-current={isCurrent(item.path) ? 'page' : undefined}
							href={item.path}
							onclick={() => (menuOpen = false)}
						>
							<NavIcon path={item.path} />
							<span>{item.label}</span>
						</a>
					{/each}
				</div>
			{/if}
		</nav>

		<div class="site-sidebar__bottom">
			<a href="/contact"><span>Write to me</span></a>
			{#if site.linkedin_url}
				<a href={site.linkedin_url} target="_blank" rel="noopener noreferrer"><span>Connect on LinkedIn</span>
				</a>
			{/if}
			{#if site.whatsapp_url}
				<a href={site.whatsapp_url} target="_blank" rel="noopener noreferrer"><span>Chat on WhatsApp</span>
				</a>
			{/if}
			<small>{site.brand_name || 'P R Rajeev'}<br />{site.tagline || 'ServiceNow developer'}</small>
		</div>
	</aside>

	<div class="site-frame__content">
		<main id="main-content" class="site-main">
			{@render children()}
		</main>
		<footer class="site-footer">
			<span>{site.footer_note || 'Thanks for spending a little time here. - Rajeev'}</span>
			<span>prrajeev.com</span>
		</footer>
	</div>
</div>
</div>

<style>
	@layer components {
		.site-root {
			min-block-size: 100svh;
			background: var(--surface-page);
			color: var(--text-body);
		}
		.skip-link {
			position: fixed;
			z-index: 20;
			inset-block-start: 0.5rem;
			inset-inline-start: 0.5rem;
			padding: var(--space-xs) var(--space-s);
			background: var(--action-primary-bg);
			color: var(--action-primary-text);
			transform: translateY(-150%);
		}
		.skip-link:focus {
			transform: translateY(0);
		}
		.site-header {
			position: sticky;
			z-index: 10;
			inset-block-start: 0;
			display: flex;
			align-items: center;
			gap: var(--space-m);
			min-block-size: var(--shell-header-height);
			padding-inline: var(--space-l);
			border-block-end: var(--border-width) solid var(--border-default);
			background: var(--surface-raised);
		}
		.site-header__brand {
			display: inline-flex;
			align-items: center;
			gap: var(--space-xs);
			min-inline-size: 0;
			color: var(--text-main);
			text-decoration: none;
		}
		.site-header__mark {
			display: grid;
			place-items: center;
			inline-size: 2.5rem;
			block-size: 2.5rem;
			flex: none;
			border: var(--border-width) solid var(--border-strong);
			border-radius: 50%;
			background: linear-gradient(135deg, var(--primary), var(--primary-dark));
			color: var(--text-main);
			font-size: var(--font-size-meta);
		}
		.site-header__name {
			white-space: nowrap;
			font-size: var(--h4);
			font-weight: var(--weight-semibold);
			letter-spacing: 0.04em;
			text-transform: uppercase;
		}
		.site-header__tagline {
			margin-inline-start: auto;
			color: var(--text-muted);
			font-size: var(--font-size-meta);
		}
		.site-header__contact {
			padding: var(--space-xs) var(--space-s);
			border: var(--border-width) solid var(--border-default);
			border-radius: var(--radius-s);
			color: var(--text-main);
			font-size: var(--font-size-meta);
			text-decoration: none;
		}
		.site-header__menu {
			display: none;
			border: var(--border-width) solid var(--border-default);
			border-radius: var(--radius-s);
			background: transparent;
			color: var(--text-main);
		}
		.site-header__menu-icon {
			position: relative;
			inline-size: 1.25rem;
			block-size: 2px;
			background: currentColor;
		}
		.site-header__menu-icon::before,
		.site-header__menu-icon::after {
			position: absolute;
			inset-inline: 0;
			block-size: 2px;
			background: currentColor;
			content: '';
		}
		.site-header__menu-icon::before { inset-block-start: -0.375rem; }
		.site-header__menu-icon::after { inset-block-start: 0.375rem; }
		.site-header__menu[aria-expanded='true'] .site-header__menu-icon { background: transparent; }
		.site-header__menu[aria-expanded='true'] .site-header__menu-icon::before { inset-block-start: 0; transform: rotate(45deg); }
		.site-header__menu[aria-expanded='true'] .site-header__menu-icon::after { inset-block-start: 0; transform: rotate(-45deg); }
		.site-frame {
			display: grid;
			grid-template-columns: var(--shell-sidebar-width) minmax(0, 1fr);
			align-items: start;
		}
		.site-sidebar {
			position: sticky;
			inset-block-start: var(--shell-header-height);
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			min-block-size: calc(100svh - var(--shell-header-height));
			padding: var(--space-l) var(--space-s);
			border-inline-end: var(--border-width) solid var(--border-default);
			background: var(--surface-raised);
		}
		.site-nav {
			display: grid;
			gap: var(--space-l);
		}
		.site-nav__group {
			display: grid;
			gap: var(--space-2xs);
		}
		.site-nav__label {
			padding-inline: var(--space-s);
			color: var(--text-muted);
			font-size: var(--font-size-meta);
			letter-spacing: 0.08em;
			text-transform: uppercase;
		}
		.site-nav__link {
			display: flex;
			align-items: center;
			gap: var(--space-s);
			min-block-size: 2.75rem;
			padding: var(--space-xs);
			border-radius: var(--radius-m);
			color: var(--text-body);
			font-size: var(--font-size-small);
			text-decoration: none;
		}
		.site-nav__link:hover,
		.site-nav__link[data-active='true'] {
			background: var(--surface-accent);
			color: var(--text-main);
		}
		.site-nav__link[data-active='true'] :global(.nav-icon) { color: var(--aqua); }
		.site-sidebar__bottom {
			display: grid;
			gap: var(--space-s);
			padding: var(--space-s);
			border-block-start: var(--border-width) solid var(--border-default);
		}
		.site-sidebar__bottom a {
			color: var(--text-body);
			font-size: var(--font-size-meta);
			text-decoration: none;
		}
		.site-sidebar__bottom a:hover {
			color: var(--text-link);
		}
		.site-sidebar__bottom small {
			color: var(--text-muted);
			font-size: var(--font-size-meta);
			line-height: 1.4;
		}
		.site-frame__content {
			min-inline-size: 0;
		}
		.site-main {
			position: relative;
			isolation: isolate;
			min-block-size: calc(100svh - var(--shell-header-height));
			padding: 0;
			background: radial-gradient(ellipse 35% 27.5% at 96% 28%, var(--page-glow-aqua), var(--page-glow-aqua-clear)),
				radial-gradient(ellipse 55% 40% at 86% 8%, var(--page-glow-navy), var(--page-glow-navy-clear)),
				var(--surface-page);
		}
		.site-main > :global(.section) {
			position: relative;
			z-index: 1;
		}
		.site-main::before {
			position: absolute;
			z-index: 0;
			inset-block-start: 1.25rem;
			inset-inline-end: 3.75rem;
			inline-size: 20rem;
			block-size: 15rem;
			background-image: radial-gradient(circle at 1px 1px, var(--primary-light) 1px, transparent 1.5px);
			background-size: 1.75rem 1.75rem;
			content: '';
			opacity: 0.22;
			pointer-events: none;
		}
		.site-footer {
			display: flex;
			justify-content: space-between;
			gap: var(--space-m);
			padding: var(--space-m) var(--gutter);
			border-block-start: var(--border-width) solid var(--border-default);
			color: var(--text-muted);
			font-size: var(--font-size-meta);
		}
		@media (max-width: 52rem) {
			.site-header {
				min-block-size: var(--shell-header-height-mobile);
				padding-inline: var(--space-m);
			}
			.site-header__tagline,
			.site-header__contact {
				display: none;
			}
			.site-header__menu {
				display: grid;
				place-items: center;
				inline-size: 2.75rem;
				block-size: 2.75rem;
				margin-inline-start: auto;
			}
			.site-frame {
				display: block;
			}
			.site-sidebar {
				position: fixed;
				z-index: 9;
				inset-block-start: var(--shell-header-height-mobile);
				inset-inline: 0;
				display: none;
				max-block-size: calc(100svh - var(--shell-header-height-mobile));
				min-block-size: 0;
				overflow-y: auto;
				border-inline-end: 0;
				border-block-end: var(--border-width) solid var(--border-default);
			}
			.site-sidebar[data-open='true'] {
				display: flex;
			}
			.site-main {
				min-block-size: calc(100svh - var(--shell-header-height-mobile));
				padding: 0;
			}
			.site-main::before {
				inset-inline-end: 0;
			}
			.site-footer {
				flex-direction: column;
				padding-inline: var(--space-m);
			}
		}
	}
</style>
