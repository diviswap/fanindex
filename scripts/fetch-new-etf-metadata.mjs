// Fetch metadata of the new ETF deployed on Chiliz Mainnet
// by calling contract read functions via a public RPC.

import { createPublicClient, http, getAddress } from "viem"
import { chiliz } from "viem/chains"

const ETF_ADDRESS = "0xFae0b5AC695fa682a2378fB3c144b4B78C0F3c2a"
const BATCH_BUYER_ADDRESS = "0x72cE310ef6eC32c14C299e235C471A8779Aab75e"
const NFT_ADDRESS = "0x8016f276183D29C0c910239b144793Ef7B977B65"

const etfAbi = [
  {
    inputs: [],
    name: "getEtfInfo",
    outputs: [
      { internalType: "address[]", name: "tokens", type: "address[]" },
      { internalType: "uint256[]", name: "weights", type: "uint256[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "batchBuyer",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "positions",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minInvestment",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "buyFeeBps",
    outputs: [{ internalType: "uint16", name: "", type: "uint16" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxPositions",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "activePositions",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "WCHZ",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
]

const erc20Abi = [
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
]

const nftAbi = [
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
]

const rpcs = [
  "https://rpc.ankr.com/chiliz",
  "https://chiliz.publicnode.com",
  "https://rpc.chiliz.com",
]

async function run() {
  let client
  for (const url of rpcs) {
    try {
      const c = createPublicClient({ chain: chiliz, transport: http(url) })
      // test
      await c.getBlockNumber()
      client = c
      console.log("[v0] Using RPC:", url)
      break
    } catch (e) {
      console.log("[v0] RPC failed:", url, e.message)
    }
  }
  if (!client) throw new Error("No working RPC")

  console.log("\n=== ETF Vault Metadata ===")
  console.log("Address:", ETF_ADDRESS)

  const [etfInfo, batchBuyer, positions, wchz, minInv, feeBps, maxPos, activePos, paused, owner] =
    await Promise.all([
      client.readContract({ address: ETF_ADDRESS, abi: etfAbi, functionName: "getEtfInfo" }),
      client.readContract({ address: ETF_ADDRESS, abi: etfAbi, functionName: "batchBuyer" }),
      client.readContract({ address: ETF_ADDRESS, abi: etfAbi, functionName: "positions" }),
      client.readContract({ address: ETF_ADDRESS, abi: etfAbi, functionName: "WCHZ" }),
      client.readContract({ address: ETF_ADDRESS, abi: etfAbi, functionName: "minInvestment" }),
      client.readContract({ address: ETF_ADDRESS, abi: etfAbi, functionName: "buyFeeBps" }),
      client.readContract({ address: ETF_ADDRESS, abi: etfAbi, functionName: "maxPositions" }),
      client.readContract({ address: ETF_ADDRESS, abi: etfAbi, functionName: "activePositions" }),
      client.readContract({ address: ETF_ADDRESS, abi: etfAbi, functionName: "paused" }),
      client.readContract({ address: ETF_ADDRESS, abi: etfAbi, functionName: "owner" }),
    ])

  const [tokens, weights] = etfInfo
  console.log("batchBuyer (from contract):", batchBuyer)
  console.log("positions NFT (from contract):", positions)
  console.log("WCHZ:", wchz)
  console.log("minInvestment (wei):", minInv.toString())
  console.log("buyFeeBps:", feeBps)
  console.log("maxPositions:", maxPos.toString())
  console.log("activePositions:", activePos.toString())
  console.log("paused:", paused)
  console.log("owner:", owner)

  console.log("\n=== Provided vs on-chain ===")
  console.log("Provided BATCH_BUYER:", BATCH_BUYER_ADDRESS, "| match:", batchBuyer.toLowerCase() === BATCH_BUYER_ADDRESS.toLowerCase())
  console.log("Provided NFT:        ", NFT_ADDRESS, "| match:", positions.toLowerCase() === NFT_ADDRESS.toLowerCase())

  console.log("\n=== Tokens in ETF ===")
  for (let i = 0; i < tokens.length; i++) {
    const addr = tokens[i]
    const weight = weights[i]
    try {
      const [name, symbol, decimals] = await Promise.all([
        client.readContract({ address: addr, abi: erc20Abi, functionName: "name" }).catch(() => "?"),
        client.readContract({ address: addr, abi: erc20Abi, functionName: "symbol" }).catch(() => "?"),
        client.readContract({ address: addr, abi: erc20Abi, functionName: "decimals" }).catch(() => 0),
      ])
      console.log(`[${i}] ${symbol} (${name}) @ ${addr} — weight: ${weight} (${Number(weight) / 100}%), decimals: ${decimals}`)
    } catch (e) {
      console.log(`[${i}] ${addr} weight: ${weight} — could not read ERC20 info:`, e.message)
    }
  }

  console.log("\n=== NFT contract ===")
  try {
    const [nftName, nftSymbol] = await Promise.all([
      client.readContract({ address: NFT_ADDRESS, abi: nftAbi, functionName: "name" }).catch(() => "?"),
      client.readContract({ address: NFT_ADDRESS, abi: nftAbi, functionName: "symbol" }).catch(() => "?"),
    ])
    console.log("NFT name:", nftName, "symbol:", nftSymbol)
  } catch (e) {
    console.log("Could not read NFT:", e.message)
  }
}

run().catch(e => {
  console.error(e)
  process.exit(1)
})
