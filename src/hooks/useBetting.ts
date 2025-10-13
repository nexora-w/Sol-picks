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

  const placeBets = useCallback(
    async (bets: Array<{ betId: string; team: string; amount: number; odds: number }>) => {
      if (!publicKey) {
        throw new Error('Wallet not connected');
      }

      if (bets.length === 0) {
        throw new Error('No bets to place');
      }

      setIsProcessing(true);
      try {
        // In a real application, this would be your betting program's public key
        const bettingProgramId = new PublicKey('72LkN61zUCxft7UVYu2Ae8qioidn5mpXRCGBkSSFnxF5');
        
        // Calculate total amount
        const totalAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
        
        // Create a single transaction with the total amount
        // In a real betting app, you would include the bet details in the transaction data
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: bettingProgramId,
            lamports: totalAmount * LAMPORTS_PER_SOL,
          })
        );

        const signature = await sendTransaction(transaction, connection);
        await connection.confirmTransaction(signature, 'confirmed');

        // Create placed bet records for each bet
        const newBets: PlacedBet[] = bets.map((bet, index) => ({
          id: `${signature}-${index}`,
          betId: bet.betId,
          team: bet.team,
          amount: bet.amount,
          odds: bet.odds,
          potentialWin: bet.amount * bet.odds,
          timestamp: new Date(),
          status: 'pending',
        }));

        setPlacedBets((prev) => [...newBets, ...prev]);
        return signature;
      } catch (error) {
        console.error('Error placing bets:', error);
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [publicKey, connection, sendTransaction]
  );

  return {
    placeBet,
    placeBets,
    placedBets,
    isProcessing,
  };
};

