'use client';

import { PlacedBet } from '@/types/betting';

interface BettingHistoryProps {
  bets: PlacedBet[];
}

export default function BettingHistory({ bets }: BettingHistoryProps) {
  if (bets.length === 0) {
    return (
      <div className="bg-[#1a1f2e] rounded-lg p-6 border border-[#2a3142]">
        <h3 className="text-lg font-bold text-white mb-4">Recent Bets</h3>
        <div className="text-center py-8 text-gray-400 text-sm">
          No bets placed yet
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1f2e] rounded-lg p-6 border border-[#2a3142]">
      <h3 className="text-lg font-bold text-white mb-4">Recent Bets</h3>
      <div className="space-y-3">
        {bets.map((bet) => (
          <div
            key={bet.id}
            className="bg-[#252b3d] rounded-lg p-4 hover:bg-[#2d3449] transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-white font-medium">{bet.team}</div>
                <div className="text-gray-400 text-sm">
                  {bet.amount} SOL @ {bet.odds.toFixed(2)}x
                </div>
              </div>
              <div
                className={`px-2 py-1 rounded text-xs font-medium ${
                  bet.status === 'won'
                    ? 'bg-green-600/20 text-green-400'
                    : bet.status === 'lost'
                    ? 'bg-red-600/20 text-red-400'
                    : 'bg-yellow-600/20 text-yellow-400'
                }`}
              >
                {bet.status.toUpperCase()}
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Potential Win</span>
              <span className="text-purple-400 font-bold">
                {bet.potentialWin.toFixed(2)} SOL
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

