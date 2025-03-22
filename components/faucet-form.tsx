"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Loader2, Wallet } from "lucide-react"
import { useRequestFunds } from "@/hooks/use-faucet";

// Add ethereum window interface
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}

export function FaucetForm() {
  const [isConnected, setIsConnected] = useState(false)
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const { requestFunds, isPending, isError, errorMessage, isSuccess } = useRequestFunds();

  // Check if wallet is already connected on component mount
  useEffect(() => {
    console.log(errorMessage?.length)
    checkIfWalletIsConnected()

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setConnectedAddress(accounts[0])
          setIsConnected(true)
        } else {
          setConnectedAddress(null)
          setIsConnected(false)
        }
      })
    }

    return () => {
      // Clean up listeners
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {})
      }
    }
  }, [])

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          setConnectedAddress(accounts[0])
          setIsConnected(true)
        }
      }
    } catch (error) {
      console.error("Error checking if wallet is connected:", error)
    }
  }

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install MetaMask to connect your wallet.")
      return
    }

    setIsConnecting(true)

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      if (accounts.length > 0) {
        setConnectedAddress(accounts[0])
        setIsConnected(true) 
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setIsConnecting(false)
      setRequestStatus("idle")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault
    await requestFunds()
  }

  return (
    <div className="space-y-8">
      {isConnected && connectedAddress ? (
        <>
          <div className="flex justify-between items-start">
            <div>
              <a
                href={`https://sepolia-blockscout.lisk.com/address/${connectedAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-200 hover:underline"
              >
                Connected: {connectedAddress}
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white border-0 p-4"
            >
              {isPending ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Requesting tokens...
                </div>
              ) : (
                "Request 0.01 ETH to Connected Wallet"
              )}
            </button>
          </div>
        </>
      ) : (
        <>
          <div>
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white border-0 p-4"
            >
              {isConnecting ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet
                </div>
              )}
            </button>
          </div>
        </>
      )}

      {errorMessage && (
        <div
          className={`rounded-md p-4 mt-4 text-center ${
            isSuccess
              ? "bg-gray-900 border border-gray-700"
              : "bg-red-950/30 border border-red-900/50"
          }`}
        >
          <p className={isSuccess ? "text-gray-200" : "text-red-400"}>{errorMessage}</p>
        </div>
      )}
    </div>
  )
}

