// Script to import Unit III: Algebra questions
import { Client, Databases, ID } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6988cf9b003ca9f28af5')
    .setKey('standard_068f9508c36aeb5933587dc131206911b163ca82c3dedeec1aefe536ecb2cac33b38a8d9c41c10836b36be46d20c23e363129aa09404efac1ff0f3add951657bf0b5d20067f400495786667f6fdf4a080aadbdb2d89626c16fae1bfa5e98c5daee016336969395774aec7be7e70e332b9c875c69a50e287e0f1bbd97426942d3');

const databases = new Databases(client);
const DATABASE_ID = 'maths-db';

const chapterData = {
    name: "Unit III: Algebra",
    description: "Linear equations, polynomials, matrices, and algebraic operations",
    color: "blue",
    icon: "📐",
    medium: "english"
};

const questions = [
    {
        questionText: "A system of three linear equations in three variables is inconsistent if their planes",
        options: ["intersect only at a point", "intersect in a line", "coincides with each other", "do not intersect"],
        correctAnswer: 3
    },
    {
        questionText: "The solution of the system x + y - 3z = -6, -7y + 7z = 7, 3z = 9 is",
        options: ["x = 1, y = 2, z = 3", "x = -1, y = 2, z = 3", "x = -1, y = -2, z = 3", "x = 1, y = -2, z = 3"],
        correctAnswer: 0
    },
    {
        questionText: "If (x - 6) is the HCF of x^2 - 2x - 24 and x^2 - kx - 6 then the value of k is",
        options: ["3", "5", "6", "8"],
        correctAnswer: 1
    },
    {
        questionText: "(3y - 3)/y / (7y - 7)/(3y^2) is",
        options: ["9y/7", "9y^3/(21y - 21)", "(21y^2 - 42y + 21)/(3y^3)", "7(y^2 - 2y + 1)/y^2"],
        correctAnswer: 0
    },
    {
        questionText: "y^2 + 1/y^2 is not equal to",
        options: ["(y^4 + 1)/y^2", "(y + 1/y)^2", "(y - 1/y)^2 + 2", "(y + 1/y)^2 - 2"],
        correctAnswer: 1
    },
    {
        questionText: "x/(x^2 - 25) - 8/(x^2 + 6x + 5) gives",
        options: ["(x^2 - 7x + 40)/((x - 5)(x + 5))", "(x^2 - 7x + 40)/((x - 5)(x + 5)(x + 1))", "(x^2 + 7x + 40)/((x - 5)(x + 5)(x + 1))", "(x^2 + 10)/((x^2 - 25)(x + 1))"],
        correctAnswer: 1
    },
    {
        questionText: "The square root of (256x^8 y^4 z^10) / (25x^6 y^6 z^6) is equal to",
        options: ["16/5 |(x^2 z^4)/y^2|", "16 |y^2 / (x^2 z^4)|", "16/5 |y / (xz^2)|", "16/5 |(xz^2)/y|"],
        correctAnswer: 3
    },
    {
        questionText: "Which of the following should be added to make x^4 + 64 a perfect square",
        options: ["4x^2", "16x^2", "8x^2", "-8x^2"],
        correctAnswer: 1
    },
    {
        questionText: "The solution of (2x - 1)^2 = 9 is equal to",
        options: ["-1", "2", "-1, 2", "None of these"],
        correctAnswer: 2
    },
    {
        questionText: "The values of a and b if 4x^4 - 24x^3 + 76x^2 + ax + b is a perfect square are",
        options: ["100, 120", "10, 12", "-120, 100", "12, 10"],
        correctAnswer: 2
    },
    {
        questionText: "If the roots of the equation q^2x^2 + p^2x + r^2 = 0 are the squares of the roots of the equation qx^2 + px + r = 0 then q, p, r are in",
        options: ["A.P", "G.P", "Both A.P and G.P", "none of these"],
        correctAnswer: 1
    },
    {
        questionText: "Graph of a linear polynomial is a",
        options: ["straight line", "circle", "parabola", "hyperbola"],
        correctAnswer: 0
    },
    {
        questionText: "The number of points of intersection of the quadratic polynomial x^2 + 4x + 4 with the X axis is",
        options: ["0", "1", "0 or 1", "2"],
        correctAnswer: 1
    },
    {
        questionText: "For the given matrix A = [[1, 3, 5, 7], [2, 4, 6, 8], [9, 11, 13, 15]] the order of the matrix A^T is",
        options: ["2 x 3", "3 x 2", "3 x 4", "4 x 3"],
        correctAnswer: 3
    },
    {
        questionText: "If A is a 2 x 3 matrix and B is a 3 x 4 matrix, how many columns does AB have",
        options: ["3", "4", "2", "5"],
        correctAnswer: 1
    },
    {
        questionText: "If number of columns and rows are not equal in a matrix then it is said to be a",
        options: ["diagonal matrix", "rectangular matrix", "square matrix", "identity matrix"],
        correctAnswer: 1
    },
    {
        questionText: "Transpose of a column matrix is",
        options: ["unit matrix", "diagonal matrix", "column matrix", "row matrix"],
        correctAnswer: 3
    },
    {
        questionText: "Find the matrix X if 2X + [[1, 3], [5, 7]] = [[5, 7], [9, 5]]",
        options: ["[[-2, -2], [2, -1]]", "[[2, 2], [2, -1]]", "[[1, 2], [2, 2]]", "[[2, 1], [2, 2]]"],
        correctAnswer: 1
    },
    {
        questionText: "Which of the following can be calculated from the given matrices A = [[1, 2], [3, 4], [5, 6]] and B = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]: (i) A^2 (ii) B^2 (iii) AB (iv) BA",
        options: ["(i) and (ii) only", "(ii) and (iii) only", "(ii) and (iv) only", "all of these"],
        correctAnswer: 2
    },
    {
        questionText: "If A = [[1, 2, 3], [3, 2, 1]], B = [[1, 0], [2, -1], [0, 2]] and C = [[0, 1], [-2, 5]]. Which of the following statements are correct? (i) AB + C = [[5, 5], [5, 5]] (ii) BC = [[0, 1], [2, -3], [-4, 10]] (iii) BA + C = [[2, 5], [3, 0]] (iv) (AB)C = [[-8, 20], [-8, 13]]",
        options: ["(i) and (ii) only", "(ii) and (iii) only", "(iii) and (iv) only", "all of these"],
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
