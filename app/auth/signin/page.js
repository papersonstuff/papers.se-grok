'use client';

import { useState } from 'react';
import { supabaseClient } from '../../../utils/supabase/client'; // Adjust path

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabaseClient.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`, // Callback URL
      },
    });
    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('Magic link sent! Check your email.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSignIn}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Magic Link'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
