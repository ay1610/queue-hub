import { fetchRecommendations, postRecommendation } from "@/lib/api/fetchRecommendations";
import { USER_DATA_CACHE } from "@/lib/cache-config";
import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { useQuery, type UseQueryOptions, type UseQueryResult } from "@tanstack/react-query";
import {
  RecommendationsResponse,
  ShareRecommendationInput,
  ShareRecommendationResponse,
} from "@/lib/types/recommendation.types";

export function recommendationsQueryOptions(
  options?: Partial<UseQueryOptions<RecommendationsResponse, Error, RecommendationsResponse>>
) {
  return {
    queryKey: ["recommendations"],
    queryFn: fetchRecommendations,
    ...USER_DATA_CACHE,
    ...options,
  } satisfies UseQueryOptions<RecommendationsResponse, Error, RecommendationsResponse>;
}

export function useRecommendations(
  options?: Partial<UseQueryOptions<RecommendationsResponse, Error, RecommendationsResponse>>
): UseQueryResult<RecommendationsResponse, Error> {
  return useQuery<RecommendationsResponse, Error>(recommendationsQueryOptions(options));
}

export function useShareRecommendation(
  options?: UseMutationOptions<ShareRecommendationResponse, Error, ShareRecommendationInput>
): UseMutationResult<ShareRecommendationResponse, Error, ShareRecommendationInput> {
  return useMutation({
    mutationFn: postRecommendation,
    ...options,
  });
}
