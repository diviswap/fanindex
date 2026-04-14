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
      ref={cardRef as React.RefObject<HTMLDivElement>}
      data-share-card
      style={{
        width: 1080,
        height: 1350,
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

      <div style={{ padding: "48px 56px", position: "relative", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header: logo + type badge */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 40 }}>
          {/* Brand section */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/fi-logo.png"
              alt="FanIndex"
              style={{ width: 48, height: 48, borderRadius: 12, objectFit: "contain", flexShrink: 0 }}
            />
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#f9fafb", letterSpacing: -0.5 }}>FanIndex</div>
              <div style={{ fontSize: 12, color: "#4b5563", fontWeight: 500, letterSpacing: 0.5 }}>fanindex.pro</div>
            </div>
          </div>
          {/* Type badge */}
          <div style={{
            fontSize: 13, fontWeight: 700, letterSpacing: 0.8,
            color: accent, background: `${accent}15`,
            border: `1.5px solid ${accent}40`,
            borderRadius: 20, padding: "8px 20px",
            textTransform: "uppercase",
          }}>
            {typeLabels[index.type] ?? "Index"}
          </div>
        </div>

        {/* Index name - prominent */}
        <div style={{ fontSize: 56, fontWeight: 800, color: "#f9fafb", letterSpacing: -2, lineHeight: 1.1, marginBottom: 16 }}>
          {index.name}
        </div>

        {/* Description */}
        <div style={{ fontSize: 16, color: "#6b7280", lineHeight: 1.6, maxWidth: 800, marginBottom: 48 }}>
          {index.description}
        </div>

        {/* Key metrics grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 48 }}>
          {showPrice && (
            <div style={{ padding: "24px 0", borderBottom: "1px solid #1f2937" }}>
              <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Current Price</div>
              <div style={{ fontSize: 40, fontWeight: 800, color: "#10b981", letterSpacing: -1, fontVariantNumeric: "tabular-nums" }}>
                {Number(price).toFixed(4)}
              </div>
              <div style={{ fontSize: 16, color: "#4b5563", fontWeight: 600, marginTop: 4 }}>CHZ</div>
            </div>
          )}
          {showApy && (
            <div style={{ padding: "24px 0", borderBottom: "1px solid #1f2937" }}>
              <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Annual APY</div>
              <div style={{ fontSize: 40, fontWeight: 800, color: "#10b981", letterSpacing: -1 }}>{index.apy}</div>
            </div>
          )}
          <div style={{ padding: "24px 0", borderBottom: "1px solid #1f2937" }}>
            <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Total Holders</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: "#f9fafb", letterSpacing: -1 }}>{index.holders}</div>
          </div>
          <div style={{ padding: "24px 0", borderBottom: "1px solid #1f2937" }}>
            <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Composition</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: "#f9fafb", letterSpacing: -1 }}>{index.tokens.length}</div>
            <div style={{ fontSize: 16, color: "#4b5563", fontWeight: 600, marginTop: 4 }}>Tokens</div>
          </div>
        </div>

        {/* Token pills section */}
        {showTokens && index.tokens.length > 0 && (
          <div>
            <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>Index Composition</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {index.tokens.slice(0, 10).map((t) => (
                <span key={t} style={{
                  fontSize: 13, fontWeight: 700, color: "#9ca3af",
                  background: "#161616", border: "1.5px solid #252525",
                  borderRadius: 12, padding: "8px 16px", letterSpacing: 0.3,
                }}>
                  {t}
                </span>
              ))}
              {index.tokens.length > 10 && (
                <span style={{
                  fontSize: 13, fontWeight: 700, color: "#6b7280",
                  background: "#161616", border: "1.5px solid #252525",
                  borderRadius: 12, padding: "8px 16px",
                }}>
                  +{index.tokens.length - 10} more
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
