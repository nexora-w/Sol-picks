import { NextRequest, NextResponse } from 'next/server';
import { PlayerProp } from '@/types/betting';

// Seeded random number generator for deterministic results
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate deterministic value based on seed
function seededValue(seed: number, min: number, max: number): number {
  return min + seededRandom(seed) * (max - min);
}

// Helper function to shuffle array with seeded random for consistency
function shuffleArray<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Helper function to generate balanced odds for over/under
function generateOverUnderOdds(seed: number): { overOdds: number; underOdds: number } {
  const overOdds = parseFloat((1.75 + seededRandom(seed) * 0.35).toFixed(2));
  const underOdds = parseFloat((3.85 - overOdds + seededRandom(seed + 1) * 0.2).toFixed(2));
  return { overOdds, underOdds };
}

// Helper function to calculate live prop odds based on current performance
function calculateLivePropOdds(
  propId: number,
  currentValue: number,
  line: number,
  progress: number,
  baseOverOdds: number,
  baseUnderOdds: number
): { overOdds: number; underOdds: number } {
  const timeRemaining = 1 - progress;
  
  // Change odds every 10 seconds
  const timeSeed = Math.floor(Date.now() / 10000);
  const volatility = seededRandom(propId * timeSeed) * 0.1;
  
  // Calculate how player is performing relative to their line
  const expectedProgress = line * progress;
  const performanceDiff = currentValue - expectedProgress;
  
  // Adjust odds based on performance and time remaining
  let overAdjustment = 0;
  let underAdjustment = 0;
  
  if (performanceDiff > 0) {
    // Player is ahead of pace - lower over odds, increase under odds
    const advantage = Math.min(performanceDiff * 0.2 * (1 - timeRemaining * 0.3), 0.8);
    overAdjustment = -advantage;
    underAdjustment = advantage;
  } else if (performanceDiff < 0) {
    // Player is behind pace - increase over odds, lower under odds
    const disadvantage = Math.min(Math.abs(performanceDiff) * 0.2 * (1 - timeRemaining * 0.3), 0.8);
    overAdjustment = disadvantage;
    underAdjustment = -disadvantage;
  }
  
  // As time runs out, odds become more extreme based on current status
  if (timeRemaining < 0.25) {
    const urgency = (0.25 - timeRemaining) * 4; // 0 to 1
    if (currentValue > line) {
      overAdjustment -= urgency * 0.5;
      underAdjustment += urgency * 0.8;
    } else if (currentValue < line) {
      overAdjustment += urgency * 0.8;
      underAdjustment -= urgency * 0.5;
    }
  }
  
  // Apply volatility
  overAdjustment += volatility - 0.05;
  underAdjustment += volatility - 0.05;
  
  // Calculate new odds with minimum of 1.01
  const overOdds = Math.max(1.01, parseFloat((baseOverOdds + overAdjustment).toFixed(2)));
  const underOdds = Math.max(1.01, parseFloat((baseUnderOdds + underAdjustment).toFixed(2)));
  
  return { overOdds, underOdds };
}

