import type { IndexData } from "@/components/indices/IndexCard"
import { FAN_TOKENS } from "@/lib/data/fan-tokens"

interface IndexShareCardProps {
  index: IndexData
  livePrice?: string
  showPrice?: boolean
  showTokens?: boolean
  isDark?: boolean
  cardRef: React.RefObject<HTMLDivElement | null>
}

export function IndexShareCard({
  index,
  livePrice,
  showPrice = true,
  showTokens = true,
  isDark = true,
  cardRef,
}: IndexShareCardProps) {
  const price = livePrice ?? index.price

  const colors = isDark
    ? {
        background: "#0a0a0a",
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
        background: "#ffffff",
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

  // Resolve token logos
  const tokenData = index.tokens.map((symbol) => ({
    symbol,
    icon: FAN_TOKENS.find((t) => t.symbol === symbol)?.icon ?? null,
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

      {/* Glow top-right */}
      <div style={{
        position: "absolute", top: -160, right: -160, width: 560, height: 560,
        background: `radial-gradient(circle, ${accent}22 0%, transparent 65%)`,
        pointerEvents: "none",
      }} />
      {/* Glow bottom-left */}
      <div style={{
        position: "absolute", bottom: -120, left: -120, width: 400, height: 400,
        background: `radial-gradient(circle, ${accent}12 0%, transparent 65%)`,
        pointerEvents: "none",
      }} />

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "64px 72px 0 72px", position: "relative" }}>

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 56 }}>
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
            color: accent,
            background: `${accent}18`,
            border: `1.5px solid ${accent}50`,
            borderRadius: 100, padding: "10px 24px",
            textTransform: "uppercase",
          }}>
            {typeLabels[index.type] ?? "Index"}
          </div>
        </div>

        {/* Index name */}
        <div style={{ fontSize: 64, fontWeight: 900, color: colors.text, letterSpacing: -2.5, lineHeight: 1.05, marginBottom: 20 }}>
          {index.name}
        </div>

        {/* Description */}
        <div style={{ fontSize: 20, color: colors.subtext, lineHeight: 1.55, marginBottom: 52, maxWidth: 860 }}>
          {index.description}
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 0, marginBottom: 52, borderTop: `1px solid ${colors.divider}`, borderBottom: `1px solid ${colors.divider}` }}>
          {showPrice && (
            <div style={{ flex: 1, padding: "28px 32px 28px 0", borderRight: `1px solid ${colors.divider}` }}>
              <div style={{ fontSize: 13, color: colors.muted, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Current Price</div>
              <div style={{ fontSize: 42, fontWeight: 800, color: "#10b981", letterSpacing: -1, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
                {Number(price).toFixed(4)}
              </div>
              <div style={{ fontSize: 16, color: colors.muted, fontWeight: 600, marginTop: 6 }}>CHZ</div>
            </div>
          )}
          <div style={{ flex: 1, padding: "28px 32px", borderRight: `1px solid ${colors.divider}` }}>
            <div style={{ fontSize: 13, color: colors.muted, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Holders</div>
            <div style={{ fontSize: 42, fontWeight: 800, color: colors.text, letterSpacing: -1, lineHeight: 1 }}>{index.holders}</div>
          </div>
          <div style={{ flex: 1, padding: "28px 32px" }}>
            <div style={{ fontSize: 13, color: colors.muted, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Tokens</div>
            <div style={{ fontSize: 42, fontWeight: 800, color: colors.text, letterSpacing: -1, lineHeight: 1 }}>{index.tokens.length}</div>
          </div>
        </div>

        {/* Token composition */}
        {showTokens && tokenData.length > 0 && (
          <div>
            <div style={{ fontSize: 13, color: colors.muted, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 20 }}>
              Composition
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {tokenData.slice(0, 9).map(({ symbol, icon }) => (
                <div key={symbol} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  fontSize: 18, fontWeight: 700, color: colors.pillText,
                  background: colors.pillBg,
                  border: `1.5px solid ${colors.pillBorder}`,
                  borderRadius: 14, padding: "10px 18px",
                }}>
                  {icon && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={icon}
                      alt={symbol}
                      crossOrigin="anonymous"
                      style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                    />
                  )}
                  {symbol}
                </div>
              ))}
              {tokenData.length > 9 && (
                <div style={{
                  display: "flex", alignItems: "center",
                  fontSize: 18, fontWeight: 700, color: colors.muted,
                  background: colors.pillBg, border: `1.5px solid ${colors.pillBorder}`,
                  borderRadius: 14, padding: "10px 18px",
                }}>
                  +{tokenData.length - 9} more
                </div>
              )}
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
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
          <span style={{ fontSize: 16, color: colors.subtext, fontWeight: 600 }}>Powered by Chiliz Chain</span>
        </div>
        <span style={{ fontSize: 16, color: colors.subtext, fontWeight: 700, letterSpacing: -0.3 }}>fanindex.pro</span>
      </div>
    </div>
  )
}
