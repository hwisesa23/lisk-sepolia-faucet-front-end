"use client"

import { useState } from "react"
import { ExternalLink, Copy, Check, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ChainOverview() {
  const [copied, setCopied] = useState<string | null>(null)
  const [networkAdded, setNetworkAdded] = useState(false)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const addNetwork = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install MetaMask to add this network.")
      return
    }

    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x106A", // 4202 in hex
            chainName: "Lisk Sepolia",
            nativeCurrency: {
              name: "Sepolia Ether",
              symbol: "ETH",
              decimals: 18,
            },
            rpcUrls: ["https://rpc.sepolia-api.lisk.com"],
            blockExplorerUrls: ["https://sepolia-blockscout.lisk.com"],
          },
        ],
      })
      setNetworkAdded(true)
      setTimeout(() => setNetworkAdded(false), 3000)
    } catch (error) {
      console.error("Error adding network:", error)
    }
  }

  return (
    <div className="rounded-lg border border-gray-700 p-6 bg-gray-900/90">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-100">Chain Overview</h2>
        <Button variant="outline" size="sm" onClick={addNetwork} disabled={networkAdded}>
          {networkAdded ? (
            <>
              <Check className="h-4 w-4 mr-2 text-gray-100" />
              Added
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add to MetaMask
            </>
          )}
        </Button>
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-medium text-gray-300">Network Name</h3>
            <button
              onClick={() => copyToClipboard("Lisk Sepolia", "network")}
              className="text-gray-400 hover:text-gray-200 transition"
            >
              {copied === "network" ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-gray-100 font-mono">Lisk Sepolia</p>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-medium text-gray-300">RPC URL</h3>
            <button
              onClick={() => copyToClipboard("https://rpc.sepolia-api.lisk.com", "rpc")}
              className="text-gray-400 hover:text-gray-200 transition"
            >
              {copied === "rpc" ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-gray-100 font-mono truncate">https://rpc.sepolia-api.lisk.com</p>
            <a
              href="https://rpc.sepolia-api.lisk.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-200 transition"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-medium text-gray-300">Chain ID</h3>
            <button
              onClick={() => copyToClipboard("4202", "chainId")}
              className="text-gray-400 hover:text-gray-200 transition"
            >
              {copied === "chainId" ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-gray-100 font-mono">4202</p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-medium text-gray-300">Currency Symbol</h3>
            <button
              onClick={() => copyToClipboard("ETH", "symbol")}
              className="text-gray-400 hover:text-gray-200 transition"
            >
              {copied === "symbol" ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-gray-100 font-mono">ETH</p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-medium text-gray-300">Block Explorer</h3>
            <button
              onClick={() => copyToClipboard("https://sepolia-blockscout.lisk.com", "explorer")}
              className="text-gray-400 hover:text-gray-200 transition"
            >
              {copied === "explorer" ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-gray-100 font-mono truncate">https://sepolia-blockscout.lisk.com</p>
            <a
              href="https://sepolia-blockscout.lisk.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-200 transition"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

