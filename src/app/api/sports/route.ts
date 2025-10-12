import { NextRequest, NextResponse } from 'next/server';
import { Bet } from '@/types/betting';

// Comprehensive team data for realistic matchups
const teams = {
  nba: [
    'Los Angeles Lakers', 'Boston Celtics', 'Golden State Warriors', 'Miami Heat',
    'Milwaukee Bucks', 'Phoenix Suns', 'Brooklyn Nets', 'Philadelphia 76ers',
    'Denver Nuggets', 'Dallas Mavericks', 'Memphis Grizzlies', 'Cleveland Cavaliers',
    'New York Knicks', 'LA Clippers', 'Sacramento Kings', 'New Orleans Pelicans'
  ],
  nfl: [
    'Kansas City Chiefs', 'Buffalo Bills', 'San Francisco 49ers', 'Philadelphia Eagles',
    'Dallas Cowboys', 'Cincinnati Bengals', 'Miami Dolphins', 'Baltimore Ravens',
    'Jacksonville Jaguars', 'Los Angeles Chargers', 'Minnesota Vikings', 'Detroit Lions',
    'Seattle Seahawks', 'Green Bay Packers', 'New York Giants', 'Las Vegas Raiders'
  ],
  soccer: {
    premierLeague: [
      'Manchester City', 'Liverpool', 'Arsenal', 'Chelsea', 'Manchester United',
      'Tottenham', 'Newcastle United', 'Brighton', 'Aston Villa', 'West Ham'
    ],
    laLiga: [
      'Real Madrid', 'Barcelona', 'Atletico Madrid', 'Sevilla', 'Real Betis',
      'Villarreal', 'Athletic Bilbao', 'Real Sociedad'
    ],
    serieA: [
      'Inter Milan', 'AC Milan', 'Juventus', 'Napoli', 'Roma',
      'Lazio', 'Atalanta', 'Fiorentina'
    ]
  },
  mlb: [
    'New York Yankees', 'Los Angeles Dodgers', 'Boston Red Sox', 'Atlanta Braves',
    'Houston Astros', 'San Francisco Giants', 'Tampa Bay Rays', 'Toronto Blue Jays',
    'Seattle Mariners', 'Texas Rangers', 'Philadelphia Phillies', 'San Diego Padres',
    'Chicago Cubs', 'St. Louis Cardinals', 'Cleveland Guardians', 'Baltimore Orioles'
  ],
  nhl: [
    'Toronto Maple Leafs', 'Boston Bruins', 'Colorado Avalanche', 'Vegas Golden Knights',
    'Edmonton Oilers', 'Carolina Hurricanes', 'New Jersey Devils', 'Dallas Stars',
    'New York Rangers', 'Tampa Bay Lightning', 'Florida Panthers', 'Seattle Kraken',
    'Los Angeles Kings', 'Minnesota Wild', 'Pittsburgh Penguins', 'Vancouver Canucks'
  ],
  mma: [
    'UFC 300 - Main Event', 'UFC 301 - Co-Main', 'UFC Fight Night',
    'Bellator Championship', 'PFL Main Card'
  ],
  tennis: [
    'Novak Djokovic', 'Carlos Alcaraz', 'Daniil Medvedev', 'Jannik Sinner',
    'Aryna Sabalenka', 'Iga Swiatek', 'Coco Gauff', 'Elena Rybakina'
  ]
};

// Helper function to generate random odds
function generateOdds(min: number = 1.5, max: number = 3.0): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

// Helper function to generate balanced odds for two teams
function generateBalancedOdds(): { homeOdds: number; awayOdds: number } {
  const homeOdds = generateOdds(1.5, 2.8);
  // Make away odds inversely correlated to home odds
  const awayOdds = parseFloat((3.3 - homeOdds + Math.random() * 0.4).toFixed(2));
  return { homeOdds, awayOdds };
}

