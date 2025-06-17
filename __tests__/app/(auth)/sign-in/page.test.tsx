import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SignInPage from "@/app/(auth)/sign-in/page";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));
jest.mock("sonner", () => ({
  toast: { loading: jest.fn(), dismiss: jest.fn(), success: jest.fn(), error: jest.fn() },
}));
jest.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      email: jest.fn(),
    },
  },
}));

describe("SignInPage", () => {
  const push = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push });
  });

  it("renders the sign-in form", () => {
    render(<SignInPage />);
    expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    render(<SignInPage />);
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/please enter valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/Password must be at least 8 characters long/i)).toBeInTheDocument();
    });
  });

  it("calls authClient.signIn.email and handles success", async () => {
    (authClient.signIn.email as jest.Mock).mockImplementation((_data, handlers) => {
      if (handlers.onRequest) handlers.onRequest("context");
      if (handlers.onResponse) handlers.onResponse("context");
      void (handlers.onSuccess && handlers.onSuccess("context"));
      return { data: {}, error: null };
    });
    render(<SignInPage />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "john@mail.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => {
      expect(authClient.signIn.email).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "john@mail.com",
          password: "password123",
          callbackURL: "/",
        }),
        expect.any(Object)
      );
      expect(toast.loading).toHaveBeenCalledWith("Signing in...", expect.any(Object));
      expect(toast.dismiss).toHaveBeenCalledWith("signin");
      expect(toast.success).toHaveBeenCalledWith("Signed in! Redirecting...", expect.any(Object));
    });
  });

  it("handles error from signIn.email handler", async () => {
    (authClient.signIn.email as jest.Mock).mockImplementation((_data, handlers) => {
      if (handlers.onRequest) handlers.onRequest("context");
      if (handlers.onResponse) handlers.onResponse("context");
      if (handlers.onError) handlers.onError("error context");
      return { data: null, error: null };
    });
    render(<SignInPage />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "john@mail.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("error context", expect.any(Object));
    });
  });

  it("handles error from signIn.email handler with non-string context", async () => {
    (authClient.signIn.email as jest.Mock).mockImplementation((_data, handlers) => {
      if (handlers.onRequest) handlers.onRequest("context");
      if (handlers.onResponse) handlers.onResponse("context");
      if (handlers.onError) handlers.onError({ foo: "bar" }); // non-string context
      return { data: null, error: null };
    });
    render(<SignInPage />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "john@mail.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to sign in. Please try again.",
        expect.any(Object)
      );
    });
  });

  it("handles error returned from signIn.email response with no message", async () => {
    (authClient.signIn.email as jest.Mock).mockResolvedValue({ data: null, error: {} });
    render(<SignInPage />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "john@mail.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Something went wrong during signup",
        expect.any(Object)
      );
    });
  });

  it("renders sign-up link", () => {
    render(<SignInPage />);
    const link = screen.getByRole("link", { name: /sign up/i });
    expect(link).toHaveAttribute("href", "/sign-up");
  });
});
