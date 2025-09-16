import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User profiles table for additional user data beyond Supabase auth
export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  organization: text("organization"),
  role: text("role"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI Predictions table to store user predictions
export const predictions = pgTable("predictions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  species: text("species").notNull(),
  region: text("region").notNull(),
  timeframe: text("timeframe").notNull(),
  scenario: text("scenario").notNull(),
  fishPopulation: text("fish_population"),
  climateChange: text("climate_change"),
  geneticDiversity: text("genetic_diversity"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).pick({
  email: true,
  fullName: true,
  organization: true,
  role: true,
});

export const insertPredictionSchema = createInsertSchema(predictions).omit({
  id: true,
  createdAt: true,
});

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type Prediction = typeof predictions.$inferSelect;

// Enhanced AI Prediction Types for improved search functionality
export type QueryType = 'species' | 'ocean' | 'composite';

export interface Coordinates {
  lat: number;
  lng: number;
  zoom?: number;
  bbox?: [number, number, number, number]; // [minLat, minLng, maxLat, maxLng]
}

export interface OceanMetrics {
  salinityPSU: number;
  pH: number;
  temperatureC: number;
  popularFishes: string[];
}

export interface EnhancedPredictionResponse {
  queryType: QueryType;
  species?: string;
  scientificName?: string;
  regionCanonical?: string;
  coordinates: Coordinates;
  stock_status?: string;
  fishPopulation?: string;
  climateChange?: string;
  geneticDiversity?: string;
  confidence?: string;
  prediction_summary?: string;
  oceanMetrics?: OceanMetrics;
  trendSummary?: string;
  model_used: boolean;
}

export interface ParsedQuery {
  queryType: QueryType;
  species?: string;
  scientificName?: string;
  regionRaw?: string;
  originalQuery: string;
}
