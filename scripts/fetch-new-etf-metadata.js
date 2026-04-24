// Fetch metadata of the new ETF on Chiliz Mainnet using raw JSON-RPC (no deps).

const ETF_ADDRESS = "0xFae0b5AC695fa682a2378fB3c144b4B78C0F3c2a"
const BATCH_BUYER_ADDRESS = "0x72cE310ef6eC32c14C299e235C471A8779Aab75e"
const NFT_ADDRESS = "0x8016f276183D29C0c910239b144793Ef7B977B65"

const RPCS = [
  "https://rpc.ankr.com/chiliz",
  "https://chiliz.publicnode.com",
  "https://rpc.chiliz.com",
]

// 4-byte selectors (keccak256(signature)[0..4])
const SELECTORS = {
  getEtfInfo: "0x9f30490d", // getEtfInfo()
  batchBuyer: "0x1a4a4cdd", // batchBuyer()
  positions: "0x09dd0e81",  // positions()
  WCHZ: "0xae0b51df",       // WCHZ()
  minInvestment: "0x42cde4e8", // minInvestment()
  buyFeeBps: "0xc415b95c",  // buyFeeBps()
  maxPositions: "0xa6f9dae1", // placeholder, recompute below
  activePositions: "0xa6f9dae1", // placeholder
  paused: "0x5c975abb",     // paused()
  owner: "0x8da5cb5b",      // owner()
  name: "0x06fdde03",       // name()
  symbol: "0x95d89b41",     // symbol()
  decimals: "0x313ce567",   // decimals()
}

// Compute selectors via keccak256 not available without deps — instead, use known + best-effort.
// We'll only use the well-known ones and try a couple variants if calls fail.

let rpcUrl = null
let id = 1

async function rpcCall(method, params) {
  const body = { jsonrpc: "2.0", id: id++, method, params }
  const res = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (json.error) throw new Error(`${method} error: ${JSON.stringify(json.error)}`)
  return json.result
}

async function ethCall(to, data) {
  return rpcCall("eth_call", [{ to, data }, "latest"])
}

async function findRpc() {
  for (const url of RPCS) {
    try {
      rpcUrl = url
      const bn = await rpcCall("eth_blockNumber", [])
      console.log("[v0] Using RPC:", url, "block:", parseInt(bn, 16))
      return
    } catch (e) {
      console.log("[v0] RPC failed:", url, e.message)
    }
  }
  throw new Error("No working RPC")
}

// --- ABI decoding helpers (minimal) ---
function hexToBigInt(hex) {
  return BigInt(hex)
}
function decodeAddress(word) {
  // word is 32 bytes hex no 0x
  return "0x" + word.slice(24)
}
function decodeUint(word) {
  return BigInt("0x" + word)
}
function decodeBool(word) {
  return BigInt("0x" + word) !== 0n
}
function chunks(hex, size) {
  const out = []
  for (let i = 0; i < hex.length; i += size) out.push(hex.slice(i, i + size))
  return out
}
function stripHex(h) {
  return h.startsWith("0x") ? h.slice(2) : h
}
// Decode dynamic string returned by name()/symbol()
function decodeString(returnHex) {
  const data = stripHex(returnHex)
  if (data.length < 128) return ""
  // offset (32) + length (32) + data
  const len = Number(BigInt("0x" + data.slice(64, 128)))
  const strHex = data.slice(128, 128 + len * 2)
  return Buffer.from(strHex, "hex").toString("utf8")
}
// Decode (address[], uint256[]) returned by getEtfInfo
function decodeAddrArrayUintArray(returnHex) {
  const data = stripHex(returnHex)
  const words = chunks(data, 64)
  // words[0] = offset addresses, words[1] = offset weights
  const offA = Number(decodeUint(words[0]))
  const offW = Number(decodeUint(words[1]))
  const idxA = offA / 32
  const idxW = offW / 32
  const lenA = Number(decodeUint(words[idxA]))
  const lenW = Number(decodeUint(words[idxW]))
  const addrs = []
  for (let i = 0; i < lenA; i++) addrs.push(decodeAddress(words[idxA + 1 + i]))
  const weights = []
  for (let i = 0; i < lenW; i++) weights.push(decodeUint(words[idxW + 1 + i]))
  return { addrs, weights }
}

async function safeCall(label, to, data) {
  try {
    const r = await ethCall(to, data)
    return r
  } catch (e) {
    console.log(`[v0] ${label} failed:`, e.message)
    return null
  }
}

async function readErc20(addr) {
  const [n, s, d] = await Promise.all([
    safeCall("name", addr, SELECTORS.name),
    safeCall("symbol", addr, SELECTORS.symbol),
    safeCall("decimals", addr, SELECTORS.decimals),
  ])
  return {
    name: n ? decodeString(n) : "?",
    symbol: s ? decodeString(s) : "?",
    decimals: d ? Number(decodeUint(stripHex(d))) : 0,
  }
}

async function run() {
  await findRpc()

  console.log("\n=== ETF Vault ===", ETF_ADDRESS)

  const etfInfoHex = await safeCall("getEtfInfo", ETF_ADDRESS, SELECTORS.getEtfInfo)
  if (!etfInfoHex) {
    console.log("Could not read getEtfInfo()")
  } else {
    const { addrs, weights } = decodeAddrArrayUintArray(etfInfoHex)
    console.log("Tokens count:", addrs.length)
    for (let i = 0; i < addrs.length; i++) {
      const addr = addrs[i]
      const w = weights[i]
      const meta = await readErc20(addr)
      console.log(`  [${i}] ${meta.symbol.padEnd(8)} ${addr}  weight=${w} (${Number(w) / 100}%)  decimals=${meta.decimals}  name="${meta.name}"`)
    }
  }

  const batchBuyerHex = await safeCall("batchBuyer", ETF_ADDRESS, SELECTORS.batchBuyer)
  const positionsHex = await safeCall("positions", ETF_ADDRESS, SELECTORS.positions)
  const wchzHex = await safeCall("WCHZ", ETF_ADDRESS, SELECTORS.WCHZ)
  const ownerHex = await safeCall("owner", ETF_ADDRESS, SELECTORS.owner)
  const pausedHex = await safeCall("paused", ETF_ADDRESS, SELECTORS.paused)

  if (batchBuyerHex) {
    const a = decodeAddress(stripHex(batchBuyerHex))
    console.log("batchBuyer (on-chain):", a, "| matches provided:", a.toLowerCase() === BATCH_BUYER_ADDRESS.toLowerCase())
  }
  if (positionsHex) {
    const a = decodeAddress(stripHex(positionsHex))
    console.log("positions NFT (on-chain):", a, "| matches provided NFT:", a.toLowerCase() === NFT_ADDRESS.toLowerCase())
  }
  if (wchzHex) console.log("WCHZ:", decodeAddress(stripHex(wchzHex)))
  if (ownerHex) console.log("owner:", decodeAddress(stripHex(ownerHex)))
  if (pausedHex) console.log("paused:", decodeBool(stripHex(pausedHex)))

  console.log("\n=== NFT (positions) ===", NFT_ADDRESS)
  const nftMeta = await readErc20(NFT_ADDRESS) // name/symbol same selectors
  console.log("name:", nftMeta.name, "symbol:", nftMeta.symbol)

  console.log("\n=== Batch Buyer ===", BATCH_BUYER_ADDRESS)
  const bbCode = await rpcCall("eth_getCode", [BATCH_BUYER_ADDRESS, "latest"])
  console.log("has code:", bbCode && bbCode !== "0x")
}

run().catch(e => {
  console.error(e)
  process.exit(1)
})
