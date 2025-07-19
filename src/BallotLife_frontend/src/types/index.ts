import { Principal } from '@dfinity/principal';

// Backend Types (matching our Motoko backend)
export interface Ballot {
  voter: Principal;
  candidate: string;
  timestamp: bigint;
}

export interface Poll {
  id: bigint;
  name: string;
  ballotingOpen: boolean;
  creator: Principal;
  ballots: Map<Principal, Ballot>;
  ballotCount: Map<string, bigint>;
  candidates: string[];
}

export interface PollDetail {
  id: bigint;
  name: string;
  ballotingOpen: boolean;
  creator: Principal;
  ballots: Ballot[];
  ballotCount: [string, bigint][];
  candidates: string[];
}

export interface PollSummary {
  id: bigint;
  name: string;
  ballotingOpen: boolean;
  creator: Principal;
}

// Frontend Types
export interface PollCardData {
  id: string;
  title: string;
  description?: string;
  status: 'open' | 'closed';
  creator: string;
  totalVotes: number;
  candidateCount: number;
  createdAt: Date;
  endDate?: Date;
}

export interface CandidateData {
  name: string;
  description?: string;
  voteCount: number;
  percentage: number;
}

export interface VotingResult {
  candidate: string;
  votes: number;
  percentage: number;
}

// Form Types
export interface CreatePollFormData {
  title: string;
  description: string;
  candidates: CandidateFormData[];
  duration?: number; // in hours
  isPublic: boolean;
}

export interface CandidateFormData {
  name: string;
  description?: string;
}

// Authentication Types
export interface AuthState {
  isAuthenticated: boolean;
  principal: Principal | null;
  identity: any;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

// Theme Types
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeState {
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
}

// Navigation Types
export interface NavigationItem {
  label: string;
  path: string;
  icon: React.ComponentType;
  requiresAuth?: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Filter and Search Types
export interface PollFilters {
  status: 'all' | 'open' | 'closed';
  creator: 'all' | 'me' | 'others';
  dateRange: 'all' | 'today' | 'week' | 'month';
  sortBy: 'recent' | 'popular' | 'ending';
}

export interface SearchState {
  query: string;
  filters: PollFilters;
  results: PollSummary[];
  isLoading: boolean;
  hasMore: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    handler: () => void;
  };
}

// Chart Types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  animation: {
    duration: number;
    easing: string;
  };
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface PollCardProps extends BaseComponentProps {
  poll: PollSummary;
  onClick?: (poll: PollSummary) => void;
  showActions?: boolean;
}

export interface VotingInterfaceProps extends BaseComponentProps {
  poll: PollDetail;
  onVote: (candidate: string) => Promise<void>;
  disabled?: boolean;
}

// Form Validation Types
export interface FormErrors {
  [key: string]: string | undefined;
}

export interface FormState<T> {
  values: T;
  errors: FormErrors;
  touched: { [K in keyof T]?: boolean };
  isValid: boolean;
  isSubmitting: boolean;
}

// Local Storage Types
export interface LocalStorageData {
  theme: ThemeMode;
  lastVisited: string;
  draftPolls: CreatePollFormData[];
  notifications: Notification[];
}

// Backend Actor Type (for our Motoko canister)
export interface BallotLifeActor {
  createPoll: (name: string) => Promise<bigint>;
  getPolls: () => Promise<PollSummary[]>;
  getPollDetail: (pollId: bigint) => Promise<PollDetail>;
  addCandidate: (pollId: bigint, candidate: string) => Promise<string>;
  castBallot: (pollId: bigint, candidate: string) => Promise<string>;
  closeBalloting: (pollId: bigint) => Promise<string>;
  reopenBalloting: (pollId: bigint) => Promise<string>;
}

// React Query Types
export interface QueryConfig {
  staleTime: number;
  cacheTime: number;
  refetchOnWindowFocus: boolean;
  retry: number;
}

// Export commonly used type unions
export type PollStatus = 'open' | 'closed';
export type NotificationType = 'success' | 'error' | 'warning' | 'info';
export type SortOption = 'recent' | 'popular' | 'ending' | 'alphabetical';