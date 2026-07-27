// Fully synthetic — no real fund, client, or capital is represented. See
// SampleDataBanner. Small, fixed dataset (not seeded-random) — this repo's
// data exists only to back real tool calls, not to be browsed as its own
// dashboard.

export type AssetClass = "Equities" | "Fixed Income" | "Alternatives" | "Digital Assets" | "Cash"

interface RawHolding {
  symbol: string
  name: string
  assetClass: AssetClass
  quantity: number
  price: number
  marketValue: number
  unrealizedPLPercent: number
}

const RAW_HOLDINGS: RawHolding[] = [
  { symbol: "AAPL", name: "Apple Inc.", assetClass: "Equities", quantity: 15000, price: 195.4, marketValue: 2_931_000, unrealizedPLPercent: 18.4 },
  { symbol: "MSFT", name: "Microsoft Corp.", assetClass: "Equities", quantity: 8000, price: 415.2, marketValue: 3_321_600, unrealizedPLPercent: 22.1 },
  { symbol: "NVDA", name: "NVIDIA Corp.", assetClass: "Equities", quantity: 20000, price: 118.25, marketValue: 2_365_000, unrealizedPLPercent: 41.7 },
  { symbol: "GOOGL", name: "Alphabet Inc.", assetClass: "Equities", quantity: 10000, price: 178.65, marketValue: 1_786_500, unrealizedPLPercent: 15.2 },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", assetClass: "Equities", quantity: 12000, price: 245.8, marketValue: 2_949_600, unrealizedPLPercent: 12.6 },
  { symbol: "AGG", name: "iShares Core U.S. Aggregate Bond ETF", assetClass: "Fixed Income", quantity: 50000, price: 98.2, marketValue: 4_910_000, unrealizedPLPercent: 1.2 },
  { symbol: "TLT", name: "iShares 20+ Year Treasury Bond ETF", assetClass: "Fixed Income", quantity: 25000, price: 88.5, marketValue: 2_212_500, unrealizedPLPercent: -2.4 },
  { symbol: "GLD", name: "SPDR Gold Shares", assetClass: "Alternatives", quantity: 6000, price: 245.1, marketValue: 1_470_600, unrealizedPLPercent: 27.3 },
  { symbol: "BTC", name: "Bitcoin (spot-equivalent exposure)", assetClass: "Digital Assets", quantity: 18.5, price: 67200, marketValue: 1_243_200, unrealizedPLPercent: 34.9 },
  { symbol: "CASH", name: "Cash & Equivalents", assetClass: "Cash", quantity: 500000, price: 1, marketValue: 500_000, unrealizedPLPercent: 0 },
]

const TOTAL_VALUE = RAW_HOLDINGS.reduce((sum, h) => sum + h.marketValue, 0)

export interface PortfolioSnapshot {
  fundName: string
  asOf: string
  totalValue: number
  totalUnrealizedPLPercent: number
  allocation: { assetClass: AssetClass; percent: number }[]
  topHoldings: { symbol: string; name: string; weight: number; unrealizedPLPercent: number }[]
}

export function getPortfolioSnapshot(): PortfolioSnapshot {
  const byClass = new Map<AssetClass, number>()
  for (const h of RAW_HOLDINGS) byClass.set(h.assetClass, (byClass.get(h.assetClass) ?? 0) + h.marketValue)

  const totalCostBasis = RAW_HOLDINGS.reduce((sum, h) => sum + h.marketValue / (1 + h.unrealizedPLPercent / 100), 0)
  const totalUnrealizedPLPercent = ((TOTAL_VALUE - totalCostBasis) / totalCostBasis) * 100

  return {
    fundName: "Meridian Capital Partners — Illustrative Portfolio",
    asOf: new Date().toISOString().slice(0, 10),
    totalValue: TOTAL_VALUE,
    totalUnrealizedPLPercent: Math.round(totalUnrealizedPLPercent * 100) / 100,
    allocation: Array.from(byClass.entries())
      .map(([assetClass, value]) => ({ assetClass, percent: Math.round((value / TOTAL_VALUE) * 1000) / 10 }))
      .sort((a, b) => b.percent - a.percent),
    topHoldings: RAW_HOLDINGS.slice()
      .sort((a, b) => b.marketValue - a.marketValue)
      .slice(0, 5)
      .map((h) => ({
        symbol: h.symbol,
        name: h.name,
        weight: Math.round((h.marketValue / TOTAL_VALUE) * 1000) / 10,
        unrealizedPLPercent: h.unrealizedPLPercent,
      })),
  }
}

export function getPositionDetail(symbol: string): Record<string, unknown> {
  const holding = RAW_HOLDINGS.find((h) => h.symbol.toUpperCase() === symbol.trim().toUpperCase())
  if (!holding) return { error: `No position found for symbol "${symbol}" in this fund.` }
  return {
    symbol: holding.symbol,
    name: holding.name,
    assetClass: holding.assetClass,
    quantity: holding.quantity,
    price: holding.price,
    marketValue: holding.marketValue,
    weight: Math.round((holding.marketValue / TOTAL_VALUE) * 1000) / 10,
    unrealizedPLPercent: holding.unrealizedPLPercent,
  }
}
