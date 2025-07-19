'use client';

import { useSearchParams } from 'next/navigation';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Unknown error';

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Sign-In Error</h1>
      <p>Error: {error}</p>
      <p>Please try signing in again or contact support if it persists.</p>
      <a href="/auth/signin" style={{ color: 'blue' }}>Go Back to Sign-In</a>
    </div>
  );
}
