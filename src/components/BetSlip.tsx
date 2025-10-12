'use client';

import { useState } from 'react';
import { useBetting } from '@/hooks/useBetting';
import { useWallet } from '@solana/wallet-adapter-react';

interface BetSelection {
  betId: string;
  team: string;
  odds: number;
}

interface BetSlipProps {
  selection: BetSelection | null;
  onClear: () => void;
}

export default function BetSlip({ selection, onClear }: BetSlipProps) {
  const [amount, setAmount] = useState('');
  const { placeBet, isProcessing } = useBetting();
  const { publicKey } = useWallet();

  const handlePlaceBet = async () => {
    if (!selection || !amount || !publicKey) return;

    try {
      await placeBet(selection.betId, selection.team, parseFloat(amount), selection.odds);
      setAmount('');
      onClear();
      alert('Bet placed successfully!');
    } catch {
      alert('Failed to place bet. Please try again.');
    }
  };

  const potentialWin = selection && amount ? parseFloat(amount) * selection.odds : 0;

  if (!selection) {
    return (
      <div className="bg-[#1a1f2e] rounded-lg p-6 border border-[#2a3142]">
        <h3 className="text-lg font-bold text-white mb-4">Bet Slip</h3>
        <div className="text-center py-8">
          <div className="text-gray-400 text-sm">
            Select a bet to get started
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1f2e] rounded-lg p-6 border border-[#2a3142]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">Bet Slip</h3>
        <button
          onClick={onClear}
          className="text-gray-400 hover:text-white text-sm"
        >
          Clear
        </button>
      </div>

      <div className="mb-4 p-4 bg-[#252b3d] rounded-lg">
        <div className="text-white font-medium mb-1">{selection.team}</div>
        <div className="text-purple-400 font-bold text-lg">{selection.odds.toFixed(2)}x</div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-400 text-sm mb-2">Bet Amount (SOL)</label>
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

      <div className="mb-4 p-4 bg-[#252b3d] rounded-lg">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Potential Win</span>
          <span className="text-white font-bold">{potentialWin.toFixed(2)} SOL</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Profit</span>
          <span className="text-green-400 font-bold">
            +{(potentialWin - parseFloat(amount || '0')).toFixed(2)} SOL
          </span>
        </div>
      </div>

      <button
        onClick={handlePlaceBet}
        disabled={!amount || !publicKey || isProcessing}
        className={`w-full py-3 rounded-lg font-bold transition-colors ${
          !amount || !publicKey || isProcessing
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        }`}
      >
        {isProcessing ? 'Processing...' : publicKey ? 'Place Bet' : 'Connect Wallet'}
      </button>
    </div>
  );
}

