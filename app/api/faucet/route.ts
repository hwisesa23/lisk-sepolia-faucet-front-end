import { NextResponse } from "next/server"

// This is a mock implementation of the faucet API
export async function POST(request: Request) {
  try {
    const { address } = await request.json()

    // Basic address validation (checks if it's a valid Ethereum address format)
    const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(address)

    if (!address || !isValidAddress) {
      return NextResponse.json({ message: "Invalid Ethereum address" }, { status: 400 })
    }

    // Mock a successful transaction
    // In a real implementation, you would send actual ETH using a private key
    const mockTxHash =
      "0x" +
      Array(64)
        .fill(0)
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("")

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return NextResponse.json({
      success: true,
      txHash: mockTxHash,
      message: `Successfully sent 0.05 ETH to ${address}`,
    })
  } catch (error) {
    console.error("Faucet error:", error)

    return NextResponse.json({ message: "Failed to send ETH from faucet" }, { status: 500 })
  }
}

