'use client';

import { useState } from 'react';

export default function Subscribe() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/subscribe', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to create checkout');
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Subscribe error:', error);
      alert('Error starting subscription. Try again.');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Subscribe to Papers.se</h1>
      <p>Access all AI news for 9.99 SEK/month.</p>
      <button onClick={handleSubscribe} disabled={loading}>
        {loading ? 'Loading...' : 'Subscribe Now'}
      </button>
    </div>
  );
}
