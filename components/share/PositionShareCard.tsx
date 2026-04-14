interface PositionShareCardProps {
  holding: {
    tokenId: bigint
    indexName: string
  }
  totalValueCHZ: number
  tokenRows: Array<{ symbol: string; name: string; amount: number; valueInCHZ: number }>
  cardRef: React.RefObject<HTMLDivElement | null>
}

export function PositionShareCard({
  holding,
  totalValueCHZ,
  tokenRows,
  cardRef,
}: PositionShareCardProps) {
  // Detect theme from system preference
  const isDark = typeof window !== 'undefined' 
    ? window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true
    : true

  const colors = isDark ? {
    background: "linear-gradient(135deg, #0c0c0c 0%, #0f0f0f 100%)",
    text: "#f9fafb",
    muted: "#6b7280",
    border: "#1a1a1a",
    grid: "radial-gradient(circle at 1px 1px, #ffffff06 1px, transparent 0)",
    cardBg: "#161616",
    cardBorder: "#252525",
  } : {
    background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
    text: "#1f2937",
    muted: "#6b7280",
    border: "#e5e7eb",
    grid: "radial-gradient(circle at 1px 1px, #00000003 1px, transparent 0)",
    cardBg: "#e5e7eb",
    cardBorder: "#d1d5db",
  }

  const accent = "#10b981"

  return (
    <div
      ref={cardRef as React.RefObject<HTMLDivElement>}
      data-share-card
      style={{
        width: 1080,
        height: 1080,
        background: colors.background,
        borderRadius: 32,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
        border: `1px solid ${colors.border}`,
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: 6, background: `linear-gradient(90deg, ${accent}, ${accent}44, transparent)` }} />

      {/* Subtle grid texture overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: colors.grid,
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
        background: isDark
          ? "radial-gradient(circle, #10b98110 0%, transparent 60%)"
          : "radial-gradient(circle, #10b98108 0%, transparent 60%)",
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
              <div style={{ fontSize: 14, fontWeight: 700, color: colors.text, letterSpacing: -0.3 }}>FanIndex</div>
              <div style={{ fontSize: 10, color: colors.muted, fontWeight: 500, letterSpacing: 0.5 }}>fanindex.pro</div>
            </div>
          </div>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 0.8,
            color: accent, background: `${accent}15`,
            border: `1.5px solid ${accent}40`,
            borderRadius: 16, padding: "6px 14px",
            textTransform: "uppercase",
          }}>
            My Position
          </div>
        </div>

        {/* Position title */}
        <div style={{ fontSize: 40, fontWeight: 800, color: colors.text, letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 8 }}>
          {holding.indexName}
        </div>
        <div style={{ fontSize: 13, color: colors.muted, marginBottom: 20 }}>
          NFT Position #{holding.tokenId.toString().slice(-4)}
        </div>

        {/* Total value highlight */}
        <div style={{
          background: `linear-gradient(135deg, ${accent}10 0%, ${accent}05 100%)`,
          border: `1.5px solid ${accent}25`,
          borderRadius: 16,
          padding: "20px 24px",
          marginBottom: 28,
        }}>
          <div style={{ fontSize: 10, color: colors.muted, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>Total Position Value</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: accent, letterSpacing: -0.8, fontVariantNumeric: "tabular-nums" }}>
            {totalValueCHZ.toFixed(2)}
          </div>
          <div style={{ fontSize: 13, color: colors.muted, fontWeight: 600, marginTop: 3 }}>CHZ</div>
        </div>

        {/* Token breakdown section */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: colors.muted, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12 }}>Position Composition</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 180, overflowY: "auto" }}>
            {tokenRows.map((token) => (
              <div key={token.symbol} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                paddingBottom: 12, borderBottom: `1px solid ${isDark ? "#1f2937" : "#d1d5db"}`,
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, marginBottom: 2 }}>{token.name}</div>
                  <div style={{ fontSize: 11, color: colors.muted, fontWeight: 500 }}>{token.symbol}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: accent, fontVariantNumeric: "tabular-nums" }}>
                    {token.valueInCHZ.toFixed(2)}
                  </div>
                  <div style={{ fontSize: 11, color: colors.muted, fontWeight: 500, marginTop: 1 }}>
                    {token.amount.toFixed(0)} tokens
                  </div>
                </div>
              </div>
            ))}
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
