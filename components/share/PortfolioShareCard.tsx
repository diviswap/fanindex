interface PortfolioShareCardProps {
  totalValue: number
  nftValue: number
  chzBalance: number
  fanTokensValue: number
  positionsCount: number
  walletAddress?: string
  isDark?: boolean
  cardRef: React.RefObject<HTMLDivElement | null>
}

export function PortfolioShareCard({
  totalValue,
  nftValue,
  chzBalance,
  fanTokensValue,
  positionsCount,
  walletAddress,
  isDark = true,
  cardRef,
}: PortfolioShareCardProps) {
  const colors = isDark
    ? {
        backgroundGradient: "linear-gradient(160deg, #111114 0%, #0a0a0a 60%, #0c0f0c 100%)",
        text: "#f9fafb",
        subtext: "#9ca3af",
        muted: "#4b5563",
        divider: "#1f2937",
        cardBg: "#111827",
        cardBorder: "#1f2937",
        footerBg: "#050505",
      }
    : {
        backgroundGradient: "linear-gradient(160deg, #f8fafc 0%, #ffffff 60%, #f0fdf4 100%)",
        text: "#111827",
        subtext: "#4b5563",
        muted: "#9ca3af",
        divider: "#e5e7eb",
        cardBg: "#f9fafb",
        cardBorder: "#e5e7eb",
        footerBg: "#f9fafb",
      }

  const accent = "#10b981"
  const blueAccent = "#3b82f6"
  const purpleAccent = "#a855f7"
  const shortAddr = walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : null

  const nftPct = totalValue > 0 ? Math.round((nftValue / totalValue) * 100) : 0
  const chzPct = totalValue > 0 ? Math.round((chzBalance / totalValue) * 100) : 0
  const tokensPct = totalValue > 0 ? Math.round((fanTokensValue / totalValue) * 100) : 0

  const segments: { value: number; color: string; label: string; pct: number }[] = [
    { value: nftValue, color: accent, label: "NFT Positions", pct: nftPct },
    { value: chzBalance, color: blueAccent, label: "CHZ Balance", pct: chzPct },
    { value: fanTokensValue, color: purpleAccent, label: "Fan Tokens", pct: tokensPct },
  ].filter((s) => s.value > 0)

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
      <div style={{ height: 8, background: `linear-gradient(90deg, ${accent} 0%, ${blueAccent}80 50%, ${purpleAccent}40 100%)`, flexShrink: 0 }} />

      {/* Glow */}
      <div style={{
        position: "absolute", top: -160, right: -160, width: 560, height: 560,
        background: `radial-gradient(circle, ${accent}18 0%, transparent 65%)`,
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
            My Portfolio
          </div>
        </div>

        {/* Title + address */}
        <div style={{ fontSize: 56, fontWeight: 900, color: colors.text, letterSpacing: -2, lineHeight: 1.05, marginBottom: 8 }}>
          My Portfolio
        </div>
        {shortAddr && (
          <div style={{ fontSize: 16, color: colors.subtext, fontFamily: "monospace", marginBottom: 36 }}>
            {shortAddr}
          </div>
        )}
        {!shortAddr && <div style={{ marginBottom: 36 }} />}

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
            <div style={{ fontSize: 14, color: colors.muted, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Total Portfolio Value</div>
            <div style={{ fontSize: 56, fontWeight: 900, color: accent, letterSpacing: -2, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
              {totalValue.toFixed(2)}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: `${accent}80`, letterSpacing: -0.5 }}>CHZ</div>
            <div style={{ fontSize: 16, color: colors.muted, marginTop: 8 }}>
              {positionsCount} position{positionsCount !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Breakdown grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[
            { label: "NFT Positions", value: nftValue, color: accent, pct: nftPct },
            { label: "CHZ Balance", value: chzBalance, color: blueAccent, pct: chzPct },
            { label: "Fan Tokens", value: fanTokensValue, color: purpleAccent, pct: tokensPct },
          ].map(({ label, value, color, pct }) => (
            <div key={label} style={{
              background: colors.cardBg,
              border: `1.5px solid ${colors.cardBorder}`,
              borderRadius: 16,
              padding: "22px 24px",
            }}>
              <div style={{ fontSize: 12, color: colors.muted, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color, letterSpacing: -0.6, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
                {value.toFixed(2)}
              </div>
              <div style={{ fontSize: 14, color: colors.muted, fontWeight: 500, marginTop: 4 }}>CHZ</div>
              <div style={{ fontSize: 13, color, fontWeight: 700, marginTop: 8 }}>{pct}%</div>
            </div>
          ))}
        </div>

        {/* Allocation bar */}
        {segments.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <div style={{ display: "flex", height: 10, borderRadius: 6, overflow: "hidden", gap: 3 }}>
              {segments.map(({ value, color, label }) => (
                <div key={label} style={{ flex: value, background: color, borderRadius: 6 }} />
              ))}
            </div>
            <div style={{ display: "flex", gap: 24, marginTop: 14 }}>
              {segments.map(({ color, label, pct }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: colors.subtext, fontWeight: 600 }}>{label} ({pct}%)</span>
                </div>
              ))}
            </div>
          </div>
        )}
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
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: accent, boxShadow: `0 0 8px ${accent}` }} />
          <span style={{ fontSize: 16, color: colors.subtext, fontWeight: 600 }}>Powered by Chiliz Chain</span>
        </div>
        <span style={{ fontSize: 16, color: colors.subtext, fontWeight: 700, letterSpacing: -0.3 }}>fanindex.pro</span>
      </div>
    </div>
  )
}
