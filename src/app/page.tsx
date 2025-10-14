'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BetCard from '@/components/BetCard';
import PlayerPropCard from '@/components/PlayerPropCard';
import BetSlip from '@/components/BetSlip';
import BettingHistory from '@/components/BettingHistory';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useBetting } from '@/hooks/useBetting';
import { useSportsData } from '@/hooks/useSportsData';
import { usePlayerProps } from '@/hooks/usePlayerProps';

interface BetSelection {
  betId: string;
  team: string;
  odds: number;
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [betSelections, setBetSelections] = useState<BetSelection[]>([]);
  const [betType, setBetType] = useState<'matches' | 'props'>('matches');
  const { placedBets } = useBetting();
  
  // Fetch sports data from API with auto-refresh every 5 seconds
  const { bets: allBets, loading, error, refetch, categories } = useSportsData({
    category: selectedCategory,
    limit: 50,
    refreshInterval: 5000,
  });

  // Fetch player props from API with auto-refresh every 5 seconds
  const { 
    props: allPlayerProps, 
    loading: propsLoading, 
    error: propsError 
  } = usePlayerProps({
    category: selectedCategory,
    limit: 50,
    refreshInterval: 5000,
  });

  // Filter out finished games and remove duplicates (memoized to prevent unnecessary recalculations)
  const bets = useMemo(() => 
    allBets
      .filter(bet => bet.status !== 'finished' && !bet.isFinished)
      .filter((bet, index, self) => 
        index === self.findIndex(b => b.id === bet.id)
      ),
    [allBets]
  );

  // Filter out finished player props and remove any duplicates based on ID (memoized)
  const playerProps = useMemo(() => 
    allPlayerProps
      .filter(prop => prop.status !== 'finished' && !prop.isFinished)
      .filter((prop, index, self) => 
        index === self.findIndex(p => p.id === prop.id)
      ),
    [allPlayerProps]
  );

  const handleBetSelection = (betId: string, team: string, odds: number) => {
    // Check if bet already exists in selections
    const exists = betSelections.some(bet => bet.betId === betId && bet.team === team);
    if (exists) {
      return; // Already selected this exact bet
    }

    // Check if there's already a bet on this match (for match bets)
    const currentBet = bets.find(bet => bet.id === betId);
    if (currentBet) {
      const hasBetOnMatch = betSelections.some(bet => bet.betId === betId);
      if (hasBetOnMatch) {
        alert('You can only bet on one outcome per match. Please remove your existing bet on this match first.');
        return;
      }
    }

    // Check if there's already a bet on this game (for player props)
    const currentProp = playerProps.find(prop => prop.id === betId);
    if (currentProp) {
      const hasBetOnGame = betSelections.some(bet => {
        // Find the prop for this bet to check if it's the same game
        const propForBet = playerProps.find(p => p.id === bet.betId);
        return propForBet && propForBet.gameId === currentProp.gameId;
      });
      if (hasBetOnGame) {
        alert('You can only bet on one player prop per game. Please remove your existing bet on this game first.');
        return;
      }
    }

    setBetSelections(prev => [...prev, { betId, team, odds }]);
  };

  const handleRemoveBet = (betId: string, team: string) => {
    setBetSelections(prev => prev.filter(bet => !(bet.betId === betId && bet.team === team)));
  };

  const handleClearAll = () => {
    setBetSelections([]);
  };

  // Update odds in betting slip when API data refreshes
  const updateBetSlipOdds = useMemo(() => {
    return (currentSelections: BetSelection[]) => {
      return currentSelections.map(selection => {
        // Find the current bet/prop data from API
        const currentBet = bets.find(bet => bet.id === selection.betId);
        const currentProp = playerProps.find(prop => prop.id === selection.betId);
        
        if (currentBet) {
          // Update odds for match bets
          let newOdds = selection.odds;
          if (selection.team === currentBet.homeTeam) {
            newOdds = currentBet.homeOdds;
          } else if (selection.team === currentBet.awayTeam) {
            newOdds = currentBet.awayOdds;
          } else if (selection.team === 'Draw' && currentBet.drawOdds) {
            newOdds = currentBet.drawOdds;
          }
          
          return { ...selection, odds: newOdds };
        } else if (currentProp) {
          // Update odds for player props
          let newOdds = selection.odds;
          if (selection.team.includes('OVER')) {
            newOdds = currentProp.overOdds;
          } else if (selection.team.includes('UNDER')) {
            newOdds = currentProp.underOdds;
          }
          
          return { ...selection, odds: newOdds };
        }
        
        // Return unchanged if bet/prop not found
        return selection;
      });
    };
  }, [bets, playerProps]);

