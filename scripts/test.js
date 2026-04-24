console.log("[v0] hello from script")
const r = await fetch("https://rpc.ankr.com/chiliz", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_blockNumber", params: [] }),
})
const j = await r.json()
console.log("[v0] block:", j)
