import Image from "next/image";
import * as React from "react";

interface Provider {
    provider_id: number;
    provider_name: string;
    logo_path: string;
}

interface ProviderCardProps {
    provider: Provider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
    return (
        <a
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
    );
}