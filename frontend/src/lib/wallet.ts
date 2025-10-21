export function formatAddress(address: string | null): string {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export async function switchToSepolia(): Promise<boolean> {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    return false
  }

  try {
    await (window as any).ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaa36a7" }],
    })
    return true
  } catch (error: any) {
    if (error.code === 4902) {
      try {
        await (window as any).ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0xaa36a7",
              chainName: "Sepolia",
              rpcUrls: ["https://sepolia.infura.io/v3/YOUR_INFURA_KEY"],
              nativeCurrency: {
                name: "Sepolia ETH",
                symbol: "ETH",
                decimals: 18,
              },
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        })
        return true
      } catch (addError) {
        console.error("Error adding Sepolia network:", addError)
        return false
      }
    }
    console.error("Error switching to Sepolia:", error)
    return false
  }
}

export function getChainName(chainId: number | null): string {
  switch (chainId) {
    case 11155111:
      return "Sepolia Testnet"
    case 1:
      return "Ethereum Mainnet"
    case 137:
      return "Polygon"
    default:
      return "Unknown Network"
  }
}
