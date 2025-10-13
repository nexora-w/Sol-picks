'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PlayerProp } from '@/types/betting';

interface PropData {
  isPlayerProp: boolean;
  playerName: string;
  statType: string;
  line: number;
  selection: string;
}

interface PlayerPropCardProps {
  prop: PlayerProp;
  onPlaceBet: (betId: string, selection: string, odds: number, propData?: PropData) => void;
}

export default function PlayerPropCard({ prop, onPlaceBet }: PlayerPropCardProps) {
  const [selectedOption, setSelectedOption] = useState<'over' | 'under' | null>(null);

  const handleBetClick = (selection: 'over' | 'under', odds: number) => {
    setSelectedOption(selection);
    onPlaceBet(
      prop.id, 
      `${prop.playerName} ${selection.toUpperCase()} ${prop.line} ${formatStatType(prop.statType)}`,
      odds,
      {
        isPlayerProp: true,
        playerName: prop.playerName,
        statType: prop.statType,
        line: prop.line,
        selection: selection,
      }
    );
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

  const formatStatType = (statType: string) => {
    const formats: Record<string, string> = {
      points: 'PTS',
      rebounds: 'REB',
      assists: 'AST',
      three_pointers: '3PM',
      yards: 'YDS',
      touchdowns: 'TD',
      receptions: 'REC',
      strikeouts: 'K',
      hits: 'H',
      home_runs: 'HR',
      goals: 'G',
      shots: 'SOG',
      saves: 'SV',
    };
    return formats[statType] || statType.toUpperCase();
  };

  const getStatusBadge = () => {
    switch (prop.status) {
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

  const isFinished = prop.status === 'finished';

  return (
    <div className="bg-[#1a1f2e] rounded-lg p-4 hover:bg-[#212838] transition-colors border border-[#2a3142]">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="text-xs text-gray-400 mb-1">
            {prop.league} • {prop.sport}
          </div>
          <div className="text-sm text-gray-500 mb-1">
            {prop.homeTeam} vs {prop.awayTeam}
          </div>
          <div className="text-sm text-gray-500">
            {prop.status === 'upcoming' && `Starts in ${formatTime(prop.startTime)}`}
            {prop.status === 'live' && (
              <span className="text-yellow-400 font-semibold">{prop.matchTime}</span>
            )}
            {prop.status === 'finished' && (
              <span className="text-gray-500">Final</span>
            )}
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Player Info */}
      <div className="mb-3 pb-3 border-b border-[#2a3142]">
        <div className="flex items-center gap-3">
          {prop.playerImage ? (
            <div className="relative w-16 h-16 rounded-full ring-2 ring-purple-500/50 shadow-lg overflow-hidden">
              <Image 
                src={prop.playerImage} 
                alt={prop.playerName}
                width={64}
                height={64}
                className="object-cover"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  const target = e.currentTarget;
                  target.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              {prop.playerName.split(' ').map(n => n[0]).join('')}
            </div>
          )}
          <div className="flex-1">
            <div className="font-bold text-white text-lg">{prop.playerName}</div>
            <div className="text-sm text-gray-400">
              {prop.playerTeam} {prop.playerPosition && `• ${prop.playerPosition}`}
            </div>
          </div>
        </div>
      </div>

      {/* Prop Line */}
      <div className="text-center mb-3">
        <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
          {formatStatType(prop.statType)}
        </div>
        <div className="text-3xl font-bold text-white">
          {prop.line}
          {prop.status === 'live' && prop.currentValue !== undefined && (
            <span className="text-sm text-yellow-400 ml-2">
              (Current: {prop.currentValue})
            </span>
          )}
        </div>
      </div>

      {/* Over/Under Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => !isFinished && handleBetClick('over', prop.overOdds)}
          disabled={isFinished}
          className={`p-4 rounded-lg transition-all ${
            isFinished
              ? 'bg-[#1a1f2e] text-gray-500 cursor-not-allowed'
              : selectedOption === 'over'
              ? 'bg-green-600 text-white'
              : 'bg-[#252b3d] hover:bg-green-600/20 text-white border-2 border-green-600/50 hover:border-green-600'
          }`}
        >
          <div className="text-xs text-gray-300 mb-1 uppercase font-semibold">Over</div>
          <div className="text-2xl font-bold">{prop.overOdds.toFixed(2)}x</div>
        </button>

        <button
          onClick={() => !isFinished && handleBetClick('under', prop.underOdds)}
          disabled={isFinished}
          className={`p-4 rounded-lg transition-all ${
            isFinished
              ? 'bg-[#1a1f2e] text-gray-500 cursor-not-allowed'
              : selectedOption === 'under'
              ? 'bg-red-600 text-white'
              : 'bg-[#252b3d] hover:bg-red-600/20 text-white border-2 border-red-600/50 hover:border-red-600'
          }`}
        >
          <div className="text-xs text-gray-300 mb-1 uppercase font-semibold">Under</div>
          <div className="text-2xl font-bold">{prop.underOdds.toFixed(2)}x</div>
        </button>
      </div>
    </div>
  );
}

