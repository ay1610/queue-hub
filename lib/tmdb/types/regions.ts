export interface TMDBRegion {
  iso_3166_1: string;
  english_name: string;
  native_name: string;
}

export interface TMDBRegionsResponse {
  results: TMDBRegion[];
}
