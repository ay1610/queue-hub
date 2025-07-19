export async function fetchRecommendations() {
  const res = await fetch("/api/recommendation");
  if (!res.ok) throw new Error("Failed to fetch recommendations");
  return res.json();
}

export async function postRecommendation({
  toUserId,
  mediaId,
  mediaType,
  message,
}: {
  toUserId: string;
  mediaId: number; 
  mediaType: "movie" | "tv";
  message: string;
}) {
  const res = await fetch("/api/recommendation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ toUserId, mediaId, mediaType, message }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
