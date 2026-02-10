import { Client, Databases, Query } from 'node-appwrite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS;

async function migrateUsers() {
    console.log('Starting migration...');

    try {
        let hasMore = true;
        let cursor = null;
        let updatedCount = 0;

        while (hasMore) {
            const queries = [Query.limit(100)];
            if (cursor) {
                queries.push(Query.cursorAfter(cursor));
            }

            const response = await databases.listDocuments(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                queries
            );

            if (response.documents.length === 0) {
                hasMore = false;
                break;
            }

            for (const doc of response.documents) {
                if (!doc.medium) {
                    await databases.updateDocument(
                        DATABASE_ID,
                        USERS_COLLECTION_ID,
                        doc.$id,
                        {
                            medium: 'english'
                        }
                    );
                    updatedCount++;
                    console.log(`Updated user ${doc.name} (${doc.email}) to english medium`);
                }
            }

            cursor = response.documents[response.documents.length - 1].$id;

            if (response.documents.length < 100) {
                hasMore = false;
            }
        }

        console.log(`Migration complete. Updated ${updatedCount} users.`);
    } catch (error) {
        console.error('Migration failed:', error);
    }
}

migrateUsers();
