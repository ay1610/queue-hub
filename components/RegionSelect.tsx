"use client";

import { useRegionStore } from "@/lib/stores/region-store";
import { SelectProps } from "@radix-ui/react-select";
import { toast } from "sonner";
import ReactCountryFlag from "react-country-flag";
import { useWatchProviderRegions } from "@/lib/tmdb/watch-providers/hooks";
import type { TMDBRegion } from "@/lib/tmdb/types/regions";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export function RegionSelect({
    onValueChange,
    ...props
}: Omit<SelectProps, "value" | "defaultValue">) {
    const { regionInfo, setRegion: setStoreRegion } = useRegionStore();
    const { data, isLoading } = useWatchProviderRegions();

    const handleChange = (value: string) => {
        const selectedRegion = regions.find(r => r.iso_3166_1 === value);
        if (selectedRegion) {
            setStoreRegion(selectedRegion);
            toast.success(() => (
                <div className="flex items-center gap-2">
                    <ReactCountryFlag countryCode={selectedRegion.iso_3166_1} svg />
                    Region changed to {selectedRegion.english_name}
                </div>
            ), {
                description: "Streaming providers will be updated for your region",
            });
            onValueChange?.(value);
        }
    };

    if (isLoading) {
        return <Skeleton className="h-10 w-full" />;
    }

    const regions: TMDBRegion[] = data?.results ?? [];
    const currentRegionCode = regionInfo?.iso_3166_1 || "US";
    const selectedRegion = regions.find((r) => r.iso_3166_1 === currentRegionCode);

    return (
        <Select onValueChange={handleChange} defaultValue={currentRegionCode} {...props}>
            <SelectTrigger>
                <SelectValue>
                    {selectedRegion && (
                        <div className="flex items-center gap-2">
                            <ReactCountryFlag countryCode={selectedRegion.iso_3166_1} svg />
                            {selectedRegion.english_name}
                        </div>
                    )}
                </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[300px] p-0" position="popper">
                <ScrollArea className="h-[300px] w-full">
                    <div className="p-1">
                        {regions.map((region: TMDBRegion) => (
                            <SelectItem key={region.iso_3166_1} value={region.iso_3166_1}>
                                <div className="flex items-center gap-2">
                                    <ReactCountryFlag countryCode={region.iso_3166_1} svg />
                                    {region.english_name}
                                </div>
                            </SelectItem>
                        ))}
                    </div>
                </ScrollArea>
            </SelectContent>
        </Select>
    );
}