  // Update betting slip odds when API data changes
  useEffect(() => {
    if (betSelections.length > 0) {
      const updatedSelections = updateBetSlipOdds(betSelections);
      // Only update if odds actually changed to avoid unnecessary re-renders
      const hasChanges = updatedSelections.some((updated, index) => 
        updated.odds !== betSelections[index].odds
      );
      
      if (hasChanges) {
        setBetSelections(updatedSelections);
      }
    }
  }, [bets, playerProps, updateBetSlipOdds]);

  return (
    <div className="min-h-screen bg-[#0f1419]">
      <Header betType={betType} onBetTypeChange={setBetType} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Advertisement Banner */}
        <div className="mb-8">
          <div className="relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20">
            <div className="relative w-full h-32 sm:h-40 md:h-48 flex items-center justify-center">
              {/* Replace the src with your actual advertisement image */}
              <Image 
                src="/images/ad.png" 
                alt="Advertisement" 
                className="w-full h-full object-contain"
                width={1000}
                height={1000}
                priority
              />
            </div>
          </div>
        </div>

        {/* Error State */}
        {(error || propsError) && (
          <div className="mb-6 bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-500">
            <h3 className="font-semibold mb-2">Error Loading Data</h3>
            <p className="text-sm">{betType === 'matches' ? error : propsError}</p>
            <button
              onClick={refetch}
              className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Categories */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                disabled={loading || propsLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-[#1a1f2e] text-gray-300 hover:bg-[#252b3d]'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span>{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Betting Cards */}
          <div className="lg:col-span-2">
            {/* Loading State for Matches */}
            {loading && betType === 'matches' ? (
              <div className="flex flex-col items-center justify-center py-12">
                <LoadingSpinner />
                <p className="text-gray-400 mt-4">Loading betting data...</p>
              </div>
            ) : propsLoading && betType === 'props' ? (
              <div className="flex flex-col items-center justify-center py-12">
                <LoadingSpinner />
                <p className="text-gray-400 mt-4">Loading player props...</p>
              </div>
            ) : betType === 'matches' ? (
              bets.length > 0 ? (
                <>
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-white">
                      Available Match Bets
                    </h2>
                    <p className="text-gray-400 text-sm">
                      {bets.length} games available
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {bets.map((bet) => (
                      <BetCard
                        key={bet.id}
                        bet={bet}
                        onPlaceBet={handleBetSelection}
                        selectedBets={betSelections}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No games available for this category</p>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    View All Sports
                  </button>
                </div>
              )
            ) : (
              // Player Props View
              playerProps.length > 0 ? (
                <>
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-white">
                      Player Props - Over/Under
                    </h2>
                    <p className="text-gray-400 text-sm">
                      {playerProps.length} props available
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {playerProps.map((prop) => (
                      <PlayerPropCard
                        key={prop.id}
                        prop={prop}
                        onPlaceBet={handleBetSelection}
                        selectedBets={betSelections}
                        allPlayerProps={playerProps}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No player props available for this category</p>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    View All Sports
                  </button>
                </div>
              )
            )}

            {/* Betting History */}
            {!loading && !propsLoading && <BettingHistory bets={placedBets} />}
          </div>

          {/* Bet Slip - Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <BetSlip
                selections={betSelections}
                onRemoveBet={handleRemoveBet}
                onClearAll={handleClearAll}
                bets={bets}
                playerProps={playerProps}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
