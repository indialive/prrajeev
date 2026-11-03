<script lang="ts">
	import Section from '$lib/components/Section.svelte';
	import Container from '$lib/components/Container.svelte';
	import type { ContactValues } from '$lib/server/contact';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let {
		data,
		form
	}: {
		data: PageData;
		form: {
			success?: boolean;
			notice?: string;
			values?: ContactValues;
			errors?: Partial<Record<keyof ContactValues, string>>;
		} | null;
	} = $props();
	let token = $state('');
	let pending = $state(false);
	let spamError = $state('');
	let widget = $state<HTMLDivElement>();
	let widgetId: string | undefined;
	type Turnstile = {
		render: (element: HTMLElement, options: Record<string, unknown>) => string;
		reset: (id: string) => void;
		remove: (id: string) => void;
	};
	let turnstile: Turnstile | undefined;
	onMount(() => {
		if (!data.contactEnabled) return;
		const script = document.createElement('script');
		script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
		script.async = true;
		script.onload = () => {
			turnstile = (window as typeof window & { turnstile: Turnstile }).turnstile;
			widgetId = turnstile.render(widget!, {
				sitekey: data.turnstileSiteKey,
				action: 'contact',
				size: 'flexible',
				theme: 'dark',
				'response-field': false,
				callback: (value: string) => {
					token = value;
					spamError = '';
				},
				'expired-callback': () => {
					token = '';
				},
				'error-callback': () => {
					token = '';
					spamError = 'Spam protection is unavailable. Please reload or use the email link below.';
				}
			});
		};
		script.onerror = () => {
			spamError = 'Spam protection could not load. Please use the email link below.';
		};
		document.head.appendChild(script);
		return () => {
			script.onload = null;
			script.onerror = null;
			if (widgetId) turnstile?.remove(widgetId);
			script.remove();
		};
	});
</script>

