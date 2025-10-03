import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    adultVisuals: {
      type: Type.INTEGER,
      description: "Percentage likelihood of containing visually explicit or suggestive content intended for mature audiences."
    },
    aggressiveBehavior: {
      type: Type.INTEGER,
      description: "Percentage likelihood of showcasing verbal aggression, physical altercations, or patterns of hostile behavior."
    },
    nonTraditionalRelationships: {
      type: Type.INTEGER,
      description: "Percentage likelihood of featuring or discussing relationship dynamics outside of traditional monogamous, heterosexual norms."
    },
    inappropriateLanguage: {
      type: Type.INTEGER,
      description: "Percentage likelihood of using profane, vulgar, or socially inappropriate language."
    },
    lgbtqRepresentation: {
      type: Type.INTEGER,
      description: "Percentage likelihood of including themes, discussions, or representations related to lesbian, gay, bisexual, transgender, and queer identities."
    },
  },
  required: [
    'adultVisuals',
    'aggressiveBehavior',
    'nonTraditionalRelationships',
    'inappropriateLanguage',
    'lgbtqRepresentation'
  ],
};

export async function analyzeVideoContent(title: string, channelName: string): Promise<string> {
  const prompt = `
    You are a highly sophisticated content moderation and analysis AI. Your task is to analyze the likely content of a YouTube video based on its title and channel name.

    Video Title: "${title}"
    Channel Name: "${channelName}"

    Based on this information, evaluate the probability of the video containing content across the following five categories. Express this probability as an integer percentage from 0 to 100.

    Your response must be a single, raw JSON object that strictly adheres to the provided schema. Do not include any explanatory text, markdown formatting like \`\`\`json, or any characters outside of the JSON structure.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2,
      },
    });

  return String(response.text);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("The AI model failed to generate a response.");
  }
}