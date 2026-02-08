/**
 * Fix Appwrite Permissions
 * Run with: node scripts/fix-permissions.mjs
 */

import { Client, Databases, Permission, Role } from 'node-appwrite';

const ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = '6988cf9b003ca9f28af5';
const API_KEY = 'standard_068f9508c36aeb5933587dc131206911b163ca82c3dedeec1aefe536ecb2cac33b38a8d9c41c10836b36be46d20c23e363129aa09404efac1ff0f3add951657bf0b5d20067f400495786667f6fdf4a080aadbdb2d89626c16fae1bfa5e98c5daee016336969395774aec7be7e70e332b9c875c69a50e287e0f1bbd97426942d3';

const DATABASE_ID = 'maths-db';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

async function fixPermissions() {
    console.log('🔧 Fixing collection permissions...\n');

    const collections = ['users', 'chapters', 'questions', 'exams', 'results'];

    for (const collectionId of collections) {
        try {
            await databases.updateCollection(
                DATABASE_ID,
                collectionId,
                collectionId.charAt(0).toUpperCase() + collectionId.slice(1),
                [
                    Permission.read(Role.any()),
                    Permission.create(Role.any()),
                    Permission.update(Role.any()),
                    Permission.delete(Role.any()),
                ],
                false // documentSecurity
            );
            console.log(`✓ Fixed permissions for ${collectionId}`);
        } catch (error) {
            console.error(`✗ Failed to fix ${collectionId}:`, error.message);
        }
    }

    console.log('\n✅ Done!');
}

fixPermissions();
