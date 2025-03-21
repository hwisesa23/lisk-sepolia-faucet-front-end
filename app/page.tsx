import { FaucetForm } from "@/components/faucet-form"
import { ChainOverview } from "@/components/chain-overview"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mt-8 text-white">Lisk Sepolia Testnet Faucet</h1>
        <p className="text-center text-gray-400 mb-8">
          Request Sepolia ETH for testing on the Lisk Sepolia Testnet
        </p>

        <ChainOverview />

        <div className="mt-6 bg-gray-900 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-white">Request Testnet ETH</h2>
          <FaucetForm />
        </div>
      </div>
    </main>
  )
}

