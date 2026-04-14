import { TrendingUp, Users, Zap } from "lucide-react"
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
  const typeLabels: Record<string, string> = {
    weighted: "Weighted Index",
    equal: "Equal-Weight Index",
    managed: "Managed Index",
  }
  const typeColors: Record<string, string> = {
    weighted: "#3b82f6",
    equal: "#a855f7",
    managed: "#10b981",
  }
  const accent = typeColors[index.type] ?? "#10b981"

  return (
    <div
      ref={cardRef}
      data-share-card
      style={{
        width: 600,
        height: 314,
        background: "linear-gradient(135deg, #0a0a0a 0%, #111111 60%, #0f1a12 100%)",
        borderRadius: 20,
        padding: "36px 40px",
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
        background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -60, left: -60, width: 220, height: 220,
        background: "radial-gradient(circle, #10b98112 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Top row: brand + type badge */}
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
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
          color: accent, background: `${accent}18`,
          border: `1px solid ${accent}40`,
          borderRadius: 20, padding: "4px 12px",
        }}>
          {typeLabels[index.type]}
        </span>
      </div>

      {/* Index name + description */}
      <div style={{ marginTop: 18, flex: 1 }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#ffffff", lineHeight: 1.15, letterSpacing: -0.8 }}>
          {index.name}
        </div>
        <div style={{ fontSize: 13, color: "#6b7280", marginTop: 6, lineHeight: 1.4, maxWidth: 420 }}>
          {index.description}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 28, marginTop: 16 }}>
        {showPrice && (
          <div>
            <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase" }}>Price</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#10b981", letterSpacing: -0.5, marginTop: 2 }}>
              {Number(price).toFixed(4)} CHZ
            </div>
          </div>
        )}
        {showApy && (
          <div>
            <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase" }}>APY</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: "#10b981", letterSpacing: -0.5 }}>{index.apy}</span>
            </div>
          </div>
        )}
        <div>
          <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase" }}>Holders</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#ffffff", letterSpacing: -0.5, marginTop: 2 }}>{index.holders}</div>
        </div>
      </div>

      {/* Tokens */}
      {showTokens && (
        <div style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
          {index.tokens.slice(0, 7).map((t) => (
            <span key={t} style={{
              fontSize: 11, fontWeight: 700, color: "#d1d5db",
              background: "#1f2937", border: "1px solid #374151",
              borderRadius: 8, padding: "3px 10px",
            }}>{t}</span>
          ))}
          {index.tokens.length > 7 && (
            <span style={{
              fontSize: 11, fontWeight: 700, color: "#6b7280",
              background: "#1f2937", border: "1px solid #374151",
              borderRadius: 8, padding: "3px 10px",
            }}>+{index.tokens.length - 7}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 18, paddingTop: 14, borderTop: "1px solid #1f2937" }}>
        <span style={{ fontSize: 11, color: "#4b5563", fontWeight: 500 }}>fanindex.xyz</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
          <span style={{ fontSize: 11, color: "#4b5563", fontWeight: 500 }}>Powered by Chiliz</span>
        </div>
      </div>
    </div>
  )
}
