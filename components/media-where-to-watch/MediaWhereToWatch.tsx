import * as React from "react";
import Image from "next/image";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export interface MediaWhereToWatchProps {
  usProviders?: {
    link?: string;
    flatrate?: Array<{ provider_id: number; provider_name: string; logo_path: string }>;
    rent?: Array<{ provider_id: number; provider_name: string; logo_path: string }>;
    buy?: Array<{ provider_id: number; provider_name: string; logo_path: string }>;
  };
}

/**
 * Displays a table of where to watch options for a media item (movie, show, etc).
 * @param usProviders - Provider info for the US region.
 */
export function MediaWhereToWatch({ usProviders }: MediaWhereToWatchProps) {

  return (
    <div className="max-w-4xl mx-auto px-4 mt-16 mb-12">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Providers</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Streaming</TableCell>
            <TableCell>
              {usProviders && usProviders.flatrate && usProviders.flatrate.length > 0 ? (
                <div className="flex gap-2 flex-wrap">
                  {usProviders.flatrate.map((provider) => (
                    <a
                      key={provider.provider_id}
                      className="inline-flex flex-col items-center group hover:scale-105 transition-transform"
                    >
                      <Image
                        src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                        alt={provider.provider_name}
                        width={45}
                        height={45}
                        className="rounded bg-white dark:bg-zinc-900 p-1 shadow group-hover:ring-2 group-hover:ring-blue-400"
                      />
                      <span className="text-xs mt-1 text-gray-700 dark:text-gray-300 text-center">
                        {provider.provider_name}
                      </span>
                    </a>
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
              {usProviders && usProviders.rent && usProviders.rent.length > 0 ? (
                <div className="flex gap-2 flex-wrap">
                  {usProviders.rent.map((provider) => (
                    <a
                      key={provider.provider_id}
                      className="inline-flex flex-col items-center group hover:scale-105 transition-transform"
                    >
                      <Image
                        src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                        alt={provider.provider_name}
                        width={45}
                        height={45}
                        className="rounded bg-white dark:bg-zinc-900 p-1 shadow group-hover:ring-2 group-hover:ring-blue-400"
                      />
                      <span className="text-xs mt-1 text-gray-700 dark:text-gray-300 text-center">
                        {provider.provider_name}
                      </span>
                    </a>
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
              {usProviders && usProviders.buy && usProviders.buy.length > 0 ? (
                <div className="flex gap-2 flex-wrap">
                  {usProviders.buy.map((provider) => (
                    <a
                      key={provider.provider_id}
                      className="inline-flex flex-col items-center group hover:scale-105 transition-transform"
                    >
                      <Image
                        src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                        alt={provider.provider_name}
                        width={45}
                        height={45}
                        className="rounded bg-white dark:bg-zinc-900 p-1 shadow group-hover:ring-2 group-hover:ring-blue-400"
                      />
                      <span className="text-xs mt-1 text-gray-700 dark:text-gray-300 text-center">
                        {provider.provider_name}
                      </span>
                    </a>
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
      <div className="mt-2">
        {usProviders && usProviders.link ? (
          <a
            href={usProviders.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 underline text-sm font-medium"
          >
            More options on TMDB
          </a>
        ) : (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            No additional provider options found.
          </span>
        )}
      </div>
    </div>
  );
}
