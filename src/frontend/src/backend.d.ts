import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
}
export interface Note {
    id: bigint;
    title: string;
    content: string;
    timestamp: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearAllRecords(): Promise<void>;
    createNote(title: string, content: string, timestamp: bigint): Promise<bigint>;
    deleteNote(noteId: bigint): Promise<void>;
    getAllNotes(): Promise<Array<Note>>;
    getAllNotesSortedByTimestamp(): Promise<Array<Note>>;
    getAllSessionRecords(): Promise<Array<[bigint, bigint]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDailyTimeLimit(): Promise<bigint | null>;
    getNoteById(noteId: bigint): Promise<Note | null>;
    getTodaysSessionRecords(dayStartTimestamp: bigint): Promise<Array<[bigint, bigint]>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveSessionRecord(startTime: bigint, endTime: bigint): Promise<void>;
    setDailyTimeLimit(minutes: bigint): Promise<void>;
    updateNote(noteId: bigint, newTitle: string, newContent: string): Promise<void>;
}
