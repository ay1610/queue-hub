export type Recommendation = {
  id: number;
  fromUserId: string;
  fromUserName?: string;
  toUserId: string;
  mediaId: number;
  mediaType: string;
  message: string;
  createdAt: string;
};

export type RecommendationsResponse = {
  recommendations: Recommendation[];
};

export type ShareRecommendationInput = {
  toUserId: string;
  mediaId: number;
  mediaType: "movie" | "tv";
  message: string;
};

export type ShareRecommendationResponse = {
  success: boolean;
  recommendation: Recommendation;
};
