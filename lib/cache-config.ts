/**
 * Centralized cache configuration for React Query
 * Defines standard cache times for different types of data
 */

// Cache times in milliseconds
const MINUTE = 1000 * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

// Common cache configurations
export const DEFAULT_CACHE = {
  staleTime: 5 * MINUTE, // 5 minutes
  gcTime: 10 * MINUTE, // 10 minutes (was cacheTime in v4)
} as const;

// Media details change less frequently than user data
export const MEDIA_DETAILS_CACHE = {
  staleTime: 10 * MINUTE, // 10 minutes
  gcTime: 20 * MINUTE, // 20 minutes (was cacheTime in v4)
} as const;

// User data should be fresher
export const USER_DATA_CACHE = {
  staleTime: 1 * MINUTE, // 1 minute
  gcTime: 5 * MINUTE, // 5 minutes (was cacheTime in v4)
} as const;

// Watch later data
export const WATCH_LATER_CACHE = {
  staleTime: 5 * MINUTE, // 5 minutes
  gcTime: 10 * MINUTE, // 10 minutes (was cacheTime in v4)
} as const;

// TMDB-specific cache configurations
export const TMDB_CACHE = {
  SHORT: {
    staleTime: 5 * MINUTE, // 5 minutes
    gcTime: 10 * MINUTE, // 10 minutes (was cacheTime in v4)
  },
  MEDIUM: {
    staleTime: 15 * MINUTE, // 15 minutes
    gcTime: 30 * MINUTE, // 30 minutes (was cacheTime in v4)
  },
  LONG: {
    staleTime: 30 * MINUTE, // 30 minutes
    gcTime: 1 * HOUR, // 1 hour (was cacheTime in v4)
  },
  VERY_LONG: {
    staleTime: 24 * HOUR, // 24 hours
    gcTime: 7 * DAY, // 7 days (was cacheTime in v4)
  },
} as const;
