export default async function handler(req, res) {
    const { url } = req.query;
    try {
        const articleResponse = await fetch("https://uptime-mercury-api.azurewebsites.net/webparser", {
            method: 'POST',
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ "url": url })
        });

        const articleData = await articleResponse.json();
        console.log(articleData)
        res.status(200).json({ articleData });
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        res.status(500).json({ error: 'Failed to fetch RSS feed' });
    }
}
