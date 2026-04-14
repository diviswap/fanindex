interface PortfolioShareCardProps {
  totalValue: number
  nftValue: number
  chzBalance: number
  fanTokensValue: number
  positionsCount: number
  walletAddress?: string
  showWallet?: boolean
  showBreakdown?: boolean
  cardRef: React.RefObject<HTMLDivElement | null>
}

export function PortfolioShareCard({
  totalValue,
  nftValue,
  chzBalance,
  fanTokensValue,
  positionsCount,
  walletAddress,
  showWallet = false,
  showBreakdown = true,
  cardRef,
}: PortfolioShareCardProps) {
  const shortAddr = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : null

  // Build allocation bars
  const segments = [
    { label: "Index NFTs", value: nftValue, color: "#10b981" },
    { label: "CHZ", value: chzBalance, color: "#f59e0b" },
    { label: "Fan Tokens", value: fanTokensValue, color: "#ec4899" },
  ].filter((s) => s.value > 0)

  const total = segments.reduce((s, seg) => s + seg.value, 0)

  return (
    <div
      ref={cardRef}
      data-share-card
      style={{
        width: 600,
        height: 314,
        background: "linear-gradient(135deg, #0a0a0a 0%, #111111 60%, #0f1712 100%)",
        borderRadius: 20,
        padding: "32px 40px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Glows */}
      <div style={{
        position: "absolute", top: -60, right: -60, width: 280, height: 280,
        background: "radial-gradient(circle, #10b98112 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -60, left: -60, width: 200, height: 200,
        background: "radial-gradient(circle, #f59e0b0a 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #10b981, #059669)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 16, fontWeight: 900, color: "#000", letterSpacing: -1 }}>F</span>
          </div>
          <span style={{ color: "#ffffff", fontWeight: 700, fontSize: 15, letterSpacing: -0.3 }}>FanIndex</span>
        </div>
        {showWallet && shortAddr && (
          <span style={{ fontSize: 12, color: "#6b7280", fontFamily: "monospace" }}>{shortAddr}</span>
        )}
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: 0.4,
          color: "#10b981", background: "#10b98118",
          border: "1px solid #10b98140",
          borderRadius: 20, padding: "4px 12px",
        }}>My Portfolio</span>
      </div>

      {/* Total Value */}
      <div style={{ marginTop: 18 }}>
        <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.9, marginBottom: 4 }}>
          Total Portfolio Value
        </div>
        <div style={{ fontSize: 44, fontWeight: 900, color: "#10b981", letterSpacing: -2, lineHeight: 1 }}>
          {totalValue.toFixed(2)}
          <span style={{ fontSize: 22, fontWeight: 600, color: "#4b9c6b", marginLeft: 8 }}>CHZ</span>
        </div>
        <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
          {positionsCount} active position{positionsCount !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Breakdown */}
      {showBreakdown && segments.length > 0 && (
        <div style={{ marginTop: 16 }}>
          {/* Stacked bar */}
          <div style={{ display: "flex", height: 6, borderRadius: 3, overflow: "hidden", gap: 2 }}>
            {segments.map((seg) => (
              <div key={seg.label} style={{
                flex: total > 0 ? seg.value / total : 1,
                background: seg.color,
                borderRadius: 3,
              }} />
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
            {segments.map((seg) => (
              <div key={seg.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: seg.color }} />
                <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>{seg.label}</span>
                <span style={{ fontSize: 11, color: "#e5e7eb", fontWeight: 700, fontFamily: "monospace" }}>
                  {seg.value.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid #1f2937" }}>
        <span style={{ fontSize: 11, color: "#4b5563", fontWeight: 500 }}>fanindex.xyz</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
          <span style={{ fontSize: 11, color: "#4b5563", fontWeight: 500 }}>Powered by Chiliz</span>
        </div>
      </div>
    </div>
  )
}