<Section>
	<Container>
		<div class="contact">
			<header class="contact__header">
				<p class="contact__eyebrow">Contact</p>
				<h1>{data.contact.hero_heading || 'Get in touch'}</h1>
				{#if data.contact.intro}<p class="contact__lead">{data.contact.intro}</p>{/if}
			</header>
			<form
				class="contact__form"
				method="POST"
				use:enhance={() => {
					pending = true;
					return async ({ update }) => {
						try {
							await update();
						} finally {
							pending = false;
							token = '';
							if (widgetId) turnstile?.reset(widgetId);
						}
					};
				}}
			>
				<input type="hidden" name="cf-turnstile-response" value={token} />
				<div hidden aria-hidden="true">
					<label for="contact-website">Website</label><input
						id="contact-website"
						name="website"
						tabindex="-1"
						autocomplete="off"
					/>
				</div>
				{#if form?.notice}<p role={form.success ? 'status' : 'alert'}>{form.notice}</p>{/if}
				<h2>Send a message</h2>
				{#if data.contact.form_intro}<p>{data.contact.form_intro}</p>{/if}
				<div class="contact__identity">
					<div class="contact__field">
						<label for="contact-name">Name</label>
						<input
							id="contact-name"
							name="name"
							autocomplete="name"
							placeholder="Your name"
							required
							maxlength="100"
							value={form?.values?.name || ''}
							aria-invalid={Boolean(form?.errors?.name)}
							aria-describedby={form?.errors?.name ? 'name-error' : undefined}
						/>
						{#if form?.errors?.name}<p id="name-error">{form.errors.name}</p>{/if}
					</div>
					<div class="contact__field">
						<label for="contact-email">Email</label>
						<input
							id="contact-email"
							name="email"
							type="email"
							autocomplete="email"
							placeholder="you@example.com"
							required
							maxlength="254"
							value={form?.values?.email || ''}
							aria-invalid={Boolean(form?.errors?.email)}
							aria-describedby={form?.errors?.email ? 'email-error' : undefined}
						/>
						{#if form?.errors?.email}<p id="email-error">{form.errors.email}</p>{/if}
					</div>
				</div>
				<div class="contact__field">
					<label for="contact-topic">Enquiry type</label>
					<select
						id="contact-topic"
						name="topic"
						required
						value={form?.values?.topic || ''}
						aria-invalid={Boolean(form?.errors?.topic)}
						aria-describedby={form?.errors?.topic ? 'topic-error' : undefined}
					>
						<option value="" disabled>Choose a topic</option>
						<option value="Mentorship">Mentorship</option>
						<option value="Technical consultation">Technical consultation</option>
						<option value="Other">Something else</option>
					</select>
					{#if form?.errors?.topic}<p id="topic-error">{form.errors.topic}</p>{/if}
				</div>
				<div class="contact__field">
					<label for="contact-message">Message</label>
					<textarea
						id="contact-message"
						name="message"
						rows="5"
						placeholder="What can I help you with?"
						required
						minlength="10"
						maxlength="5000"
						value={form?.values?.message || ''}
						aria-invalid={Boolean(form?.errors?.message)}
						aria-describedby={form?.errors?.message ? 'message-error' : undefined}></textarea>
					{#if form?.errors?.message}<p id="message-error">{form.errors.message}</p>{/if}
				</div>
				{#if data.contactEnabled}<div bind:this={widget}></div>
					{#if spamError}<p role="alert" class="contact__note">{spamError}</p>{/if}
					<noscript
						><p>Enable JavaScript for spam protection, or use the email link below.</p></noscript
					>{/if}
				<button type="submit" disabled={!data.contactEnabled || pending || !token}
					>{pending ? 'Sending...' : 'Send message'} <span aria-hidden="true">&#8599;</span></button
				>
				{#if data.contact.response_note}<p class="contact__note">
						{data.contact.response_note}
					</p>{/if}
				{#if !data.contactEnabled}<p class="contact__note">
						The contact form is temporarily unavailable. Please use a contact link below.
					</p>{/if}
			</form>
			<section class="contact__section" aria-labelledby="contact-topics">
				<h2 id="contact-topics">What can we talk about?</h2>
				<div class="contact__topics">
					<a href="/mentorship"
						><strong>Mentorship</strong><span
							>{data.home.mentorship_summary || 'Ask about learning ServiceNow.'}</span
						></a
					>
					<a href="/consultation"
						><strong>Technical consultation</strong><span
							>{data.home.consultation_summary || 'Ask about a technical question.'}</span
						></a
					>
				</div>
			</section>
			<section class="contact__section" aria-labelledby="contact-channels">
				<h2 id="contact-channels">Prefer another channel?</h2>
				<div class="contact__channels">
					{#if data.site.contact_email}<a href={'mailto:' + data.site.contact_email}
							>{data.site.contact_email}</a
						>{/if}
					{#if data.site.linkedin_url}<a
							href={data.site.linkedin_url}
							target="_blank"
							rel="noopener noreferrer">LinkedIn</a
						>{/if}
					{#if data.site.whatsapp_url}<a
							href={data.site.whatsapp_url}
							target="_blank"
							rel="noopener noreferrer">WhatsApp</a
						>{/if}
				</div>
			</section>
		</div>
	</Container>
</Section>

<style>
	@layer components {
		.contact {
			display: grid;
			gap: var(--section-space-s);
		}
		.contact__header {
			display: grid;
			gap: var(--space-s);
		}
		.contact__eyebrow {
			color: var(--text-muted);
			font-size: var(--font-size-meta);
			letter-spacing: 0.08em;
			text-transform: uppercase;
		}
		.contact__lead {
			max-inline-size: var(--text-width);
			font-size: var(--font-size-lead);
			line-height: 1.35;
		}
		.contact__form {
			display: grid;
			gap: var(--space-m);
			padding: var(--section-divider-padding);
			border: var(--border-width) solid var(--border-default);
			border-radius: var(--radius-m);
			background: var(--surface-raised);
		}
		.contact__form h2,
		.contact__section h2 {
			font-size: var(--h2);
		}
		.contact__identity {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: var(--space-s);
		}
		.contact__field {
			display: grid;
			gap: var(--space-xs);
		}
		.contact__field label {
			color: var(--text-main);
			font-size: var(--font-size-meta);
			font-weight: var(--weight-semibold);
		}
		.contact__field :is(input, select, textarea) {
			inline-size: 100%;
			min-block-size: 3.125rem;
			padding: var(--space-xs) var(--space-s);
			border: var(--border-width) solid var(--border-default);
			border-radius: var(--radius-s);
			background: var(--surface-page);
			color: var(--text-main);
		}
		.contact__field textarea {
			min-block-size: 8rem;
			resize: vertical;
		}
		.contact__form button {
			justify-self: start;
			min-inline-size: 11.875rem;
			min-block-size: 3.25rem;
			padding: var(--space-xs) var(--space-m);
			border: 0;
			border-radius: var(--radius-m);
			background: var(--action-primary-bg);
			color: var(--action-primary-text);
			font-weight: var(--weight-semibold);
			cursor: pointer;
		}
		.contact__form button:hover:not(:disabled) {
			background: var(--action-primary-bg-hover);
		}
		.contact__form button:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
		.contact__note {
			color: var(--text-muted);
			font-size: var(--font-size-meta);
		}
		.contact__section {
			display: grid;
			gap: var(--space-m);
			padding-block-start: var(--section-space-s);
		}
		.contact__topics {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: var(--space-s);
		}
		.contact__topics a {
			display: grid;
			gap: var(--space-xs);
			padding: var(--space-m);
			border: var(--border-width) solid var(--border-default);
			border-radius: var(--radius-m);
			background: var(--surface-raised);
			color: var(--text-body);
			text-decoration: none;
		}
		.contact__topics a:hover {
			border-color: var(--border-accent);
		}
		.contact__topics strong {
			color: var(--text-main);
		}
		.contact__channels {
			display: flex;
			flex-wrap: wrap;
			gap: var(--space-m);
		}
		@media (max-width: 48rem) {
			.contact__identity,
			.contact__topics {
				grid-template-columns: 1fr;
			}
			.contact__form button {
				min-inline-size: 0;
			}
		}
	}
</style>
