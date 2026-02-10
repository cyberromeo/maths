import { databases, DATABASE_ID, COLLECTIONS, ID, Query } from "./appwrite";

// ============ TYPES ============

export interface Chapter {
    $id: string;
    name: string;
    description: string;
    color: string;
    icon: string;
    medium: "english" | "tamil";
    questionCount: number;
}

export interface Question {
    $id: string;
    chapterId: string;
    chapterName: string;
    questionText: string;
    options: string[];
    correctAnswer: number;
    createdBy: string;
    createdAt: string;
}

export interface Exam {
    $id: string;
    name: string;
    type: "practice" | "live";
    chapterId?: string;
    chapterName?: string;
    questionIds: string[];
    startTime?: string;
    endTime?: string;
    durationMinutes: number;
    createdBy: string;
    isActive: boolean;
    createdAt: string;
}

export interface ExamResult {
    $id: string;
    examId: string;
    examName: string;
    studentId: string;
    studentName: string;
    mode: "exam" | "quickrevise";
    score: number;
    totalQuestions: number;
    answers: { questionId: string; selected: number; correct: number; isCorrect: boolean }[];
    completedAt: string;
    timeTaken: number;
}

// ============ CHAPTERS ============

export async function getChapters(medium?: "english" | "tamil"): Promise<Chapter[]> {
    try {
        const queries = [Query.orderAsc("name")];
        if (medium) {
            queries.push(Query.equal("medium", medium));
        }

        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.CHAPTERS,
            queries
        );
        return response.documents as unknown as Chapter[];
    } catch (error) {
        console.error("Error fetching chapters:", error);
        return [];
    }
}

export async function getChapter(chapterId: string): Promise<Chapter | null> {
    try {
        const doc = await databases.getDocument(
            DATABASE_ID,
            COLLECTIONS.CHAPTERS,
            chapterId
        );
        return doc as unknown as Chapter;
    } catch (error) {
        console.error("Error fetching chapter:", error);
        return null;
    }
}

export async function createChapter(data: Omit<Chapter, "$id" | "questionCount">): Promise<Chapter> {
    const doc = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.CHAPTERS,
        ID.unique(),
        { ...data, medium: data.medium || "english", questionCount: 0 }
    );
    return doc as unknown as Chapter;
}

// ============ QUESTIONS ============

export async function getQuestions(chapterId?: string): Promise<Question[]> {
    try {
        const queries = chapterId
            ? [Query.equal("chapterId", chapterId), Query.orderDesc("createdAt")]
            : [Query.orderDesc("createdAt")];

        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.QUESTIONS,
            queries
        );
        return response.documents as unknown as Question[];
    } catch (error) {
        console.error("Error fetching questions:", error);
        return [];
    }
}

export async function getQuestion(questionId: string): Promise<Question | null> {
    try {
        const doc = await databases.getDocument(
            DATABASE_ID,
            COLLECTIONS.QUESTIONS,
            questionId
        );
        return doc as unknown as Question;
    } catch (error) {
        console.error("Error fetching question:", error);
        return null;
    }
}

export async function createQuestion(data: Omit<Question, "$id" | "createdAt">): Promise<Question> {
    const doc = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.QUESTIONS,
        ID.unique(),
        { ...data, createdAt: new Date().toISOString() }
    );

    // Update chapter question count
    await updateChapterQuestionCount(data.chapterId);

    return doc as unknown as Question;
}

export async function getQuestionsForChapters(chapterIds: string[]): Promise<Question[]> {
    try {
        const promises = chapterIds.map(id => getQuestions(id));
        const results = await Promise.all(promises);
        return results.flat();
    } catch (error) {
        console.error("Error fetching questions for chapters:", error);
        return [];
    }
}

export async function updateQuestion(questionId: string, data: Partial<Question>): Promise<Question> {
    const doc = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.QUESTIONS,
        questionId,
        data
    );
    return doc as unknown as Question;
}

export async function deleteQuestion(questionId: string, chapterId: string): Promise<void> {
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.QUESTIONS, questionId);
    await updateChapterQuestionCount(chapterId);
}

