module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const { endpoint, ...body } = req.body;
  const API_KEY = process.env.REACT_APP_APOLLO_API_KEY;

  if (!API_KEY) return res.status(500).json({ error: "Apollo API key not configured" });

  try {
    const response = await fetch("https://api.apollo.io/api/v1/" + endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
