# prrajeev.com — Master Engineering & Development Instructions

## 1. Project

Build prrajeev.com, the professional portfolio, ServiceNow mentorship and technical consultation website of P R Rajeev, a senior ServiceNow developer.

The website has two objectives:

1. Establish professional credibility through technical expertise, enterprise experience, case studies and articles.
2. Enable ServiceNow job aspirants and working professionals to discover and request mentorship, training and technical consultation.

The website must communicate the credibility of an experienced enterprise technology professional, not resemble a generic coaching institute.

Prioritise clarity, professionalism, usability, performance and maintainability.

Do not invent Rajeev's qualifications, achievements, experience, project results or testimonials.

## 2. Existing Technology Stack

Project location: `D:\prrajeev`

- Frontend: SvelteKit with TypeScript
- CMS: Headless WordPress hosted on Hostinger
- Content delivery: WordPress REST API
- Frontend hosting: Cloudflare Pages
- Package manager: npm
- CSS: Modern vanilla CSS
- Design tool: Pen (pen.dev)
- Development: VS Code with Codex
- Version control: Git and private GitHub repository

The SvelteKit project already exists.

Inspect the current configuration before making changes. Do not recreate the project or reinstall existing dependencies.

Do not introduce Laravel, Tailwind, another frontend framework or unnecessary packages.

## 3. Core Engineering Philosophy

Follow these principles throughout development:

- DRY: eliminate meaningful duplication.
- KISS: prefer the simplest maintainable solution.
- Reuse existing components before creating new ones.
- Prefer composition over excessive configuration.
- Avoid premature abstractions.
- Use native SvelteKit and browser capabilities.
- Minimise client-side JavaScript.
- Use semantic HTML and accessible markup.
- Separate content, presentation and data access.
- Prioritise SEO, Core Web Vitals and maintainability.

Do not create files, folders, components or dependencies without a clear purpose.

Do not rewrite working code unnecessarily.

## 4. CSS Architecture

Use modern vanilla CSS with a small, deliberate architecture.

```text
src/lib/styles/
├── tokens.css
├── global.css
├── layout.css
└── utilities.css
```

Use cascade layers consistently:

```css
@layer tokens, reset, global, layouts, components, utilities;
```

Ensure imported styles and Svelte component styles follow the intended cascade order.

### Design tokens

`tokens.css` is the single source of truth for design values in the codebase.

Use CSS custom properties for:

- Brand and neutral colours
- Semantic text and surface colours
- Typography
- Spacing
- Section spacing
- Content widths
- Gutters
- Borders and radii
- Shadows
- Transitions
- Component-level design values

Use OKLCH as the primary colour notation.

Use `color-mix()`, `calc()`, `clamp()`, `min()` and `max()` where appropriate.

Avoid hardcoded design values when a suitable token exists.

Maintain a distinction between primitive tokens, semantic tokens and component tokens.

Do not import an unnecessarily large token inventory. Introduce tokens as the project requires them.

### CSS conventions

- Use logical properties.
- Use BEM for component structure.
- Use data attributes for visual variants and states.
- Prefer low-specificity selectors.
- Avoid unnecessary nesting.
- Avoid `!important`.
- Avoid duplicated declarations.
- Keep component-specific styles scoped where appropriate.

## 5. Typography

Use a calculated fluid typography system.

Define:

```css
--h1
--h2
--h3
--h4
--h5
--h6
```

Use `clamp()` to establish fluid sizes between deliberate minimum and maximum values.

Define separate tokens for body, lead, small and metadata text.

Use consistent line heights, tracking and readable text widths.

Keep visual heading sizes independent of semantic HTML heading levels.

Preserve the browser's default root font size. Do not use a 62.5% root font-size reset.

## 6. Section and Container Framework

Create reusable Section and Container primitives.

Section owns:

- `padding-block`
- `padding-inline`
- Horizontal gutter
- Section background or theme
- Vertical spacing variants

Container owns:

- `width: 100%`
- `max-width: var(--content-width)`
- `margin-inline: auto`

The container must not introduce duplicate horizontal gutters.

Use `--content-width` as the actual default maximum content width.

Support narrow, default and wide container variants.

Use the same alignment system throughout the header, hero, content sections and footer.

Avoid arbitrary section-specific padding values.

## 7. Responsive Design

Build mobile-first.

Prefer intrinsic layouts using:

- CSS Grid
- Flexbox
- `auto-fit`
- `minmax()`
- `clamp()`
- `min()`
- `max()`

Use container queries for component responsiveness.

Use viewport media queries where behaviour genuinely depends on viewport dimensions, such as primary navigation.

