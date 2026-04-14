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

  return (
    <div
      ref={cardRef}
      data-share-card
      style={{
        width: 600,
        height: 314,
        background: "linear-gradient(135deg, #0a0a0a 0%, #111111 60%, #0f1a12 100%)",
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
      {/* Background glow */}
      <div style={{
        position: "absolute", top: -80, right: -80, width: 300, height: 300,
        background: "radial-gradient(circle, #10b98114 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Top row */}
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
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {showWallet && shortAddr && (
            <span style={{ fontSize: 11, color: "#6b7280", fontFamily: "monospace" }}>{shortAddr}</span>
          )}
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 0.4,
            color: "#10b981", background: "#10b98118",
            border: "1px solid #10b98140",
            borderRadius: 20, padding: "4px 12px",
          }}>NFT #{tokenId}</span>
        </div>
      </div>

      {/* Position name + value */}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>
          My Position
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#ffffff", letterSpacing: -0.6, maxWidth: 300, lineHeight: 1.2 }}>
            {indexName}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase" }}>Total Value</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#10b981", letterSpacing: -1 }}>
              {totalValueCHZ > 0 ? totalValueCHZ.toFixed(2) : "--"} CHZ
            </div>
          </div>
        </div>
      </div>

      {/* Composition */}
      {showComposition && displayRows.length > 0 && (
        <div style={{ marginTop: 14, background: "#ffffff08", borderRadius: 12, border: "1px solid #1f2937", overflow: "hidden" }}>
          {displayRows.map((row, i) => (
            <div key={row.symbol} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "7px 14px",
              borderBottom: i < displayRows.length - 1 ? "1px solid #1f2937" : "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#10b98120", border: "1px solid #10b98140", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 9, fontWeight: 800, color: "#10b981" }}>{row.symbol.slice(0, 2)}</span>
                </div>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#e5e7eb" }}>{row.symbol}</span>
                  <span style={{ fontSize: 11, color: "#6b7280", marginLeft: 6 }}>{row.name}</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", fontFamily: "monospace" }}>
                  {row.amount > 0 ? row.amount.toFixed(3) : "--"}
                </span>
                {row.valueInCHZ > 0 && (
                  <span style={{ fontSize: 11, color: "#10b981", fontFamily: "monospace", marginLeft: 10 }}>
                    {row.valueInCHZ.toFixed(2)} CHZ
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 12, borderTop: "1px solid #1f2937" }}>
        <span style={{ fontSize: 11, color: "#4b5563", fontWeight: 500 }}>fanindex.xyz</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
          <span style={{ fontSize: 11, color: "#4b5563", fontWeight: 500 }}>Powered by Chiliz</span>
        </div>
      </div>
    </div>
  )
}
