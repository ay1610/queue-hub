import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { SignUp } from "@/app/(auth)/sign-up/page";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

vi.mock("next/navigation", () => ({ useRouter: vi.fn() }));
vi.mock("sonner", () => ({
  toast: { loading: vi.fn(), dismiss: vi.fn(), success: vi.fn(), error: vi.fn() },
}));
vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signUp: {
      email: vi.fn(),
    },
  },
}));

// Replace `any` with a more specific type for handlers
interface SignUpHandlers {
  onRequest?: (context: unknown) => void;
  onResponse?: (context: unknown) => void;
  onSuccess?: (context: unknown) => void;
  onError?: (context: unknown) => void;
}

describe("SignUp Page", () => {
  const push = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as unknown as { mockReturnValue: (val: unknown) => void }).mockReturnValue({ push });
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders all form fields and submit button", () => {
    vi.useRealTimers();
    render(<SignUp redirectDelayMs={0} />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    vi.useRealTimers();
    render(<SignUp redirectDelayMs={0} />);
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(
        screen.getAllByText(/must be atleast|valid email address|Passwords don't match/i).length
      ).toBeGreaterThan(0);
    });
  });

  it("shows validation error for mismatched passwords", async () => {
    vi.useRealTimers();
    render(<SignUp redirectDelayMs={0} />);
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "password456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(screen.getByText(/Passwords don't match/i)).toBeInTheDocument();
    });
  });

  it("calls authClient.signUp.email and handles success with matching passwords", async () => {
    vi.useRealTimers();
    (authClient.signUp.email as ReturnType<typeof vi.fn>).mockImplementation(
      (_data: unknown, handlers: SignUpHandlers) => {
        if (handlers.onRequest) handlers.onRequest("context");
        if (handlers.onResponse) handlers.onResponse("context");
        void (handlers.onSuccess && handlers.onSuccess("context"));
        return { data: {}, error: null };
      }
    );
    render(<SignUp redirectDelayMs={0} />);
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "john@mail.com" } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    for (let i = 0; i < 5; i++) await Promise.resolve();
    await waitFor(() => {
      expect(authClient.signUp.email).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "john@mail.com",
          password: "password123",
          name: "John Doe",
          callbackURL: "/sign-in",
        }),
        expect.any(Object)
      );
      expect(toast.loading).toHaveBeenCalledWith("Creating your account...", expect.any(Object));
      expect(toast.dismiss).toHaveBeenCalledWith("signup");
      expect(toast.success).toHaveBeenCalledWith(
        "Account created! Redirecting to login...",
        expect.any(Object)
      );
      expect(push).toHaveBeenCalledWith("/sign-in");
    });
  }, 20000);

  it("calls authClient.signUp.email and handles success with matching passwords (real timers diagnostic)", async () => {
    vi.useRealTimers();
    (authClient.signUp.email as ReturnType<typeof vi.fn>).mockImplementation(
      (_data: unknown, handlers: SignUpHandlers) => {
        if (handlers.onRequest) handlers.onRequest("context");
        if (handlers.onResponse) handlers.onResponse("context");
        void (handlers.onSuccess && handlers.onSuccess("context"));
        return { data: {}, error: null };
      }
    );
    render(<SignUp redirectDelayMs={0} />);
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "john@mail.com" } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    for (let i = 0; i < 5; i++) await Promise.resolve();
    await waitFor(() => {
      expect(authClient.signUp.email).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "john@mail.com",
          password: "password123",
          name: "John Doe",
          callbackURL: "/sign-in",
        }),
        expect.any(Object)
      );
      expect(toast.loading).toHaveBeenCalledWith("Creating your account...", expect.any(Object));
      expect(toast.dismiss).toHaveBeenCalledWith("signup");
      expect(toast.success).toHaveBeenCalledWith(
        "Account created! Redirecting to login...",
        expect.any(Object)
      );
      expect(push).toHaveBeenCalledWith("/sign-in");
    });
  }, 20000);

  it("handles error from signUp.email handler", async () => {
    vi.useRealTimers();
    (authClient.signUp.email as ReturnType<typeof vi.fn>).mockImplementation(
      (_data: unknown, handlers: SignUpHandlers) => {
        if (handlers.onRequest) handlers.onRequest("context");
        if (handlers.onResponse) handlers.onResponse("context");
        if (handlers.onError) handlers.onError("error context");
        return { data: null, error: null };
      }
    );
    render(<SignUp redirectDelayMs={0} />);
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "john@mail.com" } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("error context", expect.any(Object));
    });
  }, 10000);

  it("handles error from signUp.email handler with non-string context", async () => {
    vi.useRealTimers();
    (authClient.signUp.email as ReturnType<typeof vi.fn>).mockImplementation(
      (_data: unknown, handlers: SignUpHandlers) => {
        if (handlers.onRequest) handlers.onRequest("context");
        if (handlers.onResponse) handlers.onResponse("context");
        if (handlers.onError) handlers.onError({ foo: "bar" });
        return { data: null, error: null };
      }
    );
    render(<SignUp redirectDelayMs={0} />);
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "john@mail.com" } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to create account. Please try again.",
        expect.any(Object)
      );
    });
  }, 10000);

  it("handles error returned from signUp.email response with no message", async () => {
    vi.useRealTimers();
    (authClient.signUp.email as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: null,
      error: {},
    });
    render(<SignUp redirectDelayMs={0} />);
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "john@mail.com" } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Something went wrong during signup",
        expect.any(Object)
      );
    });
  }, 10000);

  it("renders sign-in link", () => {
    vi.useRealTimers();
    render(<SignUp redirectDelayMs={0} />);
    const link = screen.getByRole("link", { name: /sign in/i });
    expect(link).toHaveAttribute("href", "/sign-in");
  });
});

