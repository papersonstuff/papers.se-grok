'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import { SessionProvider, useSession } from 'next-auth/react';  // Add SessionProvider

function MainContent() {
  const { data: session, status } = useSession();
  const [allNews, setAllNews] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('all');

  if (status === 'loading') return <p>Loading session...</p>;
  if (!session) {
    window.location.href = '/api/auth/signin';
    return <p>Redirecting to sign-in...</p>;
  }

  useEffect(() => {
    const fetchAndDisplay = async () => {
      try {
        const data = await fetchNews();
        setAllNews(data.items.map(item => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })));
      } catch (error) {
        showError();
      }
    };

    fetchAndDisplay();
    setupCategoryTabs();
    const fetchInterval = setInterval(fetchAndDisplay, 60000);
    const timestampInterval = setInterval(updateTimestamps, 60000);

    return () => {
      clearInterval(fetchInterval);
      clearInterval(timestampInterval);
    };
  }, []);

  useEffect(() => {
    displayNews();
  }, [allNews, currentCategory]); // Re-display when data or category changes

  async function fetchNews() {
    const response = await fetch('./news.json?ts=' + new Date().getTime());
    if (!response.ok) throw new Error('Failed to load news');
    return response.json();
  }

  // ... Your other functions (setupCategoryTabs, displayNews, createNewsCard, etc.)

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Papers.se - AI News Aggregator</title>
      </Head>

      <header>
        {/* Your header HTML */}
      </header>

      <nav className="categories">
        {/* Your nav HTML */}
      </nav>

      <main className="container">
        <div id="newsContainer" className="news-grid">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Fetching latest AI news...</p>
          </div>
        </div>
      </main>

      <style jsx global>{`
        /* Your CSS */
      `}</style>
    </>
  );
}

export default function Home() {
  return (
    <SessionProvider>
      <MainContent />
    </SessionProvider>
  );
}
