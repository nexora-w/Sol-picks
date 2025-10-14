'use client';

import { useState, useEffect, useRef } from 'react';
import { useBetting } from '@/hooks/useBetting';
import { useWallet } from '@solana/wallet-adapter-react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Bet, PlayerProp } from '@/types/betting';

interface BetSelection {
  betId: string;
  team: string;
  odds: number;
}

interface BetSlipProps {
  selections: BetSelection[];
  onRemoveBet: (betId: string, team: string) => void;
  onClearAll: () => void;
  bets?: Bet[];
  playerProps?: PlayerProp[];
}

export default function BetSlip({ selections, onRemoveBet, onClearAll, bets = [], playerProps = [] }: BetSlipProps) {
  const [amount, setAmount] = useState('');
  const [updatedOdds, setUpdatedOdds] = useState<Map<string, 'increase' | 'decrease'>>(new Map());
  const { placeBets, isProcessing } = useBetting();
  const { publicKey } = useWallet();
  const previousSelections = useRef<BetSelection[]>([]);

  // Track odds changes and show visual feedback
  useEffect(() => {
    if (previousSelections.current.length > 0 && selections.length > 0) {
      const newUpdatedOdds = new Map<string, 'increase' | 'decrease'>();
      
      selections.forEach(selection => {
        const previousSelection = previousSelections.current.find(
          prev => prev.betId === selection.betId && prev.team === selection.team
        );
        
        if (previousSelection && previousSelection.odds !== selection.odds) {
          const selectionKey = `${selection.betId}-${selection.team}`;
          const direction = selection.odds > previousSelection.odds ? 'increase' : 'decrease';
          newUpdatedOdds.set(selectionKey, direction);
        }
      });
      
      if (newUpdatedOdds.size > 0) {
        setUpdatedOdds(newUpdatedOdds);
        
        // Clear the highlight after 3 seconds
        setTimeout(() => {
          setUpdatedOdds(new Map());
        }, 3000);
      }
    }
    
    previousSelections.current = selections;
  }, [selections]);

  const handlePlaceAllBets = async () => {
    if (!publicKey || selections.length === 0 || !amount || parseFloat(amount) <= 0) return;

    // Prepare bets with the same amount for all
    const betsToPlace = selections.map(selection => ({
      betId: selection.betId,
      team: selection.team,
      amount: parseFloat(amount),
      odds: selection.odds,
    }));

    try {
      await placeBets(betsToPlace);
      setAmount('');
      onClearAll();
      alert(`${betsToPlace.length} bet(s) placed successfully!`);
    } catch {
      alert('Failed to place bets. Please try again.');
    }
  };

  const getTotalAmount = () => {
    const amountNum = parseFloat(amount || '0');
    return amountNum * selections.length;
  };

  const getTotalPotentialWin = () => {
    const amountNum = parseFloat(amount || '0');
    return selections.reduce((sum, selection) => {
      return sum + (amountNum * selection.odds);
    }, 0);
  };

  const getMatchInfo = (selection: BetSelection) => {
    // Check if it's a match bet
    const match = bets.find(bet => bet.id === selection.betId);
    if (match) {
      return {
        type: 'match',
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        league: match.league,
        sport: match.sport
      };
    }

    // Check if it's a player prop
    const prop = playerProps.find(prop => prop.id === selection.betId);
    if (prop) {
      return {
        type: 'prop',
        homeTeam: prop.homeTeam,
        awayTeam: prop.awayTeam,
        league: prop.league,
        sport: prop.sport,
        playerName: prop.playerName
      };
    }

    return null;
  };

  if (selections.length === 0) {
    return (
      <div className="bg-[#1a1f2e] rounded-lg p-6 border border-[#2a3142]">
        <h3 className="text-lg font-bold text-white mb-4">Bet Slip</h3>
        <div className="text-center py-8">
          <div className="text-gray-400 text-sm">
            Select bets to get started
          </div>
          <div className="text-gray-500 text-xs mt-2">
            You can add multiple bets
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1f2e] rounded-lg p-6 border border-[#2a3142]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">
          Bet Slip ({selections.length})
        </h3>
        <button
          onClick={onClearAll}
          className="text-gray-400 hover:text-white text-sm"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
        {selections.map((selection) => {
          const amountNum = parseFloat(amount || '0');
          const potentialWin = amountNum * selection.odds;
          const selectionKey = `${selection.betId}-${selection.team}`;
          const oddsChange = updatedOdds.get(selectionKey);
          const isOddsUpdated = oddsChange !== undefined;
          const matchInfo = getMatchInfo(selection);

          return (
            <div 
              key={selectionKey} 
              className="p-3 bg-[#252b3d] rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {matchInfo && (
                    <div className="text-xs text-gray-400 mb-1">
                      {matchInfo.league} • {matchInfo.sport}
                    </div>
                  )}
                  {matchInfo && (
                    <div className="text-xs text-gray-500 mb-2">
                      {matchInfo.homeTeam} vs {matchInfo.awayTeam}
                      {matchInfo.type === 'prop' && matchInfo.playerName && (
                        <span className="ml-2 text-purple-400">• {matchInfo.playerName}</span>
                      )}
                    </div>
                  )}
                  <div className="text-white font-medium text-sm">{selection.team}</div>
                  <div className="flex items-center gap-2">
                    <div className="text-purple-400 font-bold text-sm flex items-center justify-center">
                      {selection.odds.toFixed(2)}x
                      {isOddsUpdated && (
                        <span className="ml-1 text-xs animate-pulse">
                          {oddsChange === 'increase' ? (
                            <FaArrowUp className="text-green-400" />
                          ) : (
                            <FaArrowDown className="text-red-400" />
                          )}
                        </span>
                      )}
                    </div>
                    {amount && parseFloat(amount) > 0 && (
                      <div className="text-xs text-gray-400">
                        → <span className="text-green-400 font-semibold">{potentialWin.toFixed(2)} SOL</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onRemoveBet(selection.betId, selection.team)}
                  className="text-gray-400 hover:text-red-400 text-xs ml-2"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bet Amount Input */}
      <div className="mb-4">
        <label className="block text-gray-400 text-sm mb-2">Bet Amount per Game (SOL)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full bg-[#252b3d] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          step="0.01"
          min="0"
        />
        <div className="flex gap-2 mt-2">
          {[0.1, 0.5, 1, 5].map((value) => (
            <button
              key={value}
              onClick={() => setAmount(value.toString())}
              className="flex-1 bg-[#252b3d] hover:bg-[#2d3449] text-white px-3 py-2 rounded text-sm transition-colors"
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mb-4 p-4 bg-[#252b3d] rounded-lg border border-purple-600/20">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-gray-400">{parseFloat(amount || '0').toFixed(2)} SOL × {selections.length} {selections.length === 1 ? 'bet' : 'bets'}</span>
        </div>
        <div className="flex justify-between text-sm mb-3">
          <span className="text-gray-400">Total Stake</span>
          <span className="text-white font-bold">{getTotalAmount().toFixed(2)} SOL</span>
        </div>
        <div className="h-px bg-purple-600/20 mb-3"></div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Total Potential Win</span>
          <span className="text-white font-bold">{getTotalPotentialWin().toFixed(2)} SOL</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Total Profit</span>
          <span className="text-green-400 font-bold">
            +{(getTotalPotentialWin() - getTotalAmount()).toFixed(2)} SOL
          </span>
        </div>
      </div>

      {/* Place Bet Button */}
      <button
        onClick={handlePlaceAllBets}
        disabled={!amount || parseFloat(amount) <= 0 || !publicKey || isProcessing}
        className={`w-full py-3 rounded-lg font-bold transition-colors ${
          !amount || parseFloat(amount) <= 0 || !publicKey || isProcessing
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        }`}
      >
        {isProcessing ? 'Processing...' : publicKey ? 'Place Bet' : 'Connect Wallet'}
      </button>
    </div>
  );
}

