'use client';

import { useState, useEffect } from 'react';
import { useSportsData } from '@/hooks/useSportsData';
import BetCard from './BetCard';
import LoadingSpinner from './LoadingSpinner';

interface LiveBettingFeedProps {
  onBetSelection?: (betId: string, team: string, odds: number) => void;
}

/**
 * Example component demonstrating the Sports API endpoint usage
 * This component fetches live betting data from the API and displays it
 */
export default function LiveBettingFeed({ onBetSelection }: LiveBettingFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Use the custom hook to fetch data from the API
  const { bets, loading, error, refetch, categories } = useSportsData({
    category: selectedCategory,
    limit: 20,
  });

  // Auto-refresh data every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 2000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [refetch]);

  const handleBetSelection = (betId: string, team: string, odds: number) => {
    onBetSelection?.(betId, team, odds);
  };

  const handleRefresh = async () => {
    await refetch();
  };

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-500">
        <h3 className="font-semibold mb-2">Error Loading Data</h3>
        <p className="text-sm">{error}</p>
        <button
          onClick={handleRefresh}
          className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Live Betting Feed</h2>
          <p className="text-gray-400 text-sm mt-1">
            Real-time odds from the API • {bets.length} games available
          </p>
        </div>
      </div>

      {/* Category Filter */}
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

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <LoadingSpinner />
          <p className="text-gray-400 mt-4">Loading betting data...</p>
        </div>
      ) : (
        <>
          {/* Bet Cards Grid */}
          {bets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bets.map((bet) => (
                <BetCard
                  key={bet.id}
                  bet={bet}
                  onPlaceBet={handleBetSelection}
                />
              ))}
            </div>
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
        </>
      )}

      {/* API Info Banner */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm">
        <div className="flex items-start gap-3">
          <span className="text-xl">ℹ️</span>
          <div>
            <h4 className="font-semibold text-blue-400 mb-1">Using Live API Data</h4>
            <p className="text-gray-300">
              This component fetches real-time betting data from <code className="bg-black/30 px-1.5 py-0.5 rounded">/api/sports</code>.
              The data refreshes automatically every 2 seconds to show the latest odds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

