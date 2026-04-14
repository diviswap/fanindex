import type { NFTHolding } from "@/lib/hooks/use-portfolio-onchain"

interface PositionShareCardProps {
  holding: NFTHolding
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
  const accent = "#10b981"

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
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 40 }}>
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
          <div style={{
            fontSize: 13, fontWeight: 700, letterSpacing: 0.8,
            color: accent, background: `${accent}15`,
            border: `1.5px solid ${accent}40`,
            borderRadius: 20, padding: "8px 20px",
            textTransform: "uppercase",
          }}>
            My Position
          </div>
        </div>

        {/* Position title */}
        <div style={{ fontSize: 56, fontWeight: 800, color: "#f9fafb", letterSpacing: -2, lineHeight: 1.1, marginBottom: 12 }}>
          {holding.indexName}
        </div>
        <div style={{ fontSize: 16, color: "#6b7280", marginBottom: 40 }}>
          NFT Position #{holding.tokenId.toString().slice(-4)}
        </div>

        {/* Total value highlight */}
        <div style={{
          background: `linear-gradient(135deg, ${accent}10 0%, ${accent}05 100%)`,
          border: `1.5px solid ${accent}25`,
          borderRadius: 20,
          padding: "28px 32px",
          marginBottom: 40,
        }}>
          <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Total Position Value</div>
          <div style={{ fontSize: 48, fontWeight: 800, color: accent, letterSpacing: -1, fontVariantNumeric: "tabular-nums" }}>
            {totalValueCHZ.toFixed(2)}
          </div>
          <div style={{ fontSize: 16, color: "#4b5563", fontWeight: 600, marginTop: 4 }}>CHZ</div>
        </div>

        {/* Token breakdown section */}
        <div>
          <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 20 }}>Position Composition</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {tokenRows.map((token) => (
              <div key={token.symbol} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "16px 0", borderBottom: "1px solid #1f2937",
              }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#f9fafb", marginBottom: 4 }}>{token.name}</div>
                  <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>{token.symbol}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: accent, fontVariantNumeric: "tabular-nums" }}>
                    {token.valueInCHZ.toFixed(2)}
                  </div>
                  <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 500, marginTop: 2 }}>
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
