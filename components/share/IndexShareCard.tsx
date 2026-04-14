import type { IndexData } from "@/components/indices/IndexCard"

interface IndexShareCardProps {
  index: IndexData
  livePrice?: string
  liveAPY?: string
  showPrice?: boolean
  showTokens?: boolean
  showApy?: boolean
  cardRef: React.RefObject<HTMLDivElement | null>
}

export function IndexShareCard({
  index,
  livePrice,
  liveAPY,
  showPrice = true,
  showTokens = true,
  showApy = true,
  cardRef,
}: IndexShareCardProps) {
  const price = livePrice ?? index.price
  const apy = liveAPY ?? index.apy

  // Detect theme from system preference or DOM
  const isDark = typeof window !== 'undefined' 
    ? window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true
    : true

  // Color scheme adapts to light/dark mode
  const colors = isDark ? {
    background: "linear-gradient(135deg, #0c0c0c 0%, #0f0f0f 100%)",
    text: "#f9fafb",
    muted: "#6b7280",
    border: "#1a1a1a",
    subtle: "#ffffff06",
    grid: "radial-gradient(circle at 1px 1px, #ffffff06 1px, transparent 0)",
    divider: "#1f2937",
    cardBg: "#161616",
    cardBorder: "#252525",
  } : {
    background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
    text: "#1f2937",
    muted: "#6b7280",
    border: "#e5e7eb",
    subtle: "#00000006",
    grid: "radial-gradient(circle at 1px 1px, #00000003 1px, transparent 0)",
    divider: "#d1d5db",
    cardBg: "#e5e7eb",
    cardBorder: "#d1d5db",
  }

  const typeColors: Record<string, string> = {
    weighted: "#3b82f6",
    equal: "#a855f7",
    managed: "#10b981",
  }
  const accent = typeColors[index.type] ?? "#10b981"

  const typeLabels: Record<string, string> = {
    weighted: "Weighted",
    equal: "Equal-Weight",
    managed: "Managed",
  }

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
        {/* Header: logo + type badge */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
          {/* Brand section */}
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
          {/* Type badge */}
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 0.8,
            color: accent, background: `${accent}15`,
            border: `1.5px solid ${accent}40`,
            borderRadius: 16, padding: "6px 14px",
            textTransform: "uppercase",
          }}>
            {typeLabels[index.type] ?? "Index"}
          </div>
        </div>

        {/* Index name - prominent */}
        <div style={{ fontSize: 44, fontWeight: 800, color: colors.text, letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 12 }}>
          {index.name}
        </div>

        {/* Description */}
        <div style={{ fontSize: 13, color: colors.muted, lineHeight: 1.5, maxWidth: 800, marginBottom: 28 }}>
          {index.description}
        </div>

        {/* Key metrics grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
          {showPrice && (
            <div style={{ paddingBottom: 16, borderBottom: `1px solid ${colors.divider}` }}>
              <div style={{ fontSize: 10, color: colors.muted, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>Current Price</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#10b981", letterSpacing: -0.8, fontVariantNumeric: "tabular-nums" }}>
                {Number(price).toFixed(4)}
              </div>
              <div style={{ fontSize: 12, color: colors.muted, fontWeight: 600, marginTop: 3 }}>CHZ</div>
            </div>
          )}
          {showApy && (
            <div style={{ paddingBottom: 16, borderBottom: `1px solid ${colors.divider}` }}>
              <div style={{ fontSize: 10, color: colors.muted, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>Annual APY</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#10b981", letterSpacing: -0.8 }}>{apy}</div>
            </div>
          )}
          <div style={{ paddingBottom: 16, borderBottom: `1px solid ${colors.divider}` }}>
            <div style={{ fontSize: 10, color: colors.muted, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>Total Holders</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: colors.text, letterSpacing: -0.8 }}>{index.holders}</div>
          </div>
          <div style={{ paddingBottom: 16, borderBottom: `1px solid ${colors.divider}` }}>
            <div style={{ fontSize: 10, color: colors.muted, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>Composition</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: colors.text, letterSpacing: -0.8 }}>{index.tokens.length}</div>
            <div style={{ fontSize: 12, color: colors.muted, fontWeight: 600, marginTop: 3 }}>Tokens</div>
          </div>
        </div>

        {/* Token pills section */}
        {showTokens && index.tokens.length > 0 && (
          <div style={{ marginTop: "auto" }}>
            <div style={{ fontSize: 10, color: colors.muted, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12 }}>Index Composition</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {index.tokens.slice(0, 8).map((t) => (
                <span key={t} style={{
                  fontSize: 12, fontWeight: 700, color: colors.muted,
                  background: colors.cardBg, 
                  border: `1.5px solid ${colors.cardBorder}`,
                  borderRadius: 10, padding: "6px 12px", letterSpacing: 0.2,
                }}>
                  {t}
                </span>
              ))}
              {index.tokens.length > 8 && (
                <span style={{
                  fontSize: 12, fontWeight: 700, color: colors.muted,
                  background: colors.cardBg,
                  border: `1.5px solid ${colors.cardBorder}`,
                  borderRadius: 10, padding: "6px 12px",
                }}>
                  +{index.tokens.length - 8}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "24px 56px",
        borderTop: `1px solid ${colors.divider}`,
        background: isDark
          ? "linear-gradient(180deg, rgba(15,15,15,0) 0%, rgba(10,10,10,1) 100%)"
          : "linear-gradient(180deg, rgba(243,244,246,0) 0%, rgba(249,250,251,1) 100%)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
          <span style={{ fontSize: 13, color: colors.muted, fontWeight: 600 }}>Powered by Chiliz Chain</span>
        </div>
        <span style={{ fontSize: 13, color: colors.muted, fontWeight: 600 }}>fanindex.pro</span>
      </div>
    </div>
  )
}
