// Script to import Unit II: Numbers and Sequences questions
import { Client, Databases, ID, Query } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6988cf9b003ca9f28af5')
    .setKey('standard_068f9508c36aeb5933587dc131206911b163ca82c3dedeec1aefe536ecb2cac33b38a8d9c41c10836b36be46d20c23e363129aa09404efac1ff0f3add951657bf0b5d20067f400495786667f6fdf4a080aadbdb2d89626c16fae1bfa5e98c5daee016336969395774aec7be7e70e332b9c875c69a50e287e0f1bbd97426942d3');

const databases = new Databases(client);
const DATABASE_ID = 'maths-db';

const chapterData = {
    name: "Unit II: Numbers and Sequences",
    description: "Euclid's division, HCF, LCM, Arithmetic and Geometric Progressions",
    color: "violet",
    icon: "📊"
};

const questions = [
    {
        questionText: "Euclid's division lemma states that for positive integers a and b, there exist unique integers q and r such that a = bq + r where r must satisfy",
        options: ["1 < r < b", "0 < r < b", "0 <= r < b", "0 < r <= b"],
        correctAnswer: 2
    },
    {
        questionText: "Using Euclid's division lemma, if the cube of any positive integer is divided by 9 then the possible remainders are",
        options: ["0, 1, 8", "1, 4, 8", "0, 1, 3", "1, 3, 5"],
        correctAnswer: 0
    },
    {
        questionText: "If the HCF of 65 and 117 is expressible in the form of 65m - 117, then the value of m is",
        options: ["4", "2", "1", "3"],
        correctAnswer: 1
    },
    {
        questionText: "The sum of the exponents of the prime factors in the prime factorization of 1729 is",
        options: ["1", "2", "3", "4"],
        correctAnswer: 2
    },
    {
        questionText: "The least number that is divisible by all the numbers from 1 to 10 (both inclusive) is",
        options: ["2025", "5220", "5025", "2520"],
        correctAnswer: 3
    },
    {
        questionText: "7^(4k) is congruent to ___ (mod 100)",
        options: ["1", "2", "3", "4"],
        correctAnswer: 0
    },
    {
        questionText: "Given F1 = 1, F2 = 3 and Fn = F(n-1) + F(n-2) then F5 is",
        options: ["3", "5", "8", "11"],
        correctAnswer: 3
    },
    {
        questionText: "The first term of an arithmetic progression is unity and the common difference is 4. Which of the following will be a term of this A.P.",
        options: ["4551", "10091", "7881", "13531"],
        correctAnswer: 2
    },
    {
        questionText: "If 6 times of 6th term of an A.P. is equal to 7 times the 7th term, then the 13th term of the A.P. is",
        options: ["0", "6", "7", "13"],
        correctAnswer: 0
    },
    {
        questionText: "An A.P. consists of 31 terms. If its 16th term is m, then the sum of all the terms of this A.P. is",
        options: ["16 m", "62 m", "31 m", "(31/2)m"],
        correctAnswer: 2
    },
    {
        questionText: "In an A.P., the first term is 1 and the common difference is 4. How many terms of the A.P. must be taken for their sum to be equal to 120?",
        options: ["6", "7", "8", "9"],
        correctAnswer: 2
    },
    {
        questionText: "If A = 2^65 and B = 2^64 + 2^63 + 2^62 + ... + 2^0 which of the following is true?",
        options: ["B is 2^64 more than A", "A and B are equal", "B is larger than A by 1", "A is larger than B by 1"],
        correctAnswer: 3
    },
    {
        questionText: "The next term of the sequence 3/16, 1/8, 1/12, 1/18, ... is",
        options: ["1/24", "1/27", "2/3", "1/81"],
        correctAnswer: 1
    },
    {
        questionText: "If the sequence t1, t2, t3, ... are in A.P. then the sequence t6, t12, t18, ... is",
        options: ["a Geometric Progression", "an Arithmetic Progression", "neither an A.P. nor a G.P.", "a constant sequence"],
        correctAnswer: 1
    },
    {
        questionText: "The value of (1^3 + 2^3 + 3^3 + ... + 15^3) - (1 + 2 + 3 + ... + 15) is",
        options: ["14400", "14200", "14280", "14520"],
        correctAnswer: 2
    }
];

async function importQuestions() {
    try {
        // Create chapter
        console.log('Creating chapter:', chapterData.name);
        const chapter = await databases.createDocument(
            DATABASE_ID,
            'chapters',
            ID.unique(),
            {
                ...chapterData,
                questionCount: questions.length
            }
        );
        console.log('Chapter created with ID:', chapter.$id);

        // Import questions
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            await databases.createDocument(
                DATABASE_ID,
                'questions',
                ID.unique(),
                {
                    chapterId: chapter.$id,
                    chapterName: chapterData.name,
                    questionText: q.questionText,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    createdBy: 'system',
                    createdAt: new Date().toISOString()
                }
            );
            console.log(`Imported question ${i + 1}/${questions.length}`);
        }

        console.log('✅ Successfully imported', questions.length, 'questions for', chapterData.name);
    } catch (error) {
        console.error('Error:', error);
    }
}

importQuestions();
