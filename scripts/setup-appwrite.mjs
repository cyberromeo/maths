/**
 * Appwrite Database Setup Script
 * Run with: node scripts/setup-appwrite.mjs
 */

import { Client, Databases, ID, Permission, Role } from 'node-appwrite';

const ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = '6988cf9b003ca9f28af5';
const API_KEY = 'standard_068f9508c36aeb5933587dc131206911b163ca82c3dedeec1aefe536ecb2cac33b38a8d9c41c10836b36be46d20c23e363129aa09404efac1ff0f3add951657bf0b5d20067f400495786667f6fdf4a080aadbdb2d89626c16fae1bfa5e98c5daee016336969395774aec7be7e70e332b9c875c69a50e287e0f1bbd97426942d3';

const DATABASE_ID = 'maths-db';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function createDatabase() {
    console.log('Creating database...');
    try {
        await databases.create(DATABASE_ID, 'Maths DB');
        console.log('✓ Database created');
    } catch (error) {
        if (error.code === 409) {
            console.log('→ Database already exists');
        } else {
            throw error;
        }
    }
}

async function createCollection(id, name, permissions = []) {
    console.log(`Creating collection: ${name}...`);
    try {
        await databases.createCollection(DATABASE_ID, id, name, permissions);
        console.log(`✓ Collection ${name} created`);
    } catch (error) {
        if (error.code === 409) {
            console.log(`→ Collection ${name} already exists`);
        } else {
            throw error;
        }
    }
}

async function createAttribute(collectionId, type, key, options = {}) {
    try {
        switch (type) {
            case 'string':
                await databases.createStringAttribute(
                    DATABASE_ID, collectionId, key,
                    options.size || 255, options.required ?? true, options.default, options.array ?? false
                );
                break;
            case 'integer':
                await databases.createIntegerAttribute(
                    DATABASE_ID, collectionId, key,
                    options.required ?? true, options.min, options.max, options.default, options.array ?? false
                );
                break;
            case 'boolean':
                await databases.createBooleanAttribute(
                    DATABASE_ID, collectionId, key,
                    options.required ?? true, options.default
                );
                break;
            case 'datetime':
                await databases.createDatetimeAttribute(
                    DATABASE_ID, collectionId, key,
                    options.required ?? true, options.default
                );
                break;
        }
        console.log(`  ✓ Attribute ${key} created`);
    } catch (error) {
        if (error.code === 409) {
            console.log(`  → Attribute ${key} already exists`);
        } else {
            console.error(`  ✗ Failed to create ${key}:`, error.message);
        }
    }
    await sleep(1000); // Rate limiting
}

async function setupUsersCollection() {
    await createCollection('users', 'Users', [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
    ]);

    await createAttribute('users', 'string', 'email', { size: 128 });
    await createAttribute('users', 'string', 'name', { size: 128 });
    await createAttribute('users', 'string', 'role', { size: 16 });
    await createAttribute('users', 'string', 'createdAt', { size: 64 });
}

async function setupChaptersCollection() {
    await createCollection('chapters', 'Chapters', [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
    ]);

    await createAttribute('chapters', 'string', 'name', { size: 128 });
    await createAttribute('chapters', 'string', 'description', { size: 1000 });
    await createAttribute('chapters', 'string', 'color', { size: 64 });
    await createAttribute('chapters', 'string', 'icon', { size: 64 });
    await createAttribute('chapters', 'integer', 'questionCount', { required: false, default: 0 });
}

async function setupQuestionsCollection() {
    await createCollection('questions', 'Questions', [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
    ]);

    await createAttribute('questions', 'string', 'chapterId', { size: 64 });
    await createAttribute('questions', 'string', 'chapterName', { size: 128 });
    await createAttribute('questions', 'string', 'questionText', { size: 10000 });
    await createAttribute('questions', 'string', 'options', { size: 1000, array: true });
    await createAttribute('questions', 'integer', 'correctAnswer');
    await createAttribute('questions', 'string', 'createdBy', { size: 64 });
    await createAttribute('questions', 'string', 'createdAt', { size: 64 });
}

async function setupExamsCollection() {
    await createCollection('exams', 'Exams', [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
    ]);

    await createAttribute('exams', 'string', 'name', { size: 128 });
    await createAttribute('exams', 'string', 'type', { size: 16 });
    await createAttribute('exams', 'string', 'chapterId', { size: 64, required: false });
    await createAttribute('exams', 'string', 'chapterName', { size: 128, required: false });
    await createAttribute('exams', 'string', 'questionIds', { size: 64, array: true });
    await createAttribute('exams', 'string', 'startTime', { size: 64, required: false });
    await createAttribute('exams', 'string', 'endTime', { size: 64, required: false });
    await createAttribute('exams', 'integer', 'durationMinutes');
    await createAttribute('exams', 'string', 'createdBy', { size: 64 });
    await createAttribute('exams', 'boolean', 'isActive', { default: true });
    await createAttribute('exams', 'string', 'createdAt', { size: 64 });
}

async function setupResultsCollection() {
    await createCollection('results', 'Results', [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
    ]);

    await createAttribute('results', 'string', 'examId', { size: 64 });
    await createAttribute('results', 'string', 'examName', { size: 128 });
    await createAttribute('results', 'string', 'studentId', { size: 64 });
    await createAttribute('results', 'string', 'studentName', { size: 128 });
    await createAttribute('results', 'string', 'mode', { size: 16 });
    await createAttribute('results', 'integer', 'score');
    await createAttribute('results', 'integer', 'totalQuestions');
    await createAttribute('results', 'string', 'answers', { size: 50000, required: false });
    await createAttribute('results', 'string', 'completedAt', { size: 64 });
    await createAttribute('results', 'integer', 'timeTaken');
}

async function main() {
    console.log('🚀 Starting Appwrite Setup...\n');

    try {
        await createDatabase();
        console.log('\n📦 Setting up collections...\n');

        await setupUsersCollection();
        await setupChaptersCollection();
        await setupQuestionsCollection();
        await setupExamsCollection();
        await setupResultsCollection();

        console.log('\n✅ Appwrite setup complete!');
    } catch (error) {
        console.error('\n❌ Setup failed:', error.message);
        process.exit(1);
    }
}

main();