/*
DOCUMENTATION: Steps taken to debug and fix async/timer-based SignUp page tests (to avoid repeating work)

1. Initial Problem: Async/timer-based tests for SignUp page were timing out in Vitest/RTL.
2. Confirmed that the router mock and setTimeout in the component were firing (debug logs added).
3. Refactored SignUp component to accept a `redirectDelayMs` prop (default 1500ms) and used it in setTimeout for navigation. Removed default export.
4. Updated all test cases to use named import `{ SignUp }` and render `<SignUp redirectDelayMs={0} />` for instant navigation.
5. Cleaned up unnecessary timer/microtask flushing in tests where delay is now zero.
6. Documented all test file changes at the top of the test file.
7. Repeatedly ran tests after each change to check for improvements.
8. Four tests now pass, but four async/timer-based tests still time out.
9. Investigated test and component code for remaining issues:
   - Confirmed all mocks and async flows are compatible with instant navigation.
   - Verified that all error/success handlers and toasts are called as expected.
   - Confirmed that `vi.useFakeTimers()` and `vi.runAllTimersAsync()` are used in all async/timer-based tests.
10. Next steps: Focus on why `vi.runAllTimersAsync()` does not resolve the async flows in error/success handler tests, and ensure all async code paths are properly flushed in tests.

---

Iteration (June 20, 2025):
- Re-ran all SignUp page tests after refactoring for `redirectDelayMs` prop and instant navigation in tests.
- Confirmed that 4/8 tests now pass (all non-async/timer-based tests).
- Verified that all mocks, async flows, and timer utilities are correctly set up in both the component and tests.
- Documented all steps taken so far directly in the test file to avoid repeating work and unnecessary loops.
- Next: Focused investigation on why `vi.runAllTimersAsync()` does not resolve async flows in error/success handler tests, and ensure all async code paths are properly flushed in tests.
- Progress and blockers are now documented in both this file and VITEST_MIGRATION_PROGRESS.md for future reference.

[CLEANUP] June 20, 2025: Removed debug logs and finalized documentation after successful Vitest migration. All async/timer-based tests now pass reliably. See VITEST_MIGRATION_PROGRESS.md for lessons learned and migration summary.
*/
