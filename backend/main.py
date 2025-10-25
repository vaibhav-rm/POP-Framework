import os
import json
import hashlib
import requests
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from dotenv import load_dotenv
from web3 import Web3, exceptions
from fastapi.middleware.cors import CORSMiddleware
from google import genai

# Load environment variables
load_dotenv()

INFURA_URL = os.getenv("INFURA_URL")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
GEMINI_KEY = os.getenv("GEMINI_API_KEY")

if not INFURA_URL or not PRIVATE_KEY or not CONTRACT_ADDRESS:
    raise RuntimeError("Missing required environment variables")

# Web3 setup
w3 = Web3(Web3.HTTPProvider(INFURA_URL))
acct = w3.eth.account.from_key(PRIVATE_KEY)
contract_address = Web3.to_checksum_address(CONTRACT_ADDRESS)

# Load contract ABI
with open("proof_contract_abi.json", "r") as f:
    contract_abi = json.load(f)

contract = w3.eth.contract(address=contract_address, abi=contract_abi)

# FastAPI app
app = FastAPI(
    title="Proof-of-Prompt API",
    description="A blockchain-based service that registers and verifies immutable AI prompt-output proofs.",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class RegisterRequest(BaseModel):
    prompt: str
    output: str

class VerifyRequest(BaseModel):
    prompt: str
    output: str
    creator: str

class VerifyTxRequest(BaseModel):
    tx_hash: str

# Utility: hash function
def sha256_hex(s: str) -> str:
    return hashlib.sha256(s.encode()).hexdigest()

# Helper: convert Proof tuple to dict
def proof_tuple_to_dict(t):
    # t = (creator_address, promptHash, outputHash, timestamp, verified)
    return {
        "creator": t[0],
        "prompt_hash": t[1].decode("utf-8") if isinstance(t[1], bytes) else t[1],
        "output_hash": t[2].decode("utf-8") if isinstance(t[2], bytes) else t[2],
        "timestamp": int(t[3]),
        "verified": t[4],
    }


# --------------------------- ROUTES --------------------------- #

@app.post("/register")
def register(req: RegisterRequest):
    prompt_hash = sha256_hex(req.prompt)
    output_hash = sha256_hex(req.output)

    try:
        estimated_gas = contract.functions.registerProof(prompt_hash, output_hash).estimate_gas({
            "from": acct.address
        })
        tx = contract.functions.registerProof(prompt_hash, output_hash).build_transaction({
            "from": acct.address,
            "nonce": w3.eth.get_transaction_count(acct.address),
            "gas": int(estimated_gas * 1.2),
            "gasPrice": w3.eth.gas_price,
        })

        signed = w3.eth.account.sign_transaction(tx, private_key=PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    except exceptions.ContractLogicError as e:
        raise HTTPException(status_code=400, detail=f"Contract error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "message": "Proof registered successfully",
        "prompt_hash": prompt_hash,
        "output_hash": output_hash,
        "tx_hash": receipt.transactionHash.hex(),
        "block_number": receipt.blockNumber,
    }

@app.post("/verify")
def verify(req: VerifyRequest):
    prompt_hash = sha256_hex(req.prompt)
    output_hash = sha256_hex(req.output)
    try:
        valid = contract.functions.verifyProof(
            Web3.to_checksum_address(req.creator),
            prompt_hash,
            output_hash
        ).call()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"verified": valid}

@app.post("/verify_tx")
def verify_by_tx(req: VerifyTxRequest):
    try:
        valid = contract.functions.verifyProofByTx(Web3.to_bytes(hexstr=req.tx_hash)).call()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"verified": valid}

@app.get("/proofs")
def get_all_proofs():
    try:
        proofs = contract.functions.getAllProofs().call()
        parsed = [proof_tuple_to_dict(p) for p in proofs]
        return {"count": len(parsed), "proofs": parsed}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/proofs/paginated")
def get_paginated_proofs(offset: int = Query(0, ge=0), limit: int = Query(5, ge=1)):
    try:
        proofs = contract.functions.getProofsPaginated(offset, limit).call()
        parsed = [proof_tuple_to_dict(p) for p in proofs]
        return {"offset": offset, "limit": limit, "count": len(parsed), "proofs": parsed}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/proofs/creator/{creator}")
def get_proofs_by_creator(creator: str):
    try:
        proofs = contract.functions.getProofsByCreator(Web3.to_checksum_address(creator)).call()
        parsed = [proof_tuple_to_dict(p) for p in proofs]
        return {"count": len(parsed), "proofs": parsed}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/proof/{proof_id}")
def get_proof_by_id(proof_id: int):
    try:
        proof = contract.functions.getProofById(proof_id).call()
        return proof_tuple_to_dict(proof)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/proofs/count")
def get_proof_count():
    try:
        count = contract.functions.getProofCount().call()
        return {"proof_count": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/creators/count")
def get_creator_count():
    try:
        count = contract.functions.getCreatorCount().call()
        return {"creator_count": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------------- Gemini Integration ---------------- #

genai_client = genai.Client(api_key=GEMINI_KEY)

def gemini_generate_text(prompt: str) -> str:
    """Generate text using Gemini (Google Generative AI API)"""
    if not GEMINI_KEY:
        raise RuntimeError("Gemini API key not set")
    
    # Initialize the client with the API key
    client = genai.Client(api_key=GEMINI_KEY)
    
    # Define the model and prompt
    model_name = "gemini-2.5-flash"  # Replace with your desired model
    prompt_text = prompt
    
    # Generate content using the model
    response = client.models.generate_content(
        model=model_name,
        contents=[genai.types.Part(text=prompt_text)]
    )
    
    # Extract and return the generated text
    return response.text


class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
def chat_and_register(req: ChatRequest):
    prompt = req.message

    # 1️⃣ Generate AI response
    try:
        ai_output = gemini_generate_text(prompt)  # uses genai SDK
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini SDK error: {str(e)}")

    # 2️⃣ Register proof on blockchain
    try:
        register(RegisterRequest(prompt=prompt, output=ai_output))
    except Exception as e:
        # Log but don’t block the chat response
        print("Error registering proof:", e)

    # 3️⃣ Return AI response to frontend
    return {"response": ai_output}



@app.post("/generate_and_register")
def generate_and_register(prompt: str):
    """Generate AI output via Gemini and register its proof"""
    ai_output = gemini_generate_text(prompt)
    return register(RegisterRequest(prompt=prompt, output=ai_output))