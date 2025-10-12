import { useState, useEffect, useCallback } from 'react';
import { Bet } from '@/types/betting';

interface UseSportsDataOptions {
  category?: string;
  limit?: number;
  autoFetch?: boolean;
}

interface SportsDataResponse {
  success: boolean;
  count: number;
  category: string;
  data: Bet[];
  categories: Array<{
    id: string;
    name: string;
    icon: string;
  }>;
}

interface UseSportsDataReturn {
  bets: Bet[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  categories: Array<{
    id: string;
    name: string;
    icon: string;
  }>;
}

/**
 * Custom hook to fetch sports betting data from the API
 * 
 * @param options Configuration options
 * @param options.category Sport category to filter ('all', 'basketball', 'football', etc.)
 * @param options.limit Maximum number of games to fetch
 * @param options.autoFetch Whether to automatically fetch data on mount (default: true)
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { bets, loading, error, refetch } = useSportsData({ 
 *     category: 'basketball',
 *     limit: 10 
 *   });
 *   
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *   
 *   return (
 *     <div>
 *       {bets.map(bet => (
 *         <div key={bet.id}>{bet.homeTeam} vs {bet.awayTeam}</div>
 *       ))}
 *       <button onClick={refetch}>Refresh</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useSportsData(options: UseSportsDataOptions = {}): UseSportsDataReturn {
  const { 
    category = 'all', 
    limit = 50,
    autoFetch = true 
  } = options;

  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Array<{
    id: string;
    name: string;
    icon: string;
  }>>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        category,
        limit: limit.toString(),
      });

      const response = await fetch(`/api/sports?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SportsDataResponse = await response.json();

      if (data.success) {
        // Convert string dates back to Date objects
        const betsWithDates = data.data.map(bet => ({
          ...bet,
          startTime: new Date(bet.startTime),
        }));
        
        setBets(betsWithDates);
        if (data.categories) {
          setCategories(data.categories);
        }
      } else {
        throw new Error('Failed to fetch sports data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching sports data:', err);
    } finally {
      setLoading(false);
    }
  }, [category, limit]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  return {
    bets,
    loading,
    error,
    refetch: fetchData,
    categories,
  };
}

/**
 * Hook to fetch sports data with manual trigger
 * Useful when you want to control when the data is fetched
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { bets, loading, fetchBets } = useLazySportsData();
 *   
 *   return (
 *     <div>
 *       <button onClick={() => fetchBets({ category: 'basketball' })}>
 *         Load Basketball Games
 *       </button>
 *       {loading && <div>Loading...</div>}
 *       {bets.map(bet => (
 *         <div key={bet.id}>{bet.homeTeam} vs {bet.awayTeam}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useLazySportsData() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBets = useCallback(async (options: Omit<UseSportsDataOptions, 'autoFetch'> = {}) => {
    const { category = 'all', limit = 50 } = options;
    
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        category,
        limit: limit.toString(),
      });

      const response = await fetch(`/api/sports?${params.toString()}`);
      const data: SportsDataResponse = await response.json();

      if (data.success) {
        const betsWithDates = data.data.map(bet => ({
          ...bet,
          startTime: new Date(bet.startTime),
        }));
        
        setBets(betsWithDates);
      } else {
        throw new Error('Failed to fetch sports data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching sports data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    bets,
    loading,
    error,
    fetchBets,
  };
}

