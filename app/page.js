'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();
  const [allNews, setAllNews] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('all');

  if (status === 'loading') return <p>Loading session...</p>;
  if (!session) {
    window.location.href = '/auth/signin';  // Changed to custom page URL
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
        displayNews();
        const lastUpdateEl = document.getElementById('lastUpdate');
        if (lastUpdateEl) {
          lastUpdateEl.textContent = `Last updated: ${new Date(data.lastUpdate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
        }
      } catch (error) {
        showError();
      }
    };

    setupCategoryTabs();
    fetchAndDisplay();
    const fetchInterval = setInterval(fetchAndDisplay, 60000);
    const timestampInterval = setInterval(updateTimestamps, 60000);

    return () => {
      clearInterval(fetchInterval);
      clearInterval(timestampInterval);
    };
  }, [currentCategory]);

  async function fetchNews() {
    const response = await fetch('./news.json?ts=' + new Date().getTime());
    if (!response.ok) throw new Error('Failed to load news');
    return response.json();
  }

  // ... The rest of your original JS functions (setupCategoryTabs, displayNews, createNewsCard, getTimeAgo, getCategoryIcon, updateTimestamps, showError)

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Papers.se - AI News Aggregator</title>
      </Head>

      <header>
        <div className="header-content">
          <h1 className="logo">Papers.se</h1>
          <div className="last-update">
            <div className="update-indicator"></div>
            <span id="lastUpdate">Updating...</span>
          </div>
        </div>
      </header>

      <nav className="categories">
        <div className="category-tabs" id="categoryTabs">
          <button className="category-tab active" data-category="all">All News</button>
          <button className="category-tab" data-category="innovation">Innovation</button>
          <button className="category-tab" data-category="research">Research</button>
          <button className="category-tab" data-category="economy">Economy</button>
          <button className="category-tab" data-category="ethics">Ethics</button>
          <button className="category-tab" data-category="applications">Applications</button>
          <button className="category-tab" data-category="startups">Startups</button>
        </div>
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
        /* Your full original CSS here */
      `}</style>
    </>
  );
}
