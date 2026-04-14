interface PortfolioShareCardProps {
  totalValue: number
  nftValue: number
  chzBalance: number
  fanTokensValue: number
  positionsCount: number
  walletAddress?: string
  cardRef: React.RefObject<HTMLDivElement | null>
}

export function PortfolioShareCard({
  totalValue,
  nftValue,
  chzBalance,
  fanTokensValue,
  positionsCount,
  walletAddress,
  cardRef,
}: PortfolioShareCardProps) {
  const accent = "#10b981"
  const shortAddr = walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : null

  // Calculate percentages
  const nftPct = totalValue > 0 ? Math.round((nftValue / totalValue) * 100) : 0
  const chzPct = totalValue > 0 ? Math.round((chzBalance / totalValue) * 100) : 0
  const tokensPct = totalValue > 0 ? Math.round((fanTokensValue / totalValue) * 100) : 0

  return (
    <div
      ref={cardRef as React.RefObject<HTMLDivElement>}
      data-share-card
      style={{
        width: 1080,
        height: 1080,
        background: "linear-gradient(135deg, #0c0c0c 0%, #0f0f0f 100%)",
        borderRadius: 32,
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
      <div style={{ height: 6, background: `linear-gradient(90deg, ${accent}, ${accent}44, transparent)` }} />

      {/* Subtle grid texture overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle at 1px 1px, #ffffff06 1px, transparent 0)",
        backgroundSize: "40px 40px",
        pointerEvents: "none",
      }} />

      {/* Glows */}
      <div style={{
        position: "absolute", top: -200, right: -200, width: 600, height: 600,
        background: `radial-gradient(circle, ${accent}12 0%, transparent 60%)`,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -150, left: -150, width: 500, height: 500,
        background: "radial-gradient(circle, #10b98110 0%, transparent 60%)",
        pointerEvents: "none",
      }} />

      <div style={{ padding: "48px 56px", position: "relative", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/fi-logo.png"
              alt="FanIndex"
              style={{ width: 40, height: 40, borderRadius: 8, objectFit: "contain", flexShrink: 0 }}
            />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#f9fafb", letterSpacing: -0.3 }}>FanIndex</div>
              <div style={{ fontSize: 10, color: "#4b5563", fontWeight: 500, letterSpacing: 0.5 }}>fanindex.pro</div>
            </div>
          </div>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 0.8,
            color: accent, background: `${accent}15`,
            border: `1.5px solid ${accent}40`,
            borderRadius: 16, padding: "6px 14px",
            textTransform: "uppercase",
          }}>
            My Portfolio
          </div>
        </div>

        {/* Portfolio title */}
        <div style={{ fontSize: 40, fontWeight: 800, color: "#f9fafb", letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 8 }}>
          My Portfolio
        </div>
        {shortAddr && (
          <div style={{ fontSize: 12, color: "#6b7280", fontFamily: "monospace", marginBottom: 20 }}>
            {shortAddr}
          </div>
        )}

        {/* Total value highlight */}
        <div style={{
          background: `linear-gradient(135deg, ${accent}10 0%, ${accent}05 100%)`,
          border: `1.5px solid ${accent}25`,
          borderRadius: 16,
          padding: "20px 24px",
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>Total Portfolio Value</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: accent, letterSpacing: -0.8, fontVariantNumeric: "tabular-nums" }}>
            {totalValue.toFixed(2)}
          </div>
          <div style={{ fontSize: 13, color: "#4b5563", fontWeight: 600, marginTop: 3 }}>CHZ</div>
          <div style={{ fontSize: 11, color: "#4b5563", fontWeight: 600, marginTop: 6 }}>{positionsCount} active position{positionsCount !== 1 ? "s" : ""}</div>
        </div>

        {/* Breakdown grid */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12 }}>Portfolio Breakdown</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {/* NFT Positions */}
            <div style={{
              background: "#161616",
              border: "1.5px solid #252525",
              borderRadius: 12,
              padding: "16px 18px",
            }}>
              <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 6 }}>NFT Positions</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: accent, letterSpacing: -0.6, fontVariantNumeric: "tabular-nums" }}>
                {nftValue.toFixed(2)}
              </div>
              <div style={{ fontSize: 11, color: "#4b5563", fontWeight: 600, marginTop: 6 }}>{nftPct}% of portfolio</div>
            </div>

            {/* CHZ Balance */}
            <div style={{
              background: "#161616",
              border: "1.5px solid #252525",
              borderRadius: 12,
              padding: "16px 18px",
            }}>
              <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 6 }}>CHZ Balance</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#3b82f6", letterSpacing: -0.6, fontVariantNumeric: "tabular-nums" }}>
                {chzBalance.toFixed(2)}
              </div>
              <div style={{ fontSize: 11, color: "#4b5563", fontWeight: 600, marginTop: 6 }}>{chzPct}% of portfolio</div>
            </div>

            {/* Fan Tokens */}
            <div style={{
              background: "#161616",
              border: "1.5px solid #252525",
              borderRadius: 12,
              padding: "16px 18px",
              gridColumn: "1 / -1",
            }}>
              <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 6 }}>Fan Tokens Holdings</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#a855f7", letterSpacing: -0.6, fontVariantNumeric: "tabular-nums" }}>
                {fanTokensValue.toFixed(2)}
              </div>
              <div style={{ fontSize: 11, color: "#4b5563", fontWeight: 600, marginTop: 6 }}>{tokensPct}% of portfolio</div>
            </div>
          </div>

          {/* Allocation bar */}
          <div style={{ marginTop: "auto" }}>
            <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", gap: 2 }}>
              {nftValue > 0 && (
                <div style={{ flex: nftValue, background: accent, borderRadius: 4 }} />
              )}
              {chzBalance > 0 && (
                <div style={{ flex: chzBalance, background: "#3b82f6", borderRadius: 4 }} />
              )}
              {fanTokensValue > 0 && (
                <div style={{ flex: fanTokensValue, background: "#a855f7", borderRadius: 4 }} />
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
                <div style={{ width: 6, height: 6, borderRadius: 1, background: accent, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, truncate: true }}>NFTs ({nftPct}%)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
                <div style={{ width: 6, height: 6, borderRadius: 1, background: "#3b82f6", flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, truncate: true }}>CHZ ({chzPct}%)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
                <div style={{ width: 6, height: 6, borderRadius: 1, background: "#a855f7", flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, truncate: true }}>Tokens ({tokensPct}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "24px 56px",
        borderTop: "1px solid #161616",
        background: "linear-gradient(180deg, rgba(15,15,15,0) 0%, rgba(10,10,10,1) 100%)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
          <span style={{ fontSize: 13, color: "#4b5563", fontWeight: 600 }}>Powered by Chiliz Chain</span>
        </div>
        <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>fanindex.pro</span>
      </div>
    </div>
  )
}