// Helper function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Helper function to generate match status and scores
function generateMatchStatus(startTime: Date, sport: string): {
  status: 'upcoming' | 'live' | 'finished';
  homeScore?: number;
  awayScore?: number;
  matchTime?: string;
  isFinished?: boolean;
} {
  const now = Date.now();
  const matchStart = startTime.getTime();
  const timeDiff = now - matchStart;
  
  // If match hasn't started yet
  if (timeDiff < 0) {
    return { status: 'upcoming' };
  }
  
  // Determine match duration and current status based on sport
  switch (sport.toLowerCase()) {
    case 'soccer': {
      // Soccer: 90 minutes + potential extra time (up to 95 minutes total)
      const matchMinutes = Math.floor(timeDiff / (1000 * 60));
      
      if (matchMinutes >= 95) {
        // Match finished
        const homeScore = Math.floor(Math.random() * 4);
        const awayScore = Math.floor(Math.random() * 4);
        return {
          status: 'finished',
          homeScore,
          awayScore,
          matchTime: "FT",
          isFinished: true
        };
      } else if (matchMinutes < 90) {
        // First half or second half
        const displayMinute = matchMinutes > 45 ? Math.min(matchMinutes, 90) : matchMinutes;
        const homeScore = Math.floor(Math.random() * 3);
        const awayScore = Math.floor(Math.random() * 3);
        return {
          status: 'live',
          homeScore,
          awayScore,
          matchTime: `${displayMinute}'`,
          isFinished: false
        };
      } else {
        // Extra time (90-95 minutes)
        const extraTime = matchMinutes - 90;
        const homeScore = Math.floor(Math.random() * 4);
        const awayScore = Math.floor(Math.random() * 4);
        return {
          status: 'live',
          homeScore,
          awayScore,
          matchTime: `90+${extraTime}'`,
          isFinished: false
        };
      }
    }
    
    case 'basketball': {
      // NBA: 48 minutes (4 quarters of 12 minutes each)
      const matchMinutes = Math.floor(timeDiff / (1000 * 60));
      
      if (matchMinutes >= 48) {
        const homeScore = 95 + Math.floor(Math.random() * 35);
        const awayScore = 95 + Math.floor(Math.random() * 35);
        return {
          status: 'finished',
          homeScore,
          awayScore,
          matchTime: "Final",
          isFinished: true
        };
      } else {
        const quarter = Math.min(Math.floor(matchMinutes / 12) + 1, 4);
        const quarterMinute = matchMinutes % 12;
        const homeScore = Math.floor((95 + Math.random() * 35) * (matchMinutes / 48));
        const awayScore = Math.floor((95 + Math.random() * 35) * (matchMinutes / 48));
        return {
          status: 'live',
          homeScore,
          awayScore,
          matchTime: `Q${quarter} ${quarterMinute}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
          isFinished: false
        };
      }
    }
    
    case 'football': {
      // NFL: 60 minutes (4 quarters of 15 minutes each)
      const matchMinutes = Math.floor(timeDiff / (1000 * 60));
      
      if (matchMinutes >= 60) {
        const homeScore = Math.floor(Math.random() * 35) + 10;
        const awayScore = Math.floor(Math.random() * 35) + 10;
        return {
          status: 'finished',
          homeScore,
          awayScore,
          matchTime: "Final",
          isFinished: true
        };
      } else {
        const quarter = Math.min(Math.floor(matchMinutes / 15) + 1, 4);
        const quarterMinute = 15 - (matchMinutes % 15);
        const homeScore = Math.floor((Math.random() * 35 + 10) * (matchMinutes / 60));
        const awayScore = Math.floor((Math.random() * 35 + 10) * (matchMinutes / 60));
        return {
          status: 'live',
          homeScore,
          awayScore,
          matchTime: `Q${quarter} ${quarterMinute}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
          isFinished: false
        };
      }
    }
    
    case 'baseball': {
      // MLB: 9 innings (approximately 3 hours)
      const matchMinutes = Math.floor(timeDiff / (1000 * 60));
      
      if (matchMinutes >= 180) {
        const homeScore = Math.floor(Math.random() * 8);
        const awayScore = Math.floor(Math.random() * 8);
        return {
          status: 'finished',
          homeScore,
          awayScore,
          matchTime: "Final",
          isFinished: true
        };
      } else {
        const inning = Math.min(Math.floor(matchMinutes / 20) + 1, 9);
        const topBottom = matchMinutes % 20 < 10 ? 'Top' : 'Bot';
        const homeScore = Math.floor(Math.random() * 8 * (matchMinutes / 180));
        const awayScore = Math.floor(Math.random() * 8 * (matchMinutes / 180));
        return {
          status: 'live',
          homeScore,
          awayScore,
          matchTime: `${topBottom} ${inning}`,
          isFinished: false
        };
      }
    }
    
    case 'hockey': {
      // NHL: 60 minutes (3 periods of 20 minutes each)
      const matchMinutes = Math.floor(timeDiff / (1000 * 60));
      
      if (matchMinutes >= 60) {
        const homeScore = Math.floor(Math.random() * 6);
        const awayScore = Math.floor(Math.random() * 6);
        return {
          status: 'finished',
          homeScore,
          awayScore,
          matchTime: "Final",
          isFinished: true
        };
      } else {
        const period = Math.min(Math.floor(matchMinutes / 20) + 1, 3);
        const periodMinute = matchMinutes % 20;
        const homeScore = Math.floor(Math.random() * 6 * (matchMinutes / 60));
        const awayScore = Math.floor(Math.random() * 6 * (matchMinutes / 60));
        return {
          status: 'live',
          homeScore,
          awayScore,
          matchTime: `P${period} ${periodMinute}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
          isFinished: false
        };
      }
    }
    
    case 'mma': {
      // MMA: 3 or 5 rounds of 5 minutes each
      const matchMinutes = Math.floor(timeDiff / (1000 * 60));
      const totalRounds = Math.random() > 0.5 ? 5 : 3;
      const totalMinutes = totalRounds * 5;
      
      if (matchMinutes >= totalMinutes) {
        return {
          status: 'finished',
          matchTime: "Decision",
          isFinished: true
        };
      } else {
        const round = Math.min(Math.floor(matchMinutes / 5) + 1, totalRounds);
        const roundMinute = 5 - (matchMinutes % 5);
        return {
          status: 'live',
          matchTime: `R${round} ${roundMinute}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
          isFinished: false
        };
      }
    }
    
    case 'tennis': {
      // Tennis: Best of 3 or 5 sets (approximately 2-3 hours)
      const matchMinutes = Math.floor(timeDiff / (1000 * 60));
      
      if (matchMinutes >= 150) {
        return {
          status: 'finished',
          matchTime: "Final",
          isFinished: true
        };
      } else {
        const set = Math.min(Math.floor(matchMinutes / 30) + 1, 3);
        const homeGames = Math.floor(Math.random() * 7);
        const awayGames = Math.floor(Math.random() * 7);
        return {
          status: 'live',
          homeScore: homeGames,
          awayScore: awayGames,
          matchTime: `Set ${set}`,
          isFinished: false
        };
      }
    }
    
    default:
      return { status: 'upcoming' };
  }
}

