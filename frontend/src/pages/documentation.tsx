"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function Documentation() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const endpoints = [
    {
      id: "register",
      method: "POST",
      route: "/register",
      description: "Register a new proof on the blockchain",
      params: [
        { name: "prompt", type: "string", description: "The AI prompt input" },
        { name: "output", type: "string", description: "The AI-generated output" },
      ],
      response: {
        message: "Proof registered successfully",
        prompt_hash: "sha256 hash of prompt",
        output_hash: "sha256 hash of output",
        tx_hash: "blockchain transaction hash",
        block_number: "block number where proof was recorded",
      },
    },
    {
      id: "verify",
      method: "POST",
      route: "/verify",
      description: "Verify a proof on the blockchain",
      params: [
        { name: "prompt", type: "string", description: "The original AI prompt" },
        { name: "output", type: "string", description: "The original AI output" },
        { name: "creator", type: "string", description: "Creator wallet address (0x...)" },
      ],
      response: {
        verified: "boolean - true if proof exists and matches",
      },
    },
    {
      id: "verify-tx",
      method: "POST",
      route: "/verify_tx",
      description: "Verify a proof using transaction hash",
      params: [{ name: "tx_hash", type: "string", description: "The blockchain transaction hash" }],
      response: {
        verified: "boolean - true if transaction is valid",
      },
    },
    {
      id: "get-all-proofs",
      method: "GET",
      route: "/proofs",
      description: "Retrieve all registered proofs",
      params: [],
      response: {
        count: "total number of proofs",
        proofs: "array of proof objects with creator, hashes, timestamp, verified status",
      },
    },
    {
      id: "get-paginated",
      method: "GET",
      route: "/proofs/paginated?offset=0&limit=5",
      description: "Retrieve proofs with pagination",
      params: [
        { name: "offset", type: "integer", description: "Starting index (default: 0)" },
        { name: "limit", type: "integer", description: "Number of results (default: 5)" },
      ],
      response: {
        offset: "requested offset",
        limit: "requested limit",
        count: "number of proofs returned",
        proofs: "array of proof objects",
      },
    },
    {
      id: "get-by-creator",
      method: "GET",
      route: "/proofs/creator/{creator}",
      description: "Get all proofs by a specific creator",
      params: [{ name: "creator", type: "string", description: "Creator wallet address (0x...)" }],
      response: {
        count: "number of proofs by creator",
        proofs: "array of proof objects",
      },
    },
    {
      id: "get-by-id",
      method: "GET",
      route: "/proof/{proof_id}",
      description: "Get a specific proof by ID",
      params: [{ name: "proof_id", type: "integer", description: "The proof ID" }],
      response: {
        creator: "creator wallet address",
        prompt_hash: "sha256 hash of prompt",
        output_hash: "sha256 hash of output",
        timestamp: "unix timestamp",
        verified: "verification status",
      },
    },
    {
      id: "proof-count",
      method: "GET",
      route: "/proofs/count",
      description: "Get total number of registered proofs",
      params: [],
      response: {
        proof_count: "total proofs on blockchain",
      },
    },
    {
      id: "creator-count",
      method: "GET",
      route: "/creators/count",
      description: "Get total number of unique creators",
      params: [],
      response: {
        creator_count: "total unique creators",
      },
    },
    {
      id: "chat",
      method: "POST",
      route: "/api/chat",
      description: "Generate AI content using Gemini and automatically register its proof",
      params: [{ name: "message", type: "string", description: "The prompt to send to Gemini" }],
      response: {
        response: "AI-generated text from Gemini",
      },
    },
    {
      id: "generate-register",
      method: "POST",
      route: "/generate_and_register",
      description: "Generate AI output via Gemini and register proof on-chain (one-step)",
      params: [{ name: "prompt", type: "string", description: "The prompt for Gemini" }],
      response: {
        message: "Proof registered successfully",
        prompt_hash: "sha256 hash",
        output_hash: "sha256 hash",
        tx_hash: "blockchain transaction hash",
        block_number: "block number",
      },
    },
  ]

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Documentation
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Learn how to use ProofChain to register and verify AI-generated content securely on the blockchain.
            </p>
          </div>

          {/* Getting Started */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Getting Started</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Connect your MetaMask wallet to the Sepolia Testnet.</li>
              <li>Open the Dashboard and input your AI-generated prompt and output.</li>
              <li>
                Click <strong>Register Proof</strong> to store it on the blockchain.
              </li>
              <li>
                Check the <strong>Hashes</strong> page to verify your registered content.
              </li>
            </ol>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Features</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                ["Immutable Records", "All proofs are permanently stored on the Sepolia testnet blockchain."],
                ["Creator Authentication", "Your wallet address is recorded as the verified creator of the content."],
                ["File + Text Support", "Register both text and file outputs using cryptographic hashing."],
                ["Searchable Registry", "Easily search and filter proofs by creator, hash, or date."],
                ["Gemini Integration", "Automatically generate and register AI content in one step."],
                ["Pagination Support", "Efficiently retrieve large datasets with offset and limit parameters."],
              ].map(([title, desc]) => (
                <div key={title} className="p-4 bg-card border border-border rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Environment Setup */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Environment Setup</h2>
            <p className="text-muted-foreground">
              Configure these environment variables in your <code className="bg-muted px-2 py-1 rounded">.env</code>{" "}
              file:
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
              {`INFURA_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_wallet_private_key
CONTRACT_ADDRESS=0x...deployed_contract_address
GEMINI_API_KEY=your_gemini_api_key`}
            </pre>
          </div>

          {/* API Reference */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">API Reference</h2>
            <p className="text-muted-foreground">
              Base URL: <code className="bg-muted px-2 py-1 rounded">https://proofchain.example.com</code>
            </p>

            {/* Blockchain Proof APIs */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-foreground">Blockchain Proof Management</h3>
              {endpoints.slice(0, 9).map((endpoint) => (
                <div key={endpoint.id} className="border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection(endpoint.id)}
                    className="w-full p-4 bg-card hover:bg-muted transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          endpoint.method === "GET"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }`}
                      >
                        {endpoint.method}
                      </span>
                      <div>
                        <p className="font-mono font-semibold text-foreground">{endpoint.route}</p>
                        <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${expandedSections[endpoint.id] ? "rotate-180" : ""}`}
                    />
                  </button>

                  {expandedSections[endpoint.id] && (
                    <div className="p-4 bg-muted border-t border-border space-y-4">
                      {endpoint.params.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Parameters</h4>
                          <div className="space-y-2">
                            {endpoint.params.map((param) => (
                              <div key={param.name} className="text-sm">
                                <code className="bg-background px-2 py-1 rounded text-primary">{param.name}</code>
                                <span className="text-muted-foreground ml-2">({param.type})</span>
                                <p className="text-muted-foreground mt-1">{param.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Response</h4>
                        <pre className="bg-background p-3 rounded text-xs overflow-x-auto">
                          {JSON.stringify(endpoint.response, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Gemini Integration APIs */}
            <div className="space-y-3 mt-8">
              <h3 className="text-xl font-semibold text-foreground">Gemini AI Integration</h3>
              {endpoints.slice(9).map((endpoint) => (
                <div key={endpoint.id} className="border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection(endpoint.id)}
                    className="w-full p-4 bg-card hover:bg-muted transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          endpoint.method === "GET"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }`}
                      >
                        {endpoint.method}
                      </span>
                      <div>
                        <p className="font-mono font-semibold text-foreground">{endpoint.route}</p>
                        <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${expandedSections[endpoint.id] ? "rotate-180" : ""}`}
                    />
                  </button>

                  {expandedSections[endpoint.id] && (
                    <div className="p-4 bg-muted border-t border-border space-y-4">
                      {endpoint.params.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Parameters</h4>
                          <div className="space-y-2">
                            {endpoint.params.map((param) => (
                              <div key={param.name} className="text-sm">
                                <code className="bg-background px-2 py-1 rounded text-primary">{param.name}</code>
                                <span className="text-muted-foreground ml-2">({param.type})</span>
                                <p className="text-muted-foreground mt-1">{param.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Response</h4>
                        <pre className="bg-background p-3 rounded text-xs overflow-x-auto">
                          {JSON.stringify(endpoint.response, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Integration Examples */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Integration Examples</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Python - Register a Proof</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                  {`import requests
import hashlib

def sha256_hex(s: str) -> str:
    return hashlib.sha256(s.encode()).hexdigest()

prompt = "Write a poem about decentralization"
output = "Decentralized dreams in code we trust..."

data = {
    "prompt": prompt,
    "output": output
}

response = requests.post(
    "https://proofchain.example.com/register",
    json=data
)

result = response.json()
print(f"Transaction Hash: {result['tx_hash']}")
print(f"Block Number: {result['block_number']}")`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Python - Verify a Proof</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                  {`import requests

prompt = "Write a poem about decentralization"
output = "Decentralized dreams in code we trust..."
creator = "0x742d35Cc6634C0532925a3b844Bc9e7595f42e0"

data = {
    "prompt": prompt,
    "output": output,
    "creator": creator
}

response = requests.post(
    "https://proofchain.example.com/verify",
    json=data
)

result = response.json()
print(f"Verified: {result['verified']}")`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Python - Generate and Register with Gemini</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                  {`import requests

prompt = "Write a poem about decentralization"

response = requests.post(
    "https://proofchain.example.com/generate_and_register",
    json={"prompt": prompt}
)

result = response.json()
print(f"AI Output: {result['message']}")
print(f"Transaction Hash: {result['tx_hash']}")
print(f"Proof automatically registered on blockchain!")`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">JavaScript - Fetch All Proofs</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                  {`async function getAllProofs() {
  const response = await fetch(
    'https://proofchain.example.com/proofs'
  );
  
  const data = await response.json();
  console.log(\`Total proofs: \${data.count}\`);
  
  data.proofs.forEach(proof => {
    console.log({
      creator: proof.creator,
      promptHash: proof.prompt_hash,
      timestamp: new Date(proof.timestamp * 1000)
    });
  });
}

getAllProofs();`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">JavaScript - Paginated Proofs</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                  {`async function getPaginatedProofs(offset = 0, limit = 5) {
  const params = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString()
  });
  
  const response = await fetch(
    \`https://proofchain.example.com/proofs/paginated?\${params}\`
  );
  
  const data = await response.json();
  console.log(\`Showing \${data.count} of \${data.offset + data.count} proofs\`);
  return data.proofs;
}

getPaginatedProofs(0, 10);`}
                </pre>
              </div>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Troubleshooting</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Ensure Sepolia Testnet is selected in MetaMask.</li>
              <li>
                Confirm your <code className="bg-muted px-2 py-1 rounded">.env</code> includes INFURA_URL, PRIVATE_KEY,
                CONTRACT_ADDRESS, and GEMINI_API_KEY.
              </li>
              <li>
                For <code className="bg-muted px-2 py-1 rounded">Gemini SDK error</code>, upgrade to the latest{" "}
                <code className="bg-muted px-2 py-1 rounded">google-genai</code> package.
              </li>
              <li>
                Include <code className="bg-muted px-2 py-1 rounded">Content-Type: application/json</code> headers for
                all POST requests.
              </li>
              <li>
                Verify contract ABI file (<code className="bg-muted px-2 py-1 rounded">proof_contract_abi.json</code>)
                is in the project root.
              </li>
              <li>Check that your wallet has sufficient Sepolia ETH for gas fees.</li>
              <li>For pagination errors, ensure offset and limit are non-negative integers.</li>
            </ul>
          </div>

          {/* Best Practices */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Best Practices</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <strong>Hash Verification:</strong> Always verify prompt and output hashes match before submitting to
                blockchain.
              </li>
              <li>
                <strong>Error Handling:</strong> Implement retry logic for failed transactions with exponential backoff.
              </li>
              <li>
                <strong>Gas Optimization:</strong> Batch multiple proofs when possible to reduce transaction costs.
              </li>
              <li>
                <strong>Creator Tracking:</strong> Store creator wallet addresses securely and validate checksums.
              </li>
              <li>
                <strong>Pagination:</strong> Use pagination for large datasets to improve performance and reduce memory
                usage.
              </li>
              <li>
                <strong>Rate Limiting:</strong> Implement rate limiting on your API endpoints to prevent abuse.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
