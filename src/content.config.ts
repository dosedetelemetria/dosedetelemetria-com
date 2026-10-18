import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';
import { VALID_TAGS } from './data/tag-data';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) => z.object({
    title: z.string().trim().min(1),
    seoTitle: z.string().trim().min(1).max(60).optional(),
    slug: z.string(),
    description: z.string().max(125),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    author: z.enum(['juraci', 'carla']),
    sourceUrl: z.url().regex(/^https:\/\/telemetrydrops\.com\/blog\/[a-z0-9-]+\/$/).optional(),
    tldr: z.string().trim().min(1).optional(),
    keyTakeaways: z.array(z.string().trim().min(1)).min(1).optional(),
    tags: z.array(z.enum(VALID_TAGS)).min(1),
    heroImage: image(),
    heroImageAlt: z.string().trim().min(1),
    faqEntries: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) })).optional(),
    historicalNote: z.string().optional(),
  }),
});

export const collections = { blog };