// Generate NBA games
function generateNBAGames(count: number, startId: number): Bet[] {
  const games: Bet[] = [];
  const shuffledTeams = shuffleArray(teams.nba);
  
  for (let i = 0; i < count && i * 2 < shuffledTeams.length; i++) {
    const { homeOdds, awayOdds } = generateBalancedOdds();
    // Generate some games in the past (live/finished), some upcoming
    const hoursOffset = Math.floor(Math.random() * 48) - 24; // -24 to +24 hours
    const startTime = new Date(Date.now() + hoursOffset * 60 * 60 * 1000);
    const matchStatus = generateMatchStatus(startTime, 'Basketball');
    
    games.push({
      id: (startId + i).toString(),
      sport: 'Basketball',
      league: 'NBA',
      homeTeam: shuffledTeams[i * 2],
      awayTeam: shuffledTeams[i * 2 + 1],
      homeOdds,
      awayOdds,
      startTime,
      category: 'basketball',
      ...matchStatus,
    });
  }
  
  return games;
}

// Generate NFL games
function generateNFLGames(count: number, startId: number): Bet[] {
  const games: Bet[] = [];
  const shuffledTeams = shuffleArray(teams.nfl);
  
  for (let i = 0; i < count && i * 2 < shuffledTeams.length; i++) {
    const { homeOdds, awayOdds } = generateBalancedOdds();
    const hoursOffset = Math.floor(Math.random() * 72) - 36; // -36 to +36 hours
    const startTime = new Date(Date.now() + hoursOffset * 60 * 60 * 1000);
    const matchStatus = generateMatchStatus(startTime, 'Football');
    
    games.push({
      id: (startId + i).toString(),
      sport: 'Football',
      league: 'NFL',
      homeTeam: shuffledTeams[i * 2],
      awayTeam: shuffledTeams[i * 2 + 1],
      homeOdds,
      awayOdds,
      startTime,
      category: 'football',
      ...matchStatus,
    });
  }
  
  return games;
}

