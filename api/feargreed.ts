
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const r = await fetch('https://api.alternative.me/fng/?limit=1&format=json');
    const data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).json({ value: data?.data?.[0]?.value, classification: data?.data?.[0]?.value_classification });
  } catch (e:any) {
    res.status(500).json({ error: e?.message || 'fetch failed' });
  }
}
