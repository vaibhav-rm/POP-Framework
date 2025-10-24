import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // change to your FastAPI server URL

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Register a new proof
export const registerProof = async (prompt: string, output: string) => {
  const res = await api.post("/register", { prompt, output });
  return res.data;
};

// Verify an existing proof
export const verifyProof = async (prompt: string, output: string, creator: string) => {
  const res = await api.post("/verify", { prompt, output, creator });
  return res.data;
};

// Fetch all proofs (if implemented in backend)
export const getAllProofs = async () => {
  const res = await api.get("/proofs");
  return res.data;
};

// Fetch proofs by creator
export const getProofsByCreator = async (creator: string) => {
  const res = await api.get(`/proofs/creator/${creator}`);
  return res.data;
};

// Generate AI output using Gemini + register proof
export const generateAndRegister = async (prompt: string) => {
  const res = await api.post("/generate_and_register", { prompt });
  return res.data;
};
