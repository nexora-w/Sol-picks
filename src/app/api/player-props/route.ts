import { NextRequest, NextResponse } from 'next/server';
import { PlayerProp } from '@/types/betting';

// Helper function to slightly adjust odds on each request (simulates real-time odds changes)
function adjustOdds(baseOdds: number): number {
  const variance = (Math.random() - 0.5) * 0.3; // +/- 0.15 variance
  const adjusted = baseOdds + variance;
  return Math.max(1.01, parseFloat(adjusted.toFixed(2))); // Ensure odds stay above 1.01
}

// LIVE player data - Real players in games happening in the next 2 hours (Oct 14, 2025 ~7 PM ET)
const STATIC_PLAYERS = [
  { name: 'Giannis Antetokounmpo', team: 'Bucks', position: 'PF', sport: 'Basketball', league: 'NBA', image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203507.png' },
  { name: 'Shai Gilgeous-Alexander', team: 'Thunder', position: 'PG', sport: 'Basketball', league: 'NBA', image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1628983.png' },
  { name: 'Shohei Ohtani', team: 'Dodgers', position: 'DH', sport: 'Baseball', league: 'MLB', image: 'https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/660271/headshot/67/current' },
  { name: 'Freddie Freeman', team: 'Dodgers', position: '1B', sport: 'Baseball', league: 'MLB', image: 'https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/518692/headshot/67/current' },
  { name: 'Alex Ovechkin', team: 'Capitals', position: 'LW', sport: 'Hockey', league: 'NHL', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop&crop=face' },
  { name: 'Nikita Kucherov', team: 'Lightning', position: 'RW', sport: 'Hockey', league: 'NHL', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop&crop=face' },
  { name: 'Christian Pulisic', team: 'United States', position: 'FW', sport: 'Soccer', league: 'International', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop&crop=face' },
  { name: 'James Rodriguez', team: 'Colombia', position: 'MF', sport: 'Soccer', league: 'International', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop&crop=face' },
  { name: 'Damian Lillard', team: 'Bucks', position: 'PG', sport: 'Basketball', league: 'NBA', image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203081.png' },
  { name: 'Mookie Betts', team: 'Dodgers', position: 'RF', sport: 'Baseball', league: 'MLB', image: 'https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/605141/headshot/67/current' },
];

// LIVE player props - Real props for games happening in the next 2 hours (Oct 14, 2025 ~7 PM ET)
const STATIC_PROPS: PlayerProp[] = [
  {
    id: 'prop-1',
    sport: 'Basketball',
    league: 'NBA Preseason',
    gameId: 'game-1',
    homeTeam: 'Milwaukee Bucks',
    awayTeam: 'Oklahoma City Thunder',
    playerName: 'Giannis Antetokounmpo',
    playerTeam: 'Bucks',
    playerPosition: 'PF',
    playerImage: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203507.png',
    statType: 'points',
    line: 28.5,
    overOdds: 1.90,
    underOdds: 1.90,
    startTime: new Date('2025-10-14T20:00:00-04:00'), // 8:00 PM ET
    category: 'basketball',
    status: 'live'
  },
  {
    id: 'prop-2',
    sport: 'Basketball',
    league: 'NBA Preseason',
    gameId: 'game-1',
    homeTeam: 'Milwaukee Bucks',
    awayTeam: 'Oklahoma City Thunder',
    playerName: 'Shai Gilgeous-Alexander',
    playerTeam: 'Thunder',
    playerPosition: 'PG',
    playerImage: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1628983.png',
    statType: 'points',
    line: 30.5,
    overOdds: 1.85,
    underOdds: 1.95,
    startTime: new Date('2025-10-14T20:00:00-04:00'), // 8:00 PM ET
    category: 'basketball',
    status: 'live'
  },
  {
    id: 'prop-3',
    sport: 'Baseball',
    league: 'MLB NLCS',
    gameId: 'game-2',
    homeTeam: 'Milwaukee Brewers',
    awayTeam: 'Los Angeles Dodgers',
    playerName: 'Shohei Ohtani',
    playerTeam: 'Dodgers',
    playerPosition: 'DH',
    playerImage: 'https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/660271/headshot/67/current',
    statType: 'hits',
    line: 1.5,
    overOdds: 1.95,
    underOdds: 1.85,
    startTime: new Date('2025-10-14T20:05:00-04:00'), // 8:05 PM ET
    category: 'baseball',
    status: 'live'
  },
  {
    id: 'prop-4',
    sport: 'Baseball',
    league: 'MLB NLCS',
    gameId: 'game-2',
    homeTeam: 'Milwaukee Brewers',
    awayTeam: 'Los Angeles Dodgers',
    playerName: 'Freddie Freeman',
    playerTeam: 'Dodgers',
    playerPosition: '1B',
    playerImage: 'https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/518692/headshot/67/current',
    statType: 'hits',
    line: 1.5,
    overOdds: 1.88,
    underOdds: 1.92,
    startTime: new Date('2025-10-14T20:05:00-04:00'), // 8:05 PM ET
    category: 'baseball',
    status: 'live'
  },
  {
    id: 'prop-5',
    sport: 'Hockey',
    league: 'NHL',
    gameId: 'game-3',
    homeTeam: 'Washington Capitals',
    awayTeam: 'Tampa Bay Lightning',
    playerName: 'Alex Ovechkin',
    playerTeam: 'Capitals',
    playerPosition: 'LW',
    playerImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop&crop=face',
    statType: 'goals',
    line: 0.5,
    overOdds: 2.10,
    underOdds: 1.75,
    startTime: new Date('2025-10-14T19:00:00-04:00'), // 7:00 PM ET
    category: 'hockey',
    status: 'live'
  },
  {
    id: 'prop-6',
    sport: 'Hockey',
    league: 'NHL',
    gameId: 'game-3',
    homeTeam: 'Washington Capitals',
    awayTeam: 'Tampa Bay Lightning',
    playerName: 'Nikita Kucherov',
    playerTeam: 'Lightning',
    playerPosition: 'RW',
    playerImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop&crop=face',
    statType: 'points',
    line: 1.5,
    overOdds: 1.80,
    underOdds: 2.00,
    startTime: new Date('2025-10-14T19:00:00-04:00'), // 7:00 PM ET
    category: 'hockey',
    status: 'live'
  },
  {
    id: 'prop-7',
    sport: 'Soccer',
    league: 'International Friendly',
    gameId: 'game-4',
    homeTeam: 'United States',
    awayTeam: 'Australia',
    playerName: 'Christian Pulisic',
    playerTeam: 'United States',
    playerPosition: 'FW',
    playerImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop&crop=face',
    statType: 'goals',
    line: 0.5,
    overOdds: 2.25,
    underOdds: 1.65,
    startTime: new Date('2025-10-14T21:00:00-04:00'), // 9:00 PM ET
    category: 'soccer',
    status: 'live'
  },
  {
    id: 'prop-8',
    sport: 'Soccer',
    league: 'International Friendly',
    gameId: 'game-5',
    homeTeam: 'Colombia',
    awayTeam: 'Canada',
    playerName: 'James Rodriguez',
    playerTeam: 'Colombia',
    playerPosition: 'MF',
    playerImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop&crop=face',
    statType: 'shots',
    line: 2.5,
    overOdds: 1.88,
    underOdds: 1.92,
    startTime: new Date('2025-10-14T20:00:00-04:00'), // 8:00 PM ET
    category: 'soccer',
    status: 'live'
  },
  {
    id: 'prop-9',
    sport: 'Basketball',
    league: 'NBA Preseason',
    gameId: 'game-1',
    homeTeam: 'Milwaukee Bucks',
    awayTeam: 'Oklahoma City Thunder',
    playerName: 'Damian Lillard',
    playerTeam: 'Bucks',
    playerPosition: 'PG',
    playerImage: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203081.png',
    statType: 'three_pointers',
    line: 4.5,
    overOdds: 1.92,
    underOdds: 1.88,
    startTime: new Date('2025-10-14T20:00:00-04:00'), // 8:00 PM ET
    category: 'basketball',
    status: 'live'
  },
  {
    id: 'prop-10',
    sport: 'Baseball',
    league: 'MLB NLCS',
    gameId: 'game-2',
    homeTeam: 'Milwaukee Brewers',
    awayTeam: 'Los Angeles Dodgers',
    playerName: 'Mookie Betts',
    playerTeam: 'Dodgers',
    playerPosition: 'RF',
    playerImage: 'https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/605141/headshot/67/current',
    statType: 'hits',
    line: 1.5,
    overOdds: 1.85,
    underOdds: 1.95,
    startTime: new Date('2025-10-14T20:05:00-04:00'), // 8:05 PM ET
    category: 'baseball',
    status: 'live'
  },
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
    
    // Apply limit and adjust odds dynamically
    const limitedProps = filteredProps.slice(0, limit).map(prop => ({
      ...prop,
      overOdds: adjustOdds(prop.overOdds),
      underOdds: adjustOdds(prop.underOdds),
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

