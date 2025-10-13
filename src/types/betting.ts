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

export interface PlayerProp {
  id: string;
  sport: string;
  league: string;
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  playerName: string;
  playerTeam: string;
  playerPosition?: string;
  playerImage?: string;
  statType: 'points' | 'rebounds' | 'assists' | 'three_pointers' | 'yards' | 'touchdowns' | 'receptions' | 'strikeouts' | 'hits' | 'home_runs' | 'goals' | 'shots' | 'saves';
  line: number; // The over/under line
  overOdds: number;
  underOdds: number;
  startTime: Date;
  category: string;
  status: 'upcoming' | 'live' | 'finished';
  currentValue?: number; // Current stat value during live games
  matchTime?: string;
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
  // For player props
  isPlayerProp?: boolean;
  playerName?: string;
  statType?: string;
  line?: number;
  selection?: 'over' | 'under';
}

export interface UserStats {
  totalBets: number;
  wonBets: number;
  totalWagered: number;
  totalWinnings: number;
}