Avoid maintaining separate mobile and desktop implementations when one fluid layout is sufficient.

## 8. Reusable Component Framework

Use Svelte 5 conventions compatible with the installed version.

Use typed props and snippets where appropriate.

Build a small reusable component framework.

Examples:

```text
Card.svelte
Button.svelte
Section.svelte
Container.svelte
Badge.svelte
```

Do not create separate components solely because their visual appearance differs.

Use data attributes to control variants.

Example:

```svelte
<Card variant="featured" size="large">...</Card>
```

Rendered HTML:

```html
<article class="card" data-variant="featured" data-size="large">...</article>
```

Use BEM for internal structure:

```css
.card
.card__header
.card__title
.card__body
.card__footer
```

Use data attributes for modifiers:

```css
.card[data-variant="featured"]
.card[data-size="large"]
```

Establish base component styles once.

Prefer changing component-local CSS custom properties rather than repeating complete declarations for each variant.

Expose only meaningful variants, sizes, themes and states.

Do not turn components into mini page builders with excessive props.

Create specialised components when content structure, accessibility or behaviour genuinely differs.

## 9. Pen Design-to-Code Workflow

Pen (pen.dev) is our visual design and page-building environment.

The workflow is:

```text
Design system
     ↓
Pen design
     ↓
Design inspection
     ↓
Token mapping
     ↓
Svelte implementation
     ↓
Visual verification
```

### Design system synchronisation

Pen designs must follow the same design system as `tokens.css`.

Map colours, typography, spacing, gutters, container widths, radii and component variants to existing tokens.

Treat `tokens.css` as the authoritative code implementation of the design system.

If an approved design introduces a genuinely new design value, establish or update the appropriate token rather than scattering arbitrary values throughout the codebase.

Do not independently redesign approved Pen layouts.

### Pixel-accurate implementation

Treat approved Pen designs as the visual specification.

Reproduce their:

- Layout
- Alignment
- Typography
- Spacing
- Colours
- Component dimensions
- Visual hierarchy
- Responsive behaviour

Compare the rendered implementation with Pen at matching viewport dimensions.

Correct visual differences systematically.

Do not sacrifice responsive behaviour, semantic HTML or accessibility to achieve pixel accuracy at one viewport.

### Component mapping

Identify repeated patterns in Pen and map them to existing Svelte components.

Use data attributes for variants.

Do not generate duplicate components or styles for visually similar elements.

Do not assume a Pen-generated code export is production-ready. Inspect, simplify and adapt it to the established architecture.

## 10. WordPress Integration

WordPress manages content.

SvelteKit manages the public presentation.

WordPress should support:

- Professional profile
- Expertise
- Projects and case studies
- Articles
- Testimonials
- Mentorship information
- Consultation information
- Availability
- Global site settings

Centralise WordPress REST API communication in a dedicated API layer.

Use typed data structures.

Do not fetch WordPress content directly inside visual components.

Avoid unnecessary custom endpoints when standard WordPress REST functionality is sufficient.

Do not expose WordPress credentials or privileged API access to the browser.

Keep WordPress content models practical for Rajeev to maintain independently.

## 11. Rendering, Performance and SEO

Prefer prerendering for public editorial pages where appropriate.

Use Cloudflare for efficient static content delivery.

For prerendered WordPress content, establish a reliable publishing-to-rebuild workflow so changes appear on the public website.

Avoid runtime API requests when content can be resolved during the build.

Use runtime fetching only when genuinely necessary.

Minimise:

- Client-side JavaScript
- External dependencies
- Duplicate API requests
- Unnecessary hydration
- Unnecessary animation
- Excessive font weights

Use responsive images with appropriate dimensions, `srcset`, `sizes` and loading behaviour.

Maintain semantic HTML, accessible navigation, correct heading hierarchy and page-specific metadata.

Use reusable SvelteKit patterns for SEO.

Do not install packages for functionality already available through SvelteKit or native browser APIs.

## 12. Development Workflow

Work incrementally.

Before implementing a feature:

1. Inspect the existing code.
2. Identify reusable components and tokens.
3. Check whether the requested functionality already exists.
4. Implement the smallest complete solution.
5. Run relevant checks.
6. Report changes and remaining issues.

Use Git commits for meaningful working milestones.

Do not modify unrelated files.

Do not introduce dependencies without explaining their necessity.

Do not silently change established architectural decisions.

If a requested feature conflicts with these instructions, explain the conflict before implementing it.

Keep responses concise and technical. Avoid lengthy explanations when a short implementation report is sufficient.
