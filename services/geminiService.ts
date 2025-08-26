
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedIdea } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const model = "gemini-2.5-flash";

const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: "A short, catchy name for the product or service idea."
        },
        description: {
          type: Type.STRING,
          description: "A brief, one or two-sentence description of the idea."
        }
      },
      required: ["title", "description"]
    }
};

export const generateIdeas = async (businessType: string): Promise<GeneratedIdea[]> => {
    if (!API_KEY) {
        throw new Error("API key is not configured.");
    }
    
    const prompt = `Generate 5 innovative and practical product or service ideas for a small business in the field of "${businessType}". The ideas should be creative and suitable for a small to medium enterprise (UMKM).`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.8,
                topP: 0.9,
            }
        });
        
        const jsonText = response.text.trim();
        const parsedResult = JSON.parse(jsonText);

        // Basic validation
        if (Array.isArray(parsedResult) && parsedResult.every(item => 'title' in item && 'description' in item)) {
            return parsedResult as GeneratedIdea[];
        } else {
            console.error("Parsed JSON does not match expected schema:", parsedResult);
            throw new Error("Received an invalid format from the AI.");
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to communicate with the AI service.");
    }
};
