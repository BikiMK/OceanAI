import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface OceanPrediction {
  species: string;
  region: string;
  stock_status: string;
  fishPopulation: string;
  climateChange: string;
  geneticDiversity: string;
  confidence: string;
  model_used: boolean;
  prediction_summary: string;
}

export async function generateOceanPrediction(query: string): Promise<OceanPrediction> {
  try {
    const systemPrompt = `You are an advanced marine biology AI that analyzes ocean ecosystems and fish populations. 
    Based on the user's query about marine species, generate detailed predictions about fish stocks, population trends, and environmental impacts.
    
    Always respond with JSON in this exact format:
    {
      "species": "species name from query",
      "region": "most likely ocean region for this species",
      "stock_status": "Increasing/Stable/Declining",
      "fishPopulation": "percentage change with + or - sign",
      "climateChange": "climate impact percentage with + or - sign", 
      "geneticDiversity": "High/Medium/Low",
      "confidence": "percentage like 87%",
      "model_used": true,
      "prediction_summary": "brief explanation of the prediction"
    }
    
    Use realistic data based on current marine biology knowledge. If the query is not about a marine species, return an error.`;

    const userPrompt = `Generate ocean prediction data for: ${query}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            species: { type: "string" },
            region: { type: "string" },
            stock_status: { type: "string" },
            fishPopulation: { type: "string" },
            climateChange: { type: "string" },
            geneticDiversity: { type: "string" },
            confidence: { type: "string" },
            model_used: { type: "boolean" },
            prediction_summary: { type: "string" }
          },
          required: ["species", "region", "stock_status", "fishPopulation", "climateChange", "geneticDiversity", "confidence", "model_used", "prediction_summary"]
        }
      },
      contents: userPrompt
    });

    const rawJson = response.text;

    if (rawJson) {
      const data: OceanPrediction = JSON.parse(rawJson);
      return data;
    } else {
      throw new Error("Empty response from Gemini model");
    }
  } catch (error) {
    throw new Error(`Failed to generate ocean prediction: ${error}`);
  }
}

export async function analyzeMarineQuery(query: string): Promise<boolean> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Is this query about marine life, fish, ocean species, or marine biology? Answer only "yes" or "no": ${query}`
    });

    const answer = response.text?.toLowerCase().trim();
    return answer === "yes";
  } catch (error) {
    console.error("Error analyzing marine query:", error);
    return false;
  }
}

export async function generateTrendAnalysis(query: string, species: string, region: string): Promise<string> {
  try {
    const prompt = `Analyze the trend for ${species} in ${region} based on this query: "${query}". Provide a brief 2-3 sentence summary about population trends, environmental factors, and conservation status. Focus on whether the population is increasing, decreasing, or stable and why.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    return response.text || `${species} populations in ${region} show mixed trends influenced by climate change and fishing pressure.`;
  } catch (error) {
    console.error("Error generating trend analysis:", error);
    return `${species} populations in ${region} show mixed trends influenced by climate change and fishing pressure.`;
  }
}