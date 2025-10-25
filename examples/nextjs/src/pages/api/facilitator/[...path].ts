import type { NextApiRequest, NextApiResponse } from 'next';

const FACILITATOR_URL = 'https://facilitator.payai.network';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { path } = req.query;
  const endpoint = Array.isArray(path) ? path.join('/') : path;

  try {
    const url = `${FACILITATOR_URL}/${endpoint}`;

    console.log(`Proxying ${req.method} request to: ${url}`);
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    // Forward the request to the facilitator
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    console.log(`Response status: ${response.status}`);

    const responseText = await response.text();
    console.log('Response body:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      return res.status(response.status).send(responseText);
    }

    // Return the response
    res.status(response.status).json(data);
  } catch (error: any) {
    console.error('Facilitator proxy error:', error);
    res.status(500).json({
      error: 'Facilitator request failed',
      message: error.message,
      stack: error.stack,
    });
  }
}
