import { NextRequest, NextResponse } from 'next/server';
import { Bet } from '@/types/betting';

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

// LIVE games data - NFL, NBA, MLB, NHL
const STATIC_GAMES: Bet[] = [
  // NFL Games
  // {
  //   id: '1',
  //   sport: 'Football',
  //   league: 'NFL',
  //   homeTeam: 'Kansas City Chiefs',
  //   awayTeam: 'Buffalo Bills',
  //   homeOdds: 1.85,
  //   awayOdds: 1.95,
  //   startTime: new Date('2025-10-14T20:00:00Z'),
  //   category: 'football',
  //   status: 'live',
  //   homeScore: 14,
  //   awayScore: 10,
  //   matchTime: "2nd Quarter - 8:32"
  // },
  // {
  //   id: '2',
  //   sport: 'Football',
  //   league: 'NFL',
  //   homeTeam: 'Dallas Cowboys',
  //   awayTeam: 'Philadelphia Eagles',
  //   homeOdds: 2.10,
  //   awayOdds: 1.75,
  //   startTime: new Date('2025-10-14T20:15:00Z'),
  //   category: 'football',
  //   status: 'live',
  //   homeScore: 7,
  //   awayScore: 14,
  //   matchTime: "1st Quarter - 3:45"
  // },
  // {
  //   id: '3',
  //   sport: 'Football',
  //   league: 'NFL',
  //   homeTeam: 'Miami Dolphins',
  //   awayTeam: 'New England Patriots',
  //   homeOdds: 1.65,
  //   awayOdds: 2.25,
  //   startTime: new Date('2025-10-14T20:30:00Z'),
  //   category: 'football',
  //   status: 'live',
  //   homeScore: 21,
  //   awayScore: 7,
  //   matchTime: "3rd Quarter - 12:15"
  // },
  // {
  //   id: '4',
  //   sport: 'Football',
  //   league: 'NFL',
  //   homeTeam: 'San Francisco 49ers',
  //   awayTeam: 'Seattle Seahawks',
  //   homeOdds: 1.45,
  //   awayOdds: 2.75,
  //   startTime: new Date('2025-10-14T21:00:00Z'),
  //   category: 'football',
  //   status: 'live',
  //   homeScore: 17,
  //   awayScore: 3,
  //   matchTime: "2nd Quarter - 5:20"
  // },
  // // NBA Games
  // {
  //   id: '5',
  //   sport: 'Basketball',
  //   league: 'NBA',
  //   homeTeam: 'Los Angeles Lakers',
  //   awayTeam: 'Boston Celtics',
  //   homeOdds: 1.90,
  //   awayOdds: 1.90,
  //   startTime: new Date('2025-10-14T20:00:00Z'),
  //   category: 'basketball',
  //   status: 'live',
  //   homeScore: 58,
  //   awayScore: 52,
  //   matchTime: "3rd Quarter - 7:45"
  // },
  // {
  //   id: '6',
  //   sport: 'Basketball',
  //   league: 'NBA',
  //   homeTeam: 'Golden State Warriors',
  //   awayTeam: 'Phoenix Suns',
  //   homeOdds: 1.75,
  //   awayOdds: 2.05,
  //   startTime: new Date('2025-10-14T20:15:00Z'),
  //   category: 'basketball',
  //   status: 'live',
  //   homeScore: 45,
  //   awayScore: 38,
  //   matchTime: "2nd Quarter - 3:20"
  // },
  // {
  //   id: '7',
  //   sport: 'Basketball',
  //   league: 'NBA',
  //   homeTeam: 'Miami Heat',
  //   awayTeam: 'Milwaukee Bucks',
  //   homeOdds: 2.20,
  //   awayOdds: 1.65,
  //   startTime: new Date('2025-10-14T20:30:00Z'),
  //   category: 'basketball',
  //   status: 'live',
  //   homeScore: 28,
  //   awayScore: 35,
  //   matchTime: "2nd Quarter - 8:15"
  // },
  // {
  //   id: '8',
  //   sport: 'Basketball',
  //   league: 'NBA',
  //   homeTeam: 'Denver Nuggets',
  //   awayTeam: 'Los Angeles Clippers',
  //   homeOdds: 1.55,
  //   awayOdds: 2.45,
  //   startTime: new Date('2025-10-14T21:00:00Z'),
  //   category: 'basketball',
  //   status: 'live',
  //   homeScore: 62,
  //   awayScore: 48,
  //   matchTime: "3rd Quarter - 4:30"
  // },
  // // MLB Games
  // {
  //   id: '9',
  //   sport: 'Baseball',
  //   league: 'MLB',
  //   homeTeam: 'New York Yankees',
  //   awayTeam: 'Houston Astros',
  //   homeOdds: 1.80,
  //   awayOdds: 2.00,
  //   startTime: new Date('2025-10-14T20:05:00Z'),
  //   category: 'baseball',
  //   status: 'live',
  //   homeScore: 3,
  //   awayScore: 1,
  //   matchTime: "6th Inning"
  // },
  // {
  //   id: '10',
  //   sport: 'Baseball',
  //   league: 'MLB',
  //   homeTeam: 'Los Angeles Dodgers',
  //   awayTeam: 'Atlanta Braves',
  //   homeOdds: 1.70,
  //   awayOdds: 2.15,
  //   startTime: new Date('2025-10-14T20:10:00Z'),
  //   category: 'baseball',
  //   status: 'live',
  //   homeScore: 2,
  //   awayScore: 4,
  //   matchTime: "7th Inning"
  // },
  // {
  //   id: '11',
  //   sport: 'Baseball',
  //   league: 'MLB',
  //   homeTeam: 'Boston Red Sox',
  //   awayTeam: 'Tampa Bay Rays',
  //   homeOdds: 2.05,
  //   awayOdds: 1.80,
  //   startTime: new Date('2025-10-14T20:20:00Z'),
  //   category: 'baseball',
  //   status: 'live',
  //   homeScore: 1,
  //   awayScore: 0,
  //   matchTime: "4th Inning"
  // },
  // {
  //   id: '12',
  //   sport: 'Baseball',
  //   league: 'MLB',
  //   homeTeam: 'San Diego Padres',
  //   awayTeam: 'San Francisco Giants',
  //   homeOdds: 1.85,
  //   awayOdds: 1.95,
  //   startTime: new Date('2025-10-14T20:35:00Z'),
  //   category: 'baseball',
  //   status: 'live',
  //   homeScore: 5,
  //   awayScore: 3,
  //   matchTime: "8th Inning"
  // },
  // // NHL Games
  // {
  //   id: '13',
  //   sport: 'Hockey',
  //   league: 'NHL',
  //   homeTeam: 'Toronto Maple Leafs',
  //   awayTeam: 'Montreal Canadiens',
  //   homeOdds: 1.65,
  //   awayOdds: 2.25,
  //   startTime: new Date('2025-10-14T20:00:00Z'),
  //   category: 'hockey',
  //   status: 'live',
  //   homeScore: 2,
  //   awayScore: 1,
  //   matchTime: "2nd Period - 8:45"
  // },
  // {
  //   id: '14',
  //   sport: 'Hockey',
  //   league: 'NHL',
  //   homeTeam: 'Boston Bruins',
  //   awayTeam: 'New York Rangers',
  //   homeOdds: 1.90,
  //   awayOdds: 1.90,
  //   startTime: new Date('2025-10-14T20:15:00Z'),
  //   category: 'hockey',
  //   status: 'live',
  //   homeScore: 1,
  //   awayScore: 3,
  //   matchTime: "3rd Period - 12:30"
  // },
  // {
  //   id: '15',
  //   sport: 'Hockey',
  //   league: 'NHL',
  //   homeTeam: 'Edmonton Oilers',
  //   awayTeam: 'Calgary Flames',
  //   homeOdds: 1.75,
  //   awayOdds: 2.05,
  //   startTime: new Date('2025-10-14T20:30:00Z'),
  //   category: 'hockey',
  //   status: 'live',
  //   homeScore: 0,
  //   awayScore: 2,
  //   matchTime: "1st Period - 15:20"
  // },
  // {
  //   id: '16',
  //   sport: 'Hockey',
  //   league: 'NHL',
  //   homeTeam: 'Vegas Golden Knights',
  //   awayTeam: 'Colorado Avalanche',
  //   homeOdds: 2.10,
  //   awayOdds: 1.75,
  //   startTime: new Date('2025-10-14T21:00:00Z'),
  //   category: 'hockey',
  //   status: 'live',
  //   homeScore: 3,
  //   awayScore: 1,
  //   matchTime: "2nd Period - 5:15"
  // },
  {
    id: '17',
    sport: 'Soccer',
    league: 'World Cup Qualifiers - Asia',
    homeTeam: 'Saudi Arabia',
    awayTeam: 'Iraq',
    homeOdds: 1.96,
    awayOdds: 5.30,
    drawOdds: 2.56,
    startTime: new Date('2025-10-14T18:45:00Z'),
    category: 'soccer',
    status: 'live',
    homeScore: 0,
    awayScore: 0,
    matchTime: "44'"
  },
  {
    id: '18',
    sport: 'Soccer',
    league: 'World Cup Qualifiers - Europe',
    homeTeam: 'Latvia',
    awayTeam: 'England',
    homeOdds: 100,
    awayOdds: 0,
    drawOdds: 26,
    startTime: new Date('2025-10-14T18:45:00Z'),
    category: 'soccer',
    status: 'live',
    homeScore: 0,
    awayScore: 2,
    matchTime: "44'"
  },
  {
    id: '19',
    sport: 'Soccer',
    league: 'World Cup Qualifiers - Europe',
    homeTeam: 'Spain',
    awayTeam: 'Bulgaria',
    homeOdds: 0,
    awayOdds: 100,
    drawOdds: 42,
    startTime: new Date('2025-10-14T18:45:00Z'),
    category: 'soccer',
    status: 'live',
    homeScore: 1,
    awayScore: 0,
    matchTime: "44'"
  },
  {
    id: '20',
    sport: 'Soccer',
    league: 'World Cup Qualifiers - Europe',
    homeTeam: 'Ireland',
    awayTeam: 'Armenia',
    homeOdds: 1.76,
    awayOdds: 6.00,
    drawOdds: 2.82,
    startTime: new Date('2025-10-14T18:45:00Z'),
    category: 'soccer',
    status: 'live',
    homeScore: 0,
    awayScore: 0,
    matchTime: "44'"
  },
  {
    id: '21',
    sport: 'Soccer',
    league: 'World Cup Qualifiers - Europe',
    homeTeam: 'Portugal',
    awayTeam: 'Hungary',
    homeOdds: 1.43,
    awayOdds: 7.80,
    drawOdds: 3.80,
    startTime: new Date('2025-10-14T18:45:00Z'),
    category: 'soccer',
    status: 'live',
    homeScore: 1,
    awayScore: 1,
    matchTime: "43'"
  },
  {
    id: '22',
    sport: 'Soccer',
    league: 'World Cup Qualifiers - Europe',
    homeTeam: 'Andorra',
    awayTeam: 'Serbia',
    homeOdds: 13.00,
    awayOdds: 1.39,
    drawOdds: 3.40,
    startTime: new Date('2025-10-14T18:45:00Z'),
    category: 'soccer',
    status: 'live',
    homeScore: 1,
    awayScore: 1,
    matchTime: "43'"
  },
  {
    id: '23',
    sport: 'Soccer',
    league: 'World Cup Qualifiers - Europe',
    homeTeam: 'Turkey',
    awayTeam: 'Georgia',
    homeOdds: 0,
    awayOdds: 100,
    drawOdds: 28,
    startTime: new Date('2025-10-14T18:45:00Z'),
    category: 'soccer',
    status: 'live',
    homeScore: 3,
    awayScore: 0,
    matchTime: "43'"
  },
  {
    id: '24',
    sport: 'Soccer',
    league: 'World Cup Qualifiers - Europe',
    homeTeam: 'Italy',
    awayTeam: 'Israel',
    homeOdds: 1.49,
    awayOdds: 6.60,
    drawOdds: 3.75,
    startTime: new Date('2025-10-14T18:45:00Z'),
    category: 'soccer',
    status: 'live',
    homeScore: 0,
    awayScore: 0,
    matchTime: "42'"
  },
  // Soccer - World Cup Qualifiers Africa
  {
    id: '25',
    sport: 'Soccer',
    league: 'World Cup Qualifiers - Africa',
    homeTeam: 'Ivory Coast',
    awayTeam: 'Kenya',
    homeOdds: 1.03,
    awayOdds: 100,
    drawOdds: 16,
    startTime: new Date('2025-10-14T19:00:00Z'),
    category: 'soccer',
    status: 'live',
    homeScore: 1,
    awayScore: 0,
    matchTime: "30'"
  },
  {
    id: '26',
    sport: 'Soccer',
    league: 'World Cup Qualifiers - Africa',
    homeTeam: 'Democratic Republic of Congo',
    awayTeam: 'Sudan',
    homeOdds: 1.30,
    awayOdds: 12.50,
    drawOdds: 4.50,
    startTime: new Date('2025-10-14T19:00:00Z'),
    category: 'soccer',
    status: 'live',
    homeScore: 0,
    awayScore: 0,
    matchTime: "28'"
  },
  {
    id: '27',
    sport: 'Soccer',
    league: 'World Cup Qualifiers - Africa',
    homeTeam: 'Senegal',
    awayTeam: 'Mauritania',
    homeOdds: 1.32,
    awayOdds: 14.00,
    drawOdds: 4.00,
    startTime: new Date('2025-10-14T19:00:00Z'),
    category: 'soccer',
    status: 'live',
    homeScore: 0,
    awayScore: 0,
    matchTime: "27"
  }
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');
    
    // Filter games by category
    let filteredGames = STATIC_GAMES;
    if (category !== 'all') {
      filteredGames = STATIC_GAMES.filter(game => game.category === category);
    }
    
    // Apply limit and adjust odds dynamically, and generate random match times for live games
    const limitedGames = filteredGames.slice(0, limit).map(game => ({
      ...game,
      homeOdds: adjustOdds(game.homeOdds),
      awayOdds: adjustOdds(game.awayOdds),
      ...(game.drawOdds ? { drawOdds: adjustOdds(game.drawOdds) } : {}),
      // Generate random match time for live games (40-60 minutes)
      ...(game.status === 'live' ? { matchTime: generateRandomMatchTime() } : {}),
    }));
    
    return NextResponse.json({
      success: true,
      count: limitedGames.length,
      category: category,
      data: limitedGames,
      categories: [
        { id: 'all', name: 'All Sports', icon: '🏆' },
        { id: 'football', name: 'NFL', icon: '🏈' },
        { id: 'basketball', name: 'NBA', icon: '🏀' },
        { id: 'baseball', name: 'MLB', icon: '⚾' },
        { id: 'hockey', name: 'NHL', icon: '🏒' },
        { id: 'soccer', name: 'Soccer', icon: '⚽' },
        { id: 'tennis', name: 'Tennis', icon: '🎾' },
        { id: 'golf', name: 'Golf', icon: '🏌️' },
        { id: 'cricket', name: 'Cricket', icon: '🏏' }
      ],
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get sports data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

