import { useState } from "react";
import { useAccount } from "wagmi";

const useFaucet = () => {
  const [state, setState] = useState<"error" | "loading" | "success" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { address } = useAccount();

  const data = {
    userAddress: address,
  };

  interface FaucetResponse {
    txHash?: string;
    errorMessage?: string;
  }

  const requestFunds = async () => {
    setState("loading");
    try {
      const response: FaucetResponse = await fetch(`http://localhost:3001/faucet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(res => res.json());

      setState(response.txHash ? "success" : "error");
      setErrorMessage(response.errorMessage ?? "Something went wrong");

      return await response;
    } catch (err: unknown) {
      console.log(err);
      setState("error");
      setErrorMessage(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

  return { requestFunds, state, errorMessage };
};

export default useFaucet;