// Generate Soccer games
function generateSoccerGames(count: number, startId: number): Bet[] {
  const games: Bet[] = [];
  const leagues = [
    { name: 'Premier League', teams: teams.soccer.premierLeague },
    { name: 'La Liga', teams: teams.soccer.laLiga },
    { name: 'Serie A', teams: teams.soccer.serieA },
  ];
  
  let gameId = startId;
  const gamesPerLeague = Math.ceil(count / leagues.length);
  
  leagues.forEach(league => {
    const shuffledTeams = shuffleArray(league.teams);
    const numGames = Math.min(gamesPerLeague, Math.floor(shuffledTeams.length / 2));
    
    for (let i = 0; i < numGames; i++) {
      const { homeOdds, awayOdds } = generateBalancedOdds();
      const drawOdds = generateOdds(2.8, 3.8);
      const hoursOffset = Math.floor(Math.random() * 96) - 48; // -48 to +48 hours
      const startTime = new Date(Date.now() + hoursOffset * 60 * 60 * 1000);
      const matchStatus = generateMatchStatus(startTime, 'Soccer');
      
      games.push({
        id: gameId.toString(),
        sport: 'Soccer',
        league: league.name,
        homeTeam: shuffledTeams[i * 2],
        awayTeam: shuffledTeams[i * 2 + 1],
        homeOdds,
        awayOdds,
        drawOdds,
        startTime,
        category: 'soccer',
        ...matchStatus,
      });
      
      gameId++;
    }
  });
  
  return games;
}

// Generate MLB games
function generateMLBGames(count: number, startId: number): Bet[] {
  const games: Bet[] = [];
  const shuffledTeams = shuffleArray(teams.mlb);
  
  for (let i = 0; i < count && i * 2 < shuffledTeams.length; i++) {
    const { homeOdds, awayOdds } = generateBalancedOdds();
    const hoursOffset = Math.floor(Math.random() * 36) - 18; // -18 to +18 hours
    const startTime = new Date(Date.now() + hoursOffset * 60 * 60 * 1000);
    const matchStatus = generateMatchStatus(startTime, 'Baseball');
    
    games.push({
      id: (startId + i).toString(),
      sport: 'Baseball',
      league: 'MLB',
      homeTeam: shuffledTeams[i * 2],
      awayTeam: shuffledTeams[i * 2 + 1],
      homeOdds,
      awayOdds,
      startTime,
      category: 'baseball',
      ...matchStatus,
    });
  }
  
  return games;
}

// Generate NHL games
function generateNHLGames(count: number, startId: number): Bet[] {
  const games: Bet[] = [];
  const shuffledTeams = shuffleArray(teams.nhl);
  
  for (let i = 0; i < count && i * 2 < shuffledTeams.length; i++) {
    const { homeOdds, awayOdds } = generateBalancedOdds();
    const hoursOffset = Math.floor(Math.random() * 48) - 24; // -24 to +24 hours
    const startTime = new Date(Date.now() + hoursOffset * 60 * 60 * 1000);
    const matchStatus = generateMatchStatus(startTime, 'Hockey');
    
    games.push({
      id: (startId + i).toString(),
      sport: 'Hockey',
      league: 'NHL',
      homeTeam: shuffledTeams[i * 2],
      awayTeam: shuffledTeams[i * 2 + 1],
      homeOdds,
      awayOdds,
      startTime,
      category: 'hockey',
      ...matchStatus,
    });
  }
  
  return games;
}

