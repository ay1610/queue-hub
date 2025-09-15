import { create } from "zustand";
import type { TMDBTVExternalIds } from "@/lib/types/tmdb";
import type { RuntimeDataResult } from "./useBatchRuntime";
import type { TitleRatingResult } from "./useBatchRatings";

type MediaData = {
  externalIds: TMDBTVExternalIds | undefined;
  runtime: RuntimeDataResult | undefined;
  rating: TitleRatingResult | undefined;
};

interface MediaDataStore {
  mediaDataMap: Map<number, MediaData>;
  setMediaDataMap: (map: Map<number, MediaData>) => void;
  getMediaData: (id: number) => MediaData | undefined;
  clearMediaData: () => void;
}

const useMediaDataStore = create<MediaDataStore>((set, get) => ({
  mediaDataMap: new Map(),
  setMediaDataMap: (map) => set({ mediaDataMap: new Map(map) }),
  getMediaData: (id) => {
    return get().mediaDataMap.get(id);
  },
  clearMediaData: () => set({ mediaDataMap: new Map() }),
}));

export const useSetMediaDataMap = () => useMediaDataStore((store) => store.setMediaDataMap);

export const useMediaDataById = (id: number) =>
  useMediaDataStore((store) => store.getMediaData(id));
