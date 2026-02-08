// Script to import Unit VI: Trigonometry questions
import { Client, Databases, ID } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6988cf9b003ca9f28af5')
    .setKey('standard_068f9508c36aeb5933587dc131206911b163ca82c3dedeec1aefe536ecb2cac33b38a8d9c41c10836b36be46d20c23e363129aa09404efac1ff0f3add951657bf0b5d20067f400495786667f6fdf4a080aadbdb2d89626c16fae1bfa5e98c5daee016336969395774aec7be7e70e332b9c875c69a50e287e0f1bbd97426942d3');

const databases = new Databases(client);
const DATABASE_ID = 'maths-db';

const chapterData = {
    name: "Unit VI: Trigonometry",
    description: "Trigonometric identities, heights and distances, and applications",
    color: "cyan",
    icon: "📐"
};

const questions = [
    {
        questionText: "The value of sin^2 theta + 1/(1 + tan^2 theta) is equal to",
        options: ["tan^2 theta", "1", "cot^2 theta", "0"],
        correctAnswer: 1 // B
    },
    {
        questionText: "tan theta cosec^2 theta - tan theta is equal to",
        options: ["sec theta", "cot^2 theta", "sin theta", "cot theta"],
        correctAnswer: 3 // D
    },
    {
        questionText: "If (sin alpha + cosec alpha)^2 + (cos alpha + sec alpha)^2 = k + tan^2 alpha + cot^2 alpha, then the value of k is equal to",
        options: ["9", "7", "5", "3"],
        correctAnswer: 1 // B
    },
    {
        questionText: "If sin theta + cos theta = a and sec theta + cosec theta = b then the value of b(a^2 - 1) is equal to",
        options: ["2a", "3a", "0", "2ab"],
        correctAnswer: 0 // A
    },
    {
        questionText: "If 5x = sec theta and 5/x = tan theta then x^2 - 1/x^2 is equal to",
        options: ["25", "1/25", "5", "1"],
        correctAnswer: 1 // B
    },
    {
        questionText: "If sin theta = cos theta then 2 tan^2 theta + sin^2 theta - 1 is equal to",
        options: ["-3/2", "3/2", "2/3", "-2/3"],
        correctAnswer: 1 // B
    },
    {
        questionText: "If x = a tan theta and y = b sec theta then",
        options: ["y^2/b^2 - x^2/a^2 = 1", "x^2/a^2 - y^2/b^2 = 1", "x^2/a^2 + y^2/b^2 = 1", "x^2/a^2 - y^2/b^2 = 0"],
        correctAnswer: 0 // A
    },
    {
        questionText: "(1 + tan theta + sec theta)(1 + cot theta - cosec theta) is equal to",
        options: ["0", "1", "2", "-1"],
        correctAnswer: 2 // C
    },
    {
        questionText: "a cot theta + b cosec theta = p and b cot theta + a cosec theta = q then p^2 - q^2 is equal to",
        options: ["a^2 - b^2", "b^2 - a^2", "a^2 + b^2", "b - a"],
        correctAnswer: 1 // B
    },
    {
        questionText: "If the ratio of the height of a tower and the length of its shadow is sqrt(3):1, then the angle of elevation of the sun has measure",
        options: ["45 degrees", "30 degrees", "90 degrees", "60 degrees"],
        correctAnswer: 3 // D
    },
    {
        questionText: "The electric pole subtends an angle of 30 degrees at a point on the same level as its foot. At a second point 'b' metres above the first, the depression of the foot of the pole is 60 degrees. The height of the pole (in metres) is equal to",
        options: ["sqrt(3)b", "b/3", "b/2", "b/sqrt(3)"],
        correctAnswer: 1 // B
    },
    {
        questionText: "A tower is 60 m high. Its shadow is x metres shorter when the sun's altitude is 45 degrees than when it has been 30 degrees, then x is equal to",
        options: ["41.92 m", "43.92 m", "43 m", "45.6 m"],
        correctAnswer: 1 // B
    },
    {
        questionText: "The angle of depression of the top and bottom of 20 m tall building from the top of a multistoried building are 30 degrees and 60 degrees respectively. The height of the multistoried building and the distance between two buildings (in metres) is",
        options: ["20, 10sqrt(3)", "30, 5sqrt(3)", "20, 10", "30, 10sqrt(3)"],
        correctAnswer: 3 // D
    },
    {
        questionText: "Two persons are standing 'x' metres apart from each other and the height of the first person is double that of the other. If from the middle point of the line joining their feet an observer finds the angular elevations of their tops to be complementary, then the height of the shorter person (in metres) is",
        options: ["sqrt(2)x", "x / (2sqrt(2))", "x / sqrt(2)", "2x"],
        correctAnswer: 1 // B
    },
    {
        questionText: "The angle of elevation of a cloud from a point h metres above a lake is beta. The angle of depression of its reflection in the lake is 45 degrees. The height of location of the cloud from the lake is",
        options: ["h(1 + tan beta) / (1 - tan beta)", "h(1 - tan beta) / (1 + tan beta)", "h tan(45 degrees - beta)", "none of these"],
        correctAnswer: 0 // A
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
