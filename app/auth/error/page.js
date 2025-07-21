'use client';

export default function ErrorPage() {
  return (
    <div>
      <h1>Error</h1>
      <p>Something went wrong. Please try signing in again.</p>
      <a href="/auth/signin">Back to Sign In</a>
    </div>
  );
}
