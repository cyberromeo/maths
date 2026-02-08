// Script to import Unit VII: Mensuration questions
import { Client, Databases, ID } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6988cf9b003ca9f28af5')
    .setKey('standard_068f9508c36aeb5933587dc131206911b163ca82c3dedeec1aefe536ecb2cac33b38a8d9c41c10836b36be46d20c23e363129aa09404efac1ff0f3add951657bf0b5d20067f400495786667f6fdf4a080aadbdb2d89626c16fae1bfa5e98c5daee016336969395774aec7be7e70e332b9c875c69a50e287e0f1bbd97426942d3');

const databases = new Databases(client);
const DATABASE_ID = 'maths-db';

const chapterData = {
    name: "Unit VII: Mensuration",
    description: "Surface area and volume of solids: cylinders, cones, spheres, and frustums",
    color: "pink",
    icon: "🧊"
};

const questions = [
    {
        questionText: "The curved surface area of a right circular cone of height 15 cm and base diameter 16 cm is",
        options: ["60 pi cm^2", "68 pi cm^2", "120 pi cm^2", "136 pi cm^2"],
        correctAnswer: 3 // D
    },
    {
        questionText: "If two solid hemispheres of same base radius r units are joined together along their bases, then curved surface area of this new solid is",
        options: ["4 pi r^2 sq. units", "6 pi r^2 sq. units", "3 pi r^2 sq. units", "8 pi r^2 sq. units"],
        correctAnswer: 0 // A
    },
    {
        questionText: "The height of a right circular cone whose radius is 5 cm and slant height is 13 cm will be",
        options: ["12 cm", "10 cm", "13 cm", "5 cm"],
        correctAnswer: 0 // A
    },
    {
        questionText: "If the radius of the base of a right circular cylinder is halved keeping the same height, then the ratio of the volume of the cylinder thus obtained to the volume of original cylinder is",
        options: ["1:2", "1:4", "1:6", "1:8"],
        correctAnswer: 1 // B
    },
    {
        questionText: "The total surface area of a cylinder whose radius is 1/3 of its height is",
        options: ["9 pi h^2 / 8 sq. units", "24 pi h^2 sq. units", "8 pi h^2 / 9 sq. units", "56 pi h^2 / 9 sq. units"],
        correctAnswer: 2 // C
    },
    {
        questionText: "In a hollow cylinder, the sum of the external and internal radii is 14 cm and the width is 4 cm. If its height is 20 cm, the volume of the material in it is",
        options: ["5600 pi cm^3", "1120 pi cm^3", "56 pi cm^3", "3600 pi cm^3"],
        correctAnswer: 1 // B
    },
    {
        questionText: "If the radius of the base of a cone is tripled and the height is doubled then the volume is",
        options: ["made 6 times", "made 18 times", "made 12 times", "unchanged"],
        correctAnswer: 1 // B
    },
    {
        questionText: "The total surface area of a hemi-sphere is how much times the square of its radius.",
        options: ["pi", "4 pi", "3 pi", "2 pi"],
        correctAnswer: 2 // C
    },
    {
        questionText: "A solid sphere of radius x cm is melted and cast into a shape of a solid cone of same radius. The height of the cone is",
        options: ["3x cm", "x cm", "4x cm", "2x cm"],
        correctAnswer: 2 // C
    },
    {
        questionText: "A frustum of a right circular cone is of height 16cm with radii of its ends as 8cm and 20cm. Then, the volume of the frustum is",
        options: ["3328 pi cm^3", "3228 pi cm^3", "3240 pi cm^3", "3340 pi cm^3"],
        correctAnswer: 0 // A
    },
    {
        questionText: "A shuttle cock used for playing badminton has the shape of the combination of",
        options: ["a cylinder and a sphere", "a hemisphere and a cone", "a sphere and a cone", "frustum of a cone and a hemisphere"],
        correctAnswer: 3 // D
    },
    {
        questionText: "A spherical ball of radius r1 units is melted to make 8 new identical balls each of radius r2 units. Then r1:r2 is",
        options: ["2:1", "1:2", "4:1", "1:4"],
        correctAnswer: 0 // A
    },
    {
        questionText: "The volume (in cm^3) of the greatest sphere that can be cut off from a cylindrical log of wood of base radius 1 cm and height 5 cm is",
        options: ["4/3 pi", "10/3 pi", "5 pi", "20/3 pi"],
        correctAnswer: 0 // A
    },
    {
        questionText: "The height and radius of the cone of which the frustum is a part are h1 units and r1 units respectively. Height of the frustum is h2 units and radius of the smaller base is r2 units. If h2:h1 = 1:2 then r1:r2 is",
        options: ["1:3", "1:2", "2:1", "3:1"],
        correctAnswer: 2 // C
    },
    {
        questionText: "The ratio of the volumes of a cylinder, a cone and a sphere, if each has the same diameter and same height is",
        options: ["1:2:3", "2:1:3", "1:3:2", "3:1:2"],
        correctAnswer: 3 // D
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
