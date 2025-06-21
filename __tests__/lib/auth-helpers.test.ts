import { getProtectedUser } from "../lib/auth-helpers";
import { vi } from "vitest";

describe("getProtectedUser", () => {
  it("redirects to /sign-in if no session", async () => {
    // Mock dependencies
    const mockRedirect = vi.fn();
    vi.mock("next/navigation", () => ({ redirect: mockRedirect }));
    vi.mock("@/lib/auth", () => ({
      auth: { api: { getSession: vi.fn().mockResolvedValue(null) } },
    }));
    vi.mock("next/headers", () => ({ headers: vi.fn() }));

    // Import after mocks
    const { getProtectedUser } = await import("../lib/auth-helpers");
    await getProtectedUser();
    expect(mockRedirect).toHaveBeenCalledWith("/sign-in");
  });

  it("returns user if session exists", async () => {
    const fakeUser = { id: "1", name: "Test" };
    vi.mock("@/lib/auth", () => ({
      auth: { api: { getSession: vi.fn().mockResolvedValue({ user: fakeUser }) } },
    }));
    vi.mock("next/headers", () => ({ headers: vi.fn() }));
    vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

    const { getProtectedUser } = await import("../lib/auth-helpers");
    const user = await getProtectedUser();
    expect(user).toEqual(fakeUser);
  });
});

// Add tests for getRandomItems if present in this file