// Generate MMA events
function generateMMAEvents(count: number, startId: number): Bet[] {
  const events: Bet[] = [];
  
  for (let i = 0; i < count; i++) {
    const { homeOdds, awayOdds } = generateBalancedOdds();
    const hoursOffset = Math.floor(Math.random() * 168) - 84; // -84 to +84 hours
    const startTime = new Date(Date.now() + hoursOffset * 60 * 60 * 1000);
    const matchStatus = generateMatchStatus(startTime, 'MMA');
    
    const fighters = [
      ['Jon Jones', 'Stipe Miocic'],
      ['Islam Makhachev', 'Charles Oliveira'],
      ['Alex Pereira', 'Jan Blachowicz'],
      ['Sean O\'Malley', 'Merab Dvalishvili'],
      ['Leon Edwards', 'Colby Covington'],
    ];
    
    const fighterPair = fighters[i % fighters.length];
    
    events.push({
      id: (startId + i).toString(),
      sport: 'MMA',
      league: 'UFC',
      homeTeam: fighterPair[0],
      awayTeam: fighterPair[1],
      homeOdds,
      awayOdds,
      startTime,
      category: 'mma',
      ...matchStatus,
    });
  }
  
  return events;
}

// Generate Tennis matches
function generateTennisMatches(count: number, startId: number): Bet[] {
  const matches: Bet[] = [];
  const shuffledPlayers = shuffleArray(teams.tennis);
  
  for (let i = 0; i < count && i * 2 < shuffledPlayers.length; i++) {
    const { homeOdds, awayOdds } = generateBalancedOdds();
    const hoursOffset = Math.floor(Math.random() * 72) - 36; // -36 to +36 hours
    const startTime = new Date(Date.now() + hoursOffset * 60 * 60 * 1000);
    const matchStatus = generateMatchStatus(startTime, 'Tennis');
    
    const tournaments = ['Australian Open', 'French Open', 'Wimbledon', 'US Open', 'ATP Finals'];
    
    matches.push({
      id: (startId + i).toString(),
      sport: 'Tennis',
      league: tournaments[Math.floor(Math.random() * tournaments.length)],
      homeTeam: shuffledPlayers[i * 2],
      awayTeam: shuffledPlayers[i * 2 + 1],
      homeOdds,
      awayOdds,
      startTime,
      category: 'tennis',
      ...matchStatus,
    });
  }
  
  return matches;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const allGames: Bet[] = [];
    let currentId = 1;
    
    // Generate games based on category
    if (category === 'all' || category === 'basketball') {
      const nbaGames = generateNBAGames(8, currentId);
      allGames.push(...nbaGames);
      currentId += nbaGames.length;
    }
    
    if (category === 'all' || category === 'football') {
      const nflGames = generateNFLGames(8, currentId);
      allGames.push(...nflGames);
      currentId += nflGames.length;
    }
    
    if (category === 'all' || category === 'soccer') {
      const soccerGames = generateSoccerGames(9, currentId);
      allGames.push(...soccerGames);
      currentId += soccerGames.length;
    }
    
    if (category === 'all' || category === 'baseball') {
      const mlbGames = generateMLBGames(8, currentId);
      allGames.push(...mlbGames);
      currentId += mlbGames.length;
    }
    
    if (category === 'all' || category === 'hockey') {
      const nhlGames = generateNHLGames(8, currentId);
      allGames.push(...nhlGames);
      currentId += nhlGames.length;
    }
    
    if (category === 'all' || category === 'mma') {
      const mmaEvents = generateMMAEvents(5, currentId);
      allGames.push(...mmaEvents);
      currentId += mmaEvents.length;
    }
    
    if (category === 'all' || category === 'tennis') {
      const tennisMatches = generateTennisMatches(4, currentId);
      allGames.push(...tennisMatches);
      currentId += tennisMatches.length;
    }
    
    // Sort by start time
    allGames.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    
    // Apply limit
    const limitedGames = allGames.slice(0, limit);
    
    return NextResponse.json({
      success: true,
      count: limitedGames.length,
      category: category,
      data: limitedGames,
      categories: [
        { id: 'all', name: 'All Sports', icon: '🏆' },
        { id: 'basketball', name: 'Basketball', icon: '🏀' },
        { id: 'football', name: 'Football', icon: '🏈' },
        { id: 'soccer', name: 'Soccer', icon: '⚽' },
        { id: 'baseball', name: 'Baseball', icon: '⚾' },
        { id: 'hockey', name: 'Hockey', icon: '🏒' },
        { id: 'mma', name: 'MMA', icon: '🥊' },
        { id: 'tennis', name: 'Tennis', icon: '🎾' },
      ],
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate sports data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

