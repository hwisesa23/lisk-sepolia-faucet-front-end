import { useState } from "react";
import { FaucetAddress, FaucetABI } from "../app/abis/faucet";
import { useWriteContract, useAccount } from "wagmi";

export function useRequestFunds() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { address } = useAccount();

  const { 
    writeContract, 
    isPending,
    isError 
  } = useWriteContract();

  const requestFunds = async () => {
    try {
      setErrorMessage(null);
      setIsSuccess(false);
      
      await writeContract({
        address: FaucetAddress,
        abi: FaucetABI,
        functionName: "requestFunds",
      });
      
      // If we get here without an error, consider it a success
      setIsSuccess(true);
      setErrorMessage("Request submitted. 0.01 ETH will be sent to your wallet.");
    } catch (error: any) {
      setIsSuccess(false);
      if (error.message.includes("execution reverted")) {
        const match = error.message.match(/execution reverted: (.*)/);
        setErrorMessage(match ? match[1] : "Transaction failed");
      } else {
        setErrorMessage(error.message || "Failed to request funds");
      }
    }
  };

  return { 
    requestFunds, 
    isPending, 
    isError, 
    errorMessage, 
    isSuccess,
    isConnected: !!address
  };
}
