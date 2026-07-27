// Fully synthetic — no real fund terms are represented.

export function getFundFactSheet(): Record<string, unknown> {
  return {
    fundName: "Meridian Capital Partners, L.P.",
    strategy: "Diversified multi-asset growth strategy across public equities, fixed income, and select alternatives.",
    inceptionDate: "2018-07-01",
    domicile: "Delaware, United States",
    managementFee: "2.0% annually",
    performanceFee: "20% over an 8% hurdle, with a high-water mark",
    minimumInvestment: "$1,000,000",
    redemptionTerms: "Quarterly redemptions with 90 days' written notice",
    lockUp: "12-month initial lock-up from date of subscription",
  }
}

export function getPerformanceSummary(): Record<string, unknown> {
  return {
    asOf: "2026-06-30",
    ytdReturnPercent: 6.8,
    oneYearReturnPercent: 11.4,
    threeYearAnnualizedReturnPercent: 9.2,
    sinceInceptionAnnualizedReturnPercent: 8.6,
    note: "Fund-level performance only. Figures are illustrative and net of fees.",
  }
}
