'use client';

import { useState } from 'react';
import { Bet } from '@/types/betting';

interface BetCardProps {
  bet: Bet;
  onPlaceBet: (betId: string, team: string, odds: number) => void;
}

export default function BetCard({ bet, onPlaceBet }: BetCardProps) {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const handleBetClick = (team: string, odds: number) => {
    setSelectedTeam(team);
    onPlaceBet(bet.id, team, odds);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      return `${Math.floor(hours / 24)}d`;
    }
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const getStatusBadge = () => {
    switch (bet.status) {
      case 'live':
        return (
          <div className="px-2 py-1 bg-red-500 rounded text-xs text-white font-semibold animate-pulse">
            🔴 LIVE
          </div>
        );
      case 'finished':
        return (
          <div className="px-2 py-1 bg-gray-600 rounded text-xs text-gray-300">
            FINISHED
          </div>
        );
      default:
        return (
          <div className="px-2 py-1 bg-green-600 rounded text-xs text-white">
            UPCOMING
          </div>
        );
    }
  };

  const isFinished = bet.status === 'finished';

  return (
    <div className="bg-[#1a1f2e] rounded-lg p-4 hover:bg-[#212838] transition-colors border border-[#2a3142]">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="text-xs text-gray-400 mb-1">
            {bet.league} • {bet.sport}
          </div>
          <div className="text-sm text-gray-500">
            {bet.status === 'upcoming' && `Starts in ${formatTime(bet.startTime)}`}
            {bet.status === 'live' && (
              <span className="text-yellow-400 font-semibold">{bet.matchTime}</span>
            )}
            {bet.status === 'finished' && (
              <span className="text-gray-500">{bet.matchTime}</span>
            )}
          </div>
          {(bet.status === 'live' || bet.status === 'finished') && bet.homeScore !== undefined && bet.awayScore !== undefined && (
            <div className="text-lg font-bold text-white mt-2">
              {bet.homeScore} - {bet.awayScore}
            </div>
          )}
        </div>
        {getStatusBadge()}
      </div>

      <div className="space-y-2">
        <button
          onClick={() => !isFinished && handleBetClick(bet.homeTeam, bet.homeOdds)}
          disabled={isFinished}
          className={`w-full flex justify-between items-center p-3 rounded-lg transition-all ${
            isFinished
              ? 'bg-[#1a1f2e] text-gray-500 cursor-not-allowed'
              : selectedTeam === bet.homeTeam
              ? 'bg-purple-600 text-white'
              : 'bg-[#252b3d] hover:bg-[#2d3449] text-white'
          }`}
        >
          <span className="font-medium">{bet.homeTeam}</span>
          <span className="font-bold">{bet.homeOdds.toFixed(2)}x</span>
        </button>

        {bet.drawOdds && (
          <button
            onClick={() => !isFinished && handleBetClick('Draw', bet.drawOdds!)}
            disabled={isFinished}
            className={`w-full flex justify-between items-center p-3 rounded-lg transition-all ${
              isFinished
                ? 'bg-[#1a1f2e] text-gray-500 cursor-not-allowed'
                : selectedTeam === 'Draw'
                ? 'bg-purple-600 text-white'
                : 'bg-[#252b3d] hover:bg-[#2d3449] text-white'
            }`}
          >
            <span className="font-medium">Draw</span>
            <span className="font-bold">{bet.drawOdds.toFixed(2)}x</span>
          </button>
        )}

        <button
          onClick={() => !isFinished && handleBetClick(bet.awayTeam, bet.awayOdds)}
          disabled={isFinished}
          className={`w-full flex justify-between items-center p-3 rounded-lg transition-all ${
            isFinished
              ? 'bg-[#1a1f2e] text-gray-500 cursor-not-allowed'
              : selectedTeam === bet.awayTeam
              ? 'bg-purple-600 text-white'
              : 'bg-[#252b3d] hover:bg-[#2d3449] text-white'
          }`}
        >
          <span className="font-medium">{bet.awayTeam}</span>
          <span className="font-bold">{bet.awayOdds.toFixed(2)}x</span>
        </button>
      </div>
    </div>
  );
}

