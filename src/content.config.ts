import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: z.object({
    name: z.string(),
    order: z.number(),
    summary: z.string(),
    whoFor: z.array(z.string()),
    outcomes: z.array(z.string()),
    included: z.array(z.string()),
    proofPointClient: z.string(),
    proofPointQuote: z.string(),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/testimonials" }),
  schema: z.object({
    client: z.string(),
    segment: z.enum(["Aged Care", "Community Health", "General Business"]),
    tenure: z.string(),
    quote: z.string(),
    outcome: z.string(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    summary: z.string(),
  }),
});

export const collections = { services, testimonials, blog };
