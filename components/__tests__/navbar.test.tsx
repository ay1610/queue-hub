import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

import React from "react";
import { render, screen } from "@testing-library/react";
import Navbar from "../navbar";
import { ThemeProvider } from "next-themes";
import userEvent from "@testing-library/user-event";

// Mock next/navigation for redirect and router used by SearchBar
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock("@/lib/auth-client", () => {
  const actual = vi.importActual ? vi.importActual("@/lib/auth-client") : {};
  return {
    ...actual,
    authClient: {
      getSession: vi.fn().mockResolvedValue({
        data: { user: { name: "Test User", email: "test@example.com" }, session: {} },
      }),
      signOut: vi.fn(),
    },
  };
});

describe("Navbar", () => {
  it("renders the brand name", () => {
    render(
      <ThemeProvider attribute="class">
        <Navbar />
      </ThemeProvider>
    );
    expect(screen.getByText(/Queue Hub\./i)).toBeInTheDocument();
  });

  it("shows sign in button when not authenticated", () => {
    render(
      <ThemeProvider attribute="class">
        <Navbar />
      </ThemeProvider>
    );
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  });

  it("shows popover and calls sign out", async () => {
    render(
      <ThemeProvider attribute="class">
        <Navbar />
      </ThemeProvider>
    );
    // Wait for the popover button to appear
    const avatarButton = await screen.findByLabelText(/open profile/i);
    expect(avatarButton).toBeInTheDocument();
    await userEvent.click(avatarButton);
    // Popover content
    expect(await screen.findByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    // Click sign out
    const signOutBtn = screen.getByRole("button", { name: /sign out/i });
    await userEvent.click(signOutBtn);
    // Optionally, check if signOut was called
    const { authClient } = await import("@/lib/auth-client");
    expect(authClient.signOut).toHaveBeenCalled();
  });
});
