export type Quote = { c: number; h: number; l: number; o: number; pc: number }

const MOCK_QUOTE: Quote = { c: 12.34, h: 12.75, l: 11.98, o: 12.10, pc: 12.00 }

export async function fetchQuote(symbol: string): Promise<Quote> {
  const key = process.env.FINNHUB_API_KEY
  if (!key) {
    // Return mock data for MVP when key is not provided
    return MOCK_QUOTE
  }

  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${key}`
  const resp = await fetch(url)
  if (!resp.ok) throw new Error(`Finnhub: ${resp.status} ${resp.statusText}`)
  const json = await resp.json()
  // Finnhub returns fields: c, h, l, o, pc
  return {
    c: json.c ?? MOCK_QUOTE.c,
    h: json.h ?? MOCK_QUOTE.h,
    l: json.l ?? MOCK_QUOTE.l,
    o: json.o ?? MOCK_QUOTE.o,
    pc: json.pc ?? MOCK_QUOTE.pc,
  }
}