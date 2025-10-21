import { ethers } from "ethers"

// Contract ABI - Replace with your actual contract ABI
const CONTRACT_ABI = [
  "function getProofCount() public view returns (uint256)",
  "function getProofByIndex(uint256 index) public view returns (tuple(bytes32 promptHash, bytes32 outputHash, address creator, uint256 timestamp))",
  "function getCreatorProofCount(address creator) public view returns (uint256)",
  "function getAllProofs() public view returns (tuple(bytes32 promptHash, bytes32 outputHash, address creator, uint256 timestamp)[])",
]

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || ""
const SEPOLIA_RPC = import.meta.env.VITE_SEPOLIA_RPC || "https://sepolia.infura.io/v3/YOUR_INFURA_KEY"

export async function getBlockchainStats() {
  try {
    if (!CONTRACT_ADDRESS) {
      console.warn("Contract address not configured")
      return { totalProofs: 0, uniqueCreators: 0 }
    }

    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC)
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)

    const proofCount = await contract.getProofCount()
    const totalProofs = Number(proofCount)

    const allProofs = await contract.getAllProofs()
    const uniqueCreators = new Set(allProofs.map((proof: any) => proof.creator)).size

    return {
      totalProofs,
      uniqueCreators,
    }
  } catch (error) {
    console.error("Error fetching blockchain stats:", error)
    return { totalProofs: 0, uniqueCreators: 0 }
  }
}

export async function getRegisteredProofs() {
  try {
    if (!CONTRACT_ADDRESS) {
      console.warn("Contract address not configured")
      return []
    }

    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC)
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)

    const allProofs = await contract.getAllProofs()

    return allProofs.map((proof: any, index: number) => ({
      id: `${index}`,
      promptHash: proof.promptHash,
      outputHash: proof.outputHash,
      creator: proof.creator,
      timestamp: new Date(Number(proof.timestamp) * 1000).toISOString(),
      blockNumber: 0,
      txHash: "",
    }))
  } catch (error) {
    console.error("Error fetching proofs:", error)
    return []
  }
}

export async function getCreatorStats(creatorAddress: string) {
  try {
    if (!CONTRACT_ADDRESS) {
      console.warn("Contract address not configured")
      return 0
    }

    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC)
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)

    const count = await contract.getCreatorProofCount(creatorAddress)
    return Number(count)
  } catch (error) {
    console.error("Error fetching creator stats:", error)
    return 0
  }
}
