// Fully synthetic — no real counterparty relationships are represented.

export type CounterpartyRole = "Prime Broker" | "Custodian" | "Derivatives Counterparty" | "Fund Administrator"

interface Counterparty {
  name: string
  role: CounterpartyRole
  creditRating: string
  exposurePercentOfNav: number
  relationshipSince: string
  notes: string
}

const COUNTERPARTIES: Counterparty[] = [
  { name: "Harbor Point Prime Services", role: "Prime Broker", creditRating: "A+", exposurePercentOfNav: 34.2, relationshipSince: "2019", notes: "Primary margin financing and securities lending relationship." },
  { name: "Cascadia Trust Bank", role: "Custodian", creditRating: "AA-", exposurePercentOfNav: 61.8, relationshipSince: "2018", notes: "Sole custodian for all fund assets." },
  { name: "Northfield Derivatives Group", role: "Derivatives Counterparty", creditRating: "A", exposurePercentOfNav: 8.5, relationshipSince: "2021", notes: "ISDA counterparty for interest-rate and FX hedges." },
  { name: "Ridgeline Fund Services", role: "Fund Administrator", creditRating: "N/A", exposurePercentOfNav: 0, relationshipSince: "2018", notes: "NAV calculation, investor recordkeeping, and reporting administrator." },
]

export function listCounterparties(): Record<string, unknown>[] {
  return COUNTERPARTIES.map((c) => ({
    name: c.name,
    role: c.role,
    creditRating: c.creditRating,
    exposurePercentOfNav: c.exposurePercentOfNav,
  }))
}

export function getCounterpartyExposure(name: string): Record<string, unknown> {
  const match = COUNTERPARTIES.find((c) => c.name.toLowerCase().includes(name.trim().toLowerCase()))
  if (!match) return { error: `No counterparty found matching "${name}".` }
  return { ...match }
}
