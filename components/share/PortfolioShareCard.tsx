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

  const segments = [
    { label: "Index NFTs", value: nftValue, color: "#10b981" },
    { label: "CHZ Balance", value: chzBalance, color: "#f59e0b" },
    { label: "Fan Tokens", value: fanTokensValue, color: "#a855f7" },
  ].filter((s) => s.value > 0)

  const total = segments.reduce((s, seg) => s + seg.value, 0)

  const statCards = [
    { label: "Index NFTs", value: nftValue, color: "#10b981", bg: "#10b98110" },
    { label: "CHZ Balance", value: chzBalance, color: "#f59e0b", bg: "#f59e0b10" },
    { label: "Fan Tokens", value: fanTokensValue, color: "#a855f7", bg: "#a855f710" },
  ]

  return (
    <div
      ref={cardRef}
      data-share-card
      style={{
        width: 640,
        minHeight: 340,
        background: "#0c0c0c",
        borderRadius: 24,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
        border: "1px solid #1a1a1a",
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: 3, background: "linear-gradient(90deg, #10b981, #10b98144, transparent)" }} />

      {/* Grid texture */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle at 1px 1px, #ffffff05 1px, transparent 0)",
        backgroundSize: "28px 28px",
        pointerEvents: "none",
      }} />

      {/* Glows */}
      <div style={{
        position: "absolute", top: -100, right: -100, width: 350, height: 350,
        background: "radial-gradient(circle, #10b9810d 0%, transparent 65%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -80, left: -80, width: 260, height: 260,
        background: "radial-gradient(circle, #f59e0b08 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      <div style={{ padding: "28px 32px 0", position: "relative", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/fi-logo.png"
              alt="FanIndex"
              style={{ width: 32, height: 32, borderRadius: 8, objectFit: "contain" }}
            />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#f9fafb", letterSpacing: -0.3 }}>FanIndex</div>
              <div style={{ fontSize: 10, color: "#4b5563", fontWeight: 500, letterSpacing: 0.5 }}>fanindex.xyz</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {showWallet && shortAddr && (
              <span style={{ fontSize: 11, color: "#4b5563", fontFamily: "monospace" }}>{shortAddr}</span>
            )}
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
              color: "#10b981", background: "#10b98118",
              border: "1px solid #10b98130",
              borderRadius: 100, padding: "5px 14px",
            }}>My Portfolio</div>
          </div>
        </div>

        {/* Total value hero */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, color: "#4b5563", fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>
            Total Portfolio Value
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 4 }}>
            <div style={{ fontSize: 52, fontWeight: 900, color: "#10b981", letterSpacing: -2.5, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
              {totalValue > 0 ? totalValue.toFixed(2) : "0.00"}
            </div>
            <div style={{ fontSize: 20, fontWeight: 600, color: "#4b9c6b", marginBottom: 6 }}>CHZ</div>
          </div>
          <div style={{ fontSize: 12, color: "#4b5563", fontWeight: 500 }}>
            {positionsCount} active position{positionsCount !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Allocation bar */}
        {showBreakdown && segments.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", height: 5, borderRadius: 3, overflow: "hidden", gap: 3 }}>
              {segments.map((seg) => (
                <div key={seg.label} style={{
                  flex: total > 0 ? seg.value / total : 1,
                  background: seg.color,
                  borderRadius: 3,
                }} />
              ))}
            </div>
          </div>
        )}

        {/* Breakdown stat cards */}
        {showBreakdown && (
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            {statCards.map((s) => (
              <div key={s.label} style={{
                flex: 1,
                background: "#111111",
                border: "1px solid #1c1c1c",
                borderRadius: 12,
                padding: "12px 14px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.color }} />
                  <span style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, letterSpacing: 0.5 }}>{s.label}</span>
                </div>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#e5e7eb", letterSpacing: -0.5, fontVariantNumeric: "tabular-nums" }}>
                  {s.value > 0 ? s.value.toFixed(2) : "0.00"}
                  <span style={{ fontSize: 11, color: "#6b7280", marginLeft: 3, fontWeight: 600 }}>CHZ</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 32px",
        borderTop: "1px solid #161616",
        background: "#0a0a0a",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
          <span style={{ fontSize: 11, color: "#4b5563", fontWeight: 500 }}>Powered by Chiliz Chain</span>
        </div>
        <span style={{ fontSize: 11, color: "#374151", fontWeight: 500 }}>fanindex.xyz</span>
      </div>
    </div>
  )
}
