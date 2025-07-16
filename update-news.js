const fs = require('fs');
const OpenAI = require('openai');

async function main() {
    try {
        // Load existing news if it exists
        let existingNews = [];
        if (fs.existsSync('news.json')) {
            const existingData = JSON.parse(fs.readFileSync('news.json', 'utf8'));
            existingNews = existingData.items || [];
        }

        // Calculate date for last hour (or adjust as needed)
        const fromDate = new Date(Date.now() - 3600000 * 1).toISOString();  // Last 1 hour
        const newsUrl = `https://newsapi.org/v2/everything?q="artificial intelligence" OR AI&from=${fromDate}&sortBy=publishedAt&language=en&pageSize=20&apiKey=${process.env.NEWSAPI_KEY}`;
        const newsResponse = await fetch(newsUrl);
        if (!newsResponse.ok) throw new Error('News API error');
        const newsData = await newsResponse.json();
        const articles = newsData.articles || [];

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const processedNews = [];
        const existingUrls = new Set(existingNews.map(item => item.url));  // Track existing URLs to avoid duplicates

        for (const article of articles) {
            // Skip if not AI related, bad data, or duplicate
            if (!article.title || !article.description || !article.publishedAt || existingUrls.has(article.url)) continue;

            const prompt = `Summarize this AI-related news in 2-3 sentences: ${article.title} - ${article.description}
Categorize into EXACTLY ONE of these (lowercase): innovation, research, economy, ethics, applications, startups. If none fit, use "innovation".
Return ONLY JSON: {"category": "example", "summary": "example summary"}`;

            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }
            });

            const result = JSON.parse(completion.choices[0].message.content);

            processedNews.push({
                id: existingNews.length + processedNews.length + 1,
                title: article.title,
                summary: result.summary,
                source: article.source.name || 'Unknown',
                category: result.category,
                timestamp: article.publishedAt,  // ISO string
                url: article.url
            });
        }

        // Combine existing and new, sort by timestamp descending, limit to e.g., 50 items
        const allNews = [...existingNews, ...processedNews]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 50);  // Keep only the latest 50 to prevent unlimited growth

        const finalData = {
            lastUpdate: new Date().toISOString(),
            items: allNews
        };

        fs.writeFileSync('news.json', JSON.stringify(finalData, null, 2));
        console.log('News updated with', processedNews.length, 'new items (total:', allNews.length, ')');
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
