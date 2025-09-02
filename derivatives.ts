
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const r = await fetch('https://www.deribit.com/api/v2/public/get_book_summary_by_currency?currency=BTC&kind=option');
    const { result } = await r.json();
    const byExpiry: Record<string, {oi:number; count:number}> = {};
    for (const row of result) {
      const exp = (row as any).expiration || (row as any).instrument_name?.split('-')[1];
      const oi = Number((row as any).open_interest) || 0;
      if (!byExpiry[exp]) byExpiry[exp] = {oi:0, count:0};
      byExpiry[exp].oi += oi; byExpiry[exp].count += 1;
    }
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).json({ byExpiry });
  } catch (e:any) {
    res.status(500).json({ error: e?.message || 'fetch failed' });
  }
}
