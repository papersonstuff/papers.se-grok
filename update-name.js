const fs = require('fs');
const OpenAI = require('openai');

async function main() {
    try {
        // Calculate date for last hour
        const fromDate = new Date(Date.now() - 3600000 * 60).toISOString().slice(0, 10);  // YYYY-MM-DD
        const newsUrl = `https://newsapi.org/v2/everything?q="artificial intelligence" OR AI&from=${fromDate}&sortBy=publishedAt&language=en&pageSize=20&apiKey=${process.env.NEWSAPI_KEY}`;
        const newsResponse = await fetch(newsUrl);
        if (!newsResponse.ok) throw new Error('News API error');
        const newsData = await newsResponse.json();
        const articles = newsData.articles || [];

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const processedNews = [];
        for (const article of articles) {
            // Skip if not AI related or bad data
            if (!article.title || !article.description || !article.publishedAt) continue;

            const prompt = `Summarize this AI-related news in 2-3 sentences: ${article.title} - ${article.description}
