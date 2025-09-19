"use client";

import { useQuery } from "@tanstack/react-query";
import { TMDB_CACHE } from "@/lib/cache-config";
import type { TMDBRegionsResponse } from "@/lib/tmdb/types/regions";
import { getWatchProviderRegions } from "./client";

/**
 * Gets the list of countries that have watch provider (OTT/streaming) data.
 * This data is used to show region-specific streaming availability.
 *
 * @returns A sorted list of regions with their ISO codes and localized names
 * @example
 * ```tsx
 * function RegionSelector() {
 *   const { data: regionsData, isLoading } = useWatchProviderRegions();
 *   if (isLoading) return <LoadingSpinner />;
 *
 *   const regions = regionsData?.results ?? [];
 *   return (
 *     <select>
 *       {regions.map(region => (
 *         <option key={region.iso_3166_1} value={region.iso_3166_1}>
 *           {region.english_name}
 *         </option>
 *       ))}
 *     </select>
 *   );
 * }
 * ```
 */
export function useWatchProviderRegions() {
  return useQuery<TMDBRegionsResponse, Error>({
    queryKey: ["watch-provider-regions"],
    queryFn: getWatchProviderRegions,
    select: (data) => ({
      ...data,
      // Sort results alphabetically by English name
      results: [...data.results].sort((a, b) => a.english_name.localeCompare(b.english_name)),
    }),
    // Regions change very infrequently, so we can cache them for a long time
    ...TMDB_CACHE.VERY_LONG,
  });
}
