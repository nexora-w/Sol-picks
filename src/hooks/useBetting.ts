'use client';

import { useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { 
  PublicKey, 
  Transaction, 
  SystemProgram,
  LAMPORTS_PER_SOL 
} from '@solana/web3.js';
import { PlacedBet } from '@/types/betting';

export const useBetting = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [placedBets, setPlacedBets] = useState<PlacedBet[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const placeBet = useCallback(
    async (betId: string, team: string, amount: number, odds: number) => {
      if (!publicKey) {
        throw new Error('Wallet not connected');
      }

      setIsProcessing(true);
      try {
        // In a real application, this would be your betting program's public key
        const bettingProgramId = new PublicKey('72LkN61zUCxft7UVYu2Ae8qioidn5mpXRCGBkSSFnxF5');
        
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: bettingProgramId,
            lamports: amount * LAMPORTS_PER_SOL,
          })
        );

        const signature = await sendTransaction(transaction, connection);
        await connection.confirmTransaction(signature, 'confirmed');

        const newBet: PlacedBet = {
          id: signature,
          betId,
          team,
          amount,
          odds,
          potentialWin: amount * odds,
          timestamp: new Date(),
          status: 'pending',
        };

        setPlacedBets((prev) => [newBet, ...prev]);
        return signature;
      } catch (error) {
        console.error('Error placing bet:', error);
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [publicKey, connection, sendTransaction]
  );

  return {
    placeBet,
    placedBets,
    isProcessing,
  };
};

