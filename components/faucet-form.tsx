"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Loader2, Wallet } from "lucide-react"

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
  const [address, setAddress] = useState("")
  const [isRequesting, setIsRequesting] = useState(false)
  const [requestStatus, setRequestStatus] = useState<"idle" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState<string | React.ReactNode>("")
  const [isConnected, setIsConnected] = useState(false)
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  // Check if wallet is already connected on component mount
  useEffect(() => {
    checkIfWalletIsConnected()

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        console.log(accounts)
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

  useEffect(() => {
    setRequestStatus("idle")
  }, [isConnected])

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

  // For direct API request
  // const requestTokensViaAPI = async () => {
  //   setIsRequesting(true)
  //   setRequestStatus("idle")

  //   try {
  //     // Replace with your actual faucet API endpoint
  //     const response = await fetch("/api/faucet", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ address: recipientAddress }),
  //     })

  //     const data = await response.json()

  //     if (response.ok) {
  //       setRequestStatus("success")
  //       setStatusMessage(
  //         <span>
  //           Successfully sent 0.05 ETH to {recipientAddress}. Transaction:{" "}
  //           <a
  //             href={`https://sepolia-blockscout.lisk.com/tx/${data.txHash}`}
  //             target="_blank"
  //             rel="noopener noreferrer"
  //             className="text-gray-200 hover:underline"
  //           >
  //             {data.txHash.slice(0, 10)}...
  //           </a>
  //         </span>,
  //       )
  //     } else {
  //       setRequestStatus("error")
  //       setStatusMessage(data.message || "Failed to request tokens")
  //     }
  //   } catch (error) {
  //     setRequestStatus("error")
  //     setStatusMessage("An error occurred while requesting tokens")
  //     console.error(error)
  //   } finally {
  //     setIsRequesting(false)
  //   }
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    await requestTokensViaAPI()
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <button
                type="submit"
                disabled={isRequesting}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white border-0 p-4"
              >
                {isRequesting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Requesting tokens...
                  </div>
                ) : (
                  "Request 0.01 ETH to Connected Wallet"
                )}
              </button>
            </div>
          </form>
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

      <div
        className={`rounded-md p-4 mt-4 ${
          requestStatus === "idle"
            ? "hidden"
            : requestStatus === "success"
            ? "bg-gray-900 border border-gray-700"
            : "bg-red-950/30 border border-red-900/50"
        }`}
      >
        <p className={requestStatus === "success" ? "text-gray-200" : "text-red-400"}>{statusMessage}</p>
      </div>
    </div>
  )
}

