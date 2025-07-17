"use client"

import { useState, useEffect } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from "wagmi"
import { parseEther } from "viem"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Info } from "lucide-react"
import { competitionVaultABI } from "@/lib/abis"
import { ConnectWallet } from "./connect-wallet"
import { chilizMainnet } from "@/lib/chains"
import { TransactionModal } from "./transaction-modal"
import type { Index } from "@/lib/types"

interface InvestCardProps {
  index: Index
  dict: any
}

export function InvestCard({ index, dict }: InvestCardProps) {
  const { name: indexName, vaultAddress, tokens } = index
  const [amount, setAmount] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { isConnected, chain } = useAccount()
  const { switchChain } = useSwitchChain()
  const { data: hash, writeContract, isPending, error, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  const investDict = dict.invest_card
  const connectDict = dict.connect_wallet

  const handleInvest = () => {
    if (!vaultAddress || !amount) return
    reset() // Reset previous transaction state
    setIsModalOpen(true)
    const value = parseEther(amount)
    writeContract({
      address: vaultAddress,
      abi: competitionVaultABI,
      functionName: "depositAndBuy",
      value: value,
    })
  }

  useEffect(() => {
    if (error && !isModalOpen) {
      setIsModalOpen(true)
    }
  }, [error, isModalOpen])

  const closeModal = () => {
    setIsModalOpen(false)
    // Delay reset to allow modal to close gracefully
    setTimeout(() => {
      if (isConfirmed || error) {
        setAmount("")
        reset()
      }
    }, 300)
  }

  if (!isConnected) {
    return (
      <Card className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl sticky top-24">
        <CardHeader>
          <CardTitle>{investDict.invest_in.replace("{indexName}", indexName)}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-center">
          <p className="text-gray-400 text-center">{investDict.connect_prompt}</p>
          <ConnectWallet dict={connectDict} />
        </CardContent>
      </Card>
    )
  }

  if (chain?.id !== chilizMainnet.id) {
    return (
      <Card className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl sticky top-24">
        <CardHeader>
          <CardTitle>Wrong Network</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-center">
          <Info className="h-8 w-8 text-blue-400" />
          <p className="text-gray-400 text-center">{investDict.wrong_network_prompt}</p>
          <Button onClick={() => switchChain({ chainId: chilizMainnet.id })}>{investDict.switch_network_button}</Button>
        </CardContent>
      </Card>
    )
  }

  if (!vaultAddress) {
    return (
      <Card className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl sticky top-24">
        <CardHeader>
          <CardTitle>Investment Unavailable</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">{investDict.unavailable_prompt}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <TransactionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        hash={hash}
        isConfirming={isConfirming}
        isConfirmed={isConfirmed}
        error={error}
        indexName={indexName}
        tokens={tokens}
        investedAmount={amount}
        dict={dict.transaction_modal}
      />
      <Card className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl sticky top-24">
        <CardHeader>
          <CardTitle>{investDict.invest_in.replace("{indexName}", indexName)}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-2">{investDict.amount_label}</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">CHZ</span>
              <Input
                type="number"
                placeholder="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isPending || isConfirming}
                className="w-full bg-gray-900/50 border-white/20 rounded-md p-2 pl-12 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <Button
            size="lg"
            onClick={handleInvest}
            disabled={!amount || isPending}
            className="w-full bg-green-500 hover:bg-green-600 text-gray-900 font-bold text-base"
          >
            {investDict.buy_button}
          </Button>
        </CardContent>
      </Card>
    </>
  )
}
