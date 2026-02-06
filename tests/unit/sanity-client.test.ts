import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { loadEnvConfig } from '@next/env';
import type { SanityClient } from 'next-sanity';

describe('Sanity Client', () => {
    let client: SanityClient;

    before(async () => {
        // Load env vars before importing the module that uses them
        loadEnvConfig(process.cwd());
        const mod = await import('../../src/lib/sanity/client');
        client = mod.client;
    });

    it('should be defined', () => {
        assert.ok(client, 'Sanity Client should be defined');
    });

    it('should have projectId and dataset configured', () => {
        const config = client.config();
        assert.ok(config.projectId, 'Project ID should be defined');
        assert.ok(config.dataset, 'Dataset should be defined');
    });
});
