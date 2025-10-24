import os
import json
import requests
from web3 import Web3
from dotenv import load_dotenv

load_dotenv()

# -------------------- CONFIG --------------------
BACKEND_URL = "http://127.0.0.1:8000"
INFURA_URL = os.getenv("INFURA_URL")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")

print("Testing Proof-of-Prompt Backend System\n")

# -------------------- STEP 1: Check Network --------------------
print("1️⃣  Checking blockchain connection...")
w3 = Web3(Web3.HTTPProvider(INFURA_URL))
if not w3.is_connected():
    print("❌ Web3 connection failed")
    exit(1)
else:
    print("✅ Connected to network:", w3.client_version)

# -------------------- STEP 2: Check Contract --------------------
print("\n2️⃣  Checking deployed contract...")

with open("proof_contract_abi.json", "r") as f:
    abi = json.load(f)

contract = w3.eth.contract(address=Web3.to_checksum_address(CONTRACT_ADDRESS), abi=abi)
try:
    count = contract.functions.getProofCount().call()
    print(f"✅ Contract reachable at {CONTRACT_ADDRESS}")
    print(f"   Current proof count: {count}")
except Exception as e:
    print("❌ Failed to access contract:", e)
    exit(1)

# -------------------- STEP 3: Register Proof --------------------
print("\n3️⃣  Registering a new proof through API...")

register_data = {
    "prompt": "AI creates art with meaning",
    "output": "A surreal painting of algorithms dreaming."
}

res = requests.post(f"{BACKEND_URL}/register", json=register_data)
if res.status_code == 200:
    rjson = res.json()
    print("✅ Proof registered successfully:")
    print(json.dumps(rjson, indent=2))
else:
    print("❌ Register failed:", res.status_code, res.text)
    exit(1)

# -------------------- STEP 4: Verify Proof --------------------
print("\n4️⃣  Verifying proof...")

verify_data = {
    "prompt": register_data["prompt"],
    "output": register_data["output"],
    "creator": "0x" + os.getenv("WALLET_ADDRESS", "0000000000000000000000000000000000000000")[2:].zfill(40)
}

res = requests.post(f"{BACKEND_URL}/verify", json=verify_data)
if res.status_code == 200:
    print("✅ Proof verification response:", res.json())
else:
    print("❌ Verification failed:", res.text)

# -------------------- STEP 5: Get All Proofs --------------------
print("\n5️⃣  Fetching all proofs...")

res = requests.get(f"{BACKEND_URL}/proofs")
if res.status_code == 200:
    data = res.json()
    print(f"✅ Retrieved {data['count']} proofs")
    print(json.dumps(data, indent=2))
else:
    print("❌ Get proofs failed:", res.text)

# -------------------- STEP 6: Paginated Proofs --------------------
print("\n6️⃣  Fetching paginated proofs...")

res = requests.get(f"{BACKEND_URL}/proofs/paginated?offset=0&limit=5")
if res.status_code == 200:
    data = res.json()
    print(f"✅ Retrieved {data['count']} paginated proofs")
    print(json.dumps(data, indent=2))
else:
    print("❌ Paginated fetch failed:", res.text)

# -------------------- STEP 7: Proofs by Creator --------------------
print("\n7️⃣  Fetching proofs by creator...")

creator = verify_data["creator"]
res = requests.get(f"{BACKEND_URL}/proofs/creator/{creator}")
if res.status_code == 200:
    data = res.json()
    print(f"✅ Retrieved {data['count']} proofs by creator {creator}")
    print(json.dumps(data, indent=2))
else:
    print("❌ Proofs by creator failed:", res.text)

print("\n✅ All tests completed.\n")
