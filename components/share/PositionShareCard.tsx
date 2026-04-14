interface TokenRow {
  symbol: string
  name: string
  amount: number
  valueInCHZ: number
}

interface PositionShareCardProps {
  tokenId: string
  indexName: string
  totalValueCHZ: number
  tokenRows: TokenRow[]
  walletAddress?: string
  showComposition?: boolean
  showWallet?: boolean
  cardRef: React.RefObject<HTMLDivElement | null>
}

export function PositionShareCard({
  tokenId,
  indexName,
  totalValueCHZ,
  tokenRows,
  walletAddress,
  showComposition = true,
  showWallet = false,
  cardRef,
}: PositionShareCardProps) {
  const shortAddr = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : null

  const displayRows = tokenRows.slice(0, 4)

  // Allocation bar segments
  const total = displayRows.reduce((s, r) => s + r.valueInCHZ, 0)
  const barColors = ["#10b981", "#3b82f6", "#a855f7", "#f59e0b"]

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
        position: "absolute", top: -80, right: -80, width: 300, height: 300,
        background: "radial-gradient(circle, #10b9810e 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      <div style={{ padding: "28px 32px 0", position: "relative", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/fi-logo.png"
              alt="FanIndex"
              style={{ width: 32, height: 32, borderRadius: 8, objectFit: "contain" }}
            />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#f9fafb", letterSpacing: -0.3 }}>FanIndex</div>
              <div style={{ fontSize: 10, color: "#4b5563", fontWeight: 500, letterSpacing: 0.5 }}>fanindex.pro</div>
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
            }}>NFT #{tokenId}</div>
          </div>
        </div>

        {/* Position label */}
        <div style={{ fontSize: 10, color: "#4b5563", fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>
          My Position
        </div>

        {/* Name + value */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#f9fafb", letterSpacing: -0.8, lineHeight: 1.15, maxWidth: 280 }}>
            {indexName}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>Total Value</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#10b981", letterSpacing: -1.2, fontVariantNumeric: "tabular-nums" }}>
              {totalValueCHZ > 0 ? totalValueCHZ.toFixed(2) : "--"}
              <span style={{ fontSize: 15, fontWeight: 600, color: "#4b9c6b", marginLeft: 5 }}>CHZ</span>
            </div>
          </div>
        </div>

        {/* Allocation bar */}
        {showComposition && displayRows.length > 0 && total > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", height: 4, borderRadius: 2, overflow: "hidden", gap: 2 }}>
              {displayRows.map((row, i) => (
                <div key={row.symbol} style={{
                  flex: row.valueInCHZ / total,
                  background: barColors[i],
                  borderRadius: 2,
                }} />
              ))}
            </div>
          </div>
        )}

        {/* Composition table */}
        {showComposition && displayRows.length > 0 && (
          <div style={{
            background: "#111111",
            borderRadius: 14,
            border: "1px solid #1c1c1c",
            overflow: "hidden",
            marginBottom: 24,
          }}>
            {displayRows.map((row, i) => (
              <div key={row.symbol} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 16px",
                borderBottom: i < displayRows.length - 1 ? "1px solid #161616" : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: barColors[i],
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#e5e7eb" }}>{row.symbol}</span>
                  <span style={{ fontSize: 11, color: "#4b5563" }}>{row.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ fontSize: 12, color: "#6b7280", fontFamily: "monospace" }}>
                    {row.amount > 0 ? row.amount.toFixed(3) : "--"}
                  </span>
                  {row.valueInCHZ > 0 && (
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#10b981", fontFamily: "monospace", minWidth: 72, textAlign: "right" }}>
                      {row.valueInCHZ.toFixed(2)} CHZ
                    </span>
                  )}
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
            <span style={{ fontSize: 11, color: "#374151", fontWeight: 500 }}>fanindex.pro</span>
      </div>
    </div>
  )
}
