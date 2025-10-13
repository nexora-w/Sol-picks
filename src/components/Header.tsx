'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useEffect, useState } from 'react';

interface HeaderProps {
  betType?: 'matches' | 'props';
  onBetTypeChange?: (type: 'matches' | 'props') => void;
}

export default function Header({ betType, onBetTypeChange }: HeaderProps) {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!publicKey) {
      setBalance(null);
      return;
    }

    connection.getBalance(publicKey).then((balance) => {
      setBalance(balance / LAMPORTS_PER_SOL);
    });
  }, [publicKey, connection]);

  return (
    <header className="bg-[#141821] border-b border-[#2a3142] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
              SolPicks
            </h1>
            
            {/* Bet Type Toggle */}
            {betType && onBetTypeChange && (
              <div className="flex gap-6 items-end">
                <button
                  onClick={() => onBetTypeChange('matches')}
                  className={`font-medium transition-colors ${
                    betType === 'matches'
                      ? 'text-white'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Match Bets
                </button>
                <button
                  onClick={() => onBetTypeChange('props')}
                  className={`font-medium transition-colors ${
                    betType === 'props'
                      ? 'text-white'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Player Props 🔥
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {publicKey && balance !== null && (
              <div className="bg-[#1a1f2e] px-4 py-2 rounded-lg border border-[#2a3142]">
                <div className="text-xs text-gray-400">Balance</div>
                <div className="text-white font-bold">{balance.toFixed(2)} SOL</div>
              </div>
            )}
            <WalletMultiButton />
          </div>
        </div>
      </div>
    </header>
  );
}

