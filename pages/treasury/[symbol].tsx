import { GetServerSideProps } from 'next'
import Link from 'next/link'
import PriceChart from '../../components/PriceChart'

export default function SymbolPage({ symbol, quote }: { symbol: string; quote: any }) {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/">← Back</Link>
        <h1 className="text-3xl font-bold mt-4">{symbol} — Treasury Overview</h1>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-medium">Key Metrics</h2>
            <ul className="mt-3 text-sm text-gray-700 space-y-1">
              <li>Current: ${quote.c.toFixed(2)}</li>
              <li>Open: ${quote.o.toFixed(2)}</li>
              <li>High: ${quote.h.toFixed(2)}</li>
              <li>Low: ${quote.l.toFixed(2)}</li>
              <li>Prev Close: ${quote.pc.toFixed(2)}</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-medium">Price Chart</h2>
            <PriceChart data={[quote.pc, quote.o, quote.l, quote.h, quote.c]} />
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const symbol = ctx.params?.symbol as string
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/quote?symbol=${encodeURIComponent(symbol)}`)
  const quote = await res.json()
  return { props: { symbol, quote } }
}