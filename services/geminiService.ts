import { GoogleGenAI, Type, Chat } from "@google/genai";
import { BookData } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const BOOK_DATA_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    author: { type: Type.STRING },
    tagline: { type: Type.STRING },
    synopsis: { type: Type.STRING },
    genres: { type: Type.ARRAY, items: { type: Type.STRING } },
    publicationYear: { type: Type.STRING },
    characters: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          role: { type: Type.STRING },
          description: { type: Type.STRING },
        }
      }
    },
    reviews: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          source: { type: Type.STRING },
          quote: { type: Type.STRING },
          rating: { type: Type.NUMBER },
        }
      }
    },
    themes: { type: Type.ARRAY, items: { type: Type.STRING } },
    emotionalArc: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          chapter: { type: Type.NUMBER },
          tension: { type: Type.NUMBER },
          label: { type: Type.STRING },
        }
      }
    }
  },
  required: ["title", "author", "synopsis", "characters", "emotionalArc"]
};

export const fetchBookDetails = async (query: string): Promise<BookData> => {
  try {
    const modelId = "gemini-2.5-flash";
    const prompt = `
      Create a rich, engaging, and structured JSON object for a book landing page.
      The book is: "${query}".
      
      If the book is real and well-known, use accurate details.
      If the book is obscure or the title is generic (like "It's in the Blood"), infer a plausible, high-quality Thriller/Mystery/Fantasy plot based on the title "It's in the Blood". 
      Make it sound like a bestseller. 
      
      For the 'emotionalArc', generate 5-7 data points representing the narrative tension curve (0-100) across the story.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: BOOK_DATA_SCHEMA,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No data returned from Gemini");
    
    return JSON.parse(text) as BookData;
  } catch (error) {
    console.error("Error fetching book details:", error);
    throw error;
  }
};

export const createBookChat = (bookContext: BookData): Chat => {
  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: `
        You are the personification of the book "${bookContext.title}" by ${bookContext.author}.
        Your personality should reflect the tone of the book (e.g., mysterious, dark, intellectual, or thrilling).
        Answer questions about the plot, characters, and themes based on the following context:
        ${JSON.stringify(bookContext)}
        
        Keep answers concise (under 100 words) and engaging. Do not spoil major plot twists unless explicitly asked.
      `,
    },
  });
};
