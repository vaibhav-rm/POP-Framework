export default function Documentation() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Documentation
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Learn how to use ProofChain to register and verify AI-generated content
            </p>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Getting Started</h2>
              <p className="text-muted-foreground">
                ProofChain is a blockchain-based framework for registering AI-generated content. Follow these steps to
                get started:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Connect your MetaMask wallet</li>
                <li>Navigate to the Dashboard</li>
                <li>Enter your prompt and AI-generated output</li>
                <li>Submit to register on the blockchain</li>
              </ol>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Features</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-card border border-border rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">Immutable Records</h3>
                  <p className="text-sm text-muted-foreground">
                    All proofs are permanently stored on the Sepolia testnet blockchain
                  </p>
                </div>
                <div className="p-4 bg-card border border-border rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">Creator Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Your wallet address is recorded as the creator of the content
                  </p>
                </div>
                <div className="p-4 bg-card border border-border rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">File Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Register both text and file outputs with cryptographic hashing
                  </p>
                </div>
                <div className="p-4 bg-card border border-border rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">Searchable Registry</h3>
                  <p className="text-sm text-muted-foreground">
                    Search and filter all registered proofs by hash or creator
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">API Reference</h2>
              <div className="space-y-4">
                <div className="p-4 bg-card border border-border rounded-lg">
                  <h3 className="font-mono font-semibold text-primary mb-2">POST /api/register</h3>
                  <p className="text-sm text-muted-foreground mb-2">Register a new proof on the blockchain</p>
                  <p className="text-xs text-muted-foreground">
                    Parameters: prompt, output, creator, output_type (text or file)
                  </p>
                </div>
                <div className="p-4 bg-card border border-border rounded-lg">
                  <h3 className="font-mono font-semibold text-primary mb-2">GET /api/proofs</h3>
                  <p className="text-sm text-muted-foreground mb-2">Retrieve all registered proofs</p>
                  <p className="text-xs text-muted-foreground">Returns: list of proofs with stats</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Best Practices</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Always connect to the Sepolia testnet before registering</li>
                <li>Keep your wallet secure and never share your private keys</li>
                <li>Include detailed prompts for better proof documentation</li>
                <li>Verify your proofs in the Hashes section after registration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
