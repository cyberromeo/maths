import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

async function addMediumAttribute(collectionId, collectionName) {
    try {
        await databases.createStringAttribute(
            DATABASE_ID,
            collectionId,
            'medium',    // key
            10,          // size
            false,       // required
            'english',   // default
            false        // array
        );
        console.log(`✅ Added "medium" attribute to ${collectionName} collection`);
    } catch (error) {
        if (error.message?.includes('already exists') || error.code === 409) {
            console.log(`⚠️  "medium" attribute already exists in ${collectionName}`);
        } else {
            console.error(`❌ Failed to add "medium" to ${collectionName}:`, error.message);
        }
    }
}

async function main() {
    console.log('Adding "medium" attribute to Appwrite collections...\n');

    await addMediumAttribute(
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS,
        'Users'
    );

    await addMediumAttribute(
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_CHAPTERS,
        'Chapters'
    );

    console.log('\nDone! Attributes may take a moment to become available.');
    console.log('Check your Appwrite console to verify.');
}

main();
