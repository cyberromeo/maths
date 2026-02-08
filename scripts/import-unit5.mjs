// Script to import Unit V: Coordinate Geometry questions
import { Client, Databases, ID } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6988cf9b003ca9f28af5')
    .setKey('standard_068f9508c36aeb5933587dc131206911b163ca82c3dedeec1aefe536ecb2cac33b38a8d9c41c10836b36be46d20c23e363129aa09404efac1ff0f3add951657bf0b5d20067f400495786667f6fdf4a080aadbdb2d89626c16fae1bfa5e98c5daee016336969395774aec7be7e70e332b9c875c69a50e287e0f1bbd97426942d3');

const databases = new Databases(client);
const DATABASE_ID = 'maths-db';

const chapterData = {
    name: "Unit V: Coordinate Geometry",
    description: "Area of triangle, straight lines, slope, and geometric proofs",
    color: "violet",
    icon: "📉"
};

const questions = [
    {
        questionText: "The area of triangle formed by the points (-5, 0), (0, -5) and (5, 0) is",
        options: ["0 sq.units", "25 sq.units", "5 sq.units", "none of these"],
        correctAnswer: 1 // B
    },
    {
        questionText: "A man walks near a wall, such that the distance between him and the wall is 10 units. Consider the wall to be the Y axis. The path travelled by the man is",
        options: ["x = 10", "y = 10", "x = 0", "y = 0"],
        correctAnswer: 0 // A
    },
    {
        questionText: "The straight line given by the equation x = 11 is",
        options: ["parallel to X axis", "parallel to Y axis", "passing through the origin", "passing through the point (0, 11)"],
        correctAnswer: 1 // B
    },
    {
        questionText: "If (5, 7), (3, p) and (6, 6) are collinear, then the value of p is",
        options: ["3", "6", "9", "12"],
        correctAnswer: 2 // C
    },
    {
        questionText: "The point of intersection of 3x - y = 4 and x + y = 8 is",
        options: ["(5, 3)", "(2, 4)", "(3, 5)", "(4, 4)"],
        correctAnswer: 2 // C
    },
    {
        questionText: "The slope of the line joining (12, 3), (4, a) is 1/8. The value of 'a' is",
        options: ["1", "4", "-5", "2"],
        correctAnswer: 3 // D
    },
    {
        questionText: "The slope of the line which is perpendicular to line joining the points (0, 0) and (-8, 8) is",
        options: ["-1", "1", "1/3", "-8"],
        correctAnswer: 1 // B
    },
    {
        questionText: "If slope of the line PQ is 1/sqrt(3) then the slope of the perpendicular bisector of PQ is",
        options: ["sqrt(3)", "-sqrt(3)", "1/sqrt(3)", "0"],
        correctAnswer: 1 // B
    },
    {
        questionText: "If A is a point on the Y axis whose ordinate is 8 and B is a point on the X axis whose abscissae is 5 then the equation of the line AB is",
        options: ["8x + 5y = 40", "8x - 5y = 40", "x = 8", "y = 5"],
        correctAnswer: 0 // A
    },
    {
        questionText: "The equation of a line passing through the origin and perpendicular to the line 7x - 3y + 4 = 0 is",
        options: ["7x - 3y + 4 = 0", "3x - 7y + 4 = 0", "3x + 7y = 0", "7x - 3y = 0"],
        correctAnswer: 2 // C
    },
    {
        questionText: "Consider four straight lines (i) l1: 3y = 4x + 5, (ii) l2: 4y = 3x - 1, (iii) l3: 4y + 3x = 7, (iv) l4: 4x + 3y = 2. Which of the following statement is true?",
        options: ["l1 and l2 are perpendicular", "l1 and l4 are parallel", "l2 and l4 are perpendicular", "l2 and l3 are parallel"],
        correctAnswer: 2 // C
    },
    {
        questionText: "A straight line has equation 8y = 4x + 21. Which of the following is true",
        options: ["The slope is 0.5 and the y intercept is 2.6", "The slope is 5 and the y intercept is 1.6", "The slope is 0.5 and the y intercept is 1.6", "The slope is 5 and the y intercept is 2.6"],
        correctAnswer: 0 // A
    },
    {
        questionText: "When proving that a quadrilateral is a trapezium, it is necessary to show",
        options: ["Two sides are parallel", "Two parallel and two non-parallel sides", "Opposite sides are parallel", "All sides are of equal length"],
        correctAnswer: 0 // A
    },
    {
        questionText: "When proving that a quadrilateral is a parallelogram by using slopes you must find",
        options: ["The slopes of two sides", "The slopes of two pair of opposite sides", "The lengths of all sides", "Both the lengths and slopes of two sides"],
        correctAnswer: 1 // B
    },
    {
        questionText: "(2, 1) is the point of intersection of two lines",
        options: ["x - y - 3 = 0; 3x - y - 7 = 0", "x + y = 3; 3x + y = 7", "3x + y = 3; x + y = 7", "x + 3y - 3 = 0; x - y - 7 = 0"],
        correctAnswer: 1 // B
    }
];

async function importQuestions() {
    try {
        // Create chapter
        console.log('Creating chapter:', chapterData.name);
        // First check if chapter exists to avoid duplicates (optional but good practice)
        // For simplicity in this script, we'll just create it. 
        // If we run this multiple times, it will create duplicate chapters unless we check.
        // However, standard CreateDocument with unique() will create a NEW chapter each time.
        // Given the context of previous scripts, we are creating new chapters.

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
