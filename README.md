# prrajeev.com

SvelteKit 5 + TypeScript frontend, public WordPress/ACF REST content, Cloudflare Pages hosting. Design tokens in `src/lib/styles/tokens.css` are authoritative.

## Development and verification

Existing dependencies are managed with npm. Configure `.env` from `.env.example` without committing secrets.

- `npm run dev`: development server.
- `npm run check`: Cloudflare binding and Svelte/TypeScript checks.
- `npm test`: cache and contact regression tests with mocked upstream services; no email is sent.
- `npm run build`: production build; output `.svelte-kit/cloudflare`.
- `npm run preview`: local Cloudflare runtime at port 4173.

GitHub `main` deploys through Cloudflare Pages. This change does not configure account-level domains or email credentials.

## WordPress freshness and reliability

`src/lib/server/wordpress.ts` centralizes public CMS access. `WORDPRESS_API_URL` overrides the production default `https://cms.prrajeev.com/wp-json/wp/v2`. Development without that setting supports the existing homepage preview.

Public JSON uses the Cloudflare Cache API:

- Successful responses stay fresh for five minutes. Changes become visible on the next successful request after that window; no rebuild is required.
- After five minutes, requests refresh content. On upstream failure, previously successful content may be used until it is one hour old, measured from the successful fetch. Failures never extend retention.
- Each refresh has an eight-second total deadline. Cold requests retry a transient network/429/5xx failure once, sharing that deadline.
- Concurrent requests for the same CMS URL share one fetch within a worker instance. This is not a global lock.
- Empty collections are cached too, so unpublished detail pages become 404 after refresh. Failed responses and malformed JSON are not cached.
- Optional image API failures omit the image. Unavailable essential content returns a readable 503; missing pages return 404.
- Development bypasses caching. HTML and contact submissions do not use this JSON cache. Error responses and non-GET responses are `no-store`.

Cloudflare caches are local to each data center and may be evicted; cold locations still require the CMS. This policy reduces CMS dependence but does not guarantee availability during a prolonged outage. [Cloudflare Cache API documentation](https://developers.cloudflare.com/workers/runtime-apis/cache/).

For urgent content corrections, a full Cloudflare cache purge can clear entries; this also clears other zone cache content. A normal deployment does not invalidate the CMS cache. Do not use this workflow for content requiring immediate removal guarantees.

The audit observed actual upstream WordPress 500s under concurrent requests and a timeout. Inspect Hostinger PHP/WordPress logs and resource limits at matching timestamps to establish the underlying cause. Never expose logs or credentials publicly.

## SEO

`Seo.svelte` supplies one title and description, canonical URLs on `https://prrajeev.com`, Open Graph/Twitter previews using existing CMS images, and escaped JSON-LD. Schemas cover Person, WebSite, pages, articles and courses without invented credentials, prices or ratings.

`/sitemap.xml` paginates published WordPress pages, articles and courses. Internal site settings, the design-system route and the default hello-world post are excluded. `robots.txt` links the sitemap. Error pages, preview hosts and the design-system route receive `noindex`.

`www.prrajeev.com` receives a 308 redirect in the application, preserving path and query, when traffic reaches Pages. Current live checks found a 301 from Hostinger/WordPress instead. Configure a deliberate Cloudflare redirect and verify the `www` DNS/custom-domain/TLS setup; the application hook cannot change DNS or intercept requests routed elsewhere.

## Contact configuration and delivery verification

The form uses a SvelteKit server action, field validation, a honeypot, single-use Turnstile tokens verified against the request hostname and `contact` action, and the Resend HTTP API. No additional packages are required. Email content is plain text; the visitor's email is used only as Reply-To. SvelteKit's default origin checks remain enabled.

Set these server-side values in Cloudflare Pages production configuration:

- `RESEND_API_KEY`: email delivery API key.
- `CONTACT_FROM`: sender address on a domain verified with Resend.
- `CONTACT_TO`: explicitly chosen recipient. The CMS currently displays `ranjith@indialive.com`; confirm whether this is the intended recipient.
- `TURNSTILE_SITE_KEY`: public site key, exposed only to the form.
- `TURNSTILE_SECRET_KEY`: private verification key. Allow the production hostname in the widget configuration.

Do not paste secrets into Git or chat. Sender DNS verification should preserve existing MX/mail records. The form stays disabled until all configuration is present; existing email/social links remain available.

After configuration and deployment:

1. Submit a clearly labelled test enquiry from the live contact page.
2. Confirm the provider accepts the email, reports delivery, and the recipient actually receives it (including spam folder checks).
3. Verify Reply-To and mobile Turnstile behavior; invalid, expired and reused tokens must fail.

Provider acceptance is not proof of inbox delivery. No real delivery has been verified yet. There is no submission database or automatic retry of uncertain email delivery, avoiding duplicate enquiries after timeouts.

## Remaining launch checks

- Resolve placeholder profile/service/footer/article content in WordPress and confirm LinkedIn, contact recipient, course descriptions and Teams details.
- Verify the deliberate Cloudflare `www` redirect, path/query preservation and TLS.
- Configure email/Turnstile and complete real inbox delivery verification.
- Inspect production CMS errors and test cache freshness/failure behavior after deployment.
- Review social cards with real crawlers, submit the sitemap to Search Console, and assess field Core Web Vitals after launch.
- Public content remains runtime-rendered. Prerendering should be introduced only with a reliable WordPress publish-to-rebuild workflow; no unconfigured build hook is assumed.

## Verification snapshot (26 September 2026)

- `npm run check` passed with no errors or warnings; production build passed.
- 21 regression tests cover cache refresh/failure/deduplication/retries, contact validation/body size/provider failures, and metadata escaping.
- All nine current sitemap routes returned 200 locally with one title, canonical URLs and valid JSON-LD; unknown page/article/course paths returned 404 with no-store.
- All nine routes were checked in Edge at 320, 390 and 1440 pixels: no horizontal overflow, failed images, unnamed visible controls or JavaScript exceptions. Escape restored menu-button focus; navigation remained usable without JavaScript. Course inquiry-bar bounds stayed within the content area. These are targeted checks, not a complete accessibility certification.
- Disabled contact submissions returned a 503 failure for native HTML and enhanced JSON forms. Enhanced JSON transport uses HTTP 200 with the action failure status in its payload.
- Live root returned 200. Live www returned a Hostinger/WordPress 301 with path/query preserved (and a trailing slash added); the local application returned a 308 preserving the exact path/query.
- ESLint reports 36 errors, all reproduced from the existing HEAD source in the affected files; this change adds none. Existing findings concern navigation resolve(), trusted CMS HTML and unkeyed course loops. New server/SEO/test code passes targeted lint.
- Email inbox delivery, real Turnstile behavior, production cache behavior and account-level Cloudflare configuration remain pending.
