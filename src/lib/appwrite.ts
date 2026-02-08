import { Client, Account, Databases, ID, Query } from "appwrite";

const client = new Client()
    .setEndpoint("https://fra.cloud.appwrite.io/v1")
    .setProject("6988cf9b003ca9f28af5");

export const account = new Account(client);
export const databases = new Databases(client);

// Collection IDs
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
export const COLLECTIONS = {
    USERS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS!,
    CHAPTERS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_CHAPTERS!,
    QUESTIONS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_QUESTIONS!,
    EXAMS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_EXAMS!,
    RESULTS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_RESULTS!,
};

export const TEACHER_SECRET_CODE = "MATHS_TEACHER_2024";
export { client, ID, Query };
