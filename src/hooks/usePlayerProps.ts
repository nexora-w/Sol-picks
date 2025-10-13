import { useState, useEffect, useCallback } from 'react';
import { PlayerProp } from '@/types/betting';

interface UsePlayerPropsOptions {
  category?: string;
  limit?: number;
  autoFetch?: boolean;
  refreshInterval?: number; // in milliseconds
}

interface PlayerPropsDataResponse {
  success: boolean;
  count: number;
  category: string;
  data: PlayerProp[];
}

interface UsePlayerPropsReturn {
  props: PlayerProp[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch player props data from the API
 * 
 * @param options Configuration options
 * @param options.category Sport category to filter ('all', 'basketball', 'football', etc.)
 * @param options.limit Maximum number of props to fetch
 * @param options.autoFetch Whether to automatically fetch data on mount (default: true)
 * @param options.refreshInterval Auto-refresh interval in milliseconds (optional)
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { props, loading, error, refetch } = usePlayerProps({ 
 *     category: 'basketball',
 *     limit: 20,
 *     refreshInterval: 5000 // Auto-refresh every 5 seconds
 *   });
 *   
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *   
 *   return (
 *     <div>
 *       {props.map(prop => (
 *         <div key={prop.id}>{prop.playerName} - {prop.statType}</div>
 *       ))}
 *       <button onClick={refetch}>Refresh</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function usePlayerProps(options: UsePlayerPropsOptions = {}): UsePlayerPropsReturn {
  const { 
    category = 'all', 
    limit = 50,
    autoFetch = true,
    refreshInterval 
  } = options;

  const [props, setProps] = useState<PlayerProp[]>([]);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (showLoading = true) => {
    // Only show loading spinner on initial load or manual refetch
    if (showLoading) {
      setLoading(true);
    }
    setError(null);

    try {
      const params = new URLSearchParams({
        category,
        limit: limit.toString(),
      });

      const response = await fetch(`/api/player-props?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PlayerPropsDataResponse = await response.json();

      if (data.success) {
        // Convert string dates back to Date objects
        const propsWithDates = data.data.map(prop => ({
          ...prop,
          startTime: new Date(prop.startTime),
        }));
        
        setProps(propsWithDates);
      } else {
        throw new Error('Failed to fetch player props data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching player props data:', err);
    } finally {
      setLoading(false);
    }
  }, [category, limit]);

  useEffect(() => {
    if (autoFetch) {
      fetchData(true); // Show loading on initial fetch
    }
  }, [fetchData, autoFetch]);

  // Auto-refresh effect
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const intervalId = setInterval(() => {
        fetchData(false); // Don't show loading on background refresh
      }, refreshInterval);

      return () => clearInterval(intervalId);
    }
  }, [refreshInterval, fetchData]);

  // Manual refetch function that shows loading
  const refetch = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  return {
    props,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to fetch player props with manual trigger
 * Useful when you want to control when the data is fetched
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { props, loading, fetchProps } = useLazyPlayerProps();
 *   
 *   return (
 *     <div>
 *       <button onClick={() => fetchProps({ category: 'basketball' })}>
 *         Load Basketball Props
 *       </button>
 *       {loading && <div>Loading...</div>}
 *       {props.map(prop => (
 *         <div key={prop.id}>{prop.playerName} - {prop.statType}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useLazyPlayerProps() {
  const [props, setProps] = useState<PlayerProp[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProps = useCallback(async (options: Omit<UsePlayerPropsOptions, 'autoFetch'> = {}) => {
    const { category = 'all', limit = 50 } = options;
    
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        category,
        limit: limit.toString(),
      });

      const response = await fetch(`/api/player-props?${params.toString()}`);
      const data: PlayerPropsDataResponse = await response.json();

      if (data.success) {
        const propsWithDates = data.data.map(prop => ({
          ...prop,
          startTime: new Date(prop.startTime),
        }));
        
        setProps(propsWithDates);
      } else {
        throw new Error('Failed to fetch player props data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching player props data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    props,
    loading,
    error,
    fetchProps,
  };
}

