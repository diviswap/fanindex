import { FAN_TOKENS } from "@/lib/data/fan-tokens"

interface PositionShareCardProps {
  holding: {
    tokenId: bigint
    indexName: string
  }
  totalValueCHZ: number
  tokenRows: Array<{ symbol: string; name: string; amount: number; valueInCHZ: number }>
  isDark?: boolean
  cardRef: React.RefObject<HTMLDivElement | null>
}

export function PositionShareCard({
  holding,
  totalValueCHZ,
  tokenRows,
  isDark = true,
  cardRef,
}: PositionShareCardProps) {
  const colors = isDark
    ? {
        backgroundGradient: "linear-gradient(160deg, #111114 0%, #0a0a0a 60%, #0c0f0c 100%)",
        text: "#f9fafb",
        subtext: "#9ca3af",
        muted: "#4b5563",
        border: "#1f2937",
        cardBg: "#111827",
        cardBorder: "#1f2937",
        divider: "#1f2937",
        pillBg: "#111827",
        pillBorder: "#374151",
        pillText: "#d1d5db",
        footerBg: "#050505",
      }
    : {
        backgroundGradient: "linear-gradient(160deg, #f8fafc 0%, #ffffff 60%, #f0fdf4 100%)",
        text: "#111827",
        subtext: "#4b5563",
        muted: "#9ca3af",
        border: "#e5e7eb",
        cardBg: "#f9fafb",
        cardBorder: "#e5e7eb",
        divider: "#e5e7eb",
        pillBg: "#f3f4f6",
        pillBorder: "#d1d5db",
        pillText: "#374151",
        footerBg: "#f9fafb",
      }

  const accent = "#10b981"

  // Resolve token icons
  const rowsWithIcons = tokenRows.map((row) => ({
    ...row,
    icon: FAN_TOKENS.find((t) => t.symbol === row.symbol)?.icon ?? null,
  }))

  return (
    <div
      ref={cardRef as React.RefObject<HTMLDivElement>}
      data-share-card
      style={{
        width: 1080,
        height: 1080,
        background: colors.backgroundGradient,
        borderRadius: 0,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: 8, background: `linear-gradient(90deg, ${accent} 0%, ${accent}80 50%, transparent 100%)`, flexShrink: 0 }} />

      {/* Glow */}
      <div style={{
        position: "absolute", top: -160, right: -160, width: 560, height: 560,
        background: `radial-gradient(circle, ${accent}22 0%, transparent 65%)`,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -120, left: -120, width: 400, height: 400,
        background: `radial-gradient(circle, ${accent}12 0%, transparent 65%)`,
        pointerEvents: "none",
      }} />

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "64px 72px 0 72px", position: "relative" }}>

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/fi-logo.png"
              alt="FanIndex"
              crossOrigin="anonymous"
              style={{ width: 52, height: 52, borderRadius: 12, objectFit: "contain", flexShrink: 0 }}
            />
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: colors.text, letterSpacing: -0.5 }}>FanIndex</div>
              <div style={{ fontSize: 14, color: colors.subtext, fontWeight: 500 }}>fanindex.pro</div>
            </div>
          </div>
          <div style={{
            fontSize: 14, fontWeight: 700, letterSpacing: 1.2,
            color: accent, background: `${accent}18`, border: `1.5px solid ${accent}50`,
            borderRadius: 100, padding: "10px 24px", textTransform: "uppercase",
          }}>
            My Position
          </div>
        </div>

        {/* Index name */}
        <div style={{ fontSize: 56, fontWeight: 900, color: colors.text, letterSpacing: -2, lineHeight: 1.05, marginBottom: 12 }}>
          {holding.indexName}
        </div>
        <div style={{ fontSize: 18, color: colors.subtext, marginBottom: 40 }}>
          NFT #{holding.tokenId.toString().slice(-4)}
        </div>

        {/* Total value box */}
        <div style={{
          background: isDark ? `${accent}10` : `${accent}08`,
          border: `2px solid ${accent}40`,
          borderRadius: 20,
          padding: "32px 40px",
          marginBottom: 44,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 14, color: colors.muted, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Total Position Value</div>
            <div style={{ fontSize: 56, fontWeight: 900, color: accent, letterSpacing: -2, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
              {totalValueCHZ.toFixed(2)}
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: `${accent}80`, letterSpacing: -0.5 }}>CHZ</div>
        </div>

        {/* Token rows */}
        <div>
          <div style={{ fontSize: 13, color: colors.muted, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 18 }}>
            Composition
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {rowsWithIcons.slice(0, 5).map((token, idx) => (
              <div key={token.symbol} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "18px 0",
                borderBottom: idx < Math.min(rowsWithIcons.length, 5) - 1 ? `1px solid ${colors.divider}` : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  {token.icon && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={token.icon}
                      alt={token.symbol}
                      crossOrigin="anonymous"
                      style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                    />
                  )}
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: colors.text }}>{token.name}</div>
                    <div style={{ fontSize: 14, color: colors.subtext, fontWeight: 500 }}>{token.symbol}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: accent, fontVariantNumeric: "tabular-nums" }}>
                    {token.valueInCHZ.toFixed(2)} CHZ
                  </div>
                  <div style={{ fontSize: 13, color: colors.muted, marginTop: 2 }}>
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
        padding: "28px 72px",
        marginTop: "auto",
        borderTop: `1px solid ${colors.divider}`,
        background: colors.footerBg,
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
          <span style={{ fontSize: 16, color: colors.subtext, fontWeight: 600 }}>Powered by Chiliz Chain</span>
        </div>
        <span style={{ fontSize: 16, color: colors.subtext, fontWeight: 700, letterSpacing: -0.3 }}>fanindex.pro</span>
      </div>
    </div>
  )
}
