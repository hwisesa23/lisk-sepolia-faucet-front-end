import { type Chain } from "viem";
import { createConfig, http, injected } from "wagmi";

export const sepoliaTestnet = {
	id: 4202,
	name: "Lisk Sepolia Testnet",
	nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
	rpcUrls: {
		default: { http: ["https://rpc.sepolia-api.lisk.com"] },
	},
	blockExplorers: {
		default: {
			name: "blockscout",
			url: "https://sepolia-blockscout.lisk.com",
		},
	},
} as const satisfies Chain;

const connectors = [injected()];

export const config = createConfig({
	connectors,
	chains: [sepoliaTestnet],
	transports: {
		[sepoliaTestnet.id]: http(),
	},
});
