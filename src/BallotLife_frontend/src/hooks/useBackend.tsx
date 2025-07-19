import React, { createContext, useContext } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BallotLife_backend } from '../../../declarations/BallotLife_backend';
import { QUERY_KEYS, QUERY_CONFIG } from '../constants';
import type { PollSummary, PollDetail, CreatePollFormData } from '../types';
import { getErrorMessage } from '../utils';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_CONFIG.STALE_TIME,
      gcTime: QUERY_CONFIG.CACHE_TIME,
      refetchOnWindowFocus: QUERY_CONFIG.REFETCH_ON_WINDOW_FOCUS,
      retry: QUERY_CONFIG.RETRY,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

// Backend API functions
const backendApi = {
  // Poll operations
  async getPolls(): Promise<PollSummary[]> {
    try {
      return await BallotLife_backend.getPolls();
    } catch (error) {
      throw new Error(`Failed to fetch polls: ${getErrorMessage(error)}`);
    }
  },

  async getPollDetail(pollId: string): Promise<PollDetail> {
    try {
      const id = BigInt(pollId);
      return await BallotLife_backend.getPollDetail(id);
    } catch (error) {
      throw new Error(`Failed to fetch poll details: ${getErrorMessage(error)}`);
    }
  },

  async createPoll(pollData: CreatePollFormData): Promise<bigint> {
    try {
      return await BallotLife_backend.createPoll(pollData.title);
    } catch (error) {
      throw new Error(`Failed to create poll: ${getErrorMessage(error)}`);
    }
  },

  async addCandidate(pollId: string, candidateName: string): Promise<string> {
    try {
      const id = BigInt(pollId);
      return await BallotLife_backend.addCandidate(id, candidateName);
    } catch (error) {
      throw new Error(`Failed to add candidate: ${getErrorMessage(error)}`);
    }
  },

  async castBallot(pollId: string, candidate: string): Promise<string> {
    try {
      const id = BigInt(pollId);
      return await BallotLife_backend.castBallot(id, candidate);
    } catch (error) {
      throw new Error(`Failed to cast ballot: ${getErrorMessage(error)}`);
    }
  },

  async closeBalloting(pollId: string): Promise<string> {
    try {
      const id = BigInt(pollId);
      return await BallotLife_backend.closeBalloting(id);
    } catch (error) {
      throw new Error(`Failed to close balloting: ${getErrorMessage(error)}`);
    }
  },

  async reopenBalloting(pollId: string): Promise<string> {
    try {
      const id = BigInt(pollId);
      return await BallotLife_backend.reopenBalloting(id);
    } catch (error) {
      throw new Error(`Failed to reopen balloting: ${getErrorMessage(error)}`);
    }
  },
};

// Custom hooks for backend operations
export const usePolls = () => {
  return useQuery({
    queryKey: QUERY_KEYS.POLLS,
    queryFn: backendApi.getPolls,
    select: (data) => data || [],
  });
};

export const usePollDetail = (pollId: string | undefined) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.POLL_DETAIL, pollId],
    queryFn: () => backendApi.getPollDetail(pollId!),
    enabled: !!pollId,
  });
};

export const useCreatePoll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: backendApi.createPoll,
    onSuccess: () => {
      // Invalidate polls list to refetch updated data
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POLLS });
    },
  });
};

export const useAddCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pollId, candidateName }: { pollId: string; candidateName: string }) =>
      backendApi.addCandidate(pollId, candidateName),
    onSuccess: (_, variables) => {
      // Invalidate specific poll detail to refetch updated data
      queryClient.invalidateQueries({ 
        queryKey: [...QUERY_KEYS.POLL_DETAIL, variables.pollId] 
      });
    },
  });
};

export const useCastBallot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pollId, candidate }: { pollId: string; candidate: string }) =>
      backendApi.castBallot(pollId, candidate),
    onSuccess: (_, variables) => {
      // Invalidate poll detail and polls list
      queryClient.invalidateQueries({ 
        queryKey: [...QUERY_KEYS.POLL_DETAIL, variables.pollId] 
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POLLS });
    },
  });
};

export const useCloseBalloting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pollId: string) => backendApi.closeBalloting(pollId),
    onSuccess: (_, pollId) => {
      // Invalidate poll detail and polls list
      queryClient.invalidateQueries({ 
        queryKey: [...QUERY_KEYS.POLL_DETAIL, pollId] 
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POLLS });
    },
  });
};

export const useReopenBalloting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pollId: string) => backendApi.reopenBalloting(pollId),
    onSuccess: (_, pollId) => {
      // Invalidate poll detail and polls list
      queryClient.invalidateQueries({ 
        queryKey: [...QUERY_KEYS.POLL_DETAIL, pollId] 
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POLLS });
    },
  });
};

// Custom hook for filtering polls by user
export const useUserPolls = (userPrincipal: string | null) => {
  const { data: allPolls, ...queryResult } = usePolls();

  const userPolls = React.useMemo(() => {
    if (!allPolls || !userPrincipal) return [];
    return allPolls.filter(poll => poll.creator.toString() === userPrincipal);
  }, [allPolls, userPrincipal]);

  return {
    ...queryResult,
    data: userPolls,
  };
};

// Custom hook for poll statistics
export const usePollStats = () => {
  const { data: polls } = usePolls();

  const stats = React.useMemo(() => {
    if (!polls) {
      return {
        totalPolls: 0,
        activePolls: 0,
        closedPolls: 0,
      };
    }

    return {
      totalPolls: polls.length,
      activePolls: polls.filter(poll => poll.ballotingOpen).length,
      closedPolls: polls.filter(poll => !poll.ballotingOpen).length,
    };
  }, [polls]);

  return stats;
};

// Custom hook for search and filtering
export const useFilteredPolls = (filters: {
  search?: string;
  status?: 'all' | 'open' | 'closed';
  sortBy?: 'recent' | 'popular' | 'alphabetical';
}) => {
  const { data: allPolls, ...queryResult } = usePolls();

  const filteredPolls = React.useMemo(() => {
    if (!allPolls) return [];

    let filtered = [...allPolls];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(poll =>
        poll.name.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(poll => {
        if (filters.status === 'open') return poll.ballotingOpen;
        if (filters.status === 'closed') return !poll.ballotingOpen;
        return true;
      });
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'alphabetical':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'recent':
          filtered.sort((a, b) => Number(b.id) - Number(a.id));
          break;
        case 'popular':
          // Note: We don't have vote count in summary, so we'll sort by ID for now
          filtered.sort((a, b) => Number(b.id) - Number(a.id));
          break;
      }
    }

    return filtered;
  }, [allPolls, filters]);

  return {
    ...queryResult,
    data: filteredPolls,
  };
};

// Backend Provider Component
interface BackendProviderProps {
  children: React.ReactNode;
}

const BackendContext = createContext<{
  queryClient: QueryClient;
} | null>(null);

export const BackendProvider: React.FC<BackendProviderProps> = ({ children }) => {
  return (
    <BackendContext.Provider value={{ queryClient }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BackendContext.Provider>
  );
};

export const useBackendContext = () => {
  const context = useContext(BackendContext);
  if (!context) {
    throw new Error('useBackendContext must be used within a BackendProvider');
  }
  return context;
};

// Utility function to invalidate all queries
export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => queryClient.invalidateQueries(),
    invalidatePolls: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POLLS }),
    invalidatePoll: (pollId: string) => 
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.POLL_DETAIL, pollId] }),
  };
};

// Export the query client for direct use if needed
export { queryClient };