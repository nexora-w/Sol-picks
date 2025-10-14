import { NextRequest, NextResponse } from 'next/server';
import { Bet } from '@/types/betting';

// Static games data - 15 games across different sports
const STATIC_GAMES: Bet[] = [
  {
    id: '1',
    sport: 'Basketball',
    league: 'NBA',
    homeTeam: 'Los Angeles Lakers',
    awayTeam: 'Golden State Warriors',
    homeOdds: 1.85,
    awayOdds: 2.00,
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    category: 'basketball',
    status: 'upcoming'
  },
  {
    id: '2',
    sport: 'Basketball',
    league: 'NBA',
    homeTeam: 'Boston Celtics',
    awayTeam: 'Miami Heat',
    homeOdds: 1.75,
    awayOdds: 2.10,
    startTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
    category: 'basketball',
    status: 'upcoming'
  },
  {
    id: '3',
    sport: 'Football',
    league: 'NFL',
    homeTeam: 'Kansas City Chiefs',
    awayTeam: 'Buffalo Bills',
    homeOdds: 1.90,
    awayOdds: 1.95,
    startTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
    category: 'football',
    status: 'upcoming'
  },
  {
    id: '4',
    sport: 'Football',
    league: 'NFL',
    homeTeam: 'San Francisco 49ers',
    awayTeam: 'Dallas Cowboys',
    homeOdds: 1.80,
    awayOdds: 2.05,
    startTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
    category: 'football',
    status: 'upcoming'
  },
  {
    id: '5',
    sport: 'Soccer',
    league: 'Premier League',
    homeTeam: 'Manchester City',
    awayTeam: 'Liverpool',
    homeOdds: 1.95,
    awayOdds: 2.20,
    drawOdds: 3.20,
    startTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
    category: 'soccer',
    status: 'upcoming'
  },
  {
    id: '6',
    sport: 'Soccer',
    league: 'Premier League',
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    homeOdds: 1.85,
    awayOdds: 2.10,
    drawOdds: 3.30,
    startTime: new Date(Date.now() + 7 * 60 * 60 * 1000),
    category: 'soccer',
    status: 'upcoming'
  },
  {
    id: '7',
    sport: 'Soccer',
    league: 'La Liga',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    homeOdds: 2.00,
    awayOdds: 2.05,
    drawOdds: 3.10,
    startTime: new Date(Date.now() + 8 * 60 * 60 * 1000),
    category: 'soccer',
    status: 'upcoming'
  },
  {
    id: '8',
    sport: 'Baseball',
    league: 'MLB',
    homeTeam: 'New York Yankees',
    awayTeam: 'Boston Red Sox',
    homeOdds: 1.75,
    awayOdds: 2.15,
    startTime: new Date(Date.now() + 9 * 60 * 60 * 1000),
    category: 'baseball',
    status: 'upcoming'
  },
  {
    id: '9',
    sport: 'Baseball',
    league: 'MLB',
    homeTeam: 'Los Angeles Dodgers',
    awayTeam: 'San Francisco Giants',
    homeOdds: 1.80,
    awayOdds: 2.05,
    startTime: new Date(Date.now() + 10 * 60 * 60 * 1000),
    category: 'baseball',
    status: 'upcoming'
  },
  {
    id: '10',
    sport: 'Hockey',
    league: 'NHL',
    homeTeam: 'Toronto Maple Leafs',
    awayTeam: 'Boston Bruins',
    homeOdds: 1.90,
    awayOdds: 1.95,
    startTime: new Date(Date.now() + 11 * 60 * 60 * 1000),
    category: 'hockey',
    status: 'upcoming'
  },
  {
    id: '11',
    sport: 'Hockey',
    league: 'NHL',
    homeTeam: 'Colorado Avalanche',
    awayTeam: 'Vegas Golden Knights',
    homeOdds: 1.85,
    awayOdds: 2.00,
    startTime: new Date(Date.now() + 12 * 60 * 60 * 1000),
    category: 'hockey',
    status: 'upcoming'
  },
  {
    id: '12',
    sport: 'MMA',
    league: 'UFC',
    homeTeam: 'Jon Jones',
    awayTeam: 'Stipe Miocic',
    homeOdds: 1.65,
    awayOdds: 2.30,
    startTime: new Date(Date.now() + 13 * 60 * 60 * 1000),
    category: 'mma',
    status: 'upcoming'
  },
  {
    id: '13',
    sport: 'MMA',
    league: 'UFC',
    homeTeam: 'Islam Makhachev',
    awayTeam: 'Charles Oliveira',
    homeOdds: 1.70,
    awayOdds: 2.20,
    startTime: new Date(Date.now() + 14 * 60 * 60 * 1000),
    category: 'mma',
    status: 'upcoming'
  },
  {
    id: '14',
    sport: 'Tennis',
    league: 'US Open',
    homeTeam: 'Novak Djokovic',
    awayTeam: 'Carlos Alcaraz',
    homeOdds: 2.00,
    awayOdds: 1.85,
    startTime: new Date(Date.now() + 15 * 60 * 60 * 1000),
    category: 'tennis',
    status: 'upcoming'
  },
  {
    id: '15',
    sport: 'Tennis',
    league: 'Wimbledon',
    homeTeam: 'Iga Swiatek',
    awayTeam: 'Aryna Sabalenka',
    homeOdds: 1.90,
    awayOdds: 1.95,
    startTime: new Date(Date.now() + 16 * 60 * 60 * 1000),
    category: 'tennis',
    status: 'upcoming'
  },
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
    
    // Apply limit
    const limitedGames = filteredGames.slice(0, limit);
    
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
        error: 'Failed to get sports data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

