'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const res = await signIn('email', {
      email,
      redirect: false,
    });

    setLoading(false);
    if (res.error) {
      setMessage('Error: ' + res.error);
    } else {
      setMessage('Check your email for the sign-in link!');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center' }}>
      <h1>Sign In to Papers.se</h1>
      <p>Enter your email to get a magic link (no password needed).</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
          {loading ? 'Sending...' : 'Sign In with Email'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
