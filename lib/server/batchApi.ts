import { cookies, headers } from "next/headers";

export async function postBatch<TRequest, TResponse>(
  path: string,
  body: TRequest
): Promise<TResponse[] | null> {
  try {
    const hdrs = await headers();
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      hdrs.get("origin") ||
      `http://${hdrs.get("host") || "localhost:3000"}`;
    const cookieHeader = (await cookies()).toString();

    const res = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`POST ${path} failed:`, res.status, res.statusText);
      return null;
    }

    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error(`Error posting to ${path}:`, error);
    return null;
  }
}
