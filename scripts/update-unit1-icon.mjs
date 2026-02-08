import { Client, Databases } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6988cf9b003ca9f28af5')
    .setKey('standard_068f9508c36aeb5933587dc131206911b163ca82c3dedeec1aefe536ecb2cac33b38a8d9c41c10836b36be46d20c23e363129aa09404efac1ff0f3add951657bf0b5d20067f400495786667f6fdf4a080aadbdb2d89626c16fae1bfa5e98c5daee016336969395774aec7be7e70e332b9c875c69a50e287e0f1bbd97426942d3');

const databases = new Databases(client);
const DATABASE_ID = 'maths-db';
const CHAPTER_ID = 'relations-and-functions';

async function updateIcon() {
    try {
        await databases.updateDocument(
            DATABASE_ID,
            'chapters',
            CHAPTER_ID,
            {
                icon: 'F'
            }
        );
        console.log('✅ Updated Unit 1 icon to "F"');
    } catch (error) {
        console.error('Error updating icon:', error);
    }
}

updateIcon();
