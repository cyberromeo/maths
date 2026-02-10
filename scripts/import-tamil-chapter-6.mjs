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
    "unit": "6",
    "chapter_name": "முக்கோணவியல்",
    "total_questions": 15,
    "questions": [
        {
            "id": 1,
            "question": "sin²θ + 1/(1 + tan²θ) -ன் மதிப்பு",
            "options": [
                "tan²θ",
                "1",
                "cot²θ",
                "0"
            ],
            "answer": "1"
        },
        {
            "id": 2,
            "question": "tan θ cosec²θ - tan θ -ன் மதிப்பு",
            "options": [
                "sec θ",
                "cot²θ",
                "sin θ",
                "cot θ"
            ],
            "answer": "cot θ"
        },
        {
            "id": 3,
            "question": "(sin α + cosec α)² + (cos α + sec α)² = k + tan²α + cot²α எனில் k -ன் மதிப்பு",
            "options": [
                "9",
                "7",
                "5",
                "3"
            ],
            "answer": "7"
        },
        {
            "id": 4,
            "question": "sin θ + cos θ = a மற்றும் sec θ + cosec θ = b எனில் b(a² - 1) -ன் மதிப்பு",
            "options": [
                "2a",
                "3a",
                "0",
                "2ab"
            ],
            "answer": "2a"
        },
        {
            "id": 5,
            "question": "5x = sec θ மற்றும் 5/x = tan θ எனில் x² - 1/x² -ன் மதிப்பு",
            "options": [
                "25",
                "1/25",
                "5",
                "1"
            ],
            "answer": "1/25"
        },
        {
            "id": 6,
            "question": "sin θ = cos θ எனில் 2 tan²θ + sin²θ - 1 -ன் மதிப்பு",
            "options": [
                "-3/2",
                "3/2",
                "2/3",
                "-2/3"
            ],
            "answer": "3/2"
        },
        {
            "id": 7,
            "question": "x = a tan θ, y = b sec θ எனில்",
            "options": [
                "y²/b² - x²/a² = 1",
                "x²/a² - y²/b² = 1",
                "x²/a² + y²/b² = 1",
                "x²/a² - y²/b² = 0"
            ],
            "answer": "y²/b² - x²/a² = 1"
        },
        {
            "id": 8,
            "question": "(1 + tan θ + sec θ)(1 + cot θ - cosec θ) -ன் மதிப்பு",
            "options": [
                "0",
                "1",
                "2",
                "-1"
            ],
            "answer": "2"
        },
        {
            "id": 9,
            "question": "a cot θ + b cosec θ = p மற்றும் b cot θ + a cosec θ = q எனில் p² - q² -ன் மதிப்பு",
            "options": [
                "a² - b²",
                "b² - a²",
                "a² + b²",
                "b - a"
            ],
            "answer": "b² - a²"
        },
        {
            "id": 10,
            "question": "ஒரு கோபுரத்தின் உயரத்திற்கும், அதன் நிழலின் நீளத்திற்கும் உள்ள விகிதம் √3 : 1 எனில் சூரியனைக் காணும் ஏற்றக்கோண அளவானது",
            "options": [
                "45°",
                "30°",
                "90°",
                "60°"
            ],
            "answer": "60°"
        },
        {
            "id": 11,
            "question": "ஒரு மின்கம்பமானது அதன் அடியில் சமதளப் பரப்பில் உள்ள ஒரு புள்ளியில் 30° கோணத்தை ஏற்படுத்துகிறது. முதல் புள்ளிக்கு 'b' மீ உயரத்தில் உள்ள இரண்டாவது புள்ளியிலிருந்து மின்கம்பத்தின் அடிக்கு இறக்ககோணம் 60° எனில், மின் கம்பத்தின் உயரமானது",
            "options": [
                "√3 b",
                "b/3",
                "b/2",
                "b/√3"
            ],
            "answer": "b/3"
        },
        {
            "id": 12,
            "question": "ஒரு கோபுரத்தின் உயரம் 60 மீ ஆகும். சூரியனைக் காணும் ஏற்றக்கோணம் 30° -யிலிருந்து 45° ஆக உயரும்போது, கோபுரத்தின் நிழலானது x-மீ குறைகிறது எனில், x -ன் மதிப்பு",
            "options": [
                "41.92 மீ",
                "43.92 மீ",
                "43 மீ",
                "45.6 மீ"
            ],
            "answer": "43.92 மீ"
        },
        {
            "id": 13,
            "question": "பல அடுக்குக் கட்டடத்தின் உச்சியிலிருந்து 20 மீ உயரமுள்ள கட்டடத்தின் உச்சி, அடி ஆகியவற்றின் இறக்கக்கோணங்கள் முறையே 30° மற்றும் 60° எனில், பல அடுக்குக் கட்டடத்தின் உயரம் மற்றும் இரு கட்டடங்களுக்கு இடையேயுள்ள தொலைவானது (மீட்டரில்)",
            "options": [
                "20, 10√3",
                "30, 5√3",
                "20, 10",
                "30, 10√3"
            ],
            "answer": "30, 10√3"
        },
        {
            "id": 14,
            "question": "இரண்டு நபர்களுக்கு இடைப்பட்ட தொலைவு 'x' மீ ஆகும். முதல் நபரின் உயரமானது இரண்டாவது நபரின் உயரத்தைப் போல இரு மடங்காக உள்ளது. அவர்களுக்கு இடைப்பட்ட தொலைவு நேர்கோட்டின் மையப் புள்ளியிலிருந்து இரு நபர்களின் உச்சியின் ஏற்றக் கோணங்கள் நிரப்புக்கோணங்கள் எனில், குட்டையாக உள்ள நபரின் உயரம் (மீட்டரில்) காண்க.",
            "options": [
                "√2x",
                "x / 2√2",
                "x / √2",
                "2x"
            ],
            "answer": "x / 2√2"
        },
        {
            "id": 15,
            "question": "ஓர் ஏரியின் மேலே h மீ உயரத்தில் உள்ள ஒரு புள்ளியிலிருந்து மேகத்திற்கு உள்ள ஏற்றக்கோணம் β. மேக பிம்பத்தின் இறக்கக் கோணம் 45° எனில், ஏரியில் இருந்து மேகத்திற்கு உள்ள உயரமானது",
            "options": [
                "h(1 + tan β) / (1 - tan β)",
                "h(1 - tan β) / (1 + tan β)",
                "h tan(45° - β)",
                "இல்லை"
            ],
            "answer": "h(1 + tan β) / (1 - tan β)"
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
                color: "cyan-500", // Cyan for Trigonometry
                icon: "📐", // Triangle ruler again, fitting for Trig
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
