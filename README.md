# TelemetryDrops - Astro Version

Professional OpenTelemetry training courses and educational content, migrated from React to Astro for improved performance and SEO.

## 🚀 Migration Status

**✅ COMPLETED** - Successfully migrated from React to Astro with 100% feature parity:
- All pages and functionality preserved
- Supabase integration working
- Forms and interactive elements functional
- Identical visual appearance maintained

## 🏗️ Architecture

### Tech Stack
- **Framework**: Astro 5.x with React islands
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (database, auth, edge functions)
- **Package Manager**: Bun
- **TypeScript**: Full type safety

### Project Structure

```text
src/
├── components/
│   ├── ui/              # React components (interactive)
│   └── astro/           # Astro components (static)
├── layouts/             # Layout components
│   └── Layout.astro     # Main layout with SEO
├── pages/               # Route pages
│   ├── index.astro      # Homepage
│   ├── products/        # Product pages
│   ├── 404.astro        # Error page
│   └── [legal].astro    # Legal pages
├── data/                # Static data
│   ├── product-data.ts  # Course catalog
│   ├── testimonial-data.ts
│   └── seo-data.ts      # SEO metadata
├── lib/                 # Utilities
└── integrations/        # Supabase client
```

## 🧞 Commands

All commands use **bun** as the package manager:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun install`             | Install dependencies                             |
| `bun run dev`             | Start development server at `localhost:4321`    |
| `bun run build`           | Build production site to `./dist/`              |
| `bun run build:dev`       | Build development version                        |
| `bun run preview`         | Preview production build locally                 |
| `bun run lint`            | Run Astro linting                               |
| `bun run type-check`      | Run TypeScript type checking                    |

## 🌟 Features

### Static Generation + React Islands
- **Performance**: Static HTML with selective JavaScript hydration
- **SEO**: Server-side rendering for better crawlability
- **Interactivity**: React components load only when needed (`client:load`)

### Business Features
- **Product Catalog**: 2 OpenTelemetry courses with detailed information
- **Lead Capture**: Waitlist forms with Supabase integration
- **Testimonials**: Customer feedback with structured data
- **Responsive Design**: Mobile-first with Tailwind CSS

### Technical Features
- **TypeScript**: Full type safety across the codebase
- **SEO Optimization**: Meta tags, structured data (JSON-LD), sitemaps
- **Component Library**: shadcn/ui components for consistent design
- **Form Handling**: React Hook Form with Zod validation

## 🔗 Routes

- `/` - Homepage with hero and product overview
- `/products` - Product catalog and comparison
- `/products/otel-specialization` - Intensive program (waitlist)
- `/products/otel-track` - Self-paced course (available)
- `/privacy-policy`, `/terms-of-use`, `/imprint` - Legal pages

## 🛠️ Development

### Environment Setup
1. Clone the repository
2. Install dependencies: `bun install`
3. Start development server: `bun run dev`
4. Open `http://localhost:4321` in your browser

### Key Components
- **Interactive**: LeadCaptureForm (React with `client:load`)
- **Static**: ProductCard, Testimonial, SectionHeading (Astro)
- **Hybrid**: Navigation with mobile toggle

### Data Management
- Product information in `src/data/product-data.ts`
- Customer testimonials in `src/data/testimonial-data.ts`
- SEO metadata in `src/data/seo-data.ts`

## 🚀 Deployment

The project is ready for deployment on:
- **Netlify** (recommended)
- **Vercel**
- **Static hosting** (GitHub Pages, etc.)

Build command: `bun run build`
Output directory: `dist/`

## 📊 Performance Benefits

Compared to the original React version:
- **Faster initial load** with static HTML
- **Reduced JavaScript bundle** size
- **Better SEO** with server-side rendering
- **Improved Core Web Vitals** scores

---

**TelemetryDrops**: Empowering developers with expert OpenTelemetry education and certification programs.
