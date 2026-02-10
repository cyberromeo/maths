import { Client, Databases, Query } from 'node-appwrite';
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
const CHAPTERS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_CHAPTERS;

async function fixEnglishChapters() {
    console.log('Starting migration to fix English chapters...');
    try {
        // Fetch all chapters (limit 100 for now, should be enough)
        const response = await databases.listDocuments(
            DATABASE_ID,
            CHAPTERS_COLLECTION,
            [Query.limit(100)]
        );

        console.log(`Found ${response.total} chapters.`);

        let updatedCount = 0;
        for (const chapter of response.documents) {
            // Check if medium is missing or not 'tamil' (assuming everything else is english for now)
            // safer check: if it doesn't have medium at all, or if it is null/undefined
            if (!chapter.medium) {
                console.log(`Updating chapter "${chapter.name}" (${chapter.$id}) - missing medium...`);
                await databases.updateDocument(
                    DATABASE_ID,
                    CHAPTERS_COLLECTION,
                    chapter.$id,
                    {
                        medium: 'english'
                    }
                );
                updatedCount++;
            } else {
                console.log(`Skipping chapter "${chapter.name}" (${chapter.$id}) - medium is "${chapter.medium}"`);
            }
        }

        console.log(`Migration complete. Updated ${updatedCount} chapters to 'english'.`);

    } catch (error) {
        console.error('Error during migration:', error);
    }
}

fixEnglishChapters();
