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
		{ section: 'help', label: 'Consultation', path: '/consultation' },
		{ section: 'help', label: 'Contact', path: '/contact' }
	];

	let menuItems = $derived.by(() => {
		const source = site.menu_items?.length
			? site.menu_items.filter((item) => item.path.startsWith('/') && !item.path.startsWith('//'))
			: fallbackMenu;
		const items = source.filter((item) => item.path !== '/courses' && item.path !== '/mentorship');
		const consultationIndex = items.findIndex((item) => item.path === '/consultation');
		const helpIndex = items.findIndex((item) => item.section === 'help');
		items.splice(consultationIndex >= 0 ? consultationIndex : helpIndex >= 0 ? helpIndex : items.length, 0, {
			section: 'help',
			label: 'Learn with me',
			path: '/courses'
		});
		return items;
	});

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
							data-featured={item.path === '/courses'}
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

		{#if site.linkedin_url || site.whatsapp_url}
			<div class="site-sidebar__social" aria-label="Social links">
				{#if site.linkedin_url}
					<a href={site.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">
						<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
							<path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.75H4.98V9.2h2.95v9.55ZM6.45 7.9a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.3 10.85H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.51V9.2h2.83v1.3h.04c.39-.75 1.36-1.55 2.79-1.55 2.99 0 3.58 1.97 3.58 4.53v5.27Z" />
						</svg>
					</a>
				{/if}
				{#if site.whatsapp_url}
					<a href={site.whatsapp_url} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="WhatsApp">
						<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
							<path d="M12 2a9.94 9.94 0 0 0-8.56 15.02L2 22l5.13-1.35A10 10 0 1 0 12 2Zm0 18.18a8.12 8.12 0 0 1-4.13-1.13l-.3-.18-3.05.8.81-2.97-.2-.31A8.18 8.18 0 1 1 12 20.18Zm4.48-6.13c-.25-.12-1.46-.72-1.69-.8-.23-.08-.4-.12-.56.13-.17.25-.65.8-.79.96-.15.17-.29.19-.54.06a6.71 6.71 0 0 1-3.31-2.89c-.25-.43.25-.4.71-1.33.08-.17.04-.32-.02-.45-.06-.12-.56-1.35-.77-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.09s.9 2.42 1.02 2.59c.13.17 1.77 2.7 4.28 3.79.6.26 1.07.41 1.44.52.61.2 1.17.17 1.61.1.49-.07 1.46-.6 1.67-1.17.21-.57.21-1.06.15-1.17-.06-.11-.23-.17-.48-.29Z" />
						</svg>
					</a>
				{/if}
			</div>
		{/if}
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
			background: var(--surface-shell);
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
			background: linear-gradient(135deg, var(--aqua), var(--primary-light));
			color: var(--primary-dark);
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
			background: var(--surface-shell);
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
		.site-nav__link[data-featured='true'] {
			color: var(--text-main);
			font-weight: var(--weight-semibold);
		}
		.site-nav__link[data-featured='true'] :global(.nav-icon) { color: var(--aqua); }
		.site-sidebar__social {
			display: flex;
			gap: var(--space-xs);
			padding: var(--space-s);
			border-block-start: var(--border-width) solid var(--border-default);
		}
		.site-sidebar__social a {
			display: grid;
			place-items: center;
			inline-size: 2.75rem;
			block-size: 2.75rem;
			border: var(--border-width) solid var(--border-default);
			border-radius: var(--radius-m);
			color: var(--text-body);
		}
		.site-sidebar__social a:hover {
			border-color: var(--border-accent);
			color: var(--aqua);
		}
		.site-sidebar__social svg { inline-size: 1.25rem; block-size: 1.25rem; }
		.site-frame__content {
			min-inline-size: 0;
		}
		.site-main {
			position: relative;
			isolation: isolate;
			min-block-size: calc(100svh - var(--shell-header-height));
			padding: 0;
			background:
				radial-gradient(ellipse 75% 55% at 98% 5%, var(--page-glow-blue), transparent 88%),
				radial-gradient(ellipse 65% 45% at 8% 95%, var(--page-glow-teal), transparent 90%),
				radial-gradient(ellipse 45% 30% at 92% 42%, var(--page-glow-aqua), transparent 95%),
				linear-gradient(125deg, var(--surface-page), color-mix(in oklch, var(--surface-page) 74%, var(--primary)));
		}
		.site-main > :global(.section) {
			position: relative;
			z-index: 1;
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

			.site-footer {
				flex-direction: column;
				padding-inline: var(--space-m);
			}
		}
	}
</style>
