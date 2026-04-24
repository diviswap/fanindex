import fs from "node:fs"

const ETF = "0xFae0b5AC695fa682a2378fB3c144b4B78C0F3c2a"
const BATCH = "0x72cE310ef6eC32c14C299e235C471A8779Aab75e"
const NFT = "0x8016f276183D29C0c910239b144793Ef7B977B65"
const RPCS = [
  "https://rpc.ankr.com/chiliz",
  "https://chiliz.publicnode.com",
  "https://rpc.chiliz.com",
]

const out = []
const log = (...a) => {
  const line = a.map(x => typeof x === "object" ? JSON.stringify(x) : String(x)).join(" ")
  out.push(line)
  console.log(line)
}

// minimal keccak (not needed - using pre-computed selectors below)
const SEL = {
  name: "0x06fdde03",
  symbol: "0x95d89b41",
  decimals: "0x313ce567",
  totalSupply: "0x18160ddd",
  owner: "0x8da5cb5b",
  paused: "0x5c975abb",
  // common ETF-like getters to try
  getTokens: "0xaa6ca808",      // getTokens()
  tokens0: "0x4f64b2be",         // tokens(uint256) index 0
  weights0: "0x7c3a00fd",        // weights(uint256) index 0
  assets: "0x38d52e0f",          // asset()
  factor: "0xfabc1cbc",          // no-op
}

async function call(rpc, to, data) {
  try {
    const r = await fetch(rpc, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_call", params: [{ to, data }, "latest"] }),
    })
    const j = await r.json()
    if (j.error) return { ok: false, err: j.error.message }
    return { ok: true, data: j.result }
  } catch (e) {
    return { ok: false, err: String(e.message || e) }
  }
}

async function code(rpc, addr) {
  try {
    const r = await fetch(rpc, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_getCode", params: [addr, "latest"] }),
    })
    const j = await r.json()
    return j.result || ""
  } catch (e) { return "" }
}

function decodeString(hex) {
  if (!hex || hex === "0x" || hex.length < 130) return null
  try {
    const data = hex.slice(2)
    const offset = parseInt(data.slice(0, 64), 16) * 2
    const length = parseInt(data.slice(offset, offset + 64), 16) * 2
    const strHex = data.slice(offset + 64, offset + 64 + length)
    return Buffer.from(strHex, "hex").toString("utf-8")
  } catch { return null }
}

function decodeAddressArray(hex) {
  if (!hex || hex === "0x") return null
  try {
    const data = hex.slice(2)
    const offset = parseInt(data.slice(0, 64), 16) * 2
    const length = parseInt(data.slice(offset, offset + 64), 16)
    const result = []
    for (let i = 0; i < length; i++) {
      const word = data.slice(offset + 64 + i * 64, offset + 64 + (i + 1) * 64)
      result.push("0x" + word.slice(24))
    }
    return result
  } catch { return null }
}

function decodeUintArray(hex) {
  if (!hex || hex === "0x") return null
  try {
    const data = hex.slice(2)
    const offset = parseInt(data.slice(0, 64), 16) * 2
    const length = parseInt(data.slice(offset, offset + 64), 16)
    const result = []
    for (let i = 0; i < length; i++) {
      const word = data.slice(offset + 64 + i * 64, offset + 64 + (i + 1) * 64)
      result.push(BigInt("0x" + word).toString())
    }
    return result
  } catch { return null }
}

async function firstWorkingRpc() {
  for (const r of RPCS) {
    const c = await code(r, ETF)
    if (c && c !== "0x") { log("Using RPC:", r); return r }
  }
  return null
}

