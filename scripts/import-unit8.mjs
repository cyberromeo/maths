// Script to import Unit VIII: Statistics and Probability questions
import { Client, Databases, ID } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6988cf9b003ca9f28af5')
    .setKey('standard_068f9508c36aeb5933587dc131206911b163ca82c3dedeec1aefe536ecb2cac33b38a8d9c41c10836b36be46d20c23e363129aa09404efac1ff0f3add951657bf0b5d20067f400495786667f6fdf4a080aadbdb2d89626c16fae1bfa5e98c5daee016336969395774aec7be7e70e332b9c875c69a50e287e0f1bbd97426942d3');

const databases = new Databases(client);
const DATABASE_ID = 'maths-db';

const chapterData = {
    name: "Unit VIII: Statistics and Probability",
    description: "Measures of central tendency, dispersion, probability concepts, and events",
    color: "amber",
    icon: "📊"
};

const questions = [
    {
        questionText: "Which of the following is not a measure of dispersion?",
        options: ["Range", "Standard deviation", "Arithmetic mean", "Variance"],
        correctAnswer: 2 // C
    },
    {
        questionText: "The range of the data 8, 8, 8, 8, 8...8 is",
        options: ["0", "1", "8", "3"],
        correctAnswer: 0 // A
    },
    {
        questionText: "The sum of all deviations of the data from its mean is",
        options: ["Always positive", "always negative", "zero", "non-zero integer"],
        correctAnswer: 2 // C
    },
    {
        questionText: "The mean of 100 observations is 40 and their standard deviation is 3. The sum of squares of all observations is",
        options: ["40000", "160900", "160000", "30000"],
        correctAnswer: 1 // B
    },
    {
        questionText: "Variance of first 20 natural numbers is",
        options: ["32.25", "44.25", "33.25", "30"],
        correctAnswer: 2 // C
    },
    {
        questionText: "The standard deviation of a data is 3. If each value is multiplied by 5 then the new variance is",
        options: ["3", "15", "5", "225"],
        correctAnswer: 3 // D
    },
    {
        questionText: "If the standard deviation of x, y, z is p then the standard deviation of 3x + 5, 3y + 5, 3z + 5 is",
        options: ["3p + 5", "3p", "p + 5", "9p + 15"],
        correctAnswer: 1 // B
    },
    {
        questionText: "If the mean and coefficient of variation of a data are 4 and 87.5% then the standard deviation is",
        options: ["3.5", "3", "4.5", "2.5"],
        correctAnswer: 0 // A
    },
    {
        questionText: "Which of the following is incorrect?",
        options: ["P(A) > 1", "0 <= P(A) <= 1", "P(null) = 0", "P(A) + P(not A) = 1"],
        correctAnswer: 0 // A
    },
    {
        questionText: "The probability of a red marble selected at random from a jar containing p red, q blue and r green marbles is",
        options: ["q / (p + q + r)", "p / (p + q + r)", "(p + q) / (p + q + r)", "(p + r) / (p + q + r)"],
        correctAnswer: 1 // B
    },
    {
        questionText: "A page is selected at random from a book. The probability that the digit at units place of the page number chosen is less than 7 is",
        options: ["3/10", "7/10", "3/9", "7/9"],
        correctAnswer: 1 // B
    },
    {
        questionText: "The probability of getting a job for a person is x/3. If the probability of not getting the job is 2/3 then the value of x is",
        options: ["2", "1", "3", "1.5"],
        correctAnswer: 1 // B
    },
    {
        questionText: "Kamalam went to play a lucky draw contest. 135 tickets of the lucky draw were sold. If the probability of Kamalam winning is 1/9, then the number of tickets bought by Kamalam is",
        options: ["5", "10", "15", "20"],
        correctAnswer: 2 // C
    },
    {
        questionText: "If a letter is chosen at random from the English alphabets {a, b, ..., z}, then the probability that the letter chosen precedes x",
        options: ["12/13", "1/13", "23/26", "3/26"],
        correctAnswer: 2 // C
    },
    {
        questionText: "A purse contains 10 notes of Rs.2000, 15 notes of Rs.500, and 25 notes of Rs.200. One note is drawn at random. What is the probability that the note is either a Rs.500 note or Rs.200 note?",
        options: ["1/5", "3/10", "2/3", "4/5"],
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
