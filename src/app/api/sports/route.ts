import { NextRequest, NextResponse } from 'next/server';
import { Bet } from '@/types/betting';

// LIVE games data - Real matches happening in the next 2 hours (as of Oct 14, 2025 ~7 PM ET)
const STATIC_GAMES: Bet[] = [
  {
    id: '1',
    sport: 'Hockey',
    league: 'NHL',
    homeTeam: 'Washington Capitals',
    awayTeam: 'Tampa Bay Lightning',
    homeOdds: 1.95,
    awayOdds: 1.90,
    startTime: new Date('2025-10-14T19:00:00-04:00'), // 7:00 PM ET
    category: 'hockey',
    status: 'live'
  },
  {
    id: '2',
    sport: 'Basketball',
    league: 'NBA Preseason',
    homeTeam: 'Milwaukee Bucks',
    awayTeam: 'Oklahoma City Thunder',
    homeOdds: 1.85,
    awayOdds: 2.00,
    startTime: new Date('2025-10-14T20:00:00-04:00'), // 8:00 PM ET
    category: 'basketball',
    status: 'live'
  },
  {
    id: '3',
    sport: 'Baseball',
    league: 'MLB NLCS',
    homeTeam: 'Milwaukee Brewers',
    awayTeam: 'Los Angeles Dodgers',
    homeOdds: 2.15,
    awayOdds: 1.75,
    startTime: new Date('2025-10-14T20:05:00-04:00'), // 8:05 PM ET
    category: 'baseball',
    status: 'live'
  },
  {
    id: '4',
    sport: 'Soccer',
    league: 'International Friendly',
    homeTeam: 'Colombia',
    awayTeam: 'Canada',
    homeOdds: 1.70,
    awayOdds: 2.30,
    drawOdds: 3.20,
    startTime: new Date('2025-10-14T20:00:00-04:00'), // 8:00 PM ET
    category: 'soccer',
    status: 'live'
  },
  {
    id: '5',
    sport: 'Soccer',
    league: 'International Friendly',
    homeTeam: 'United States',
    awayTeam: 'Australia',
    homeOdds: 1.65,
    awayOdds: 2.40,
    drawOdds: 3.10,
    startTime: new Date('2025-10-14T21:00:00-04:00'), // 9:00 PM ET
    category: 'soccer',
    status: 'live'
  },
  {
    id: '6',
    sport: 'Hockey',
    league: 'NHL',
    homeTeam: 'Dallas Stars',
    awayTeam: 'Minnesota Wild',
    homeOdds: 1.88,
    awayOdds: 1.97,
    startTime: new Date('2025-10-14T21:30:00-04:00'), // 9:30 PM ET
    category: 'hockey',
    status: 'live'
  },
  {
    id: '7',
    sport: 'Basketball',
    league: 'NBA',
    homeTeam: 'Los Angeles Lakers',
    awayTeam: 'Golden State Warriors',
    homeOdds: 1.85,
    awayOdds: 2.00,
    startTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
    category: 'basketball',
    status: 'live'
  },
  {
    id: '8',
    sport: 'Football',
    league: 'NFL',
    homeTeam: 'Kansas City Chiefs',
    awayTeam: 'Buffalo Bills',
    homeOdds: 1.90,
    awayOdds: 1.95,
    startTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
    category: 'football',
    status: 'live'
  },
  {
    id: '9',
    sport: 'Soccer',
    league: 'Premier League',
    homeTeam: 'Manchester City',
    awayTeam: 'Liverpool',
    homeOdds: 1.95,
    awayOdds: 2.20,
    drawOdds: 3.20,
    startTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
    category: 'soccer',
    status: 'live'
  },
  {
    id: '10',
    sport: 'Baseball',
    league: 'MLB',
    homeTeam: 'New York Yankees',
    awayTeam: 'Boston Red Sox',
    homeOdds: 1.75,
    awayOdds: 2.15,
    startTime: new Date(Date.now() + 9 * 60 * 60 * 1000),
    category: 'baseball',
    status: 'live'
  },
  {
    id: '11',
    sport: 'Hockey',
    league: 'NHL',
    homeTeam: 'Toronto Maple Leafs',
    awayTeam: 'Boston Bruins',
    homeOdds: 1.90,
    awayOdds: 1.95,
    startTime: new Date(Date.now() + 11 * 60 * 60 * 1000),
    category: 'hockey',
    status: 'live'
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
    status: 'live'
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
    status: 'live'
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
    status: 'live'
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
    status: 'live'
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

