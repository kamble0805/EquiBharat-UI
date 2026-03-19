import { AuthPageForm } from '@/components/auth/AuthPageForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign In - EquiBharat',
    description: 'Sign in to access your account',
};

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-32 bg-background">
            <AuthPageForm initialMode="login" />
        </div>
    );
}
