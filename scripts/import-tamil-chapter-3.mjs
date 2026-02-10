import { Client, Databases, ID } from 'node-appwrite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const CHAPTERS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_CHAPTERS;
const QUESTIONS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_QUESTIONS || 'questions';

const tamilChapterData = {
    "unit": "3",
    "chapter_name": "இயற்கணிதம்",
    "total_questions": 20,
    "questions": [
        {
            "id": 1,
            "question": "மூன்று மாறிகளில் அமைந்த மூன்று நேரிய சமன்பாடுகளின் தொகுப்பிற்கு தீர்வுகள் இல்லையெனில், அத்தொகுப்பில் உள்ள தளங்கள்",
            "options": [
                "ஒரே ஒரு புள்ளியில் வெட்டுகின்றன",
                "ஒரே ஒரு கோட்டில் வெட்டுகின்றன",
                "ஒன்றின் மீது ஒன்று பொருந்தும்",
                "ஒன்றையொன்று வெட்டாது"
            ],
            "answer": "ஒன்றையொன்று வெட்டாது"
        },
        {
            "id": 2,
            "question": "x + y - 3z = -6, -7y + 7z = 7, 3z = 9 என்ற தொகுப்பின் தீர்வு",
            "options": [
                "x = 1, y = 2, z = 3",
                "x = -1, y = 2, z = 3",
                "x = -1, y = -2, z = 3",
                "x = 1, y = -2, z = -3"
            ],
            "answer": "x = 1, y = 2, z = 3"
        },
        {
            "id": 3,
            "question": "x² - 2x - 24 மற்றும் x² - kx - 6 -யின் மீ.பொ.வ. (x - 6) எனில், k -யின் மதிப்பு",
            "options": [
                "3",
                "5",
                "6",
                "8"
            ],
            "answer": "5"
        },
        {
            "id": 4,
            "question": "(3y - 3) / y ÷ (7y - 7) / 3y² என்பது",
            "options": [
                "9y / 7",
                "9y³ / (21y - 21)",
                "21y² - 42y + 21 / 3y³",
                "7(y² - 2y + 1) / y²"
            ],
            "answer": "9y / 7"
        },
        {
            "id": 5,
            "question": "கீழ்க்கண்டவற்றுள் எது y² + 1/y² -க்கு சமம் இல்லை",
            "options": [
                "(y⁴ + 1) / y²",
                "(y + 1/y)²",
                "(y - 1/y)² + 2",
                "(y + 1/y)² - 2"
            ],
            "answer": "(y + 1/y)²"
        },
        {
            "id": 6,
            "question": "x / (x² - 25) - 8 / (x² + 6x + 5) -ன் சுருங்கிய வடிவம்",
            "options": [
                "(x² - 7x + 40) / (x - 5)(x + 5)",
                "(x² + 7x + 40) / (x - 5)(x + 5)(x + 1)",
                "(x² - 7x + 40) / (x² - 25)(x + 1)",
                "(x² + 10) / (x² - 25)(x + 1)"
            ],
            "answer": "(x² - 7x + 40) / (x² - 25)(x + 1)"
        },
        {
            "id": 7,
            "question": "(256x⁸y⁴z¹⁰ / 25x⁶y⁶z⁶) -ன் வர்க்கமூலம்",
            "options": [
                "16/5 |x²z⁴ / y²|",
                "16/5 |y² / x²z⁴|",
                "16/5 |y / xz²|",
                "16/5 |xz² / y|"
            ],
            "answer": "16/5 |xz² / y|"
        },
        {
            "id": 8,
            "question": "x⁴ + 64 -ஐ முழு வர்க்கமாக மாற்ற அதனுடன் பின்வருவனவற்றுள் எதைக் கூட்ட வேண்டும்?",
            "options": [
                "4x²",
                "16x²",
                "8x²",
                "-8x²"
            ],
            "answer": "16x²"
        },
        {
            "id": 9,
            "question": "(2x - 1)² = 9 -ன் தீர்வு",
            "options": [
                "-1",
                "2",
                "-1, 2",
                "இதில் எதுவும் இல்லை"
            ],
            "answer": "-1, 2"
        },
        {
            "id": 10,
            "question": "4x⁴ - 24x³ + 76x² + ax + b ஒரு முழு வர்க்கம் எனில், a மற்றும் b -யின் மதிப்பு",
            "options": [
                "100, 120",
                "10, 12",
                "-120, 100",
                "12, 10"
            ],
            "answer": "-120, 100"
        },
        {
            "id": 11,
            "question": "q²x² + p²x + r² = 0 என்ற சமன்பாட்டின் மூலங்கள், qx² + px + r = 0 என்ற சமன்பாட்டின் மூலங்களின் வர்க்கங்கள் எனில், q, p, r என்பன",
            "options": [
                "ஒரு கூட்டுத் தொடர்வரிசையில் உள்ளன",
                "ஒரு பெருக்குத் தொடர்வரிசையில் உள்ளன",
                "கூட்டுத் தொடர்வரிசை மற்றும் பெருக்குத் தொடர்வரிசை இரண்டிலும் உள்ளன",
                "இதில் எதுவும் இல்லை"
            ],
            "answer": "ஒரு பெருக்குத் தொடர்வரிசையில் உள்ளன"
        },
        {
            "id": 12,
            "question": "ஒரு நேரிய பல்லுறுப்புக் கோவையின் வரைபடம் ஒரு",
            "options": [
                "நேர்கோடு",
                "வட்டம்",
                "பரவளையம்",
                "அதிபரவளையம்"
            ],
            "answer": "நேர்கோடு"
        },
        {
            "id": 13,
            "question": "x² + 4x + 4 என்ற இருபடி பல்லுறுப்புக் கோவை X அச்சோடு வெட்டும் புள்ளிகளின் எண்ணிக்கை",
            "options": [
                "0",
                "1",
                "0 அல்லது 1",
                "2"
            ],
            "answer": "1"
        },
        {
            "id": 14,
            "question": "A என்ற அணியின் வரிசை 3x4 எனில், நிரல்களின் எண்ணிக்கை",
            "options": [
                "3",
                "4",
                "2",
                "5"
            ],
            "answer": "4"
        },
        {
            "id": 15,
            "question": "A என்ற அணியின் வரிசை 2x3, B என்ற அணியின் வரிசை 3x4 எனில், AB என்ற அணியின் நிரல் மாற்று அணியின் வரிசை",
            "options": [
                "2x3",
                "3x2",
                "3x4",
                "4x2"
            ],
            "answer": "4x2"
        },
        {
            "id": 16,
            "question": "நிரல்கள் மற்றும் நிரைகள் சம எண்ணிக்கையில்லாத அணி",
            "options": [
                "மூலைவிட்ட அணி",
                "செவ்வக அணி",
                "சதுர அணி",
                "அலகு அணி"
            ],
            "answer": "செவ்வக அணி"
        },
        {
            "id": 17,
            "question": "ஒரு நிரல் அணியின், நிரை நிரல் மாற்று அணி",
            "options": [
                "அலகு அணி",
                "மூலைவிட்ட அணி",
                "நிரல் அணி",
                "நிரை அணி"
            ],
            "answer": "நிரை அணி"
        },
        {
            "id": 18,
            "question": "2X + [[1, 3], [5, 7]] = [[5, 7], [9, 5]] எனில், X என்ற அணியைக் காண்க",
            "options": [
                "[[-2, -2], [2, -1]]",
                "[[2, 2], [2, -1]]",
                "[[1, 2], [2, 2]]",
                "[[2, 1], [2, 2]]"
            ],
            "answer": "[[2, 2], [2, -1]]"
        },
        {
            "id": 19,
            "question": "A = [[1, 2], [3, 4], [5, 6]], B = [[1, 2, 3], [4, 5, 6], [7, 8, 9]] ஆகிய அணிகளைக் கொண்டு எவ்வகை அணிகளைக் கணக்கிட முடியும்? (i) A² (ii) B² (iii) AB (iv) BA",
            "options": [
                "(i), (ii)",
                "(ii), (iii)",
                "(ii), (iv)",
                "அனைத்தும்"
            ],
            "answer": "(ii), (iv)"
        },
        {
            "id": 20,
            "question": "A = [[1, 2, 3], [3, 2, 1]], B = [[1, 0], [2, -1], [0, 2]], C = [[0, 1], [-2, 5]] எனில், பின்வருவனவற்றுள் எவை சரி? (i) AB + C = [[5, 5], [5, 5]] (ii) BC = [[0, 1], [2, -3], [-4, 10]]",
            "options": [
                "(i) மற்றும் (ii) மட்டும்",
                "(ii) மற்றும் (iii) மட்டும்",
                "(iii) மற்றும் (iv) மட்டும்",
                "அனைத்தும்"
            ],
            "answer": "(i) மற்றும் (ii) மட்டும்"
        }
    ]
};

