export interface Movie {
  id: string;
  title: string;
  year: string;
  genre: string;
  description: string;
  rating: number;
  imageUrl: string;
}

export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: number;
}

export interface UserProfile {
  id: string;
  username: string;
  streak: number;
  holyTrinity: Movie[];
  watchedHistory: Movie[];
}
