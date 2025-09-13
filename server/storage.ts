import { type UserProfile, type InsertUserProfile, type Prediction, type InsertPrediction } from "@shared/schema";
import { randomUUID } from "crypto";

// Storage interface for user profiles and predictions
export interface IStorage {
  getUserProfile(id: string): Promise<UserProfile | undefined>;
  getUserProfileByEmail(email: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(id: string, profile: Partial<InsertUserProfile>): Promise<UserProfile | undefined>;
  
  getPrediction(id: string): Promise<Prediction | undefined>;
  getUserPredictions(userId: string): Promise<Prediction[]>;
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;
  searchPredictions(userId: string, query: string): Promise<Prediction[]>;
}

export class MemStorage implements IStorage {
  private userProfiles: Map<string, UserProfile>;
  private predictions: Map<string, Prediction>;

  constructor() {
    this.userProfiles = new Map();
    this.predictions = new Map();
  }

  async getUserProfile(id: string): Promise<UserProfile | undefined> {
    return this.userProfiles.get(id);
  }

  async getUserProfileByEmail(email: string): Promise<UserProfile | undefined> {
    return Array.from(this.userProfiles.values()).find(
      (profile) => profile.email === email,
    );
  }

  async createUserProfile(insertProfile: InsertUserProfile): Promise<UserProfile> {
    const id = randomUUID();
    const profile: UserProfile = { 
      id,
      email: insertProfile.email,
      fullName: insertProfile.fullName || null,
      organization: insertProfile.organization || null,
      role: insertProfile.role || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.userProfiles.set(id, profile);
    return profile;
  }

  async updateUserProfile(id: string, updates: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const existing = this.userProfiles.get(id);
    if (!existing) return undefined;
    
    const updated: UserProfile = { 
      ...existing, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.userProfiles.set(id, updated);
    return updated;
  }

  async getPrediction(id: string): Promise<Prediction | undefined> {
    return this.predictions.get(id);
  }

  async getUserPredictions(userId: string): Promise<Prediction[]> {
    return Array.from(this.predictions.values()).filter(
      (prediction) => prediction.userId === userId,
    );
  }

  async createPrediction(insertPrediction: InsertPrediction): Promise<Prediction> {
    const id = randomUUID();
    const prediction: Prediction = { 
      id,
      userId: insertPrediction.userId,
      species: insertPrediction.species,
      region: insertPrediction.region,
      timeframe: insertPrediction.timeframe,
      scenario: insertPrediction.scenario,
      fishPopulation: insertPrediction.fishPopulation || null,
      climateChange: insertPrediction.climateChange || null,
      geneticDiversity: insertPrediction.geneticDiversity || null,
      createdAt: new Date()
    };
    this.predictions.set(id, prediction);
    return prediction;
  }

  async searchPredictions(userId: string, query: string): Promise<Prediction[]> {
    const userPredictions = await this.getUserPredictions(userId);
    return userPredictions.filter(prediction => 
      prediction.species.toLowerCase().includes(query.toLowerCase()) ||
      prediction.region.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export const storage = new MemStorage();
