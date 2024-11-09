export interface Player {
  id: number;
  name: string;
  balance: number;
}

export interface WeeklyEarnings {
  playerId: number;
  earnings: number;
  week: number;
}
