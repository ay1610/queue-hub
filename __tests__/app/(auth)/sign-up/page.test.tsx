import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
// Update the import path below if the actual path or export is different
// Update the import path below if the actual path or export is different
import SignUp from '@/app/(auth)/sign-up/page';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
jest.mock('sonner', () => ({ toast: { loading: jest.fn(), dismiss: jest.fn(), success: jest.fn(), error: jest.fn() } }));
jest.mock('@/lib/auth-client', () => ({
    authClient: {
        signUp: {
            email: jest.fn()
        }
    }
}));

describe('SignUp Page', () => {
    const push = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push });
    });

    it('renders all form fields and submit button', () => {
        render(<SignUp />);
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument(); // More specific to avoid matching "Confirm Password"
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('shows validation errors for empty fields', async () => {
        render(<SignUp />);
        fireEvent.click(screen.getByRole('button', { name: /submit/i }));
        await waitFor(() => {
            // Check for specific error messages related to all fields including confirmPassword
            expect(screen.getAllByText(/must be atleast|valid email address|Passwords don't match/i).length).toBeGreaterThan(0);
        });
    });

    it('shows validation error for mismatched passwords', async () => {
        render(<SignUp />);
        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password456' } });
        fireEvent.click(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() => {
            expect(screen.getByText(/Passwords don't match/i)).toBeInTheDocument();
        });
    });

    it('calls authClient.signUp.email and handles success with matching passwords', async () => {
        jest.useFakeTimers();
        (authClient.signUp.email as jest.Mock).mockImplementation((_data, handlers) => {
            if (handlers.onRequest) handlers.onRequest('context');
            if (handlers.onResponse) handlers.onResponse('context');
            void (handlers.onSuccess && handlers.onSuccess('context'));
            return { data: {}, error: null };
        });
        render(<SignUp />);
        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@mail.com' } });
        fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /submit/i }));
        await waitFor(() => {
            expect(authClient.signUp.email).toHaveBeenCalledWith(
                expect.objectContaining({ email: 'john@mail.com', password: 'password123', name: 'John Doe', callbackURL: '/sign-in' }),
                expect.any(Object)
            );
            expect(toast.loading).toHaveBeenCalledWith('Creating your account...', expect.any(Object));
            expect(toast.dismiss).toHaveBeenCalledWith('signup');
            expect(toast.success).toHaveBeenCalledWith('Account created! Redirecting to login...', expect.any(Object));
        });
        // Fast-forward timers to trigger setTimeout
        jest.runAllTimers();
        expect(push).toHaveBeenCalledWith('/sign-in');
        jest.useRealTimers();
    });

    it('handles error from signUp.email handler', async () => {
        (authClient.signUp.email as jest.Mock).mockImplementation((_data, handlers) => {
            if (handlers.onRequest) handlers.onRequest('context');
            if (handlers.onResponse) handlers.onResponse('context');
            if (handlers.onError) handlers.onError('error context');
            return { data: null, error: null };
        });
        render(<SignUp />);
        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@mail.com' } });
        fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /submit/i }));
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                'error context',
                expect.any(Object)
            );
        });
    });

    it('handles error from signUp.email handler with non-string context', async () => {
        (authClient.signUp.email as jest.Mock).mockImplementation((_data, handlers) => {
            if (handlers.onRequest) handlers.onRequest('context');
            if (handlers.onResponse) handlers.onResponse('context');
            if (handlers.onError) handlers.onError({ foo: 'bar' }); // non-string context
            return { data: null, error: null };
        });
        render(<SignUp />);
        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@mail.com' } });
        fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /submit/i }));
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                'Failed to create account. Please try again.',
                expect.any(Object)
            );
        });
    });

    it('handles error returned from signUp.email response with no message', async () => {
        (authClient.signUp.email as jest.Mock).mockResolvedValue({ data: null, error: {} });
        render(<SignUp />);
        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@mail.com' } });
        fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /submit/i }));
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Something went wrong during signup', expect.any(Object));
        });
    });

    it('renders sign-in link', () => {
        render(<SignUp />);
        const link = screen.getByRole('link', { name: /sign in/i });
        expect(link).toHaveAttribute('href', '/sign-in');
    });
});
