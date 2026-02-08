// Script to import Unit IV: Geometry questions
import { Client, Databases, ID } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6988cf9b003ca9f28af5')
    .setKey('standard_068f9508c36aeb5933587dc131206911b163ca82c3dedeec1aefe536ecb2cac33b38a8d9c41c10836b36be46d20c23e363129aa09404efac1ff0f3add951657bf0b5d20067f400495786667f6fdf4a080aadbdb2d89626c16fae1bfa5e98c5daee016336969395774aec7be7e70e332b9c875c69a50e287e0f1bbd97426942d3');

const databases = new Databases(client);
const DATABASE_ID = 'maths-db';

const chapterData = {
    name: "Unit IV: Geometry",
    description: "Similar triangles, tangents, circles, and geometric proofs",
    color: "emerald",
    icon: "📐"
};

const questions = [
    {
        questionText: "If in triangles ABC and EDF, AB/DE = BC/FD, then they will be similar when",
        options: ["angle B = angle E", "angle A = angle D", "angle B = angle D", "angle A = angle F"],
        correctAnswer: 2
    },
    {
        questionText: "In triangle LMN, angle L = 60°, angle M = 50°. If triangle LMN ~ triangle PQR then the value of angle R is",
        options: ["40°", "70°", "30°", "110°"],
        correctAnswer: 1
    },
    {
        questionText: "If triangle ABC is an isosceles triangle with angle C = 90° and AC = 5 cm, then AB is",
        options: ["2.5 cm", "5 cm", "10 cm", "5√2 cm"],
        correctAnswer: 3
    },
    {
        questionText: "In a given figure ST || QR, PS = 2 cm and SQ = 3 cm. Then the ratio of the area of triangle PQR to the area of triangle PST is",
        options: ["25:4", "25:7", "25:11", "25:13"],
        correctAnswer: 0
    },
    {
        questionText: "The perimeters of two similar triangles ABC and PQR are 36 cm and 24 cm respectively. If PQ = 10 cm, then the length of AB is",
        options: ["6 2/3 cm", "10√6 / 3 cm", "66 2/3 cm", "15 cm"],
        correctAnswer: 3
    },
    {
        questionText: "If in triangle ABC, DE || BC. AB = 3.6 cm, AC = 2.4 cm and AD = 2.1 cm then the length of AE is",
        options: ["1.4 cm", "1.8 cm", "1.2 cm", "1.05 cm"],
        correctAnswer: 0
    },
    {
        questionText: "In a triangle ABC, AD is the bisector of angle BAC. If AB = 8 cm, BD = 6 cm and DC = 3 cm. The length of the side AC is",
        options: ["6 cm", "4 cm", "3 cm", "8 cm"],
        correctAnswer: 1
    },
    {
        questionText: "In the adjacent figure angle BAC = 90° and AD perpendicular to BC then",
        options: ["BD . CD = BC^2", "AB . AC = BC^2", "BD . CD = AD^2", "AB . AC = AD^2"],
        correctAnswer: 2
    },
    {
        questionText: "Two poles of heights 6 m and 11 m stand vertically on a plane ground. If the distance between their feet is 12 m, what is the distance between their tops?",
        options: ["13 m", "14 m", "15 m", "12.8 m"],
        correctAnswer: 0
    },
    {
        questionText: "In the given figure, PR = 26 cm, QR = 24 cm, angle PAQ = 90°, PA = 6 cm and QA = 8 cm. Find angle PQR",
        options: ["80°", "85°", "75°", "90°"],
        correctAnswer: 3
    },
    {
        questionText: "A tangent is perpendicular to the radius at the",
        options: ["centre", "point of contact", "infinity", "chord"],
        correctAnswer: 1
    },
    {
        questionText: "How many tangents can be drawn to the circle from an exterior point?",
        options: ["one", "two", "infinite", "zero"],
        correctAnswer: 1
    },
    {
        questionText: "The two tangents from an external points P to a circle with centre at O are PA and PB. If angle APB = 70° then the value of angle AOB is",
        options: ["100°", "110°", "120°", "130°"],
        correctAnswer: 1
    },
    {
        questionText: "In figure CP and CQ are tangents to a circle with centre at O. ARB is another tangent touching the circle at R. If CP = 11 cm and BC = 7 cm, then the length of BR is",
        options: ["6 cm", "5 cm", "8 cm", "4 cm"],
        correctAnswer: 3
    },
    {
        questionText: "In figure if PR is tangent to the circle at P and O is the centre of the circle, then angle POQ is",
        options: ["120°", "100°", "110°", "90°"],
        correctAnswer: 0
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
