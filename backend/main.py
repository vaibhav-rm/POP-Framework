import os
import json
import hashlib
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from web3 import Web3, exceptions

load_dotenv()

INFURA_URL = os.getenv("INFURA_URL")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")  # MetaMask account private key (use a test wallet!)
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
GEMINI_KEY = os.getenv("GEMINI_API_KEY")  # optional: for generating content with Gemini

if not INFURA_URL or not PRIVATE_KEY or not CONTRACT_ADDRESS:
    raise RuntimeError("Set INFURA_URL, PRIVATE_KEY, CONTRACT_ADDRESS in env")

w3 = Web3(Web3.HTTPProvider(INFURA_URL))
acct = w3.eth.account.from_key(PRIVATE_KEY)
contract_address = Web3.to_checksum_address(CONTRACT_ADDRESS)

# load ABI
with open("proof_contract_abi.json", "r") as f:
    contract_abi = json.load(f)

contract = w3.eth.contract(address=contract_address, abi=contract_abi)

app = FastAPI(title="Proof-of-Prompt API", version="1.0.0")

class RegisterRequest(BaseModel):
    prompt: str
    output: str

class VerifyRequest(BaseModel):
    prompt: str
    output: str
    creator: str  # hex address of creator

def sha256_hex(s: str) -> str:
    return hashlib.sha256(s.encode()).hexdigest()

@app.post("/register")
def register(req: RegisterRequest):
    prompt_hash = sha256_hex(req.prompt)
    output_hash = sha256_hex(req.output)

    # build tx
    try:
        tx = contract.functions.registerProof(prompt_hash, output_hash).build_transaction({
            "from": acct.address,
            "nonce": w3.eth.get_transaction_count(acct.address),
            "gas": 220000,
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
        "message": "Proof registered",
        "prompt_hash": prompt_hash,
        "output_hash": output_hash,
        "tx_hash": receipt.transactionHash.hex(),
        "blockNumber": receipt.blockNumber
    }

@app.post("/verify")
def verify(req: VerifyRequest):
    prompt_hash = sha256_hex(req.prompt)
    output_hash = sha256_hex(req.output)
    try:
        valid = contract.functions.verifyProof(prompt_hash, output_hash, Web3.to_checksum_address(req.creator)).call()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"verified": valid}

import requests

def gemini_generate_text(prompt: str) -> str:
    # Simple POST to Google generative endpoint (replace with correct Gemini endpoint / client)
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateText?key={GEMINI_KEY}"
    payload = {"prompt": prompt}
    r = requests.post(url, json=payload, timeout=20)
    r.raise_for_status()
    data = r.json()
    # adapt based on returned structure; this is illustrative:
    return data.get("candidates", [{}])[0].get("content", "")

@app.post("/generate_and_register")
def generate_and_register(prompt: str):
    if not GEMINI_KEY:
        raise HTTPException(status_code=500, detail="Gemini key not configured")
    ai_output = gemini_generate_text(prompt)
    # reuse register logic
    return register(RegisterRequest(prompt=prompt, output=ai_output))

