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
  const response = await fetch("/api/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ preferences: userPreferences }),
  });
  if (!response.ok) throw new Error("Failed to fetch recommendations");
  return response.json();
}

export async function summarizeChat(messages: { user: string; text: string }[]): Promise<string> {
  const response = await fetch("/api/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!response.ok) throw new Error("Failed to fetch summary");
  const data = await response.json();
  return data.summary;
}

export async function tagChat(messages: { user: string; text: string }[]): Promise<string[]> {
  const response = await fetch("/api/tags", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!response.ok) throw new Error("Failed to fetch tags");
  return response.json();
}
