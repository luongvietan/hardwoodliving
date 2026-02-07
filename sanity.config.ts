import { defineConfig } from 'sanity';
import { type StructureResolver, structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './src/lib/sanity/schemas';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

// Singleton document types that should only have one instance
const singletonTypes = new Set(['homepage', 'siteSettings']);

// Custom structure for singleton documents
const structure: StructureResolver = (S) =>
    S.list()
        .title('Content')
        .items([
            // Singleton items - show as single document editor
            S.listItem()
                .title('Homepage')
                .id('homepage')
                .child(
                    S.document()
                        .schemaType('homepage')
                        .documentId('homepage')
                ),
            S.listItem()
                .title('Site Settings')
                .id('siteSettings')
                .child(
                    S.document()
                        .schemaType('siteSettings')
                        .documentId('siteSettings')
                ),
            S.divider(),
            // Regular document types - filter out singletons from default list
            ...S.documentTypeListItems().filter(
                (listItem) => !singletonTypes.has(listItem.getId() ?? '')
            ),
        ]);

export default defineConfig({
    name: 'default',
    title: 'Hardwood Living',

    projectId,
    dataset,

    basePath: '/admin',

    plugins: [
        structureTool({ structure }),
        presentationTool({
            previewUrl: {
                origin: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
                previewMode: {
                    enable: '/api/draft-mode/enable',
                },
            },
        }),
        visionTool(),
    ],

    schema: {
        types: schemaTypes,
        // Prevent creation of new singleton documents via "New document" menu
        templates: (templates) =>
            templates.filter(
                ({ schemaType }) => !singletonTypes.has(schemaType)
            ),
    },

    document: {
        // Prevent singletons from being duplicated or deleted
        actions: (input, context) =>
            singletonTypes.has(context.schemaType)
                ? input.filter(
                      ({ action }) =>
                          action &&
                          ['publish', 'discardChanges', 'restore'].includes(action)
                  )
                : input,
    },
});