async function main() {
    console.log(`Starting import of Chapter ${tamilChapterData.unit}: ${tamilChapterData.chapter_name}`);

    try {
        const chapter = await databases.createDocument(
            DATABASE_ID,
            CHAPTERS_COLLECTION,
            ID.unique(),
            {
                name: `அலகு ${tamilChapterData.unit}: ${tamilChapterData.chapter_name}`,
                description: tamilChapterData.chapter_name,
                color: "violet-500", // Distinct color for Algebra
                icon: "∑", // Sigma for Algebra
                medium: "tamil",
                questionCount: tamilChapterData.questions.length
            }
        );
        console.log(`✅ Created chapter: ${chapter.name} (${chapter.$id})`);

        for (const q of tamilChapterData.questions) {
            const correctIndex = q.options.findIndex(opt => opt === q.answer);

            if (correctIndex === -1) {
                console.warn(`⚠️  Warning: Answer "${q.answer}" not found in options for question ${q.id}. Defaulting to index 0.`);
            }

            await databases.createDocument(
                DATABASE_ID,
                QUESTIONS_COLLECTION,
                ID.unique(),
                {
                    chapterId: chapter.$id,
                    chapterName: chapter.name,
                    questionText: q.question,
                    options: q.options,
                    correctAnswer: correctIndex !== -1 ? correctIndex : 0,
                    createdBy: "admin",
                    createdAt: new Date().toISOString()
                }
            );
            console.log(`   - Added question ${q.id}`);
        }

        console.log(`\nSuccessfully imported chapter and ${tamilChapterData.questions.length} questions.`);

    } catch (error) {
        console.error("❌ Import failed:", error.message);
    }
}

main();
