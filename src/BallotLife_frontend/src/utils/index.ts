import { format, formatDistanceToNow, isValid } from 'date-fns';
import { Principal } from '@dfinity/principal';
import { STORAGE_KEYS, VALIDATION, REGEX } from '../constants';
import type { 
  PollSummary, 
  PollDetail, 
  VotingResult, 
  ChartDataPoint,
  ThemeMode,
  LocalStorageData 
} from '../types';

// Date and Time Utilities
export const formatDate = (date: Date | number | string): string => {
  const dateObj = new Date(date);
  if (!isValid(dateObj)) return 'Invalid date';
  return format(dateObj, 'MMM dd, yyyy');
};

export const formatDateTime = (date: Date | number | string): string => {
  const dateObj = new Date(date);
  if (!isValid(dateObj)) return 'Invalid date';
  return format(dateObj, 'MMM dd, yyyy HH:mm');
};

export const formatTimeAgo = (date: Date | number | string): string => {
  const dateObj = new Date(date);
  if (!isValid(dateObj)) return 'Invalid date';
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

export const formatDuration = (hours: number): string => {
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  if (remainingHours === 0) {
    return `${days} day${days !== 1 ? 's' : ''}`;
  }
  
  return `${days} day${days !== 1 ? 's' : ''}, ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
};

// Principal Utilities
export const formatPrincipal = (principal: Principal | string): string => {
  const principalStr = typeof principal === 'string' ? principal : principal.toString();
  if (principalStr.length <= 12) return principalStr;
  return `${principalStr.slice(0, 6)}...${principalStr.slice(-6)}`;
};

export const validatePrincipal = (principal: string): boolean => {
  try {
    Principal.fromText(principal);
    return true;
  } catch {
    return false;
  }
};

// Number Formatting
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%';
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(1)}%`;
};

// Validation Utilities
export const validatePollTitle = (title: string): string | null => {
  if (!title.trim()) {
    return 'Title is required';
  }
  if (title.length < VALIDATION.POLL_TITLE.MIN_LENGTH) {
    return `Title must be at least ${VALIDATION.POLL_TITLE.MIN_LENGTH} characters`;
  }
  if (title.length > VALIDATION.POLL_TITLE.MAX_LENGTH) {
    return `Title must be no more than ${VALIDATION.POLL_TITLE.MAX_LENGTH} characters`;
  }
  if (!REGEX.POLL_TITLE.test(title)) {
    return 'Title contains invalid characters';
  }
  return null;
};

export const validateCandidateName = (name: string): string | null => {
  if (!name.trim()) {
    return 'Candidate name is required';
  }
  if (name.length < VALIDATION.CANDIDATE_NAME.MIN_LENGTH) {
    return `Name must be at least ${VALIDATION.CANDIDATE_NAME.MIN_LENGTH} character`;
  }
  if (name.length > VALIDATION.CANDIDATE_NAME.MAX_LENGTH) {
    return `Name must be no more than ${VALIDATION.CANDIDATE_NAME.MAX_LENGTH} characters`;
  }
  if (!REGEX.CANDIDATE_NAME.test(name)) {
    return 'Name contains invalid characters';
  }
  return null;
};

export const validateDescription = (description: string, maxLength: number): string | null => {
  if (description.length > maxLength) {
    return `Description must be no more than ${maxLength} characters`;
  }
  return null;
};

// Data Transformation Utilities
export const calculateVotingResults = (poll: PollDetail): VotingResult[] => {
  const totalVotes = poll.ballotCount.reduce((sum, [, count]) => sum + Number(count), 0);
  
  return poll.ballotCount.map(([candidate, count]) => ({
    candidate,
    votes: Number(count),
    percentage: totalVotes > 0 ? (Number(count) / totalVotes) * 100 : 0,
  })).sort((a, b) => b.votes - a.votes);
};

export const transformPollForChart = (poll: PollDetail): ChartDataPoint[] => {
  const results = calculateVotingResults(poll);
  
  return results.map((result, index) => ({
    label: result.candidate,
    value: result.votes,
    color: getChartColor(index),
  }));
};

export const getChartColor = (index: number): string => {
  const colors = [
    '#1976D2', '#388E3C', '#7B1FA2', '#F57C00', '#D32F2F',
    '#1976D2', '#7B1FA2', '#FF5722', '#795548', '#607D8B'
  ];
  return colors[index % colors.length];
};

// Poll Status Utilities
export const getPollStatus = (poll: PollSummary | PollDetail): 'open' | 'closed' => {
  return poll.ballotingOpen ? 'open' : 'closed';
};

export const getPollStatusColor = (status: 'open' | 'closed'): 'success' | 'error' => {
  return status === 'open' ? 'success' : 'error';
};

export const getTotalVotes = (poll: PollDetail): number => {
  return poll.ballotCount.reduce((sum, [, count]) => sum + Number(count), 0);
};

export const hasUserVoted = (poll: PollDetail, userPrincipal: Principal | null): boolean => {
  if (!userPrincipal) return false;
  return poll.ballots.some(ballot => ballot.voter.toString() === userPrincipal.toString());
};

export const getUserVote = (poll: PollDetail, userPrincipal: Principal | null): string | null => {
  if (!userPrincipal) return null;
  const userBallot = poll.ballots.find(ballot => 
    ballot.voter.toString() === userPrincipal.toString()
  );
  return userBallot?.candidate || null;
};

// Local Storage Utilities
export const getFromStorage = <T>(key: keyof typeof STORAGE_KEYS, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(STORAGE_KEYS[key]);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setToStorage = <T>(key: keyof typeof STORAGE_KEYS, value: T): void => {
  try {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

export const removeFromStorage = (key: keyof typeof STORAGE_KEYS): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS[key]);
  } catch (error) {
    console.warn('Failed to remove from localStorage:', error);
  }
};

// Theme Utilities
export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

export const resolveThemeMode = (mode: ThemeMode): 'light' | 'dark' => {
  if (mode === 'system') {
    return getSystemTheme();
  }
  return mode;
};

// URL Utilities
export const createPollUrl = (pollId: string | number): string => {
  return `/poll/${pollId}`;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      textArea.remove();
      return result;
    }
  } catch {
    return false;
  }
};

// Array Utilities
export const removeDuplicates = <T>(array: T[], key?: keyof T): T[] => {
  if (!key) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

export const sortByProperty = <T>(array: T[], property: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aValue = a[property];
    const bValue = b[property];
    
    if (aValue < bValue) {
      return direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

// Error Handling Utilities
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};

export const isNetworkError = (error: unknown): boolean => {
  const message = getErrorMessage(error).toLowerCase();
  return message.includes('network') || 
         message.includes('fetch') || 
         message.includes('connection') ||
         message.includes('timeout');
};

// Debounce Utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// ID Generation
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Type Guards
export const isValidPoll = (poll: any): poll is PollSummary => {
  return poll && 
         typeof poll.id !== 'undefined' &&
         typeof poll.name === 'string' &&
         typeof poll.ballotingOpen === 'boolean' &&
         poll.creator;
};

export const isValidPollDetail = (poll: any): poll is PollDetail => {
  return isValidPoll(poll) &&
         Array.isArray(poll.ballots) &&
         Array.isArray(poll.ballotCount) &&
         Array.isArray(poll.candidates);
};