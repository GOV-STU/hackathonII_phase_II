/**
 * Home page - Authentication entry point.
 * Shows signup/login form as the first screen.
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../services/authApi';
import AuthPage from '../components/AuthPage';

export default function Home() {
  const router = useRouter();

  // Redirect to todos if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/todos');
    }
  }, [router]);

  return <AuthPage />;
}
