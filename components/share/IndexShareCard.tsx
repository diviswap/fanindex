import type { IndexData } from "@/components/indices/IndexCard"

interface IndexShareCardProps {
  index: IndexData
  livePrice?: string
  showPrice?: boolean
  showTokens?: boolean
  showApy?: boolean
  cardRef: React.RefObject<HTMLDivElement | null>
}

export function IndexShareCard({
  index,
  livePrice,
  showPrice = true,
  showTokens = true,
  showApy = true,
  cardRef,
}: IndexShareCardProps) {
  const price = livePrice ?? index.price

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
      <div style={{ height: 3, background: `linear-gradient(90deg, ${accent}, ${accent}44, transparent)` }} />

      {/* Subtle grid texture overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle at 1px 1px, #ffffff06 1px, transparent 0)",
        backgroundSize: "28px 28px",
        pointerEvents: "none",
      }} />

      {/* Glow */}
      <div style={{
        position: "absolute", top: -100, right: -100, width: 360, height: 360,
        background: `radial-gradient(circle, ${accent}0f 0%, transparent 65%)`,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -80, left: -80, width: 240, height: 240,
        background: "radial-gradient(circle, #10b98108 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      <div style={{ padding: "28px 32px 0", position: "relative" }}>
        {/* Header: logo + badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          {/* Brand */}
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
          {/* Type badge */}
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 0.6,
            color: accent, background: `${accent}18`,
            border: `1px solid ${accent}35`,
            borderRadius: 100, padding: "5px 14px",
          }}>
            {typeLabels[index.type] ?? "Index"}
          </div>
        </div>

        {/* Index name */}
        <div style={{ fontSize: 30, fontWeight: 800, color: "#f9fafb", letterSpacing: -1, lineHeight: 1.1, marginBottom: 8 }}>
          {index.name}
        </div>
        <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5, maxWidth: 480, marginBottom: 24 }}>
          {index.description}
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 0, marginBottom: 24 }}>
          {showPrice && (
            <div style={{ flex: 1, paddingRight: 20, borderRight: "1px solid #1f2937" }}>
              <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Price</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#10b981", letterSpacing: -0.8, fontVariantNumeric: "tabular-nums" }}>
                {Number(price).toFixed(4)}
                <span style={{ fontSize: 13, color: "#4b5563", fontWeight: 600, marginLeft: 4 }}>CHZ</span>
              </div>
            </div>
          )}
          {showApy && (
            <div style={{ flex: 1, paddingLeft: showPrice ? 20 : 0, paddingRight: 20, borderRight: "1px solid #1f2937" }}>
              <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>APY</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#10b981", letterSpacing: -0.8 }}>{index.apy}</div>
            </div>
          )}
          <div style={{ flex: 1, paddingLeft: (showPrice || showApy) ? 20 : 0 }}>
            <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Holders</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#f9fafb", letterSpacing: -0.8 }}>{index.holders}</div>
          </div>
        </div>

        {/* Token pills */}
        {showTokens && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 28 }}>
            {index.tokens.slice(0, 8).map((t) => (
              <span key={t} style={{
                fontSize: 11, fontWeight: 700, color: "#9ca3af",
                background: "#161616", border: "1px solid #252525",
                borderRadius: 6, padding: "4px 10px", letterSpacing: 0.2,
              }}>{t}</span>
            ))}
            {index.tokens.length > 8 && (
              <span style={{
                fontSize: 11, fontWeight: 700, color: "#6b7280",
                background: "#161616", border: "1px solid #252525",
                borderRadius: 6, padding: "4px 10px",
              }}>+{index.tokens.length - 8}</span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: "auto",
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
