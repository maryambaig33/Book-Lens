export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface Character {
  name: string;
  role: string;
  description: string;
}

export interface Review {
  source: string;
  quote: string;
  rating: number; // 1-5
}

export interface EmotionalArcPoint {
  chapter: number;
  tension: number; // 0-100
  label: string;
}

export interface BookData {
  title: string;
  author: string;
  tagline: string;
  synopsis: string;
  genres: string[];
  publicationYear: string;
  characters: Character[];
  reviews: Review[];
  themes: string[];
  emotionalArc: EmotionalArcPoint[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
