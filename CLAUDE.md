# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Package Manager**: Use `bun` instead of `npm` for all package operations.

```bash
# Development server (auto-reloading with instant preview)
bun run dev

# Build for production
bun run build

# Build for development environment
bun run build:dev

# Preview production build locally
bun run preview

# Lint the codebase
bun run lint

# Type check the codebase
bun run type-check

# Install packages
bun add <package-name>

# Install dev dependencies
bun add -D <package-name>
```

## Testing Standards

**Test Co-location**: Tests are placed next to their subjects (not in `__tests__` directories)
- `src/components/SEO.astro` → `src/components/SEO.test.ts`
- `src/data/seo-data.ts` → `src/data/seo-data.test.ts`

**Test Strategy**: Focus on business logic and value, avoid implementation details
- Use real data and actual business flows
- Test user-facing functionality and SEO requirements
- Avoid mocking external libraries when possible

## Architecture Overview

### Technology Stack
- **Frontend**: Astro + React 19 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (database, auth, edge functions)
- **State Management**: TanStack Query for server state (when using React islands)
- **Deployment**: Netlify with static site generation

### Project Structure

**Core Application**:
- `src/pages/` - File-based routing with Astro pages
- `src/layouts/` - Shared layout components
- `src/components/` - Astro and React components

**Data Layer**:
- `src/data/product-data.ts` - Product catalog with courses, features, curriculum
- `src/data/testimonial-data.ts` - Customer testimonials linked to products
- `src/integrations/supabase/` - Supabase client and type definitions

**Component Architecture**:
- `src/components/ui/` - shadcn/ui primitive components (React)
- `src/components/` - Application-specific components (Astro and React)
- `src/lib/utils.ts` - Utility functions (primarily `cn` for className merging)

### Key Business Logic

**Product System**:
- Two main products: "OTel Specialization" (€1,297) and "OTel Track" (€597)
- Products have slugs (`otel-specialization`, `otel-track`), features, detailed curriculum, and availability status
- Product routing: `/products/[slug]` with dynamic product detail pages

**Lead Capture**:
- Waitlist system for unavailable products via `LeadCaptureForm`
- Data stored in Supabase `waitlist` table
- Email notifications sent via Supabase Edge Functions

**Testimonial System**:
- Customer testimonials linked to specific products via `productIds` array
- Helper functions for getting product-specific or random testimonials

### Routing Structure
- `/` - Homepage with hero, features, testimonials
- `/products/` - Product catalog with comparison table
- `/products/[slug]/` - Individual product detail pages
- `/privacy-policy/`, `/terms-of-use/`, `/imprint/` - Legal pages
- Astro handles static site generation with dynamic routes

### Key Integration Points

**Supabase Configuration**:
- Project ID: `gqslgkgqolvrlfbmpbgu`
- Edge function: `send-waitlist-notification` for email handling
- Tables: `waitlist` for lead capture

**Content Management**:
- All product content, pricing, and curriculum managed in TypeScript data files
- Testimonials include avatar URLs pointing to `/testimonials/` directory
- Company contact: `contact@telemetrydrops.com`

### Development Notes

**Styling System**:
- Uses Tailwind with custom color palette (`telemetria-orange`, `telemetria-dark`, etc.)
- Component variants managed via `class-variance-authority`
- Responsive design with mobile-first approach
- Custom animations: `pulse-subtle`, `fade-in`, `fade-in-right`, `line-expand`

**State Management**:
- TanStack Query for server state (Supabase interactions) in React islands
- Local component state for forms and UI interactions
- Toast notifications via shadcn/ui Sonner integration

**Type Safety**:
- Comprehensive TypeScript interfaces for products, testimonials, and forms
- Supabase types auto-generated in `src/integrations/supabase/types.ts`

**Astro-specific Notes**:
- Use Astro components for static content and layouts
- Use React components for interactive elements (forms, dynamic UI)
- Leverage Astro's partial hydration for optimal performance
- Client directives: `client:load`, `client:idle`, `client:visible` for React islands

### CI/CD Pipeline

**GitHub Actions** (`.github/workflows/ci.yml`):
- **Main Job**: Lint, type-check, and build on every push/PR to main
- **SEO Validation Job**: Validates SEO files (robots.txt, sitemap.xml) and runs SEO-specific tests
- **Uses Bun**: All package management and script execution uses Bun
- **Automated Checks**: Ensures code quality and SEO implementation integrity