// src/api/api.ts
export interface Player {
  playerName: string;
  score: string;
  playerId: string;
  country: string;
  balance: string;
}

export interface LeaderboardResponse {
  leaderboard: Player[];
  userRank: number;
  surroundingPlayers?: Player[];
}

export const fetchPlayerSuggestions = async (query: string): Promise<string[]> => {
  try {
    const response = await fetch(`http://192.168.1.91:3000/players/search?q=${query}`);
    const data = await response.json();
    return data.suggestions;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
};

export const fetchLeaderboard = async (playerName: string) => {
  try {
    const response = await fetch(`http://192.168.1.91:3000/api/leaderboard?playerName=${playerName}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return { leaderboard: [], userRank: null };
  }
};