async function updateChapterQuestionCount(chapterId: string): Promise<void> {
    try {
        const questions = await getQuestions(chapterId);
        await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.CHAPTERS,
            chapterId,
            { questionCount: questions.length }
        );
    } catch (error) {
        console.error("Error updating chapter question count:", error);
    }
}

// ============ EXAMS ============

export async function getExams(type?: "practice" | "live", createdBy?: string): Promise<Exam[]> {
    try {
        const queries: string[] = [Query.orderDesc("createdAt")];

        if (type) queries.push(Query.equal("type", type));
        if (createdBy) queries.push(Query.equal("createdBy", createdBy));

        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.EXAMS,
            queries
        );
        return response.documents as unknown as Exam[];
    } catch (error) {
        console.error("Error fetching exams:", error);
        return [];
    }
}

export async function getActiveExams(): Promise<Exam[]> {
    try {
        const now = new Date().toISOString();
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.EXAMS,
            [
                Query.equal("type", "live"),
                Query.equal("isActive", true),
                Query.lessThanEqual("startTime", now),
                Query.greaterThanEqual("endTime", now),
            ]
        );
        return response.documents as unknown as Exam[];
    } catch (error) {
        console.error("Error fetching active exams:", error);
        return [];
    }
}

export async function getExam(examId: string): Promise<Exam | null> {
    try {
        const doc = await databases.getDocument(
            DATABASE_ID,
            COLLECTIONS.EXAMS,
            examId
        );
        return doc as unknown as Exam;
    } catch (error) {
        console.error("Error fetching exam:", error);
        return null;
    }
}

export async function createExam(data: Omit<Exam, "$id" | "createdAt">): Promise<Exam> {
    const doc = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.EXAMS,
        ID.unique(),
        { ...data, createdAt: new Date().toISOString() }
    );
    return doc as unknown as Exam;
}

export async function updateExam(examId: string, data: Partial<Exam>): Promise<Exam> {
    const doc = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.EXAMS,
        examId,
        data
    );
    return doc as unknown as Exam;
}

// ============ RESULTS ============

export async function getResults(studentId?: string, examId?: string): Promise<ExamResult[]> {
    try {
        const queries: string[] = [Query.orderDesc("completedAt"), Query.limit(100)];

        if (studentId) queries.push(Query.equal("studentId", studentId));
        if (examId) queries.push(Query.equal("examId", examId));

        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.RESULTS,
            queries
        );
        return response.documents as unknown as ExamResult[];
    } catch (error) {
        console.error("Error fetching results:", error);
        return [];
    }
}

export async function getResult(resultId: string): Promise<ExamResult | null> {
    try {
        const doc = await databases.getDocument(
            DATABASE_ID,
            COLLECTIONS.RESULTS,
            resultId
        );
        return doc as unknown as ExamResult;
    } catch (error) {
        console.error("Error fetching result:", error);
        return null;
    }
}

export async function createResult(data: Omit<ExamResult, "$id">): Promise<ExamResult> {
    // Appwrite stores answers as a JSON string, so stringify the array
    const dataToSave = {
        ...data,
        answers: JSON.stringify(data.answers || [])
    };
    const doc = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.RESULTS,
        ID.unique(),
        dataToSave
    );
    return doc as unknown as ExamResult;
}

// ============ ANALYTICS ============

export async function getStudentStats(studentId: string) {
    const results = await getResults(studentId);

    if (results.length === 0) {
        return {
            totalExams: 0,
            averageScore: 0,
            totalQuestions: 0,
            correctAnswers: 0,
        };
    }

    const totalExams = results.length;
    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const totalQuestions = results.reduce((sum, r) => sum + r.totalQuestions, 0);
    const averageScore = Math.round((totalScore / totalQuestions) * 100);

    return {
        totalExams,
        averageScore,
        totalQuestions,
        correctAnswers: totalScore,
    };
}

export async function getAllStudents(medium?: "english" | "tamil") {
    try {
        const queries = [Query.equal("role", "student"), Query.orderAsc("name")];
        if (medium) {
            queries.push(Query.equal("medium", medium));
        }

        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.USERS,
            queries
        );
        return response.documents;
    } catch (error) {
        console.error("Error fetching students:", error);
        return [];
    }
}
