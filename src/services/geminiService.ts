import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface Movie {
  id: string;
  title: string;
  year: string;
  genre: string;
  description: string;
  rating: number;
  imageUrl: string;
}

export async function getMovieRecommendations(userPreferences: string): Promise<Movie[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Recommend 6 movies based on these preferences: ${userPreferences}. Return a JSON array of objects with id, title, year, genre, description, rating (out of 10), and a search keyword for an image.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            year: { type: Type.STRING },
            genre: { type: Type.STRING },
            description: { type: Type.STRING },
            rating: { type: Type.NUMBER },
            imageKeyword: { type: Type.STRING },
          },
          required: ["id", "title", "year", "genre", "description", "rating", "imageKeyword"],
        },
      },
    },
  });

  const data = JSON.parse(response.text || "[]");
  return data.map((m: any) => ({
    ...m,
    imageUrl: `https://picsum.photos/seed/${m.imageKeyword}/400/600`,
  }));
}

export async function summarizeChat(messages: { user: string; text: string }[]): Promise<string> {
  const chatHistory = messages.map(m => `${m.user}: ${m.text}`).join("\n");
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Summarize the following movie chat discussion in 2-3 sentences, highlighting the main movies discussed and the general sentiment:\n\n${chatHistory}`,
  });

  return response.text || "No summary available.";
}

export async function tagChat(messages: { user: string; text: string }[]): Promise<string[]> {
  const chatHistory = messages.map(m => `${m.user}: ${m.text}`).join("\n");
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this movie chat and provide 3-5 relevant tags (genres, emotions, or themes discussed). Return as a JSON array of strings.\n\n${chatHistory}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
    },
  });

  return JSON.parse(response.text || "[]");
}
