// Application Constants
export const APP_NAME = 'BallotLife';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Decentralized Voting Platform on Internet Computer';

// Routes
export const ROUTES = {
  HOME: '/',
  DISCOVER: '/discover',
  POLL_DETAIL: '/poll/:id',
  CREATE_POLL: '/create',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// React Query Configuration
export const QUERY_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 10 * 60 * 1000, // 10 minutes
  REFETCH_ON_WINDOW_FOCUS: true,
  RETRY: 3,
} as const;

// Query Keys
export const QUERY_KEYS = {
  POLLS: ['polls'],
  POLL_DETAIL: ['poll'],
  USER_POLLS: ['user', 'polls'],
  USER_VOTES: ['user', 'votes'],
  POLL_RESULTS: ['poll', 'results'],
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'ballotlife_theme',
  DRAFT_POLLS: 'ballotlife_draft_polls',
  LAST_VISITED: 'ballotlife_last_visited',
  NOTIFICATIONS: 'ballotlife_notifications',
  USER_PREFERENCES: 'ballotlife_user_preferences',
} as const;

// Theme Configuration
export const THEME = {
  BREAKPOINTS: {
    MOBILE: 320,
    TABLET: 768,
    DESKTOP: 1024,
    LARGE: 1440,
  },
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
    XXL: 48,
  },
  BORDER_RADIUS: {
    SM: 4,
    MD: 8,
    LG: 12,
    XL: 16,
    ROUND: 20,
  },
  ELEVATION: {
    NONE: 'none',
    SM: '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)',
    MD: '0px 4px 8px rgba(0, 0, 0, 0.16), 0px 2px 4px rgba(0, 0, 0, 0.12)',
    LG: '0px 8px 16px rgba(0, 0, 0, 0.16), 0px 4px 8px rgba(0, 0, 0, 0.12)',
    XL: '0px 16px 24px rgba(0, 0, 0, 0.16), 0px 8px 12px rgba(0, 0, 0, 0.12)',
  },
} as const;

// Animation Durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 800,
} as const;

// Form Validation
export const VALIDATION = {
  POLL_TITLE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100,
  },
  POLL_DESCRIPTION: {
    MAX_LENGTH: 500,
  },
  CANDIDATE_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
  },
  CANDIDATE_DESCRIPTION: {
    MAX_LENGTH: 200,
  },
  MIN_CANDIDATES: 2,
  MAX_CANDIDATES: 20,
} as const;

// Poll Configuration
export const POLL_CONFIG = {
  DEFAULT_DURATION: 24, // hours
  MIN_DURATION: 1, // hours
  MAX_DURATION: 168, // 1 week
  MAX_POLLS_PER_PAGE: 12,
  REFRESH_INTERVAL: 30000, // 30 seconds
} as const;

// Chart Configuration
export const CHART_CONFIG = {
  COLORS: [
    '#1976D2', // Primary Blue
    '#388E3C', // Secondary Green
    '#7B1FA2', // Accent Purple
    '#F57C00', // Orange
    '#D32F2F', // Red
    '#1976D2', // Blue (repeat for more candidates)
    '#7B1FA2', // Purple
    '#FF5722', // Deep Orange
    '#795548', // Brown
    '#607D8B', // Blue Grey
  ],
  ANIMATION_DURATION: 800,
  RESPONSIVE_BREAKPOINT: 768,
} as const;

// Notification Configuration
export const NOTIFICATION_CONFIG = {
  DEFAULT_DURATION: 5000, // 5 seconds
  SUCCESS_DURATION: 3000, // 3 seconds
  ERROR_DURATION: 8000, // 8 seconds
  MAX_NOTIFICATIONS: 5,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You must be signed in to perform this action.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  POLL_NOT_FOUND: 'Poll not found or has been deleted.',
  VOTING_CLOSED: 'Voting for this poll has been closed.',
  ALREADY_VOTED: 'You have already voted in this poll.',
  INVALID_CANDIDATE: 'Please select a valid candidate.',
  POLL_CREATE_ERROR: 'Failed to create poll. Please try again.',
  CANDIDATE_ADD_ERROR: 'Failed to add candidate. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  POLL_CREATED: 'Poll created successfully!',
  VOTE_CAST: 'Your vote has been recorded successfully!',
  CANDIDATE_ADDED: 'Candidate added successfully!',
  POLL_CLOSED: 'Poll has been closed successfully!',
  POLL_REOPENED: 'Poll has been reopened successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!',
} as const;

// Internet Identity Configuration
export const II_CONFIG = {
  MAX_TIME_TO_LIVE: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days in nanoseconds
  IDLE_TIMEOUT: 30 * 60 * 1000, // 30 minutes in milliseconds
} as const;

// Feature Flags
export const FEATURES = {
  DARK_MODE: true,
  NOTIFICATIONS: true,
  ANALYTICS: false,
  EXPORT_RESULTS: true,
  POLL_TEMPLATES: false,
  ADVANCED_FILTERS: true,
  REAL_TIME_UPDATES: true,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
  INFINITE_SCROLL_THRESHOLD: 0.8,
} as const;

// Search Configuration
export const SEARCH_CONFIG = {
  DEBOUNCE_DELAY: 300, // milliseconds
  MIN_QUERY_LENGTH: 2,
  MAX_RESULTS: 50,
} as const;

// File Upload (if needed for future features)
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_FILES: 1,
} as const;

// Social Sharing (if needed for future features)
export const SOCIAL_CONFIG = {
  TWITTER_HANDLE: '@BallotLife',
  HASHTAGS: ['BallotLife', 'Voting', 'Democracy', 'InternetComputer'],
} as const;

// Regular Expressions
export const REGEX = {
  POLL_TITLE: /^[a-zA-Z0-9\s\-_.,!?()]+$/,
  CANDIDATE_NAME: /^[a-zA-Z0-9\s\-_.]+$/,
  PRINCIPAL_ID: /^[a-zA-Z0-9\-]+$/,
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;