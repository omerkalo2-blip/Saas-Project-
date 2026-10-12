
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const perPage = req.query.per_page || 50;
    const r = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=ils&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=false&price_change_percentage=24h,7d`);
    if (!r.ok) throw new Error(`Coingecko status ${r.status}`);
    const data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.status(200).json(data);
  } catch (e:any) {
    res.status(500).json({ error: e?.message || 'fetch failed' });
  }
}
