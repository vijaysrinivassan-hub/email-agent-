export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const API_KEY = process.env.REACT_APP_APOLLO_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: "REACT_APP_APOLLO_API_KEY not set in environment" });

  try {
    const { endpoint, ...body } = req.body;
    if (!endpoint) return res.status(400).json({ error: "Missing endpoint field in request body" });

    const url = `https://api.apollo.io/api/v1/${endpoint}`;
    console.log(`[Apollo Proxy] POST ${url}`);
    console.log(`[Apollo Proxy] Body: ${JSON.stringify(body).substring(0, 500)}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": API_KEY,
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    console.log(`[Apollo Proxy] Status: ${response.status}`);
    console.log(`[Apollo Proxy] Response: ${text.substring(0, 500)}`);

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(response.status).json({
        error: "Apollo returned non-JSON response",
        status: response.status,
        body: text.substring(0, 200),
      });
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || data.error || "Apollo API error",
        status: response.status,
        details: data,
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("[Apollo Proxy] Crash:", err.message);
    return res.status(500).json({ error: "Proxy error: " + err.message });
  }
}
