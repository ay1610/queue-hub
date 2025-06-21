import { vi } from "vitest";

// Move all vi.mock calls to the top-level before imports
const mockRedirect = vi.fn();
const mockGetSession = vi.fn();

vi.mock("next/navigation", () => ({ redirect: mockRedirect }));
vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: mockGetSession } },
}));
vi.mock("next/headers", () => ({ headers: vi.fn() }));

describe("getProtectedUser", () => {
  beforeEach(() => {
    mockRedirect.mockClear();
    mockGetSession.mockReset();
  });

  afterEach(() => {
    vi.resetModules(); // Reset module registry to ensure isolation
    vi.restoreAllMocks(); // Restore all mocks to their original implementations
  });

  it("redirects to /sign-in if no session", async () => {
    mockGetSession.mockResolvedValueOnce(null);
    const { getProtectedUser } = await import("../../lib/auth-helpers");
    await expect(getProtectedUser()).rejects.toThrow();
    expect(mockRedirect).toHaveBeenCalledWith("/sign-in");
  });

  it("returns user if session exists", async () => {
    mockGetSession.mockResolvedValueOnce({ user: { id: "1", name: "Test" } });
    const { getProtectedUser } = await import("../../lib/auth-helpers");
    const user = await getProtectedUser();
    expect(user).toEqual({ id: "1", name: "Test" });
  });
});

// Add tests for getRandomItems if present in this file
