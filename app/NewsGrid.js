'use client';

import { useState, useEffect } from 'react';

export default function NewsGrid({ initialNews }) {
  const [currentCategory, setCurrentCategory] = useState('all');
  const [news, setNews] = useState(initialNews.items || []);
  const [lastUpdate, setLastUpdate] = useState(initialNews.lastUpdate || '');

  useEffect(() => {
    const refreshNews = async () => {
      try {
        const res = await fetch('/news.json?ts=' + new Date().getTime());
        if (res.ok) {
          const data = await res.json();
          setNews(data.items || []);
          setLastUpdate(data.lastUpdate);
        }
      } catch (error) {
        console.error('News refresh error:', error);
      }
    };

    refreshNews();
    const interval = setInterval(refreshNews, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const filteredNews = currentCategory === 'all' ? news : news.filter(item => item.category === currentCategory);

  const categories = ['all', 'innovation', 'research', 'economy', 'ethics', 'applications', 'startups'];

  const getTimeAgo = (timestamp) => {
    const minutes = Math.floor((Date.now() - new Date(timestamp)) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    return 'Over an hour ago';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      innovation: '💡',
      research: '🔬',
      economy: '💰',
      ethics: '⚖️',
      applications: '⚙️',
      startups: '🚀'
    };
    return icons[category] || '📰';
  };

  return (
    <div className="container">
      <header>
        <div className="header-content">
          <h1 className="logo">Papers.se</h1>
          <div className="last-update">
            <div className="update-indicator"></div>
            <span>Last updated: {new Date(lastUpdate).toLocaleTimeString()}</span>
          </div>
        </div>
      </header>

      <nav className="categories">
        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-tab ${currentCategory === cat ? 'active' : ''}`}
              onClick={() => setCurrentCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)} News
            </button>
          ))}
        </div>
      </nav>

      <div className="news-grid">
        {filteredNews.length === 0 ? (
          <div className="empty-state">
            <h3>No news found</h3>
            <p>No articles in this category yet.</p>
          </div>
        ) : (
          filteredNews.map(item => (
            <article key={item.id} className="news-card" onClick={() => window.open(item.url, '_blank')}>
              <div className="news-header">
                <div className="news-source">{item.source}</div>
                <h2 className="news-title">{item.title}</h2>
                <div className="news-meta">
                  <span className="news-time">⏱ {getTimeAgo(item.timestamp)}</span>
                  <span className="news-category">{getCategoryIcon(item.category)} {item.category}</span>
                </div>
              </div>
              <div className="news-content">
                <p className="news-summary">{item.summary}</p>
                <a href={item.url} className="read-more" onClick={e => e.stopPropagation()}>Read more →</a>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Logout button */}
      <button onClick={async () => {
        const { supabaseClient } = await import('../utils/supabase/client');  // Dynamic import if needed
        await supabaseClient.auth.signOut();
        window.location.href = '/auth/signin';
      }}>Logout</button>
    </div>
  );
}
