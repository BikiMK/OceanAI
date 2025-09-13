import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPredictionSchema } from "@shared/schema";
import { spawn } from "child_process";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // User profile routes
  app.get("/api/profile/:id", async (req, res) => {
    try {
      const profile = await storage.getUserProfile(req.params.id);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.post("/api/profile", async (req, res) => {
    try {
      const profile = await storage.createUserProfile(req.body);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ error: "Failed to create profile" });
    }
  });

  // Prediction routes
  app.get("/api/predictions/:userId", async (req, res) => {
    try {
      const predictions = await storage.getUserPredictions(req.params.userId);
      res.json(predictions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch predictions" });
    }
  });

  app.post("/api/predictions", async (req, res) => {
    try {
      const validatedData = insertPredictionSchema.parse(req.body);
      const prediction = await storage.createPrediction(validatedData);
      res.json(prediction);
    } catch (error) {
      res.status(400).json({ error: "Failed to create prediction" });
    }
  });

  app.get("/api/predictions/:userId/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Search query required" });
      }
      const results = await storage.searchPredictions(req.params.userId, query);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to search predictions" });
    }
  });

  // AI Prediction - Use Gemini AI for marine predictions
  app.post("/api/ml-predict", async (req, res) => {
    try {
      const { query } = req.body;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: "Query is required" });
      }

      // Import Gemini functions
      const { generateOceanPrediction, analyzeMarineQuery } = await import("./gemini.js");

      // First check if the query is about marine life
      const isMarineQuery = await analyzeMarineQuery(query);
      
      if (!isMarineQuery) {
        return res.status(400).json({ 
          error: "Invalid species. Please search for marine species like tuna, salmon, cod, etc.",
          model_used: false
        });
      }

      // Generate prediction using Gemini AI
      const result = await generateOceanPrediction(query);
      res.json(result);

    } catch (error) {
      console.error("AI prediction error:", error);
      res.status(500).json({ 
        error: "Failed to generate prediction",
        message: error instanceof Error ? error.message : "Unknown error",
        model_used: false
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
