export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const API_KEY = process.env.REACT_APP_APOLLO_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: "REACT_APP_APOLLO_API_KEY not set" });

  try {
    const { endpoint, ...body } = req.body;
    if (!endpoint) return res.status(400).json({ error: "Missing endpoint" });

    // For api_search endpoints, params go as query string, not body
    const isApiSearch = endpoint.includes("api_search");
    let url = `https://api.apollo.io/api/v1/${endpoint}`;
    let fetchBody = null;

    if (isApiSearch) {
      // Build query string from params
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(body)) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(`${key}[]`, v));
        } else if (value !== null && value !== undefined) {
          params.append(key, String(value));
        }
      }
      const qs = params.toString();
      if (qs) url += `?${qs}`;
      console.log(`[Apollo Proxy] GET-style POST ${url}`);
    } else {
      fetchBody = JSON.stringify(body);
      console.log(`[Apollo Proxy] POST ${url} body: ${fetchBody.substring(0, 500)}`);
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": API_KEY,
      },
      ...(fetchBody ? { body: fetchBody } : {}),
    });

    const text = await response.text();
    console.log(`[Apollo Proxy] Status: ${response.status}`);
    console.log(`[Apollo Proxy] Response: ${text.substring(0, 800)}`);

    let data;
    try { data = JSON.parse(text); }
    catch (e) {
      return res.status(response.status).json({
        error: "Non-JSON response from Apollo",
        status: response.status,
        body: text.substring(0, 300),
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
    return res.status(500).json({ error: "Proxy crash: " + err.message });
  }
}
