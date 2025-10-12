'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BetCard from '@/components/BetCard';
import BetSlip from '@/components/BetSlip';
import UserStats from '@/components/UserStats';
import BettingHistory from '@/components/BettingHistory';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useBetting } from '@/hooks/useBetting';
import { useSportsData } from '@/hooks/useSportsData';
import { UserStats as UserStatsType } from '@/types/betting';

interface BetSelection {
  betId: string;
  team: string;
  odds: number;
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [betSelection, setBetSelection] = useState<BetSelection | null>(null);
  const { placedBets } = useBetting();
  
  // Fetch sports data from API
  const { bets, loading, error, refetch, categories } = useSportsData({
    category: selectedCategory,
    limit: 50,
  });

  const handleBetSelection = (betId: string, team: string, odds: number) => {
    setBetSelection({ betId, team, odds });
  };

  const userStats: UserStatsType = {
    totalBets: placedBets.length,
    wonBets: placedBets.filter(bet => bet.status === 'won').length,
    totalWagered: placedBets.reduce((sum, bet) => sum + bet.amount, 0),
    totalWinnings: placedBets.filter(bet => bet.status === 'won').reduce((sum, bet) => sum + bet.potentialWin, 0),
  };

  return (
    <div className="min-h-screen bg-[#0f1419]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Stats */}
        <div className="mb-8">
          <UserStats stats={userStats} />
        </div>

        {/* Header with Refresh Button */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Live Sports Betting</h2>
            <p className="text-gray-400 text-sm mt-1">
              Real-time odds powered by API • {bets.length} games available
            </p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-500">
            <h3 className="font-semibold mb-2">Error Loading Data</h3>
            <p className="text-sm">{error}</p>
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
                disabled={loading}
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
            {/* Loading State */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <LoadingSpinner />
                <p className="text-gray-400 mt-4">Loading betting data...</p>
              </div>
            ) : bets.length > 0 ? (
              <>
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-white">
                    Available Bets
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
            )}

            {/* Betting History */}
            {!loading && <BettingHistory bets={placedBets} />}
          </div>

          {/* Bet Slip - Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <BetSlip
                selection={betSelection}
                onClear={() => setBetSelection(null)}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
