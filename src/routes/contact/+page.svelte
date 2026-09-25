<script lang="ts">
	import Section from '$lib/components/Section.svelte';
	import Container from '$lib/components/Container.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let name = $state('');
	let email = $state('');
	let topic = $state('');
	let message = $state('');

	function sendEmail(event: SubmitEvent) {
		event.preventDefault();
		const address = data.site.contact_email;
		if (!address) return;
		const subject = topic ? topic + ' inquiry from ' + name : 'Website inquiry from ' + name;
		const body = 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message;
		window.location.href = 'mailto:' + address + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
	}
</script>

<svelte:head>
	<title>Contact | P R Rajeev</title>
	<meta name="description" content={data.contact.intro || 'Contact P R Rajeev about mentorship or technical consultation.'} />
</svelte:head>

<Section>
	<Container>
		<div class="contact">
			<header class="contact__header">
				<p class="contact__eyebrow">Contact</p>
				<h1>{data.contact.hero_heading || 'Get in touch'}</h1>
				{#if data.contact.intro}<p class="contact__lead">{data.contact.intro}</p>{/if}
			</header>
			<form class="contact__form" onsubmit={sendEmail}>
				<h2>Send a message</h2>
				{#if data.contact.form_intro}<p>{data.contact.form_intro}</p>{/if}
				<div class="contact__identity">
					<div class="contact__field">
						<label for="contact-name">Name</label>
						<input id="contact-name" name="name" autocomplete="name" placeholder="Your name" required bind:value={name} />
					</div>
					<div class="contact__field">
						<label for="contact-email">Email</label>
						<input id="contact-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required bind:value={email} />
					</div>
				</div>
				<div class="contact__field">
					<label for="contact-topic">Enquiry type</label>
					<select id="contact-topic" name="topic" required bind:value={topic}>
						<option value="" disabled>Choose a topic</option>
						<option value="Mentorship">Mentorship</option>
						<option value="Technical consultation">Technical consultation</option>
						<option value="Other">Something else</option>
					</select>
				</div>
				<div class="contact__field">
					<label for="contact-message">Message</label>
					<textarea id="contact-message" name="message" rows="5" placeholder="What can I help you with?" required bind:value={message}></textarea>
				</div>
				<button type="submit" disabled={!data.site.contact_email}>Open email app <span aria-hidden="true">&#8599;</span></button>
				{#if data.contact.response_note}<p class="contact__note">{data.contact.response_note}</p>{/if}
				{#if !data.site.contact_email}<p class="contact__note">The contact form is temporarily unavailable.</p>{/if}
			</form>
			<section class="contact__section" aria-labelledby="contact-topics">
				<h2 id="contact-topics">What can we talk about?</h2>
				<div class="contact__topics">
					<a href="/mentorship"><strong>Mentorship</strong><span>{data.home.mentorship_summary || 'Ask about learning ServiceNow.'}</span></a>
					<a href="/consultation"><strong>Technical consultation</strong><span>{data.home.consultation_summary || 'Ask about a technical question.'}</span></a>
				</div>
			</section>
			<section class="contact__section" aria-labelledby="contact-channels">
				<h2 id="contact-channels">Prefer another channel?</h2>
				<div class="contact__channels">
					{#if data.site.contact_email}<a href={'mailto:' + data.site.contact_email}>{data.site.contact_email}</a>{/if}
					{#if data.site.linkedin_url}<a href={data.site.linkedin_url} target="_blank" rel="noopener noreferrer">LinkedIn</a>{/if}
					{#if data.site.whatsapp_url}<a href={data.site.whatsapp_url} target="_blank" rel="noopener noreferrer">WhatsApp</a>{/if}
				</div>
			</section>
		</div>
	</Container>
</Section>

<style>
	@layer components {
		.contact { display: grid; gap: var(--section-space-s); }
		.contact__header { display: grid; gap: var(--space-s); }
		.contact__eyebrow { color: var(--text-muted); font-size: var(--font-size-meta); letter-spacing: 0.08em; text-transform: uppercase; }
		.contact__lead { max-inline-size: var(--text-width); font-size: var(--font-size-lead); line-height: 1.35; }
		.contact__form { display: grid; gap: var(--space-m); padding: var(--section-divider-padding); border: var(--border-width) solid var(--border-default); border-radius: var(--radius-m); background: var(--surface-raised); }
		.contact__form h2, .contact__section h2 { font-size: var(--h2); }
		.contact__identity { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-s); }
		.contact__field { display: grid; gap: var(--space-xs); }
		.contact__field label { color: var(--text-main); font-size: var(--font-size-meta); font-weight: var(--weight-semibold); }
		.contact__field :is(input, select, textarea) { inline-size: 100%; min-block-size: 3.125rem; padding: var(--space-xs) var(--space-s); border: var(--border-width) solid var(--border-default); border-radius: var(--radius-s); background: var(--surface-page); color: var(--text-main); }
		.contact__field textarea { min-block-size: 8rem; resize: vertical; }
		.contact__form button { justify-self: start; min-inline-size: 11.875rem; min-block-size: 3.25rem; padding: var(--space-xs) var(--space-m); border: 0; border-radius: var(--radius-m); background: var(--action-primary-bg); color: var(--action-primary-text); font-weight: var(--weight-semibold); cursor: pointer; }
		.contact__form button:hover:not(:disabled) { background: var(--action-primary-bg-hover); }
		.contact__form button:disabled { opacity: 0.5; cursor: not-allowed; }
		.contact__note { color: var(--text-muted); font-size: var(--font-size-meta); }
		.contact__section { display: grid; gap: var(--space-m); padding-block-start: var(--section-divider-padding); border-block-start: var(--border-width) solid var(--border-default); }
		.contact__topics { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-s); }
		.contact__topics a { display: grid; gap: var(--space-xs); padding: var(--space-m); border: var(--border-width) solid var(--border-default); border-radius: var(--radius-m); background: var(--surface-raised); color: var(--text-body); text-decoration: none; }
		.contact__topics a:hover { border-color: var(--border-accent); }
		.contact__topics strong { color: var(--text-main); }
		.contact__channels { display: flex; flex-wrap: wrap; gap: var(--space-m); }
		@media (max-width: 48rem) {
			.contact__identity, .contact__topics { grid-template-columns: 1fr; }
			.contact__form button { min-inline-size: 0; }
		}
	}
</style>