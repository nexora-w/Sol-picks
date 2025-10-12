'use client';

import { UserStats as UserStatsType } from '@/types/betting';

interface UserStatsProps {
  stats: UserStatsType;
}

export default function UserStats({ stats }: UserStatsProps) {
  const winRate = stats.totalBets > 0 ? (stats.wonBets / stats.totalBets) * 100 : 0;
  const profit = stats.totalWinnings - stats.totalWagered;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-[#1a1f2e] rounded-lg p-4 border border-[#2a3142]">
        <div className="text-gray-400 text-sm mb-1">Total Bets</div>
        <div className="text-white text-2xl font-bold">{stats.totalBets}</div>
      </div>

      <div className="bg-[#1a1f2e] rounded-lg p-4 border border-[#2a3142]">
        <div className="text-gray-400 text-sm mb-1">Win Rate</div>
        <div className="text-white text-2xl font-bold">{winRate.toFixed(1)}%</div>
      </div>

      <div className="bg-[#1a1f2e] rounded-lg p-4 border border-[#2a3142]">
        <div className="text-gray-400 text-sm mb-1">Total Wagered</div>
        <div className="text-white text-2xl font-bold">{stats.totalWagered.toFixed(2)} SOL</div>
      </div>

      <div className="bg-[#1a1f2e] rounded-lg p-4 border border-[#2a3142]">
        <div className="text-gray-400 text-sm mb-1">Profit/Loss</div>
        <div className={`text-2xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {profit >= 0 ? '+' : ''}{profit.toFixed(2)} SOL
        </div>
      </div>
    </div>
  );
}

