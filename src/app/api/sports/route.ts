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

// LIVE games data - Converted from Portuguese data structure
const STATIC_GAMES: Bet[] = [
  // Soccer - World Cup Qualifiers
  {
    id: '1',
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
    id: '2',
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
    id: '3',
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
    id: '4',
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
    id: '5',
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
    id: '6',
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
    id: '7',
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
    id: '8',
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
    id: '9',
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
    id: '10',
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
    id: '11',
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
    matchTime: "27'"
  },
  {
    id: '12',
    sport: 'Soccer',
    league: 'World Cup Qualifiers - Africa',
    homeTeam: 'Gabon',
    awayTeam: 'Burundi',
    homeOdds: 1.49,
    awayOdds: 7.60,
    drawOdds: 3.50,
    startTime: new Date('2025-10-14T19:00:00Z'),
    category: 'soccer',
    status: 'live',
    homeScore: 0,
    awayScore: 0,
    matchTime: "26'"
  },
  {
    id: '13',
    sport: 'Soccer',
    league: 'World Cup Qualifiers - Africa',
    homeTeam: 'Morocco',
    awayTeam: 'Republic of Congo',
    homeOdds: 1.08,
    awayOdds: 90.00,
    drawOdds: 8.00,
    startTime: new Date('2025-10-14T19:00:00Z'),
    category: 'soccer',
    status: 'live',
    homeScore: 0,
    awayScore: 0,
    matchTime: "29'"
  },
  // English FA Cup
  {
    id: '14',
    sport: 'Soccer',
    league: 'FA Cup Qualifying',
    homeTeam: 'Hartlepool United FC',
    awayTeam: 'Gainsborough Trinity',
    homeOdds: 7.00,
    awayOdds: 1.35,
    drawOdds: 5.00,
    startTime: new Date('2025-10-14T18:45:00Z'),
    category: 'soccer',
    status: 'live',
    homeScore: 0,
    awayScore: 2,
    matchTime: "45+1'"
  },
  {
    id: '15',
    sport: 'Soccer',
    league: 'FA Cup Qualifying',
    homeTeam: 'St. Albans City',
    awayTeam: 'Banbury United',
    homeOdds: 2.44,
    awayOdds: 3.25,
    drawOdds: 2.68,
    startTime: new Date('2025-10-14T18:45:00Z'),
    category: 'soccer',
    status: 'live',
    homeScore: 0,
    awayScore: 0,
    matchTime: "44'"
  },
  {
    id: '16',
    sport: 'Soccer',
    league: 'FA Cup Qualifying',
    homeTeam: 'Chester City',
    awayTeam: 'Morecambe FC',
    homeOdds: 2.68,
    awayOdds: 2.86,
    drawOdds: 2.72,
    startTime: new Date('2025-10-14T18:45:00Z'),
    category: 'soccer',
    status: 'live',
    homeScore: 0,
    awayScore: 0,
    matchTime: "45'"
  },
  // Northern Ireland
  {
    id: '17',
    sport: 'Soccer',
    league: 'County Antrim Shield',
    homeTeam: 'Carrick Rangers',
    awayTeam: 'FC Glentoran',
    homeOdds: 1.77,
    awayOdds: 4.40,
    drawOdds: 3.45,
    startTime: new Date('2025-10-14T18:45:00Z'),
    category: 'soccer',
    status: 'live',
    homeScore: 1,
    awayScore: 0,
    matchTime: "45+1'"
  },
  // Ice Hockey
  {
    id: '18',
    sport: 'Hockey',
    league: 'Champions Hockey League',
    homeTeam: 'Belfast Giants',
    awayTeam: 'Brynas IF',
    homeOdds: 2.90,
    awayOdds: 1.34,
    startTime: new Date('2025-10-14T18:00:00Z'),
    category: 'hockey',
    status: 'live',
    homeScore: 1,
    awayScore: 1,
    matchTime: "2nd Intermission"
  },
  // Basketball - Champions League
  {
    id: '19',
    sport: 'Basketball',
    league: 'Champions League',
    homeTeam: 'Trapani Shark',
    awayTeam: 'Tofas SK Bursa',
    homeOdds: 7.20,
    awayOdds: 1.05,
    startTime: new Date('2025-10-14T18:30:00Z'),
    category: 'basketball',
    status: 'live',
    homeScore: 36,
    awayScore: 53,
    matchTime: "2nd Quarter"
  },
  {
    id: '20',
    sport: 'Basketball',
    league: 'Champions League',
    homeTeam: 'CB 1939 Canarias',
    awayTeam: 'Bnei Herzelia',
    homeOdds: 0,
    awayOdds: 11.00,
    startTime: new Date('2025-10-14T19:00:00Z'),
    category: 'basketball',
    status: 'live',
    homeScore: 35,
    awayScore: 17,
    matchTime: "2nd Quarter - 08:02"
  },
  // Basketball - EuroCup
  {
    id: '21',
    sport: 'Basketball',
    league: 'EuroCup',
    homeTeam: 'Hamburg Towers',
    awayTeam: 'Bahcesehir College',
    homeOdds: 10.00,
    awayOdds: 0,
    startTime: new Date('2025-10-14T17:30:00Z'),
    category: 'basketball',
    status: 'live',
    homeScore: 78,
    awayScore: 94,
    matchTime: "4th Quarter - 02:29"
  },
  // Basketball - EuroLeague
  {
    id: '22',
    sport: 'Basketball',
    league: 'EuroLeague',
    homeTeam: 'Fenerbahce Istanbul',
    awayTeam: 'BC Dubai',
    homeOdds: 12.50,
    awayOdds: 0,
    startTime: new Date('2025-10-14T17:45:00Z'),
    category: 'basketball',
    status: 'live',
    homeScore: 56,
    awayScore: 85,
    matchTime: "4th Quarter - 04:29"
  },
  {
    id: '23',
    sport: 'Basketball',
    league: 'EuroLeague',
    homeTeam: 'KK Crvena zvezda Belgrade',
    awayTeam: 'BC Zalgiris Kaunas',
    homeOdds: 1.60,
    awayOdds: 2.24,
    startTime: new Date('2025-10-14T18:00:00Z'),
    category: 'basketball',
    status: 'live',
    homeScore: 54,
    awayScore: 51,
    matchTime: "3rd Quarter - 02:34"
  },
  {
    id: '24',
    sport: 'Basketball',
    league: 'EuroLeague',
    homeTeam: 'Olympiacos BC',
    awayTeam: 'Anadolu Efes SK',
    homeOdds: 1.31,
    awayOdds: 3.25,
    startTime: new Date('2025-10-14T18:15:00Z'),
    category: 'basketball',
    status: 'live',
    homeScore: 59,
    awayScore: 58,
    matchTime: "3rd Quarter - 04:36"
  },
  {
    id: '25',
    sport: 'Basketball',
    league: 'EuroLeague',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Olimpia Milano',
    homeOdds: 2.50,
    awayOdds: 1.49,
    startTime: new Date('2025-10-14T18:30:00Z'),
    category: 'basketball',
    status: 'live',
    homeScore: 28,
    awayScore: 33,
    matchTime: "2nd Quarter"
  },
  // Basketball - EuroCup
  {
    id: '26',
    sport: 'Basketball',
    league: 'EuroCup',
    homeTeam: 'FC Porto',
    awayTeam: 'Antwerp Giants',
    homeOdds: 1.19,
    awayOdds: 3.95,
    startTime: new Date('2025-10-14T19:00:00Z'),
    category: 'basketball',
    status: 'live',
    homeScore: 22,
    awayScore: 11,
    matchTime: "2nd Quarter - 07:29"
  },
  // Tennis
  {
    id: '27',
    sport: 'Tennis',
    league: 'WTA 125K Rio de Janeiro',
    homeTeam: 'Capurro Taborda, Martina (F)',
    awayTeam: 'Rivoli, Pietra (F)',
    homeOdds: 1.12,
    awayOdds: 5.30,
    startTime: new Date('2025-10-14T18:20:00Z'),
    category: 'tennis',
    status: 'live',
    homeScore: 1,
    awayScore: 0,
    matchTime: "2nd Set"
  },
  {
    id: '28',
    sport: 'Tennis',
    league: 'WTA 125K Rio de Janeiro',
    homeTeam: 'Vergara Rivera, Antonia (F)',
    awayTeam: 'Pedretti, Thaisa Grana (F)',
    homeOdds: 1.97,
    awayOdds: 1.72,
    startTime: new Date('2025-10-14T19:05:00Z'),
    category: 'tennis',
    status: 'live',
    homeScore: 0,
    awayScore: 0,
    matchTime: "1st Set"
  },
  {
    id: '29',
    sport: 'Tennis',
    league: 'WTA 125K Rio de Janeiro',
    homeTeam: 'Waltert, Simona (F)',
    awayTeam: 'Giovannini, Luisina (F)',
    homeOdds: 1.09,
    awayOdds: 5.70,
    startTime: new Date('2025-10-14T19:10:00Z'),
    category: 'tennis',
    status: 'live',
    homeScore: 0,
    awayScore: 0,
    matchTime: "1st Set"
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

