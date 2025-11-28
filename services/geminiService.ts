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
    goodreadsUrl: { type: Type.STRING },
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
      Generate a structured JSON object for a book landing page for the book: "${query}".
      
      Instructions:
      1. If the book is "It's in the Blood", treat it as a high-stakes Thriller/Mystery novel. If real details are unknown, halluciation is permitted for the creative purpose of this demo: assume a plot about a detective discovering a genetic conspiracy.
      2. The 'tagline' should be short, punchy, and cinematic.
      3. 'synopsis' should be 2 paragraphs long, intriguing, without spoilers.
      4. 'emotionalArc' should track the narrative tension (0-100) across 6 chapters/segments.
      5. Include a valid looking 'goodreadsUrl' (e.g. https://www.goodreads.com/book/show/220291737-it-s-in-the-blood for "It's in the Blood").
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
        You are the personification of the book "${bookContext.title}".
        Tone: Atmospheric, intelligent, slightly mysterious, but helpful.
        Context:
        ${JSON.stringify(bookContext)}
        
        Keep answers under 80 words. Be evocative.
      `,
    },
  });
};