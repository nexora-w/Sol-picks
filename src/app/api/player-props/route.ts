import { NextRequest, NextResponse } from 'next/server';
import { PlayerProp } from '@/types/betting';

// Static player data - 10 players
const STATIC_PLAYERS = [
  { name: 'LeBron James', team: 'Lakers', position: 'SF', sport: 'Basketball', league: 'NBA', image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png' },
  { name: 'Stephen Curry', team: 'Warriors', position: 'PG', sport: 'Basketball', league: 'NBA', image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/201939.png' },
  { name: 'Patrick Mahomes', team: 'Chiefs', position: 'QB', sport: 'Football', league: 'NFL', image: 'https://a.espncdn.com/i/headshots/nfl/players/full/3139477.png' },
  { name: 'Travis Kelce', team: 'Chiefs', position: 'TE', sport: 'Football', league: 'NFL', image: 'https://a.espncdn.com/i/headshots/nfl/players/full/15847.png' },
  { name: 'Shohei Ohtani', team: 'Dodgers', position: 'DH', sport: 'Baseball', league: 'MLB', image: 'https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/660271/headshot/67/current' },
  { name: 'Aaron Judge', team: 'Yankees', position: 'RF', sport: 'Baseball', league: 'MLB', image: 'https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/592450/headshot/67/current' },
  { name: 'Erling Haaland', team: 'Manchester City', position: 'FW', sport: 'Soccer', league: 'Premier League', image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p223094.png' },
  { name: 'Mohamed Salah', team: 'Liverpool', position: 'FW', sport: 'Soccer', league: 'Premier League', image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p118748.png' },
  { name: 'Luka Doncic', team: 'Mavericks', position: 'PG', sport: 'Basketball', league: 'NBA', image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1629029.png' },
  { name: 'Tyreek Hill', team: 'Dolphins', position: 'WR', sport: 'Football', league: 'NFL', image: 'https://a.espncdn.com/i/headshots/nfl/players/full/3116406.png' },
];

// Static props for each player
const STATIC_PROPS: PlayerProp[] = [
  {
    id: 'prop-1',
    sport: 'Basketball',
    league: 'NBA',
    gameId: 'game-1',
    homeTeam: 'Lakers',
    awayTeam: 'Warriors',
    playerName: 'LeBron James',
    playerTeam: 'Lakers',
    playerPosition: 'SF',
    playerImage: 'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png',
    statType: 'points',
    line: 27.5,
    overOdds: 1.90,
    underOdds: 1.90,
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    category: 'basketball',
    status: 'upcoming'
  },
  {
    id: 'prop-2',
        sport: 'Basketball',
        league: 'NBA',
    gameId: 'game-1',
    homeTeam: 'Lakers',
    awayTeam: 'Warriors',
    playerName: 'Stephen Curry',
    playerTeam: 'Warriors',
    playerPosition: 'PG',
    playerImage: 'https://cdn.nba.com/headshots/nba/latest/1040x760/201939.png',
    statType: 'three_pointers',
    line: 5.5,
    overOdds: 1.85,
    underOdds: 1.95,
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        category: 'basketball',
    status: 'upcoming'
  },
  {
    id: 'prop-3',
    sport: 'Football',
    league: 'NFL',
    gameId: 'game-2',
    homeTeam: 'Chiefs',
    awayTeam: 'Bills',
    playerName: 'Patrick Mahomes',
    playerTeam: 'Chiefs',
    playerPosition: 'QB',
    playerImage: 'https://a.espncdn.com/i/headshots/nfl/players/full/3139477.png',
    statType: 'yards',
    line: 285.5,
    overOdds: 1.88,
    underOdds: 1.92,
    startTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
    category: 'football',
    status: 'upcoming'
  },
  {
    id: 'prop-4',
        sport: 'Football',
        league: 'NFL',
    gameId: 'game-2',
    homeTeam: 'Chiefs',
    awayTeam: 'Bills',
    playerName: 'Travis Kelce',
    playerTeam: 'Chiefs',
    playerPosition: 'TE',
    playerImage: 'https://a.espncdn.com/i/headshots/nfl/players/full/15847.png',
    statType: 'receptions',
    line: 6.5,
    overOdds: 1.87,
    underOdds: 1.93,
    startTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
        category: 'football',
    status: 'upcoming'
  },
  {
    id: 'prop-5',
    sport: 'Baseball',
    league: 'MLB',
    gameId: 'game-3',
    homeTeam: 'Dodgers',
    awayTeam: 'Giants',
    playerName: 'Shohei Ohtani',
    playerTeam: 'Dodgers',
    playerPosition: 'DH',
    playerImage: 'https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/660271/headshot/67/current',
    statType: 'hits',
    line: 1.5,
    overOdds: 2.00,
    underOdds: 1.80,
    startTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
    category: 'baseball',
    status: 'upcoming'
  },
  {
    id: 'prop-6',
        sport: 'Baseball',
        league: 'MLB',
    gameId: 'game-4',
    homeTeam: 'Yankees',
    awayTeam: 'Red Sox',
    playerName: 'Aaron Judge',
    playerTeam: 'Yankees',
    playerPosition: 'RF',
    playerImage: 'https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/592450/headshot/67/current',
    statType: 'home_runs',
    line: 0.5,
    overOdds: 2.50,
    underOdds: 1.55,
    startTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
        category: 'baseball',
    status: 'upcoming'
  },
  {
    id: 'prop-7',
    sport: 'Soccer',
    league: 'Premier League',
    gameId: 'game-5',
    homeTeam: 'Manchester City',
    awayTeam: 'Liverpool',
    playerName: 'Erling Haaland',
    playerTeam: 'Manchester City',
    playerPosition: 'FW',
    playerImage: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p223094.png',
    statType: 'goals',
    line: 0.5,
    overOdds: 1.75,
    underOdds: 2.05,
    startTime: new Date(Date.now() + 8 * 60 * 60 * 1000),
    category: 'soccer',
    status: 'upcoming'
  },
  {
    id: 'prop-8',
        sport: 'Soccer',
        league: 'Premier League',
    gameId: 'game-5',
    homeTeam: 'Manchester City',
    awayTeam: 'Liverpool',
    playerName: 'Mohamed Salah',
    playerTeam: 'Liverpool',
    playerPosition: 'FW',
    playerImage: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p118748.png',
    statType: 'shots',
    line: 3.5,
    overOdds: 1.92,
    underOdds: 1.88,
    startTime: new Date(Date.now() + 8 * 60 * 60 * 1000),
        category: 'soccer',
    status: 'upcoming'
  },
  {
    id: 'prop-9',
    sport: 'Basketball',
    league: 'NBA',
    gameId: 'game-6',
    homeTeam: 'Mavericks',
    awayTeam: 'Suns',
    playerName: 'Luka Doncic',
    playerTeam: 'Mavericks',
    playerPosition: 'PG',
    playerImage: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1629029.png',
    statType: 'assists',
    line: 9.5,
    overOdds: 1.95,
    underOdds: 1.85,
    startTime: new Date(Date.now() + 10 * 60 * 60 * 1000),
    category: 'basketball',
    status: 'upcoming'
  },
  {
    id: 'prop-10',
    sport: 'Football',
    league: 'NFL',
    gameId: 'game-7',
    homeTeam: 'Dolphins',
    awayTeam: 'Eagles',
    playerName: 'Tyreek Hill',
    playerTeam: 'Dolphins',
    playerPosition: 'WR',
    playerImage: 'https://a.espncdn.com/i/headshots/nfl/players/full/3116406.png',
    statType: 'yards',
    line: 95.5,
    overOdds: 1.90,
    underOdds: 1.90,
    startTime: new Date(Date.now() + 12 * 60 * 60 * 1000),
    category: 'football',
    status: 'upcoming'
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
    
    // Apply limit
    const limitedProps = filteredProps.slice(0, limit);
    
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