// Function selectors for common ETF patterns
const SELECTORS = {
  "getTokens()": "0xaa6ca808",
  "getWeights()": "0x6b7fecf8",
  "getComponents()": "0xbca2c199",
  "tokens(uint256)": "0x4f64b2be",
  "components(uint256)": "0xc6dbdf61",
  "positions(uint256)": "0x7c015a89",
  "getPositionData()": "0xb27b25cf",
  "name()": "0x06fdde03",
  "symbol()": "0x95d89b41",
  "totalSupply()": "0x18160ddd",
  "decimals()": "0x313ce567",
  "owner()": "0x8da5cb5b",
  "paused()": "0x5c975abb",
  "nft()": "0x47ccca02",
  "batchBuyer()": "0x8c0a2f72",
  "indexToken()": "0x7da0a877",
  "numberOfTokens()": "0x1f6f83bc",
  "length()": "0x1f7b6d32",
}

async function run() {
  const rpc = await firstWorkingRpc()
  if (!rpc) { log("No working RPC"); return }

  log("\n=== ETF Contract:", ETF, "===")
  const nameRes = await call(rpc, ETF, SELECTORS["name()"])
  if (nameRes.ok) log("name() raw:", nameRes.data, "decoded:", decodeString(nameRes.data))
  const symRes = await call(rpc, ETF, SELECTORS["symbol()"])
  if (symRes.ok) log("symbol() raw:", symRes.data, "decoded:", decodeString(symRes.data))
  const tsRes = await call(rpc, ETF, SELECTORS["totalSupply()"])
  if (tsRes.ok) log("totalSupply():", tsRes.data, "=", tsRes.data === "0x" ? 0 : BigInt(tsRes.data).toString())
  const decRes = await call(rpc, ETF, SELECTORS["decimals()"])
  if (decRes.ok) log("decimals():", decRes.data, "=", decRes.data === "0x" ? 0 : BigInt(decRes.data).toString())
  const ownerRes = await call(rpc, ETF, SELECTORS["owner()"])
  if (ownerRes.ok) log("owner():", ownerRes.data)

  // Try the EtfVault ABI selectors found in the code
  const vaultSelectors = {
    "numTokens": "0x5dbe47e8",
    "getTokens": "0xaa6ca808",
    "getWeights": "0x6b7fecf8",
    "tokenAddresses(uint256)": "0xe355b0f4",
    "tokenWeights(uint256)": "0x3c5c7e19",
  }
  for (const [label, sel] of Object.entries(vaultSelectors)) {
    const r = await call(rpc, ETF, sel)
    if (r.ok && r.data !== "0x") {
      log(`${label}:`, r.data)
      const addrs = decodeAddressArray(r.data)
      if (addrs) log(`  as address[]:`, addrs)
      const uints = decodeUintArray(r.data)
      if (uints) log(`  as uint[]:`, uints)
    }
  }

  // Try numTokens/tokenLength common patterns
  const lengthSelectors = ["0x5dbe47e8", "0x1f6f83bc", "0xa02b161e", "0x949d225d"]
  for (let i = 0; i < 10; i++) {
    const idxHex = i.toString(16).padStart(64, "0")
    const addrCall = "0x4f64b2be" + idxHex  // tokens(uint256)
    const r = await call(rpc, ETF, addrCall)
    if (r.ok && r.data !== "0x" && r.data !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
      log(`tokens(${i}):`, "0x" + r.data.slice(-40))
    } else break
  }

  log("\n=== BatchBuyer Contract:", BATCH, "===")
  const bCode = await code(rpc, BATCH)
  log("has code:", bCode && bCode !== "0x" ? `yes (${bCode.length} chars)` : "no")

  log("\n=== NFT Contract:", NFT, "===")
  const nftName = await call(rpc, NFT, SELECTORS["name()"])
  if (nftName.ok) log("name():", decodeString(nftName.data))
  const nftSym = await call(rpc, NFT, SELECTORS["symbol()"])
  if (nftSym.ok) log("symbol():", decodeString(nftSym.data))

  fs.writeFileSync("/vercel/share/v0-project/scripts/metadata-output.txt", out.join("\n"))
  log("\nWrote output to metadata-output.txt")
}

run().catch(e => log("FATAL:", e.message))
