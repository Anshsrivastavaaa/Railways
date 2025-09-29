'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This is a temporary page to redirect users to the dashboard.
export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
       <div className="text-center">
        <p className="text-muted-foreground">Redirecting to dashboard...</p>
      </div>
    </main>
  )
}
