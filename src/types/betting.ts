export interface Bet {
  id: string;
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeOdds: number;
  awayOdds: number;
  drawOdds?: number;
  startTime: Date;
  category: string;
  status: 'upcoming' | 'live' | 'finished';
  homeScore?: number;
  awayScore?: number;
  matchTime?: string; // e.g., "45'", "2nd Quarter", "Top 3rd", "Set 2"
  isFinished?: boolean;
}

export interface PlacedBet {
  id: string;
  betId: string;
  team: string;
  amount: number;
  odds: number;
  potentialWin: number;
  timestamp: Date;
  status: 'pending' | 'won' | 'lost';
}

export interface UserStats {
  totalBets: number;
  wonBets: number;
  totalWagered: number;
  totalWinnings: number;
}

