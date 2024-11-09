export interface Player {
  playerId: string;
  playerName: string;
  country: string;
  balance: string;
  rank: number;
  score: string;
}

export const mockPlayers: Player[] = [
  { playerId: "1148129", playerName: "Uma_1148128", country: "Italy", balance: "1791.00", rank: 1, score: "188" },
  { playerId: "234567", playerName: "Alice_Smith", country: "Sweden", balance: "750.00", rank: 2, score: "180" },
  { playerId: "345678", playerName: "Bob_Johnson", country: "USA", balance: "1000.00", rank: 3, score: "170" },
  { playerId: "456789", playerName: "Charlie_Brown", country: "Turkey", balance: "10.00", rank: 4, score: "160" },
  { playerId: "567890", playerName: "Emily_Davis", country: "France", balance: "800.00", rank: 5, score: "150" }
];
