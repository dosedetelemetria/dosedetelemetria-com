# Website alignment

Telemetry Drops and Dose de Telemetria use equivalent website implementations
with separate repositories, content inventories and deployments. Common source
files are identical copies, listed in `scripts/site-alignment.json`. There is no
published UI package, cross-checkout import, or dependency on the other checkout
at build time. A package or repository consolidation remains a separate decision.

## Common implementation and local ownership

| Surface | Alignment | Site-owned differences |
| --- | --- | --- |
| Foundations and controls | Same global CSS, typography, spacing, surfaces, focus, reduced motion, React controls and button variants | `src/styles/brand.css`: accent, readable link/focus color, primary foreground/hover and legacy brand aliases |
| Navigation and footer | Same markup, menu breakpoint, keyboard loop, Escape, body scroll lock, active-link state and footer hierarchy | `src/data/site.mjs`: brand, language, destinations, contact and footer copy; course links use the local catalog |
| Search metadata | Same canonical normalization, title budget, alternates, social tags and identity graph | Local SEO data, language, domain, organization and dedicated social-card catalog |
| Home | Same shell, headings, product cards, testimonials, video and FAQ components | Localized editorial sections, instructor anchor/profile, media, course data and testimonials |
| Course catalog | Identical route template, cards, scoped comparison headers, catalog prices and state, testimonials and FAQs | `catalogCopy`, course catalog, metadata and FAQ answers |
| Course details | Identical route template and offer component, price/discount/closed state, waitlist links, features, curriculum and FAQs | `courseCopy`, course facts, instructor and catalog-backed schema/currency |
| Waitlist | Same labels, unique control IDs, native POST, disabled pre-hydration submit, field autocomplete, status/error presentation and submission flow | Public Supabase client and notification function configuration; `waitlist-analytics.ts` preserves each site's existing tracking policy |
| Blog discovery | Same featured/recent/archive template, tag filtering, result count, headings and progressive fallback to topic links | Article inventory, taxonomy, publication dates, locale and translated labels |
| Article cards | Same three visual variants, loading priorities and responsive sizing | Existing public WebP pairs or local Astro image metadata; the card accepts both inputs |
| Article reading | Same breadcrumbs, author bio, TOC, code-copy behavior and export handling | Article layout/content contracts: English tutorials support summaries, takeaways and series; Portuguese historical articles retain dates, bodies, images and legacy fragments |
| FAQ | Same native disclosure and visible-answer/schema contract | Questions and answers generated from each site's real catalog and available resources |
| Worker and exports | Same preview-image handling and HTML-to-Markdown builder; production canonical identities remain stable | Legacy blog-host redirects and localized missing-page responses remain site-specific |
| Analytics | Common layout with explicit head/body integration boundaries | Drops retains its analytics; Dose does not acquire Drops tracking configuration |
| Legal and resources | Common shell and controls | Legal texts, available resource pages, images, social accounts, backend settings and enrollment destinations remain local |

Course availability is independent of visual emphasis. A highlighted card opens
course details; it must not enable enrollment. A completion certificate is not
CNCF OTCA certification. Existing English resources remain labelled as English
when linked from Dose; alignment does not publish translated copies automatically.

## Compare implementations

With both checkouts available, run from either website:

```sh
bun run compare:site /absolute/path/to/the/other/website
```

The command fails on changed or missing common files. It does not fetch GitHub,
copy files, or silently normalize away differences. Brand/copy files and local
adapters are excluded intentionally. The manifest compares itself too, so the
common-file inventory must agree. Run comparison after applying a common change
to both repositories; review the corresponding pair of diffs together.

Each site's ordinary `test:seo` also runs `scripts/alignment.test.mjs`, checking
catalog links and availability, comparison headers, form labels/initial state,
FAQ/schema agreement and preview-image URL boundaries. These local checks run in
CI; cross-repository source comparison requires both checkouts and is a separate
check. It is not an automatic package-update mechanism.

Complete lint, type checking, build and SEO checks in both repositories. Compare
rendered home, catalog, course, blog and article pages in English/orange and
Portuguese/yellow, including mobile navigation, keyboard states and direct
`#waitlist` links. Verify the Worker locally or in its branch preview for HTML,
negotiated/direct Markdown, `Vary: Accept`, image origin rewriting, redirects and
404s. A static Astro or Netlify preview does not execute the Cloudflare Worker.

Use `DESIGN.md` for the current app reference. Repository-specific lockfiles,
content schemas and deployment settings remain separately validated; identical
component source does not establish identical dependency resolution, field
performance, actual form delivery or legal equivalence.
