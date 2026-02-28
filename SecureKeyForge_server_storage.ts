import {
  users,
  passwordEntries,
  type User,
  type UpsertUser,
  type PasswordEntry,
  type InsertPasswordEntry,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  setMasterPassword(userId: string, hashedPassword: string): Promise<void>;
  verifyMasterPassword(userId: string, hashedPassword: string): Promise<boolean>;
  
  // Password entries methods
  getAllPasswordEntries(userId: string): Promise<PasswordEntry[]>;
  createPasswordEntry(userId: string, entry: InsertPasswordEntry): Promise<PasswordEntry>;
  deletePasswordEntry(id: number, userId: string): Promise<boolean>;
  clearAllPasswordEntries(userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async setMasterPassword(userId: string, hashedPassword: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        masterPassword: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  async verifyMasterPassword(userId: string, hashedPassword: string): Promise<boolean> {
    const [user] = await db
      .select({ masterPassword: users.masterPassword })
      .from(users)
      .where(eq(users.id, userId));
    
    return user?.masterPassword === hashedPassword;
  }

  // Password entries operations
  async getAllPasswordEntries(userId: string): Promise<PasswordEntry[]> {
    return await db
      .select()
      .from(passwordEntries)
      .where(eq(passwordEntries.userId, userId))
      .orderBy(passwordEntries.createdAt);
  }

  async createPasswordEntry(userId: string, insertEntry: InsertPasswordEntry): Promise<PasswordEntry> {
    const [entry] = await db
      .insert(passwordEntries)
      .values({
        ...insertEntry,
        userId,
      })
      .returning();
    return entry;
  }

  async deletePasswordEntry(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(passwordEntries)
      .where(eq(passwordEntries.id, id));
    return (result.rowCount || 0) > 0;
  }

  async clearAllPasswordEntries(userId: string): Promise<void> {
    await db
      .delete(passwordEntries)
      .where(eq(passwordEntries.userId, userId));
  }
}

export const storage = new DatabaseStorage();
