
import { GoogleGenAI, Type } from "@google/genai";
import { GiftIdea } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateGiftIdeas = async (
  recipient: string,
  occasion: string,
  budget: string
): Promise<GiftIdea[]> => {
  try {
    const prompt = `You are a thoughtful gift recommender for a chic boutique marketplace called GIVORA. 
    Suggest 3 unique and creative gift ideas for ${recipient} for a ${occasion} occasion with a budget of around ${budget}.
    The gifts should feel personal, elegant, and suitable for a high-end boutique.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.STRING,
                description: "The name of the gift idea.",
              },
              description: {
                type: Type.STRING,
                description: "A short, appealing description of the gift.",
              },
            },
            required: ["name", "description"],
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const ideas: GiftIdea[] = JSON.parse(jsonText);
    return ideas;
  } catch (error) {
    console.error("Error generating gift ideas:", error);
    throw new Error("Failed to generate gift ideas. Please try again.");
  }
};
