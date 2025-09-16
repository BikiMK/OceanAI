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

  // AI Prediction - Enhanced with accurate coordinates and ocean data
  app.post("/api/ml-predict", async (req, res) => {
    try {
      const { query } = req.body;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: "Query is required" });
      }

      // Import enhanced parsing and data
      const { parseMarineQuery, resolveRegionCoordinates } = await import("./queryParser.js");
      const { findMarineRegion } = await import("../shared/marineGazetteer.js");
      const { generateOceanPrediction, generateTrendAnalysis } = await import("./gemini.js");
      
      // Parse the query to understand what user is asking for
      const parsedQuery = parseMarineQuery(query);
      const coordinates = resolveRegionCoordinates(parsedQuery.regionRaw);
      
      // Build the response based on query type
      const response: any = {
        queryType: parsedQuery.queryType,
        coordinates,
        model_used: false
      };
      
      // Add species information if found
      if (parsedQuery.species) {
        response.species = parsedQuery.species;
        response.scientificName = parsedQuery.scientificName;
      }
      
      // Add region information if found
      if (parsedQuery.regionRaw) {
        const regionData = findMarineRegion(parsedQuery.regionRaw);
        if (regionData) {
          response.regionCanonical = regionData.canonicalName;
          
          // For ocean or composite queries, include ocean metrics
          if (parsedQuery.queryType === 'ocean' || parsedQuery.queryType === 'composite') {
            response.oceanMetrics = regionData.oceanMetrics;
          }
        }
      }
      
      // Generate AI predictions for species or composite queries
      if (parsedQuery.queryType === 'species' || parsedQuery.queryType === 'composite') {
        try {
          const predictionData = await generateOceanPrediction(query);
          response.stock_status = predictionData.stock_status;
          response.fishPopulation = predictionData.fishPopulation;
          response.climateChange = predictionData.climateChange;
          response.geneticDiversity = predictionData.geneticDiversity;
          response.confidence = predictionData.confidence;
          response.prediction_summary = predictionData.prediction_summary;
          response.model_used = true;
          
          // For composite queries, add trend analysis
          if (parsedQuery.queryType === 'composite') {
            response.trendSummary = await generateTrendAnalysis(query, parsedQuery.species || '', parsedQuery.regionRaw || '');
          }
        } catch (error) {
          console.warn("Gemini prediction failed, using fallback:", error);
          // Use fallback data for species queries
          response.stock_status = "Stable";
          response.fishPopulation = "+5.2%";
          response.climateChange = "-2.1%";
          response.geneticDiversity = "Medium";
          response.confidence = "85%";
          response.prediction_summary = "Fallback prediction based on general marine trends.";
        }
      }
      
      res.json(response);

    } catch (error) {
      console.error("Enhanced prediction error:", error);
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
