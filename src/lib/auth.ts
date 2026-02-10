import { account, databases, DATABASE_ID, COLLECTIONS, ID, TEACHER_SECRET_CODE } from "./appwrite";
import { AppwriteException } from "appwrite";

export interface User {
    $id: string;
    email: string;
    name: string;
    role: "teacher" | "student";
    medium: "english" | "tamil";
    createdAt: string;
}

// Sign up a new user
export async function signUp(
    email: string,
    password: string,
    name: string,
    role: "teacher" | "student",
    medium: "english" | "tamil" = "english",
    teacherCode?: string
): Promise<User> {
    // Validate teacher code if role is teacher
    if (role === "teacher") {
        if (!teacherCode || teacherCode !== TEACHER_SECRET_CODE) {
            throw new Error("Invalid teacher registration code");
        }
    }

    try {
        // Create auth account
        const authUser = await account.create(ID.unique(), email, password, name);

        // Create user document in database
        const userDoc = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            authUser.$id,
            {
                email,
                name,
                role,
                medium,
                createdAt: new Date().toISOString(),
            }
        );

        // Create session
        await account.createEmailPasswordSession(email, password);

        return {
            $id: userDoc.$id,
            email: userDoc.email,
            name: userDoc.name,
            role: userDoc.role,
            medium: userDoc.medium || "english",
            createdAt: userDoc.createdAt,
        };
    } catch (error) {
        if (error instanceof AppwriteException) {
            if (error.code === 409) {
                throw new Error("An account with this email already exists");
            }
        }
        throw error;
    }
}

// Sign in an existing user
export async function signIn(email: string, password: string): Promise<User> {
    try {
        // Create session
        await account.createEmailPasswordSession(email, password);

        // Get current user
        const authUser = await account.get();

        // Get user document
        const userDoc = await databases.getDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            authUser.$id
        );

        return {
            $id: userDoc.$id,
            email: userDoc.email,
            name: userDoc.name,
            role: userDoc.role,
            medium: userDoc.medium || "english",
            createdAt: userDoc.createdAt,
        };
    } catch (error) {
        if (error instanceof AppwriteException) {
            if (error.code === 401) {
                throw new Error("Invalid email or password");
            }
        }
        throw error;
    }
}

// Sign out the current user
export async function signOut(): Promise<void> {
    try {
        await account.deleteSession("current");
    } catch (error) {
        console.error("Error signing out:", error);
        throw error;
    }
}

// Get the current user
export async function getCurrentUser(): Promise<User | null> {
    try {
        const authUser = await account.get();

        const userDoc = await databases.getDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            authUser.$id
        );

        return {
            $id: userDoc.$id,
            email: userDoc.email,
            name: userDoc.name,
            role: userDoc.role,
            medium: userDoc.medium || "english",
            createdAt: userDoc.createdAt,
        };
    } catch {
        return null;
    }
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
    try {
        await account.get();
        return true;
    } catch {
        return false;
    }
}
