'use client';

import { Bet } from '@/types/betting';

interface BetCardProps {
  bet: Bet;
  onPlaceBet: (betId: string, team: string, odds: number) => void;
  selectedBets?: Array<{ betId: string; team: string; odds: number }>;
}

export default function BetCard({ bet, onPlaceBet, selectedBets = [] }: BetCardProps) {
  // Check if there's already a bet on this match
  const existingBet = selectedBets.find(selection => selection.betId === bet.id);
  const hasExistingBet = !!existingBet;

  const handleBetClick = (team: string, odds: number) => {
    // If there's already a bet on this match and it's not the same team, don't allow selection
    if (hasExistingBet && existingBet?.team !== team) {
      return;
    }
    
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

  const isFinished = bet.status === 'finished';

  return (
    <div className="bg-[#1a1f2e] rounded-lg p-4 hover:bg-[#212838] transition-colors border border-[#2a3142]">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="text-xs text-gray-400">
              {bet.league} • {bet.sport}
            </div>
            {hasExistingBet && (
              <div className="px-2 py-1 bg-purple-600/20 text-purple-400 text-xs rounded-full border border-purple-600/30">
                ✓ Bet Selected
              </div>
            )}
          </div>
          {(bet.status === 'live' || bet.status === 'finished') && bet.homeScore !== undefined && bet.awayScore !== undefined && (
            <div className="text-lg font-bold text-white mt-2">
              {bet.homeScore} - {bet.awayScore}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => !isFinished && handleBetClick(bet.homeTeam, bet.homeOdds)}
          disabled={isFinished || (hasExistingBet && existingBet?.team !== bet.homeTeam)}
          className={`w-full flex justify-between items-center p-3 rounded-lg transition-all ${
            isFinished
              ? 'bg-[#1a1f2e] text-gray-500 cursor-not-allowed'
              : existingBet?.team === bet.homeTeam
              ? 'bg-purple-600 text-white'
              : hasExistingBet && existingBet?.team !== bet.homeTeam
              ? 'bg-[#1a1f2e] text-gray-500 cursor-not-allowed opacity-50'
              : 'bg-[#252b3d] hover:bg-[#2d3449] text-white'
          }`}
        >
          <span className="font-medium">{bet.homeTeam}</span>
          <span className="font-bold">{bet.homeOdds.toFixed(2)}x</span>
        </button>

        {bet.drawOdds && (
          <button
            onClick={() => !isFinished && handleBetClick('Draw', bet.drawOdds!)}
            disabled={isFinished || (hasExistingBet && existingBet?.team !== 'Draw')}
            className={`w-full flex justify-between items-center p-3 rounded-lg transition-all ${
              isFinished
                ? 'bg-[#1a1f2e] text-gray-500 cursor-not-allowed'
                : existingBet?.team === 'Draw'
                ? 'bg-purple-600 text-white'
                : hasExistingBet && existingBet?.team !== 'Draw'
                ? 'bg-[#1a1f2e] text-gray-500 cursor-not-allowed opacity-50'
                : 'bg-[#252b3d] hover:bg-[#2d3449] text-white'
            }`}
          >
            <span className="font-medium">Draw</span>
            <span className="font-bold">{bet.drawOdds.toFixed(2)}x</span>
          </button>
        )}

        <button
          onClick={() => !isFinished && handleBetClick(bet.awayTeam, bet.awayOdds)}
          disabled={isFinished || (hasExistingBet && existingBet?.team !== bet.awayTeam)}
          className={`w-full flex justify-between items-center p-3 rounded-lg transition-all ${
            isFinished
              ? 'bg-[#1a1f2e] text-gray-500 cursor-not-allowed'
              : existingBet?.team === bet.awayTeam
              ? 'bg-purple-600 text-white'
              : hasExistingBet && existingBet?.team !== bet.awayTeam
              ? 'bg-[#1a1f2e] text-gray-500 cursor-not-allowed opacity-50'
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

