export default function PriceChart({ data }: { data: number[] }) {
  // Simple sparkline SVG for MVP
  const width = 600
  const height = 120
  const max = Math.max(...data)
  const min = Math.min(...data)
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / (max - min || 1)) * height
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="w-full h-32">
      <polyline fill="none" stroke="#4F46E5" strokeWidth={2} points={points} />
    </svg>
  )
}