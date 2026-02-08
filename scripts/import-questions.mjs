/**
 * Import Questions Script
 * Run with: node scripts/import-questions.mjs
 */

import { Client, Databases, ID } from 'node-appwrite';

const ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = '6988cf9b003ca9f28af5';
const API_KEY = 'standard_068f9508c36aeb5933587dc131206911b163ca82c3dedeec1aefe536ecb2cac33b38a8d9c41c10836b36be46d20c23e363129aa09404efac1ff0f3add951657bf0b5d20067f400495786667f6fdf4a080aadbdb2d89626c16fae1bfa5e98c5daee016336969395774aec7be7e70e332b9c875c69a50e287e0f1bbd97426942d3';

const DATABASE_ID = 'maths-db';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

const data = {
    "chapter": "Unit I: Relations and Functions",
    "questions": [
        {
            "number": 1,
            "question": "If n(A x B) = 6 and A = {1, 3} then n(B) is",
            "options": ["1", "2", "3", "6"],
            "answer": 2
        },
        {
            "number": 2,
            "question": "A = {a, b, p}, B = {2, 3}, C = {p, q, r, s} then n[(A U C) x B] is",
            "options": ["8", "20", "12", "16"],
            "answer": 2
        },
        {
            "number": 3,
            "question": "If A = {1, 2}, B = {1, 2, 3, 4}, C = {5, 6} and D = {5, 6, 7, 8} then state which of the following statement is true.",
            "options": ["(A x C) subset of (B x D)", "(B x D) subset of (A x C)", "(A x B) subset of (A x D)", "(D x A) subset of (B x A)"],
            "answer": 0
        },
        {
            "number": 4,
            "question": "If there are 1024 relations from a set A = {1, 2, 3, 4, 5} to a set B, then the number of elements in B is",
            "options": ["3", "2", "4", "8"],
            "answer": 1
        },
        {
            "number": 5,
            "question": "The range of the relation R = {(x, x²) | x is a prime number less than 13} is",
            "options": ["{2, 3, 5, 7}", "{2, 3, 5, 7, 11}", "{4, 9, 25, 49, 121}", "{1, 4, 9, 25, 49, 121}"],
            "answer": 2
        },
        {
            "number": 6,
            "question": "If the ordered pairs (a + 2, 4) and (5, 2a + b) are equal then (a, b) is",
            "options": ["(2, -2)", "(5, 1)", "(2, 3)", "(3, -2)"],
            "answer": 3
        },
        {
            "number": 7,
            "question": "Let n(A) = m and n(B) = n then the total number of non-empty relations that can be defined from A to B is",
            "options": ["mⁿ", "nm", "2^(mn) - 1", "2^(mn)"],
            "answer": 2
        },
        {
            "number": 8,
            "question": "If {(a, 8), (6, b)} represents an identity function, then the value of a and b are respectively",
            "options": ["(8, 6)", "(8, 8)", "(6, 8)", "(6, 6)"],
            "answer": 0
        },
        {
            "number": 9,
            "question": "Let A = {1, 2, 3, 4} and B = {4, 8, 9, 10}. A function f: A → B given by f = {(1, 4), (2, 8), (3, 9), (4, 10)} is a",
            "options": ["Many-one function", "Identity function", "One-to-one function", "Into function"],
            "answer": 2
        },
        {
            "number": 10,
            "question": "If f(x) = 2x² and g(x) = 1/(3x) then fog is",
            "options": ["3/(2x²)", "2/(3x²)", "2/(9x²)", "1/(6x²)"],
            "answer": 2
        },
        {
            "number": 11,
            "question": "If f: A → B is a bijective function and if n(B) = 7 then n(A) is equal to",
            "options": ["7", "49", "1", "14"],
            "answer": 0
        },
        {
            "number": 12,
            "question": "Let f and g be two functions given by f = {(0, 1), (2, 0), (3, -4), (4, 2), (5, 7)} and g = {(0, 2), (1, 0), (2, 4), (-4, 2), (7, 0)} then the range of f o g is",
            "options": ["{0, 2, 3, 4, 5}", "{-4, 1, 0, 2, 7}", "{1, 2, 3, 4, 5}", "{0, 1, 2}"],
            "answer": 3
        },
        {
            "number": 13,
            "question": "Let f(x) = √(1 + x²) then",
            "options": ["f(xy) = f(x).f(y)", "f(xy) ≥ f(x).f(y)", "f(xy) ≤ f(x).f(y)", "None of these"],
            "answer": 2
        },
        {
            "number": 14,
            "question": "If g = {(1, 1), (2, 3), (3, 5), (4, 7)} is a function given by g(x) = ax + b then the values of a and b are",
            "options": ["(-1, 2)", "(2, -1)", "(-1, -2)", "(1, 2)"],
            "answer": 1
        },
        {
            "number": 15,
            "question": "f(x) = (x + 1)³ - (x - 1)³ represents a function which is",
            "options": ["linear", "cubic", "reciprocal", "quadratic"],
            "answer": 3
        }
    ]
};

async function importData() {
    console.log('📚 Importing chapter and questions...\n');

    // Create chapter
    const chapterId = 'relations-and-functions';
    const chapterName = data.chapter;

    try {
        await databases.createDocument(DATABASE_ID, 'chapters', chapterId, {
            name: chapterName,
            description: 'Relations, functions, types of functions, composition of functions',
            color: 'emerald',
            icon: 'Function',
            questionCount: data.questions.length
        });
        console.log(`✓ Chapter "${chapterName}" created`);
    } catch (error) {
        if (error.code === 409) {
            console.log(`→ Chapter "${chapterName}" already exists`);
        } else {
            console.error('Error creating chapter:', error.message);
        }
    }

    // Create questions
    console.log(`\n📝 Importing ${data.questions.length} questions...\n`);

    for (const q of data.questions) {
        try {
            await databases.createDocument(DATABASE_ID, 'questions', ID.unique(), {
                chapterId: chapterId,
                chapterName: chapterName,
                questionText: q.question,
                options: q.options,
                correctAnswer: q.answer,
                createdBy: 'system',
                createdAt: new Date().toISOString()
            });
            console.log(`✓ Question ${q.number} imported`);
        } catch (error) {
            console.error(`✗ Question ${q.number} failed:`, error.message);
        }
    }

    console.log('\n✅ Import complete!');
}

importData();
