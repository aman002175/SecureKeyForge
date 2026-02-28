import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPasswordEntrySchema, setMasterPasswordSchema, verifyMasterPasswordSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth, isAuthenticated, requireMasterPassword, hashPassword, verifyPassword } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Master password setup
  app.post('/api/auth/master-password/setup', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.masterPassword) {
        return res.status(400).json({ message: "Master password already set" });
      }

      const { masterPassword } = setMasterPasswordSchema.parse(req.body);
      const hashedPassword = await hashPassword(masterPassword);
      
      await storage.setMasterPassword(userId, hashedPassword);
      req.session.masterPasswordVerified = true;
      
      res.json({ message: "Master password set successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else {
        console.error("Error setting master password:", error);
        res.status(500).json({ message: "Failed to set master password" });
      }
    }
  });

  // Master password verification
  app.post('/api/auth/master-password/verify', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.masterPassword) {
        return res.status(400).json({ message: "Master password not set" });
      }

      const { masterPassword } = verifyMasterPasswordSchema.parse(req.body);
      const isValid = await verifyPassword(masterPassword, user.masterPassword);
      
      if (isValid) {
        req.session.masterPasswordVerified = true;
        res.json({ message: "Master password verified successfully" });
      } else {
        res.status(401).json({ message: "Invalid master password" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else {
        console.error("Error verifying master password:", error);
        res.status(500).json({ message: "Failed to verify master password" });
      }
    }
  });

  // Check master password status
  app.get('/api/auth/master-password/status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      res.json({
        hasPassword: !!user?.masterPassword,
        isVerified: !!req.session.masterPasswordVerified
      });
    } catch (error) {
      console.error("Error checking master password status:", error);
      res.status(500).json({ message: "Failed to check master password status" });
    }
  });

  // Get all password entries (protected)
  app.get("/api/password-entries", isAuthenticated, requireMasterPassword, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entries = await storage.getAllPasswordEntries(userId);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching password entries:", error);
      res.status(500).json({ message: "Failed to fetch password entries" });
    }
  });

  // Create new password entry (protected)
  app.post("/api/password-entries", isAuthenticated, requireMasterPassword, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertPasswordEntrySchema.parse(req.body);
      const entry = await storage.createPasswordEntry(userId, validatedData);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else {
        console.error("Error creating password entry:", error);
        res.status(500).json({ message: "Failed to create password entry" });
      }
    }
  });

  // Delete password entry (protected)
  app.delete("/api/password-entries/:id", isAuthenticated, requireMasterPassword, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid entry ID" });
      }

      const deleted = await storage.deletePasswordEntry(id, userId);
      if (deleted) {
        res.json({ message: "Password entry deleted successfully" });
      } else {
        res.status(404).json({ message: "Password entry not found" });
      }
    } catch (error) {
      console.error("Error deleting password entry:", error);
      res.status(500).json({ message: "Failed to delete password entry" });
    }
  });

  // Clear all password entries (protected)
  app.delete("/api/password-entries", isAuthenticated, requireMasterPassword, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.clearAllPasswordEntries(userId);
      res.json({ message: "All password entries cleared successfully" });
    } catch (error) {
      console.error("Error clearing password entries:", error);
      res.status(500).json({ message: "Failed to clear password entries" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
