import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

// Shared shape for a written entry (a note or a project write-up).
const entrySchema = z.object({
	title: z.string(),
	description: z.string().optional(),
	pubDate: z.coerce.date(),
	draft: z.boolean().optional(),
});

// Personal writing & learning. Each .md file in src/content/notes/ becomes
// a page at /notes/<filename>.
const notes = defineCollection({
	loader: glob({ base: './src/content/notes', pattern: '**/*.md' }),
	schema: entrySchema,
});

// Project write-ups. Each .md file in src/content/projects/ becomes a page
// at /projects/<filename>.
const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
	schema: entrySchema,
});

export const collections = { notes, projects };
