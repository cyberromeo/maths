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
const QUESTIONS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_QUESTIONS || 'questions'; // Fallback if not in env

const tamilChapterData = {
    "unit": "1",
    "chapter_name": "உறவுகளும் சார்புகளும்",
    "total_questions": 15,
    "questions": [
        {
            "id": 1,
            "question": "n(A x B) = 6 மற்றும் A = {1, 3} எனில், n(B) ஆனது",
            "options": [
                "1",
                "2",
                "3",
                "6"
            ],
            "answer": "3"
        },
        {
            "id": 2,
            "question": "A = {a, b, p}, B = {2, 3}, C = {p, q, r, s} எனில், n[(A U C) x B] ஆனது",
            "options": [
                "8",
                "20",
                "12",
                "16"
            ],
            "answer": "12"
        },
        {
            "id": 3,
            "question": "A = {1, 2}, B = {1, 2, 3, 4}, C = {5, 6} மற்றும் D = {5, 6, 7, 8} எனில் கீழே கொடுக்கப்பட்டவைகளில் எது சரியான கூற்று?",
            "options": [
                "(A x C) ⊂ (B x D)",
                "(B x D) ⊂ (A x C)",
                "(A x B) ⊂ (A x D)",
                "(D x A) ⊂ (B x A)"
            ],
            "answer": "(A x C) ⊂ (B x D)"
        },
        {
            "id": 4,
            "question": "A = {1, 2, 3, 4, 5} -லிருந்து, B என்ற கணத்திற்கு 1024 உறவுகள் உள்ளது எனில், B -ல் உள்ள உறுப்புகளின் எண்ணிக்கை",
            "options": [
                "3",
                "2",
                "4",
                "8"
            ],
            "answer": "2"
        },
        {
            "id": 5,
            "question": "R = {(x, x²) | x ஆனது 13-ஐ விடக் குறைவான பகா எண்கள்} என்ற உறவின் வீச்சகமானது",
            "options": [
                "{2, 3, 5, 7}",
                "{2, 3, 5, 7, 11}",
                "{4, 9, 25, 49, 121}",
                "{1, 4, 9, 25, 49, 121}"
            ],
            "answer": "{4, 9, 25, 49, 121}"
        },
        {
            "id": 6,
            "question": "(a + 2, 4) மற்றும் (5, 2a + b) ஆகிய வரிசைச் சோடிகள் சமம் எனில், (a, b) என்பது",
            "options": [
                "(2, -2)",
                "(5, 1)",
                "(2, 3)",
                "(3, -2)"
            ],
            "answer": "(3, -2)"
        },
        {
            "id": 7,
            "question": "n(A) = m மற்றும் n(B) = n என்க. A-லிருந்து B-க்கு வரையறுக்கப்பட்ட வெற்று கணமில்லாத உறவுகளின் மொத்த எண்ணிக்கை",
            "options": [
                "mⁿ",
                "nᵐ",
                "2ᵐⁿ - 1",
                "2ᵐⁿ"
            ],
            "answer": "2ᵐⁿ - 1"
        },
        {
            "id": 8,
            "question": "{(a, 8), (6, b)} ஆனது ஒரு சமனிச் சார்பு எனில், a மற்றும் b மதிப்புகளாவன முறையே",
            "options": [
                "(8, 6)",
                "(8, 8)",
                "(6, 8)",
                "(6, 6)"
            ],
            "answer": "(8, 6)"
        },
        {
            "id": 9,
            "question": "A = {1, 2, 3, 4}, B = {4, 8, 9, 10} என்க. f : A → B, f = {(1, 4), (2, 8), (3, 9), (4, 10)} எனக் கொடுக்கப்பட்டால் f என்பது",
            "options": [
                "பலவற்றிலிருந்து ஒன்றுக்கான சார்பு",
                "சமனிச் சார்பு",
                "ஒன்றுக்கொன்றான சார்பு",
                "உட்சார்பு"
            ],
            "answer": "ஒன்றுக்கொன்றான சார்பு"
        },
        {
            "id": 10,
            "question": "f(x) = 2x² மற்றும் g(x) = 1/3x எனில் f o g ஆனது",
            "options": [
                "3 / 2x²",
                "2 / 3x²",
                "2 / 9x²",
                "1 / 6x²"
            ],
            "answer": "2 / 9x²"
        },
        {
            "id": 11,
            "question": "f : A → B ஆனது இருபுறச் சார்பு மற்றும் n(B) = 7 எனில் n(A) ஆனது",
            "options": [
                "7",
                "49",
                "1",
                "14"
            ],
            "answer": "7"
        },
        {
            "id": 12,
            "question": "f மற்றும் g என்ற இரண்டு சார்புகளும் f = {(0, 1), (2, 0), (3, -4), (4, 2), (5, 7)}, g = {(0, 2), (1, 0), (2, 4), (-4, 2), (7, 0)} எனக் கொடுக்கப்பட்டால் f o g -ன் வீச்சகமானது",
            "options": [
                "{0, 2, 3, 4, 5}",
                "{-4, 1, 0, 2, 7}",
                "{1, 2, 3, 4, 5}",
                "{0, 1, 2}"
            ],
            "answer": "{0, 1, 2}"
        },
        {
            "id": 13,
            "question": "f(x) = √(1 + x²) எனில்",
            "options": [
                "f(xy) = f(x).f(y)",
                "f(xy) ≥ f(x).f(y)",
                "f(xy) ≤ f(x).f(y)",
                "இவற்றில் ஒன்றுமில்லை"
            ],
            "answer": "f(xy) ≤ f(x).f(y)"
        },
        {
            "id": 14,
            "question": "g = {(1, 1), (2, 3), (3, 5), (4, 7)} என்ற சார்பானது g(x) = αx + β எனக் கொடுக்கப்பட்டால் α, β -ன் மதிப்பானது",
            "options": [
                "(-1, 2)",
                "(2, -1)",
                "(-1, -2)",
                "(1, 2)"
            ],
            "answer": "(2, -1)"
        },
        {
            "id": 15,
            "question": "f(x) = (x + 1)³ - (x - 1)³ குறிப்பிடும் சார்பானது",
            "options": [
                "நேரிய சார்பு",
                "ஒரு கனச் சார்பு",
                "தலைகீழ்ச் சார்பு",
                "இருபடிச் சார்பு"
            ],
            "answer": "இருபடிச் சார்பு"
        }
    ]
};

async function main() {
    console.log(`Starting import of Chapter ${tamilChapterData.unit}: ${tamilChapterData.chapter_name}`);

    // Create Chapter
    try {
        const chapter = await databases.createDocument(
            DATABASE_ID,
            CHAPTERS_COLLECTION,
            ID.unique(),
            {
                name: `அலகு ${tamilChapterData.unit}: ${tamilChapterData.chapter_name}`,
                description: tamilChapterData.chapter_name,
                color: "emerald-500", // Default color
                icon: "📐", // Default icon
                medium: "tamil",
                questionCount: tamilChapterData.questions.length
            }
        );
        console.log(`✅ Created chapter: ${chapter.name} (${chapter.$id})`);

        // Create Questions
        for (const q of tamilChapterData.questions) {
            // Find correct answer index
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
                    createdBy: "admin", // System created
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
