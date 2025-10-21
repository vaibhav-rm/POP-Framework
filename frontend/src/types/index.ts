export interface ProofRecord {
  id: string
  promptHash: string
  outputHash: string
  creator: string
  txHash: string
  blockNumber: number
  timestamp: string
  outputType: "text" | "file"
}

export interface BlockchainStats {
  totalProofs: number
  uniqueCreators: number
  myProofs: number
}

export interface RegisterResult {
  prompt_hash: string
  output_hash: string
  tx_hash: string
  blockNumber: number
  creator: string
  timestamp: string
  output_type: "text" | "file"
}
