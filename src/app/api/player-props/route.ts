import { NextRequest, NextResponse } from 'next/server';
import { PlayerProp } from '@/types/betting';

// Helper function to slightly adjust odds on each request (simulates real-time odds changes)
function adjustOdds(baseOdds: number): number {
  const variance = (Math.random() - 0.5) * 0.3; // +/- 0.15 variance
  const adjusted = baseOdds + variance;
  return Math.max(1.01, parseFloat(adjusted.toFixed(2))); // Ensure odds stay above 1.01
}

// Helper function to generate random match time between 40-60 minutes
function generateRandomMatchTime(): string {
  const minutes = Math.floor(Math.random() * 21) + 40; // Random between 40-60
  return `${minutes}'`;
}


// LIVE player props - NFL, NBA, MLB, NHL
const STATIC_PROPS: PlayerProp[] = [
  // NFL Player Props
  {
    id: 'prop-1',
    sport: 'Football',
    league: 'NFL',
    gameId: 'game-1',
    homeTeam: 'Kansas City Chiefs',
    awayTeam: 'Buffalo Bills',
    playerName: 'Patrick Mahomes',
    playerTeam: 'Kansas City Chiefs',
    playerPosition: 'QB',
    playerImage: 'https://a.espncdn.com/i/headshots/nfl/players/full/3139477.png',
    statType: 'points', //passing_yards
    line: 275.5,
    overOdds: 1.90,
    underOdds: 1.90,
    startTime: new Date('2025-10-14T20:00:00Z'),
    category: 'football',
    status: 'live'
  },
  {
    id: 'prop-2',
    sport: 'Football',
    league: 'NFL',
    gameId: 'game-1',
    homeTeam: 'Kansas City Chiefs',
    awayTeam: 'Buffalo Bills',
    playerName: 'Josh Allen',
    playerTeam: 'Buffalo Bills',
    playerPosition: 'QB',
    playerImage: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRUHmakVIabZ60lwfR8Tw9lg7sdn0xXLs_g3JUvw-ErsY9N_pbE9SPAvQU0Reh9gx4PaX1GYrfbP3ZTvyPdzDaTdPSq6X7fA8x1e_GfhZc',
    statType: 'points', //rushing_yards
    line: 45.5,
    overOdds: 1.85,
    underOdds: 1.95,
    startTime: new Date('2025-10-14T20:00:00Z'),
    category: 'football',
    status: 'live'
  },
  {
    id: 'prop-3',
    sport: 'Football',
    league: 'NFL',
    gameId: 'game-2',
    homeTeam: 'Dallas Cowboys',
    awayTeam: 'Philadelphia Eagles',
    playerName: 'Dak Prescott',
    playerTeam: 'Dallas Cowboys',
    playerPosition: 'QB',
    playerImage: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/2577417.png&w=350&h=254',
    statType: 'touchdowns', //passing_touchdowns
    line: 2.5,
    overOdds: 1.95,
    underOdds: 1.85,
    startTime: new Date('2025-10-14T20:15:00Z'),
    category: 'football',
    status: 'live'
  },
  {
    id: 'prop-4',
    sport: 'Basketball',
    league: 'NBA',
    gameId: 'game-5',
    homeTeam: 'Los Angeles Lakers',
    awayTeam: 'Boston Celtics',
    playerName: 'LeBron James',
    playerTeam: 'Los Angeles Lakers',
    playerPosition: 'SF',
    playerImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/LeBron_James_%2851959977144%29_%28cropped2%29.jpg/1036px-LeBron_James_%2851959977144%29_%28cropped2%29.jpg',
    statType: 'points',
    line: 25.5,
    overOdds: 1.88,
    underOdds: 1.92,
    startTime: new Date('2025-10-14T20:00:00Z'),
    category: 'basketball',
    status: 'live'
  },
  {
    id: 'prop-6',
    sport: 'Baseball',
    league: 'MLB',
    gameId: 'game-9',
    homeTeam: 'New York Yankees',
    awayTeam: 'Houston Astros',
    playerName: 'Aaron Judge',
    playerTeam: 'New York Yankees',
    playerPosition: 'RF',
    playerImage: 'https://a.espncdn.com/combiner/i?img=/i/headshots/mlb/players/full/33192.png',
    statType: 'hits',
    line: 1.5,
    overOdds: 1.80,
    underOdds: 2.00,
    startTime: new Date('2025-10-14T20:05:00Z'),
    category: 'baseball',
    status: 'live'
  },
  {
    id: 'prop-7',
    sport: 'Hockey',
    league: 'NHL',
    gameId: 'game-13',
    homeTeam: 'Toronto Maple Leafs',
    awayTeam: 'Montreal Canadiens',
    playerName: 'Auston Matthews',
    playerTeam: 'Toronto Maple Leafs',
    playerPosition: 'C',
    playerImage: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nhl/players/full/4024123.png',
    statType: 'goals',
    line: 0.5,
    overOdds: 1.92,
    underOdds: 1.88,
    startTime: new Date('2025-10-14T20:00:00Z'),
    category: 'hockey',
    status: 'live'
  },
  {
    id: 'prop-8',
    sport: 'Football',
    league: 'NFL',
    gameId: 'game-3',
    homeTeam: 'Miami Dolphins',
    awayTeam: 'New England Patriots',
    playerName: 'Tyreek Hill',
    playerTeam: 'Miami Dolphins',
    playerPosition: 'WR',
    playerImage: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/3116406.png',
    statType: 'goals',
    line: 85.5,
    overOdds: 1.88,
    underOdds: 1.92,
    startTime: new Date('2025-10-14T20:30:00Z'),
    category: 'football',
    status: 'live'
  },
  // NBA Players
  {
    id: 'prop-9',
    sport: 'Basketball',
    league: 'NBA',
    gameId: 'game-6',
    homeTeam: 'Cleveland Cavaliers',
    awayTeam: 'Detroit Pistons',
    playerName: 'Donovan Mitchell',
    playerTeam: 'Cleveland Cavaliers',
    playerPosition: 'SG',
    playerImage: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/3908809.png',
    statType: 'points',
    line: 28.5,
    overOdds: 1.90,
    underOdds: 1.90,
    startTime: new Date('2025-10-14T20:00:00Z'),
    category: 'basketball',
    status: 'live'
  },
  {
    id: 'prop-10',
    sport: 'Basketball',
    league: 'NBA',
    gameId: 'game-6',
    homeTeam: 'Cleveland Cavaliers',
    awayTeam: 'Detroit Pistons',
    playerName: 'Cade Cunningham',
    playerTeam: 'Detroit Pistons',
    playerPosition: 'PG',
    playerImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW-ipworzJo-zshVbVdZDw3-NGdYwJ8UAwelmyw1arlXBt8FXnctbjY3FMyRctWmYq8XjtRs45BiSMp-PjRRj5FrHaXdMLngAaaybrXw',
    statType: 'assists',
    line: 7.5,
    overOdds: 1.85,
    underOdds: 1.95,
    startTime: new Date('2025-10-14T20:00:00Z'),
    category: 'basketball',
    status: 'live'
  },
  {
    id: 'prop-11',
    sport: 'Basketball',
    league: 'NBA',
    gameId: 'game-7',
    homeTeam: 'Phoenix Suns',
    awayTeam: 'Golden State Warriors',
    playerName: 'Kevin Durant',
    playerTeam: 'Phoenix Suns',
    playerPosition: 'SF',
    playerImage: 'https://assets.underdogfantasy.com/player-images/nba/53f2fa48-e61b-49fb-843d-8a3e872257eb_24.png',
    statType: 'points',
    line: 26.5,
    overOdds: 1.88,
    underOdds: 1.92,
    startTime: new Date('2025-10-14T20:00:00Z'),
    category: 'basketball',
    status: 'live'
  },
  // MLB Players
  {
    id: 'prop-12',
    sport: 'Baseball',
    league: 'MLB',
    gameId: 'game-10',
    homeTeam: 'Los Angeles Dodgers',
    awayTeam: 'San Diego Padres',
    playerName: 'Mookie Betts',
    playerTeam: 'Los Angeles Dodgers',
    playerPosition: 'RF',
    playerImage: 'https://a.espncdn.com/combiner/i?img=/i/headshots/mlb/players/full/33039.png',
    statType: 'hits',
    line: 1.5,
    overOdds: 1.85,
    underOdds: 1.95,
    startTime: new Date('2025-10-14T20:05:00Z'),
    category: 'baseball',
    status: 'live'
  },
  {
    id: 'prop-13',
    sport: 'Baseball',
    league: 'MLB',
    gameId: 'game-11',
    homeTeam: 'Milwaukee Brewers',
    awayTeam: 'Chicago Cubs',
    playerName: 'Christian Yelich',
    playerTeam: 'Milwaukee Brewers',
    playerPosition: 'LF',
    playerImage: 'https://assets.underdogfantasy.com/player-images/mlb/20250414_20-42cb5171-ffa3-4600-9c41-dbc3805206ea.png',
    statType: 'home_runs',
    line: 0.5,
    overOdds: 1.90,
    underOdds: 1.90,
    startTime: new Date('2025-10-14T20:05:00Z'),
    category: 'baseball',
    status: 'live'
  },
  {
    id: 'prop-14',
    sport: 'Baseball',
    league: 'MLB',
    gameId: 'game-10',
    homeTeam: 'Los Angeles Dodgers',
    awayTeam: 'San Diego Padres',
    playerName: 'Max Muncy',
    playerTeam: 'Los Angeles Dodgers',
    playerPosition: '3B',
    playerImage: 'https://assets.underdogfantasy.com/player-images/mlb/20250414_20-d692c6b5-5895-4b72-8a46-d9b9594defb6.png',
    statType: 'home_runs',
    line: 0.5,
    overOdds: 2.10,
    underOdds: 1.70,
    startTime: new Date('2025-10-14T20:05:00Z'),
    category: 'baseball',
    status: 'live'
  },
  // NFL Players
  {
    id: 'prop-15',
    sport: 'Football',
    league: 'NFL',
    gameId: 'game-4',
    homeTeam: 'Cincinnati Bengals',
    awayTeam: 'Pittsburgh Steelers',
    playerName: 'Chase Brown',
    playerTeam: 'Cincinnati Bengals',
    playerPosition: 'RB',
    playerImage: 'https://assets.underdogfantasy.com/player-images/nfl/20250911_02-d74ff06d-905d-4fed-8f98-b5f6d4549333.png',
    statType: 'yards',
    line: 65.5,
    overOdds: 1.88,
    underOdds: 1.92,
    startTime: new Date('2025-10-14T20:30:00Z'),
    category: 'football',
    status: 'live'
  },
  {
    id: 'prop-16',
    sport: 'Football',
    league: 'NFL',
    gameId: 'game-4',
    homeTeam: 'Cincinnati Bengals',
    awayTeam: 'Pittsburgh Steelers',
    playerName: 'Andrei Iosivas',
    playerTeam: 'Cincinnati Bengals',
    playerPosition: 'WR',
    playerImage: 'https://assets.underdogfantasy.com/player-images/nfl/20250911_02-30c0df5e-bb77-4eee-8390-8fc13844e1c3.png',
    statType: 'yards',
    line: 45.5,
    overOdds: 1.90,
    underOdds: 1.90,
    startTime: new Date('2025-10-14T20:30:00Z'),
    category: 'football',
    status: 'live'
  }
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');
    
    // Filter props by category
    let filteredProps = STATIC_PROPS;
    if (category !== 'all') {
      filteredProps = STATIC_PROPS.filter(prop => prop.category === category);
    }
    
    // Apply limit and adjust odds dynamically, and generate random match times for live games
    const limitedProps = filteredProps.slice(0, limit).map(prop => ({
      ...prop,
      overOdds: adjustOdds(prop.overOdds),
      underOdds: adjustOdds(prop.underOdds),
      // Generate random match time for live games (40-60 minutes)
      ...(prop.status === 'live' ? { matchTime: generateRandomMatchTime() } : {}),
    }));
    
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
        error: 'Failed to get player props data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

