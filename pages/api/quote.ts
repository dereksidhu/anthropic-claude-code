import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchQuote } from '../../lib/finnhub'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const symbol = (req.query.symbol as string) || 'BMNR'
  try {
    const data = await fetchQuote(symbol)
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: 'failed_to_fetch', message: String(err) })
  }
}