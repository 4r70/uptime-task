import Parser from 'rss-parser';

const parser = new Parser();

export default async function handler(req, res) {
    const { url } = req.query;

    try {
        const feed = await parser.parseURL(url);
        res.status(200).json({ items: feed.items });
      } catch (error) {
        console.error('Error fetching RSS feed:', error);
        res.status(500).json({ error: 'Failed to fetch RSS feed' });
      }
}
