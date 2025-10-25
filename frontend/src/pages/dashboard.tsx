"use client"

import type React from "react"
import { useState } from "react"
import { useWallet } from "../components/wallet-provider"
import { registerProof } from "../api/api"
import { CopyButton } from "../components/copy-button"

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
    e.preventDefault()
    setLoading(true)
    setError("")
    setResult(null)

    if (!isConnected) {
      setError("Please connect your wallet first")
      setLoading(false)
      return
    }

    try {
      if (outputType === "text") {
        const data = await registerProof(prompt, output)
        setResult({
          message: "Proof registered successfully",
          prompt_hash: data.prompt_hash,
          output_hash: data.output_hash,
          creator: address,
          tx_hash: data.tx_hash,
          blockNumber: data.block_number,
        })
      } else if (fileOutput) {
        const fileText = await fileOutput.text()
        const data = await registerProof(prompt, fileText)
        setResult({
          message: "File proof registered successfully",
          prompt_hash: data.prompt_hash,
          output_hash: data.output_hash,
          creator: address,
          tx_hash: data.tx_hash,
          blockNumber: data.block_number,
        })
      } else {
        throw new Error("Please provide either text or a file as output")
      }

      setPrompt("")
      setOutput("")
      setFileOutput(null)
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-background via-background to-background/50">
      <div className="max-w-2xl mx-auto">
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="text-center space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Register Your Proof
              </span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
              Submit your AI-generated content to be registered on the blockchain
            </p>
          </div>

          {/* Wallet Status */}
          {!isConnected && (
            <div className="p-3 sm:p-4 bg-destructive/10 border border-destructive/30 rounded-lg animate-in fade-in duration-300">
              <p className="text-xs sm:text-sm text-destructive">Please connect your wallet to register proofs</p>
            </div>
          )}

          {isConnected && (
            <div className="p-3 sm:p-4 bg-primary/10 border border-primary/30 rounded-lg animate-in fade-in duration-300">
              <p className="text-xs sm:text-sm text-primary">
                Connected as: <span className="font-mono break-all">{address}</span>
              </p>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleRegister}
            className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100"
          >
            <div className="space-y-4">
              {/* Prompt Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Your Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter the prompt you used to generate the content..."
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm sm:text-base resize-none"
                  rows={4}
                  required
                />
              </div>

              {/* Output Type Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Output Type</label>
                <div className="flex gap-3 sm:gap-4">
                  <label
                    className={`flex items-center gap-2 cursor-pointer flex-1 p-3 border rounded-lg transition-all ${
                      outputType === "text" ? "border-primary/50 bg-primary/5" : "border-border hover:bg-card/50"
                    }`}
                  >
                    <input
                      type="radio"
                      value="text"
                      checked={outputType === "text"}
                      onChange={(e) => setOutputType(e.target.value as "text" | "file")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-foreground">Text Output</span>
                  </label>
                  <label
                    className={`flex items-center gap-2 cursor-pointer flex-1 p-3 border rounded-lg transition-all ${
                      outputType === "file" ? "border-primary/50 bg-primary/5" : "border-border hover:bg-card/50"
                    }`}
                  >
                    <input
                      type="radio"
                      value="file"
                      checked={outputType === "file"}
                      onChange={(e) => setOutputType(e.target.value as "text" | "file")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-foreground">File Output</span>
                  </label>
                </div>
              </div>

              {/* Output Input */}
              {outputType === "text" ? (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Generated Output</label>
                  <textarea
                    value={output}
                    onChange={(e) => setOutput(e.target.value)}
                    placeholder="Enter the AI-generated output..."
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm sm:text-base resize-none"
                    rows={4}
                    required
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Upload File Output</label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      required
                    />
                  </div>
                  {fileOutput && (
                    <div className="flex items-center gap-2 p-2 rounded bg-primary/5 border border-primary/20 animate-in fade-in duration-300">
                      <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-xs sm:text-sm text-primary">Selected: {fileOutput.name}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 sm:p-4 bg-destructive/10 border border-destructive/30 rounded-lg animate-in fade-in duration-300">
                <p className="text-xs sm:text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isConnected}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base hover:scale-105 active:scale-95 transform duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                  Registering...
                </span>
              ) : (
                "Register Proof on Blockchain"
              )}
            </button>
          </form>

          {/* Success Result */}
          {result && (
            <div className="p-4 sm:p-6 bg-gradient-to-br from-card/80 to-card/40 border border-primary/30 rounded-lg space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center animate-in zoom-in duration-300">
                  <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-primary">Proof Registered Successfully!</h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                {/* Prompt Hash */}
                <div className="space-y-2 p-3 sm:p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-muted-foreground font-semibold">Prompt Hash</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-xs break-all flex-1 text-primary">{result.prompt_hash}</p>
                    <CopyButton text={result.prompt_hash} label="Copy" />
                  </div>
                </div>

                {/* Output Hash */}
                <div className="space-y-2 p-3 sm:p-4 rounded-lg bg-accent/5 border border-accent/10">
                  <p className="text-muted-foreground font-semibold">Output Hash</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-xs break-all flex-1 text-accent">{result.output_hash}</p>
                    <CopyButton text={result.output_hash} label="Copy" />
                  </div>
                </div>

                {/* Creator Address */}
                <div className="space-y-2 p-3 sm:p-4 rounded-lg bg-secondary/5 border border-secondary/10">
                  <p className="text-muted-foreground font-semibold">Creator Address</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-xs break-all flex-1 text-secondary">{result.creator}</p>
                    <CopyButton text={result.creator} label="Copy" />
                  </div>
                </div>

                {/* Transaction Hash */}
                <div className="space-y-2 p-3 sm:p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-muted-foreground font-semibold">Transaction Hash</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-xs break-all flex-1 text-primary">{result.tx_hash}</p>
                    <CopyButton text={result.tx_hash} label="Copy" />
                  </div>
                </div>

                {/* Block Number */}
                <div className="space-y-2 p-3 sm:p-4 rounded-lg bg-secondary/5 border border-secondary/10">
                  <p className="text-muted-foreground font-semibold">Block Number</p>
                  <p className="font-mono text-xs text-secondary font-bold">{result.blockNumber}</p>
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
