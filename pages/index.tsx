import Link from 'next/link'
import type { GetServerSideProps } from 'next'
import MetricCard from '../components/MetricCard'
import PriceChart from '../components/PriceChart'

type Quote = {
  c: number; // current price
  h: number; // high
  l: number; // low
  o: number; // open
  pc: number; // previous close
}

export default function Home({ quote }: { quote: Quote }) {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold">BMNR Analytics (MVP)</h1>
        <p className="text-sm text-gray-600 mt-1">Data source: Finnhub (proxy). Mock data used if no API key provided.</p>
      </header>

      <main className="max-w-4xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard title="Current Price" value={`$${quote.c.toFixed(2)}`} />
        <MetricCard title="Day High" value={`$${quote.h.toFixed(2)}`} />
        <MetricCard title="Day Low" value={`$${quote.l.toFixed(2)}`} />

        <div className="col-span-1 md:col-span-3 bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium">Price Chart</h2>
          <PriceChart data={[quote.pc, quote.o, quote.l, quote.h, quote.c]} />
          <div className="mt-3 text-sm text-gray-500">
            <Link href="/treasury/BMNR">View symbol details</Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/quote?symbol=BMNR`)
  const quote = await res.json()
  return { props: { quote } }
}