# 🧾 Proof of Prompt — Blockchain-Powered AI Provenance API

> **Proof of Prompt** is a blockchain-based API that allows AI companies, researchers, and developers to store cryptographic proofs of their AI prompts and generated outputs on the Ethereum **Sepolia testnet** — ensuring **transparency, authenticity, and tamper-proof records** for all AI-generated content.

---

## 🚀 Overview

As AI models become more powerful, **verifying the origin of AI outputs** has become essential.  
This project creates a **trust layer for generative AI systems** — where each prompt and response pair can be registered on the blockchain as immutable proof of authorship.

This proof can later be verified by anyone via the provided REST API.

---

## 🧩 Features

✅ **Blockchain-backed verification** — Each proof is stored immutably on Ethereum (Sepolia testnet).  
✅ **FastAPI-powered REST API** — Easy integration with existing AI systems.  
✅ **SHA-256 cryptographic hashing** — Secure prompt & output fingerprinting.  
✅ **Free and open-source** — Testnet-based for zero-cost experimentation.  
✅ **Swagger UI** for easy endpoint testing.  
✅ **Future-ready** — Designed for production deployment and Web3 scaling.

---

## 🛠️ Tech Stack

| Layer | Technology |
|--------|-------------|
| Smart Contract | Solidity (Ethereum / Sepolia) |
| Backend API | FastAPI (Python) |
| Blockchain Interaction | Web3.py |
| Hashing | SHA-256 |
| Frontend (Planned) | React + Tailwind CSS |

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/proof-of-prompt.git
cd proof-of-prompt

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

### 2️⃣ Create and Activate a Virtual Environment
Create a .env file in the root folder and add:

```bash
PRIVATE_KEY=your_wallet_private_key
WALLET_ADDRESS=your_public_wallet_address
INFURA_URL=https://sepolia.infura.io/v3/your_project_id
CONTRACT_ADDRESS=your_deployed_contract_address

### 4️⃣ Run the API Server
```bash
uvicorn main:app --reload



## 🛠️ Tech Stack

| Layer | Technology |
|--------|-------------|
| Smart Contract | Solidity (Ethereum / Sepolia) |
| Backend API | FastAPI (Python) |
| Blockchain Interaction | Web3.py |
| Hashing | SHA-256 |
| Frontend (Planned) | React + Tailwind CSS |

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/proof-of-prompt.git
cd proof-of-prompt
````

### 2️⃣ Create and Activate a Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3️⃣ Set Environment Variables

Create a `.env` file in the root folder and add:

```
PRIVATE_KEY=your_wallet_private_key
WALLET_ADDRESS=your_public_wallet_address
INFURA_URL=https://sepolia.infura.io/v3/your_project_id
CONTRACT_ADDRESS=your_deployed_contract_address
```

> 🛡️ **Important:** Never commit your `.env` file.
> Your private key can be exported from MetaMask (for testing only).

### 4️⃣ Run the API Server

```bash
uvicorn main:app --reload
```

Visit the interactive API docs:
👉 [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🔗 API Endpoints

### `POST /register`

Registers a proof of a given prompt and output pair.

**Example:**

```bash
curl -X POST "http://127.0.0.1:8000/register" \
-H "Content-Type: application/json" \
-d '{"prompt":"hello world","output":"AI output text"}'
```

**Response:**

```json
{
  "message": "Proof registered",
  "prompt_hash": "b94d27b9...",
  "output_hash": "4856309c...",
  "tx_hash": "78fb314cc047998451fa7583bfcb5efcd1eefe9d462b759e4ff51641744185a2",
  "blockNumber": 9446553
}
```

---

### `POST /verify`

Verifies if a prompt-output pair exists on the blockchain.

**Example:**

```bash
curl -X POST "http://127.0.0.1:8000/verify" \
-H "Content-Type: application/json" \
-d '{"prompt":"hello world","output":"AI output text","creator":"0xYourWallet"}'
```

**Response:**

```json
{"verified": true}
```

---

## 🌍 How It Works

1. **User submits a prompt and AI output**
2. API hashes both using SHA-256
3. A **smart contract transaction** is sent to the blockchain
4. Hashes are stored immutably with creator’s address
5. Anyone can later **verify** the authenticity of the pair

---

## 🪙 Example Transaction

👉 [View on Sepolia Etherscan](https://sepolia.etherscan.io/tx/78fb314cc047998451fa7583bfcb5efcd1eefe9d462b759e4ff51641744185a2)

---

## 💡 Future Plans

* 🌐 **Public dashboard** to explore registered proofs
* 🧾 **Frontend landing page** (React + Tailwind)
* 🔐 **JWT authentication** for verified API users
* ⚡ **IPFS integration** to store complete AI outputs
* 🤝 **Multi-chain support** (Polygon, Arbitrum, Base)

---

## 🤝 Contributing

Pull requests and feature suggestions are welcome!
Open an issue or fork the project to get started.

---

## 📜 License

This project is licensed under the **MIT License** — feel free to use and build upon it.

---

```
```

