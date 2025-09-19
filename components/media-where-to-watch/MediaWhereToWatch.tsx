import * as React from "react";
import ReactCountryFlag from "react-country-flag";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaWatchProviders } from "@/lib/tmdb/hooks/use-watch-providers";
import { useRegionStore } from "@/lib/stores/region-store";
import { ProviderCard } from "./ProviderCard";

export interface MediaWhereToWatchProps {
  mediaId: number;
  mediaType: "movie" | "tv";
}

/**
 * Displays a table of streaming, rental, and purchase options for a media item.
 * Uses the current region setting to show relevant providers.
 * @param mediaId - The TMDB ID of the movie or TV show
 * @param mediaType - Whether this is a movie or TV show
 */
const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full">{children}</div>
);

export function MediaWhereToWatch({ mediaId, mediaType }: MediaWhereToWatchProps) {
  const { data: providers, isLoading, error } = useMediaWatchProviders(mediaId, mediaType);
  const { regionInfo, getRegionCode } = useRegionStore();

  if (isLoading) {
    return (
      <Container>
        <Skeleton className="h-[300px] w-full" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="text-red-500 dark:text-red-400">
          Error loading watch providers. Please try again later.
        </div>
      </Container>
    );
  }

  if (!providers) {
    return (
      <Container>
        <div className="text-muted-foreground text-sm flex items-center gap-2">
          No watch provider information available for{" "}
          <span className="inline-flex items-center gap-1.5">
            <ReactCountryFlag
              countryCode={getRegionCode()}
              svg
              style={{
                width: "1em",
                height: "1em",
              }}
              title={regionInfo?.english_name || "United States"}
            />
            {regionInfo?.english_name || "United States"}
          </span>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <span>Showing providers for</span>
          <span className="inline-flex items-center gap-1.5 font-medium">
            <ReactCountryFlag
              countryCode={getRegionCode()}
              svg
              style={{
                width: "1em",
                height: "1em",
              }}
              title={regionInfo?.english_name || "United States"}
            />
            {regionInfo?.english_name || "United States"}
          </span>
          <span className="text-xs whitespace-nowrap">(Change region in settings)</span>
        </div>
      </div>
      <div className="space-y-6 sm:space-y-0">
        <Table className="hidden sm:table">
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Type</TableHead>
              <TableHead>Providers</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Streaming</TableCell>
              <TableCell>
                {providers.flatrate && providers.flatrate.length > 0 ? (
                  <div className="flex gap-2 flex-wrap">
                    {providers.flatrate.map((provider) => (
                      <ProviderCard key={provider.provider_id} provider={provider} />
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    No streaming providers found.
                  </span>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Rent</TableCell>
              <TableCell>
                {providers.rent && providers.rent.length > 0 ? (
                  <div className="flex gap-2 flex-wrap">
                    {providers.rent.map((provider) => (
                      <ProviderCard key={provider.provider_id} provider={provider} />
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    No rent providers found.
                  </span>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Buy</TableCell>
              <TableCell>
                {providers.buy && providers.buy.length > 0 ? (
                  <div className="flex gap-2 flex-wrap">
                    {providers.buy.map((provider) => (
                      <ProviderCard key={provider.provider_id} provider={provider} />
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    No buy providers found.
                  </span>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Mobile layout */}
        <div className="sm:hidden space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Streaming</h3>
            {providers.flatrate && providers.flatrate.length > 0 ? (
              <div className="flex gap-3 flex-wrap">
                {providers.flatrate.map((provider) => (
                  <ProviderCard key={provider.provider_id} provider={provider} />
                ))}
              </div>
            ) : (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                No streaming providers found.
              </span>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Rent</h3>
            {providers.rent && providers.rent.length > 0 ? (
              <div className="flex gap-3 flex-wrap">
                {providers.rent.map((provider) => (
                  <ProviderCard key={provider.provider_id} provider={provider} />
                ))}
              </div>
            ) : (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                No rent providers found.
              </span>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Buy</h3>
            {providers.buy && providers.buy.length > 0 ? (
              <div className="flex gap-3 flex-wrap">
                {providers.buy.map((provider) => (
                  <ProviderCard key={provider.provider_id} provider={provider} />
                ))}
              </div>
            ) : (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                No buy providers found.
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 sm:mt-2">
        {providers.link ? (
          <a
            href={providers.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
          >
            More options on TMDB
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        ) : (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            No additional provider options found.
          </span>
        )}
      </div>
    </Container>
  );
}