// Comprehensive player data with real images
const playerData = {
  nba: [
    { name: 'LeBron James', team: 'Lakers', position: 'SF', points: 27.5, rebounds: 8.5, assists: 7.5, threePointers: 2.5, image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png' },
    { name: 'Stephen Curry', team: 'Warriors', position: 'PG', points: 29.5, rebounds: 5.5, assists: 6.5, threePointers: 5.5, image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/201939.png' },
    { name: 'Jayson Tatum', team: 'Celtics', position: 'SF', points: 28.5, rebounds: 8.5, assists: 4.5, threePointers: 3.5, image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1628369.png' },
    { name: 'Luka Doncic', team: 'Mavericks', position: 'PG', points: 32.5, rebounds: 8.5, assists: 9.5, threePointers: 3.5, image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1629029.png' },
    { name: 'Giannis Antetokounmpo', team: 'Bucks', position: 'PF', points: 30.5, rebounds: 11.5, assists: 5.5, threePointers: 1.5, image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203507.png' },
    { name: 'Nikola Jokic', team: 'Nuggets', position: 'C', points: 26.5, rebounds: 12.5, assists: 9.5, threePointers: 1.5, image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203999.png' },
    { name: 'Kevin Durant', team: 'Suns', position: 'SF', points: 28.5, rebounds: 6.5, assists: 5.5, threePointers: 2.5, image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/201142.png' },
    { name: 'Jimmy Butler', team: 'Heat', position: 'SG', points: 22.5, rebounds: 5.5, assists: 5.5, threePointers: 1.5, image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/202710.png' },
    { name: 'Joel Embiid', team: '76ers', position: 'C', points: 33.5, rebounds: 10.5, assists: 4.5, threePointers: 1.5, image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203954.png' },
    { name: 'Damian Lillard', team: 'Bucks', position: 'PG', points: 25.5, rebounds: 4.5, assists: 7.5, threePointers: 4.5, image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203081.png' },
    { name: 'Anthony Davis', team: 'Lakers', position: 'PF', points: 24.5, rebounds: 12.5, assists: 3.5, threePointers: 1.5, image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203076.png' },
    { name: 'Devin Booker', team: 'Suns', position: 'SG', points: 27.5, rebounds: 4.5, assists: 6.5, threePointers: 2.5, image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1626164.png' },
    { name: 'Kawhi Leonard', team: 'Clippers', position: 'SF', points: 23.5, rebounds: 6.5, assists: 3.5, threePointers: 2.5, image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/202695.png' },
    { name: 'Jaylen Brown', team: 'Celtics', position: 'SG', points: 26.5, rebounds: 6.5, assists: 3.5, threePointers: 2.5, image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1627759.png' },
    { name: 'Donovan Mitchell', team: 'Cavaliers', position: 'SG', points: 28.5, rebounds: 5.5, assists: 6.5, threePointers: 4.5, image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1628378.png' },
    { name: 'Trae Young', team: 'Hawks', position: 'PG', points: 26.5, rebounds: 3.5, assists: 10.5, threePointers: 3.5, image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1629027.png' },
  ],
  nfl: [
    { name: 'Patrick Mahomes', team: 'Chiefs', position: 'QB', yards: 285.5, touchdowns: 2.5, receptions: 0, image: 'https://a.espncdn.com/i/headshots/nfl/players/full/3139477.png' },
    { name: 'Josh Allen', team: 'Bills', position: 'QB', yards: 275.5, touchdowns: 2.5, receptions: 0, image: 'https://a.espncdn.com/i/headshots/nfl/players/full/3918298.png' },
    { name: 'Travis Kelce', team: 'Chiefs', position: 'TE', yards: 75.5, touchdowns: 0.5, receptions: 6.5, image: 'https://a.espncdn.com/i/headshots/nfl/players/full/15847.png' },
    { name: 'Tyreek Hill', team: 'Dolphins', position: 'WR', yards: 95.5, touchdowns: 0.5, receptions: 7.5, image: 'https://a.espncdn.com/i/headshots/nfl/players/full/3116406.png' },
    { name: 'Christian McCaffrey', team: '49ers', position: 'RB', yards: 95.5, touchdowns: 1.5, receptions: 5.5, image: 'https://a.espncdn.com/i/headshots/nfl/players/full/3116385.png' },
    { name: 'Justin Jefferson', team: 'Vikings', position: 'WR', yards: 85.5, touchdowns: 0.5, receptions: 6.5, image: 'https://a.espncdn.com/i/headshots/nfl/players/full/4262921.png' },
    { name: 'Jalen Hurts', team: 'Eagles', position: 'QB', yards: 245.5, touchdowns: 2.5, receptions: 0, image: 'https://a.espncdn.com/i/headshots/nfl/players/full/4361741.png' },
    { name: 'CeeDee Lamb', team: 'Cowboys', position: 'WR', yards: 90.5, touchdowns: 0.5, receptions: 7.5, image: 'https://a.espncdn.com/i/headshots/nfl/players/full/4241389.png' },
    { name: 'Lamar Jackson', team: 'Ravens', position: 'QB', yards: 255.5, touchdowns: 2.5, receptions: 0, image: 'https://a.espncdn.com/i/headshots/nfl/players/full/3916387.png' },
    { name: 'Joe Burrow', team: 'Bengals', position: 'QB', yards: 275.5, touchdowns: 2.5, receptions: 0, image: 'https://a.espncdn.com/i/headshots/nfl/players/full/4360310.png' },
  ],
  mlb: [
    { name: 'Aaron Judge', team: 'Yankees', position: 'RF', hits: 1.5, strikeouts: 7.5, homeRuns: 0.5, image: 'https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/592450/headshot/67/current' },
    { name: 'Shohei Ohtani', team: 'Dodgers', position: 'DH', hits: 1.5, strikeouts: 8.5, homeRuns: 0.5, image: 'https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/660271/headshot/67/current' },
    { name: 'Mookie Betts', team: 'Dodgers', position: 'RF', hits: 1.5, strikeouts: 6.5, homeRuns: 0.5, image: 'https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/605141/headshot/67/current' },
    { name: 'Gerrit Cole', team: 'Yankees', position: 'P', hits: 0, strikeouts: 7.5, homeRuns: 0, image: 'https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/543037/headshot/67/current' },
    { name: 'Ronald Acuna Jr.', team: 'Braves', position: 'OF', hits: 1.5, strikeouts: 6.5, homeRuns: 0.5, image: 'https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/660670/headshot/67/current' },
    { name: 'Freddie Freeman', team: 'Dodgers', position: '1B', hits: 1.5, strikeouts: 5.5, homeRuns: 0.5, image: 'https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/518692/headshot/67/current' },
    { name: 'Juan Soto', team: 'Padres', position: 'OF', hits: 1.5, strikeouts: 7.5, homeRuns: 0.5, image: 'https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/665742/headshot/67/current' },
    { name: 'Spencer Strider', team: 'Braves', position: 'P', hits: 0, strikeouts: 9.5, homeRuns: 0, image: 'https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/675911/headshot/67/current' },
  ],
  soccer: [
    { name: 'Erling Haaland', team: 'Manchester City', position: 'FW', goals: 0.5, shots: 4.5, saves: 0, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p223094.png' },
    { name: 'Mohamed Salah', team: 'Liverpool', position: 'FW', goals: 0.5, shots: 3.5, saves: 0, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p118748.png' },
    { name: 'Harry Kane', team: 'Bayern Munich', position: 'FW', goals: 0.5, shots: 4.5, saves: 0, image: 'https://img.fcbayern.com/image/upload/cms/public/images/fcbayern-com/homepage/saison-23-24/profis/kane_harry.png' },
    { name: 'Kylian Mbappe', team: 'Real Madrid', position: 'FW', goals: 0.5, shots: 4.5, saves: 0, image: 'https://assets.laliga.com/squad/2024/t186/p246333/512x512/p246333_t186_2024_1_001_000.png' },
    { name: 'Bukayo Saka', team: 'Arsenal', position: 'FW', goals: 0.5, shots: 3.5, saves: 0, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p223340.png' },
    { name: 'Kevin De Bruyne', team: 'Manchester City', position: 'MF', goals: 0.5, shots: 2.5, saves: 0, image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p78830.png' },
    { name: 'Robert Lewandowski', team: 'Barcelona', position: 'FW', goals: 0.5, shots: 4.5, saves: 0, image: 'https://assets.laliga.com/squad/2024/t178/p56764/512x512/p56764_t178_2024_1_001_000.png' },
    { name: 'Vinicius Junior', team: 'Real Madrid', position: 'FW', goals: 0.5, shots: 3.5, saves: 0, image: 'https://assets.laliga.com/squad/2024/t186/p246333/512x512/p246333_t186_2024_1_001_000.png' },
  ],
};

// Game matchups for context
const gameMatchups = {
  nba: [
    { home: 'Lakers', away: 'Warriors' },
    { home: 'Celtics', away: 'Heat' },
    { home: 'Bucks', away: 'Nuggets' },
    { home: 'Suns', away: 'Mavericks' },
    { home: '76ers', away: 'Cavaliers' },
    { home: 'Clippers', away: 'Hawks' },
  ],
  nfl: [
    { home: 'Chiefs', away: 'Bills' },
    { home: '49ers', away: 'Cowboys' },
    { home: 'Eagles', away: 'Dolphins' },
    { home: 'Ravens', away: 'Bengals' },
    { home: 'Vikings', away: 'Packers' },
  ],
  mlb: [
    { home: 'Yankees', away: 'Red Sox' },
    { home: 'Dodgers', away: 'Giants' },
    { home: 'Braves', away: 'Mets' },
    { home: 'Padres', away: 'Diamondbacks' },
  ],
  soccer: [
    { home: 'Manchester City', away: 'Liverpool' },
    { home: 'Arsenal', away: 'Chelsea' },
    { home: 'Real Madrid', away: 'Barcelona' },
    { home: 'Bayern Munich', away: 'Dortmund' },
  ],
};

// Helper to get consistent start time
function getConsistentStartTime(propId: number, minHours: number, maxHours: number): Date {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const hoursOffset = seededValue(propId * 73, minHours, maxHours);
  return new Date(startOfDay.getTime() + hoursOffset * 60 * 60 * 1000);
}

// Helper to determine prop status
function getPropStatus(startTime: Date, propId: number, sport: string): {
  status: 'upcoming' | 'live' | 'finished';
  currentValue?: number;
  matchTime?: string;
  isFinished?: boolean;
} {
  const now = Date.now();
  const propStart = startTime.getTime();
  const timeDiff = now - propStart;
  
  if (timeDiff < 0) {
    return { status: 'upcoming' };
  }
  
  // Determine if prop is live or finished based on sport
  let matchDuration = 0;
  let matchTime = '';
  
  switch (sport.toLowerCase()) {
    case 'basketball':
      matchDuration = 48 * 60 * 1000; // 48 minutes
      if (timeDiff >= matchDuration) {
        return { status: 'finished', matchTime: 'Final', isFinished: true };
      } else {
        const minutes = Math.floor(timeDiff / (1000 * 60));
        const quarter = Math.min(Math.floor(minutes / 12) + 1, 4);
        matchTime = `Q${quarter}`;
      }
      break;
    case 'football':
      matchDuration = 60 * 60 * 1000; // 60 minutes
      if (timeDiff >= matchDuration) {
        return { status: 'finished', matchTime: 'Final', isFinished: true };
      } else {
        const minutes = Math.floor(timeDiff / (1000 * 60));
        const quarter = Math.min(Math.floor(minutes / 15) + 1, 4);
        matchTime = `Q${quarter}`;
      }
      break;
    case 'baseball':
      matchDuration = 180 * 60 * 1000; // 180 minutes
      if (timeDiff >= matchDuration) {
        return { status: 'finished', matchTime: 'Final', isFinished: true };
      } else {
        const minutes = Math.floor(timeDiff / (1000 * 60));
        const inning = Math.min(Math.floor(minutes / 20) + 1, 9);
        matchTime = `${inning}th Inning`;
      }
      break;
    case 'soccer':
      matchDuration = 95 * 60 * 1000; // 95 minutes
      if (timeDiff >= matchDuration) {
        return { status: 'finished', matchTime: 'FT', isFinished: true };
      } else {
        const minutes = Math.floor(timeDiff / (1000 * 60));
        matchTime = `${Math.min(minutes, 90)}'`;
      }
      break;
    default:
      return { status: 'upcoming' };
  }
  
  return {
    status: 'live',
    matchTime,
    isFinished: false,
  };
}

// Generate NBA player props
function generateNBAProps(count: number, startId: number): PlayerProp[] {
  const props: PlayerProp[] = [];
  // Use fixed seed to ensure consistent player selection across refreshes
  const shuffledPlayers = shuffleArray(playerData.nba, 12345).slice(0, count);
  
  shuffledPlayers.forEach((player, index) => {
    const propId = startId + index;
    const matchup = gameMatchups.nba[Math.floor(seededValue(propId * 11, 0, gameMatchups.nba.length))];
    
    // Force first player's game to be live (started 10-30 minutes ago, duration is 48 min)
    let startTime: Date;
    if (index === 0) {
      const now = new Date();
      const minutesAgo = 10 + seededValue(propId * 73, 0, 20); // 10-30 minutes ago
      startTime = new Date(now.getTime() - minutesAgo * 60 * 1000);
    } else {
      startTime = getConsistentStartTime(propId, -2, 48);
    }
    
    // Generate multiple prop types per player
    const statTypes: Array<{ type: 'points' | 'rebounds' | 'assists' | 'three_pointers'; line: number }> = [
      { type: 'points', line: player.points },
      { type: 'rebounds', line: player.rebounds },
      { type: 'assists', line: player.assists },
    ];
    
    statTypes.forEach((stat, statIndex) => {
      const currentPropId = propId + statIndex * 1000;
      const baseOdds = generateOverUnderOdds(currentPropId);
      const status = getPropStatus(startTime, currentPropId, 'Basketball');
      
      // Calculate current value for live props
      let currentValue: number | undefined;
      let overOdds = baseOdds.overOdds;
      let underOdds = baseOdds.underOdds;
      
      if (status.status === 'live') {
        const now = Date.now();
        const timeDiff = now - startTime.getTime();
        const progress = timeDiff / (48 * 60 * 1000);
        const performanceMultiplier = seededValue(currentPropId * 97 + Math.floor(now / 5000), 0.4, 1.6);
        currentValue = Math.floor(stat.line * progress * performanceMultiplier);
        
        // Calculate dynamic odds based on current performance
        const liveOdds = calculateLivePropOdds(currentPropId, currentValue, stat.line, progress, baseOdds.overOdds, baseOdds.underOdds);
        overOdds = liveOdds.overOdds;
        underOdds = liveOdds.underOdds;
      }
      
      props.push({
        id: `nba-prop-${currentPropId}`,
        sport: 'Basketball',
        league: 'NBA',
        gameId: `nba-game-${propId}`,
        homeTeam: matchup.home,
        awayTeam: matchup.away,
        playerName: player.name,
        playerTeam: player.team,
        playerPosition: player.position,
        playerImage: player.image,
        statType: stat.type,
        line: stat.line,
        overOdds,
        underOdds,
        startTime,
        category: 'basketball',
        ...status,
        currentValue,
      });
    });
  });
  
  return props;
}

// Generate NFL player props
function generateNFLProps(count: number, startId: number): PlayerProp[] {
  const props: PlayerProp[] = [];
  // Use fixed seed to ensure consistent player selection across refreshes
  const shuffledPlayers = shuffleArray(playerData.nfl, 54321).slice(0, count);
  
  shuffledPlayers.forEach((player, index) => {
    const propId = startId + index;
    const matchup = gameMatchups.nfl[Math.floor(seededValue(propId * 13, 0, gameMatchups.nfl.length))];
    
    // Force first player's game to be live (started 15-45 minutes ago, duration is 60 min)
    let startTime: Date;
    if (index === 0) {
      const now = new Date();
      const minutesAgo = 15 + seededValue(propId * 73, 0, 30); // 15-45 minutes ago
      startTime = new Date(now.getTime() - minutesAgo * 60 * 1000);
    } else {
      startTime = getConsistentStartTime(propId, -1, 60);
    }
    
    const statTypes: Array<{ type: 'yards' | 'touchdowns' | 'receptions'; line: number }> = [];
    if (player.yards > 0) statTypes.push({ type: 'yards', line: player.yards });
    if (player.touchdowns > 0) statTypes.push({ type: 'touchdowns', line: player.touchdowns });
    if (player.receptions > 0) statTypes.push({ type: 'receptions', line: player.receptions });
    
    statTypes.forEach((stat, statIndex) => {
      const currentPropId = propId + statIndex * 1000;
      const baseOdds = generateOverUnderOdds(currentPropId);
      const status = getPropStatus(startTime, currentPropId, 'Football');
      
      let currentValue: number | undefined;
      let overOdds = baseOdds.overOdds;
      let underOdds = baseOdds.underOdds;
      
      if (status.status === 'live') {
        const now = Date.now();
        const timeDiff = now - startTime.getTime();
        const progress = timeDiff / (60 * 60 * 1000);
        const performanceMultiplier = seededValue(currentPropId * 97 + Math.floor(now / 5000), 0.3, 1.7);
        currentValue = stat.type === 'yards' 
          ? Math.floor(stat.line * progress * performanceMultiplier)
          : Math.floor(stat.line * progress * performanceMultiplier * 10) / 10;
        
        // Calculate dynamic odds based on current performance
        const liveOdds = calculateLivePropOdds(currentPropId, currentValue, stat.line, progress, baseOdds.overOdds, baseOdds.underOdds);
        overOdds = liveOdds.overOdds;
        underOdds = liveOdds.underOdds;
      }
      
      props.push({
        id: `nfl-prop-${currentPropId}`,
        sport: 'Football',
        league: 'NFL',
        gameId: `nfl-game-${propId}`,
        homeTeam: matchup.home,
        awayTeam: matchup.away,
        playerName: player.name,
        playerTeam: player.team,
        playerPosition: player.position,
        playerImage: player.image,
        statType: stat.type,
        line: stat.line,
        overOdds,
        underOdds,
        startTime,
        category: 'football',
        ...status,
        currentValue,
      });
    });
  });
  
  return props;
}

// Generate MLB player props
function generateMLBProps(count: number, startId: number): PlayerProp[] {
  const props: PlayerProp[] = [];
  // Use fixed seed to ensure consistent player selection across refreshes
  const shuffledPlayers = shuffleArray(playerData.mlb, 11111).slice(0, count);
  
  shuffledPlayers.forEach((player, index) => {
    const propId = startId + index;
    const matchup = gameMatchups.mlb[Math.floor(seededValue(propId * 17, 0, gameMatchups.mlb.length))];
    const startTime = getConsistentStartTime(propId, -1, 36);
    
    const statTypes: Array<{ type: 'hits' | 'strikeouts' | 'home_runs'; line: number }> = [];
    if (player.hits > 0) statTypes.push({ type: 'hits', line: player.hits });
    if (player.strikeouts > 0) statTypes.push({ type: 'strikeouts', line: player.strikeouts });
    
    statTypes.forEach((stat, statIndex) => {
      const currentPropId = propId + statIndex * 1000;
      const baseOdds = generateOverUnderOdds(currentPropId);
      const status = getPropStatus(startTime, currentPropId, 'Baseball');
      
      let currentValue: number | undefined;
      let overOdds = baseOdds.overOdds;
      let underOdds = baseOdds.underOdds;
      
      if (status.status === 'live') {
        const now = Date.now();
        const timeDiff = now - startTime.getTime();
        const progress = timeDiff / (180 * 60 * 1000);
        const performanceMultiplier = seededValue(currentPropId * 97 + Math.floor(now / 5000), 0.3, 1.8);
        currentValue = Math.floor(stat.line * progress * performanceMultiplier);
        
        // Calculate dynamic odds based on current performance
        const liveOdds = calculateLivePropOdds(currentPropId, currentValue, stat.line, progress, baseOdds.overOdds, baseOdds.underOdds);
        overOdds = liveOdds.overOdds;
        underOdds = liveOdds.underOdds;
      }
      
      props.push({
        id: `mlb-prop-${currentPropId}`,
        sport: 'Baseball',
        league: 'MLB',
        gameId: `mlb-game-${propId}`,
        homeTeam: matchup.home,
        awayTeam: matchup.away,
        playerName: player.name,
        playerTeam: player.team,
        playerPosition: player.position,
        playerImage: player.image,
        statType: stat.type,
        line: stat.line,
        overOdds,
        underOdds,
        startTime,
        category: 'baseball',
        ...status,
        currentValue,
      });
    });
  });
  
  return props;
}

// Generate Soccer player props
function generateSoccerProps(count: number, startId: number): PlayerProp[] {
  const props: PlayerProp[] = [];
  // Use fixed seed to ensure consistent player selection across refreshes
  const shuffledPlayers = shuffleArray(playerData.soccer, 99999).slice(0, count);
  
  shuffledPlayers.forEach((player, index) => {
    const propId = startId + index;
    const matchup = gameMatchups.soccer[Math.floor(seededValue(propId * 19, 0, gameMatchups.soccer.length))];
    
    // Force first player's game to be live (started 20-60 minutes ago, duration is 95 min)
    let startTime: Date;
    if (index === 0) {
      const now = new Date();
      const minutesAgo = 20 + seededValue(propId * 73, 0, 40); // 20-60 minutes ago
      startTime = new Date(now.getTime() - minutesAgo * 60 * 1000);
    } else {
      startTime = getConsistentStartTime(propId, -2, 72);
    }
    
    const statTypes: Array<{ type: 'goals' | 'shots'; line: number }> = [
      { type: 'goals', line: player.goals },
      { type: 'shots', line: player.shots },
    ];
    
    statTypes.forEach((stat, statIndex) => {
      const currentPropId = propId + statIndex * 1000;
      const baseOdds = generateOverUnderOdds(currentPropId);
      const status = getPropStatus(startTime, currentPropId, 'Soccer');
      
      let currentValue: number | undefined;
      let overOdds = baseOdds.overOdds;
      let underOdds = baseOdds.underOdds;
      
      if (status.status === 'live') {
        const now = Date.now();
        const timeDiff = now - startTime.getTime();
        const progress = timeDiff / (95 * 60 * 1000);
        const performanceMultiplier = seededValue(currentPropId * 97 + Math.floor(now / 5000), 0.2, 2.0);
        currentValue = Math.floor(stat.line * progress * performanceMultiplier);
        
        // Calculate dynamic odds based on current performance
        const liveOdds = calculateLivePropOdds(currentPropId, currentValue, stat.line, progress, baseOdds.overOdds, baseOdds.underOdds);
        overOdds = liveOdds.overOdds;
        underOdds = liveOdds.underOdds;
      }
      
      props.push({
        id: `soccer-prop-${currentPropId}`,
        sport: 'Soccer',
        league: 'Premier League',
        gameId: `soccer-game-${propId}`,
        homeTeam: matchup.home,
        awayTeam: matchup.away,
        playerName: player.name,
        playerTeam: player.team,
        playerPosition: player.position,
        playerImage: player.image,
        statType: stat.type,
        line: stat.line,
        overOdds,
        underOdds,
        startTime,
        category: 'soccer',
        ...status,
        currentValue,
      });
    });
  });
  
  return props;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const allProps: PlayerProp[] = [];
    let currentId = 1;
    
    // Generate props based on category
    if (category === 'all' || category === 'basketball') {
      const nbaProps = generateNBAProps(6, currentId);
      allProps.push(...nbaProps);
      currentId += 1000;
    }
    
    if (category === 'all' || category === 'football') {
      const nflProps = generateNFLProps(5, currentId);
      allProps.push(...nflProps);
      currentId += 1000;
    }
    
    if (category === 'all' || category === 'baseball') {
      const mlbProps = generateMLBProps(4, currentId);
      allProps.push(...mlbProps);
      currentId += 1000;
    }
    
    if (category === 'all' || category === 'soccer') {
      const soccerProps = generateSoccerProps(4, currentId);
      allProps.push(...soccerProps);
      currentId += 1000;
    }
    
    // Sort by start time
    allProps.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    
    // Apply limit
    const limitedProps = allProps.slice(0, limit);
    
    return NextResponse.json({
      success: true,
      count: limitedProps.length,
      category: category,
      data: limitedProps,
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate player props data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

