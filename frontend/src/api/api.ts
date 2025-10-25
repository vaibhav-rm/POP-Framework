import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
})

// ------------------------------
// 🔐 Proof Registration & Queries
// ------------------------------

// Register a new proof
export const registerProof = async (prompt: string, output: string) => {
  const res = await api.post("/register", { prompt, output })
  return res.data
}

// Verify a proof
export const verifyProof = async (prompt: string, output: string, creator: string) => {
  const res = await api.post("/verify", { prompt, output, creator })
  return res.data
}

// Fetch all proofs
export const getAllProofs = async () => {
  const res = await api.get("/proofs")
  return res.data
}

// Fetch proofs by creator
export const getProofsByCreator = async (creator: string) => {
  const res = await api.get(`/proofs/creator/${creator}`)
  return res.data
}

// Count endpoints
export const getProofCount = async () => {
  const res = await api.get("/proofs/count")
  return res.data
}

export const getCreatorCount = async () => {
  const res = await api.get("/creators/count")
  return res.data
}

// ------------------------------
// 🤖 AI + Proof Integration
// ------------------------------

// Generate AI output using Gemini SDK only
export const generateAIOutput = async (prompt: string) => {
  const res = await api.post("/generate_text", { prompt })
  return res.data
}

// Generate & register proof (legacy combined endpoint)
export const generateAndRegister = async (prompt: string) => {
  const res = await api.post("/generate_and_register", { prompt })
  return res.data
}

// Chat endpoint — returns AI response & auto-registers proof
export const chatAndRegister = async (payload: { message: string }) => {
  const res = await api.post("/api/chat", payload)
  return res.data
}
