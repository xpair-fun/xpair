import type { NextApiRequest, NextApiResponse } from 'next';

// Server-side only - API key never exposed to client
const ONCHAIN_API_KEY = 'onchain_adac1c6e671516677ea8301eec15eea1ab3eab28129176e9fdbc4c9fe6b79a4c';
const ONCHAIN_API_URL = 'https://api.onchain.fi/v1';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { endpoint } = req.query;

  if (!endpoint || Array.isArray(endpoint)) {
    return res.status(400).json({ error: 'Invalid endpoint' });
  }

  try {
    const url = `${ONCHAIN_API_URL}/${endpoint}`;

    const response = await fetch(url, {
      method: req.method,
      headers: {
        'X-API-Key': ONCHAIN_API_KEY,
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    const responseText = await response.text();

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      return res.status(response.status).send(responseText);
    }

    res.status(response.status).json(data);
  } catch (error: any) {
    res.status(500).json({
      error: 'Onchain.fi request failed',
      message: error.message,
    });
  }
}
