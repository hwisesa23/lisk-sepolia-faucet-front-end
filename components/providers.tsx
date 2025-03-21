"use client"

import type React from "react"

import { WagmiConfig, createConfig, configureChains } from "wagmi"
import { publicProvider } from "wagmi/providers/public"
import { sepolia } from "wagmi/chains"
import { injected, metaMask, walletConnect } from "wagmi/connectors"

// Configure chains and providers
const { chains, publicClient, webSocketPublicClient } = configureChains([sepolia], [publicProvider()])

// Create wagmi config
const config = createConfig({
  autoConnect: true,
  connectors: [
    metaMask({ chains }),
    walletConnect({
      chains,
      options: {
        projectId: "YOUR_PROJECT_ID", // Replace with your WalletConnect project ID
      },
    }),
    injected({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
})

export function Providers({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>
}

