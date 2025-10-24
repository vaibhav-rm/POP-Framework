export default function Documentation() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                Documentation
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Learn how to use ProofChain to register and verify AI-generated content securely.
            </p>
          </div>

          {/* Getting Started */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Getting Started</h2>
            <p className="text-muted-foreground">
              ProofChain is a blockchain-based framework for registering AI-generated content. Follow these steps:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Connect your MetaMask wallet to the Sepolia Testnet.</li>
              <li>Open the Dashboard and input your AI-generated prompt and output.</li>
              <li>Click <strong>Register Proof</strong> to store it on the blockchain.</li>
              <li>Check the <strong>Hashes</strong> page to verify your registered content.</li>
            </ol>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Features</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-card border border-border rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Immutable Records</h3>
                <p className="text-sm text-muted-foreground">
                  All proofs are permanently stored on the Sepolia testnet blockchain.
                </p>
              </div>
              <div className="p-4 bg-card border border-border rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Creator Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Your wallet address is recorded as the verified creator of the content.
                </p>
              </div>
              <div className="p-4 bg-card border border-border rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">File + Text Support</h3>
                <p className="text-sm text-muted-foreground">
                  Register both text and file outputs using cryptographic hashing.
                </p>
              </div>
              <div className="p-4 bg-card border border-border rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Searchable Registry</h3>
                <p className="text-sm text-muted-foreground">
                  Easily search and filter proofs by creator, hash, or date.
                </p>
              </div>
            </div>
          </div>

          {/* API Reference */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">API Reference</h2>

            <div className="p-4 bg-card border border-border rounded-lg">
              <h3 className="font-mono font-semibold text-primary mb-2">POST /api/register</h3>
              <p className="text-sm text-muted-foreground mb-2">Register a new proof on the blockchain.</p>
              <p className="text-xs text-muted-foreground">
                <strong>Parameters:</strong> prompt, output, creator, output_type ("text" or "file")
              </p>
            </div>

            <div className="p-4 bg-card border border-border rounded-lg">
              <h3 className="font-mono font-semibold text-primary mb-2">GET /api/proofs</h3>
              <p className="text-sm text-muted-foreground mb-2">Retrieve all registered proofs.</p>
              <p className="text-xs text-muted-foreground">Returns: list of proofs with creator and timestamps.</p>
            </div>

            <div className="p-4 bg-card border border-border rounded-lg">
              <h3 className="font-mono font-semibold text-primary mb-2">GET /api/proofs/count</h3>
              <p className="text-sm text-muted-foreground mb-2">Get total number of registered proofs.</p>
              <p className="text-xs text-muted-foreground">Returns: integer count</p>
            </div>

            <div className="p-4 bg-card border border-border rounded-lg">
              <h3 className="font-mono font-semibold text-primary mb-2">GET /api/creators/count</h3>
              <p className="text-sm text-muted-foreground mb-2">Get total number of unique creators.</p>
              <p className="text-xs text-muted-foreground">Returns: integer count</p>
            </div>
          </div>

          {/* Integration Examples */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Integration Examples</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Python (using Google GenAI + ProofChain API):</strong></p>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
{`from google import genai
import requests

client = genai.Client(api_key="YOUR_GEMINI_API_KEY")

prompt = "Write a poem about decentralization"
result = client.models.generate_content(model="gemini-1.5-flash", contents=prompt)

data = {
  "prompt": prompt,
  "output": result.text,
  "creator": "0xYourWalletAddress",
  "output_type": "text"
}

res = requests.post("https://proofchain.example.com/api/register", json=data)
print(res.json())`}
              </pre>

              <p><strong>Frontend (fetching stats):</strong></p>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
{`useEffect(() => {
  async function fetchStats() {
    const proofs = await fetch("/api/proofs/count").then(res => res.json());
    const creators = await fetch("/api/creators/count").then(res => res.json());
    console.log("Total proofs:", proofs.count, "Creators:", creators.count);
  }
  fetchStats();
}, []);`}
              </pre>
            </div>
          </div>

          {/* Advanced Topics */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Advanced Topics</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong>Smart Contract Interaction:</strong> Uses Ethers.js to connect with ProofRegistry.sol.</li>
              <li><strong>Verification Hashing:</strong> SHA-256 based hashing ensures tamper-proof records.</li>
              <li><strong>AI Provenance:</strong> Integrate ProofChain with AI tools to prove data origin.</li>
              <li><strong>Decentralized Storage:</strong> IPFS support (coming soon).</li>
            </ul>
          </div>

          {/* Troubleshooting */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Troubleshooting</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>If MetaMask doesn’t connect, ensure Sepolia Testnet is enabled in your wallet.</li>
              <li>Check your RPC endpoint and internet connection before registering a proof.</li>
              <li>For <code>Gemini SDK error</code> issues, ensure your Google GenAI SDK version is updated.</li>
              <li>Always include valid <code>Content-Type: application/json</code> headers in API requests.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
