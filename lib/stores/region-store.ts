import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TMDBRegion } from "@/lib/tmdb/types/regions";

interface RegionState {
  regionInfo: TMDBRegion | null;
  setRegion: (regionInfo: TMDBRegion) => void;
  getRegionCode: () => string;
  initializeFromCookie: () => void;
}

export const useRegionStore = create<RegionState>()(
  persist(
    (set, get) => ({
      regionInfo: null,
      setRegion: (regionInfo: TMDBRegion) => set({ regionInfo }),
      getRegionCode: () => get().regionInfo?.iso_3166_1 || "US", // Default to US if no region set
      initializeFromCookie: () => {
        try {
          const regionCookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith("user-region="));

          if (regionCookie) {
            const regionData = JSON.parse(decodeURIComponent(regionCookie.split("=")[1]));
            if (regionData.iso_3166_1) {
              set({
                regionInfo: {
                  iso_3166_1: regionData.iso_3166_1,
                  english_name: regionData.country || "Unknown",
                  native_name: regionData.country || "Unknown",
                },
              });
            }
          }
        } catch (error) {
          console.error("Error initializing region from cookie:", error);
        }
      },
    }),
    {
      name: "region-storage", // unique name for localStorage key
    }
  )
);
