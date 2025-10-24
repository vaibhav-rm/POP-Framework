"use client"

import type React from "react"

import { useState } from "react"
import { useWallet } from "../components/wallet-provider"
import { registerProof } from "../api/api";

export default function Dashboard() {
  const { address, isConnected } = useWallet()
  const [prompt, setPrompt] = useState("")
  const [output, setOutput] = useState("")
  const [fileOutput, setFileOutput] = useState<File | null>(null)
  const [outputType, setOutputType] = useState<"text" | "file">("text")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileOutput(e.target.files[0])
    }
  }

const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  setResult(null);

  if (!isConnected) {
    setError("Please connect your wallet first");
    setLoading(false);
    return;
  }

  try {
    if (outputType === "text") {
      const data = await registerProof(prompt, output);
setResult({
  message: "Proof registered successfully",
  prompt_hash: data.prompt_hash,
  output_hash: data.output_hash,
  creator: address,          // add creator address
  tx_hash: data.tx_hash,
  blockNumber: data.block_number, // make sure this matches API response
});

    } else if (fileOutput) {
      const fileText = await fileOutput.text();
      const data = await registerProof(prompt, fileText);
  setResult({
    message: "File proof registered successfully",
    prompt_hash: data.prompt_hash,
    output_hash: data.output_hash,
    creator: address,
    tx_hash: data.tx_hash,
    blockNumber: data.block_number,
  });
    } else {
      throw new Error("Please provide either text or a file as output");
    }

    //Reset fields after successful registration
    setPrompt("");
    setOutput("");
    setFileOutput(null);
  } catch (err: any) {
    setError(err.response?.data?.detail || err.message || "An error occurred");
  } finally {
    setLoading(false);
  }
};


  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                Register Your Proof
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Submit your AI-generated content to be registered on the blockchain
            </p>
          </div>

          {!isConnected && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
              <p className="text-sm text-destructive">Please connect your wallet to register proofs</p>
            </div>
          )}

          {isConnected && (
            <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
              <p className="text-sm text-primary">Connected as: {address}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Your Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter the prompt you used to generate the content..."
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Output Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="text"
                      checked={outputType === "text"}
                      onChange={(e) => setOutputType(e.target.value as "text" | "file")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-foreground">Text Output</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="file"
                      checked={outputType === "file"}
                      onChange={(e) => setOutputType(e.target.value as "text" | "file")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-foreground">File Output</span>
                  </label>
                </div>
              </div>

              {outputType === "text" ? (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Generated Output</label>
                  <textarea
                    value={output}
                    onChange={(e) => setOutput(e.target.value)}
                    placeholder="Enter the AI-generated output..."
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    rows={4}
                    required
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Upload File Output</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    required
                  />
                  {fileOutput && <p className="text-sm text-primary">Selected: {fileOutput.name}</p>}
                </div>
              )}
            </div>

            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !isConnected}
              className="w-full px-6 py-3 bg-linear-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Register Proof on Blockchain"}
            </button>
          </form>

          {result && (
            <div className="p-6 bg-card border border-primary/30 rounded-lg space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <h3 className="text-lg font-semibold text-primary">Proof Registered Successfully!</h3>
              </div>

              <div className="space-y-3 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Prompt Hash</p>
                  <p className="font-mono text-xs text-primary break-all">{result.prompt_hash}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-muted-foreground">Output Hash</p>
                  <p className="font-mono text-xs text-primary break-all">{result.output_hash}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-muted-foreground">Creator Address</p>
                  <p className="font-mono text-xs text-accent break-all">{result.creator}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-muted-foreground">Transaction Hash</p>
                  <p className="font-mono text-xs text-accent break-all">{result.tx_hash}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-muted-foreground">Block Number</p>
                  <p className="font-mono text-xs text-secondary">{result.blockNumber}</p>
                </div>
              </div>

              <button
                onClick={() => setResult(null)}
                className="w-full px-4 py-2 bg-primary/10 border border-primary/30 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-all"
              >
                Register Another Proof
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
