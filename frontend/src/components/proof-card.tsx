"use client"

import { useState } from "react"
import { CopyButton } from "./copy-button"

interface ProofCardProps {
  proof: any
  isOwn?: boolean
}

export function ProofCard({ proof, isOwn = false }: ProofCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
      </div>

      <div className="relative space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">⛓️</span>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                {proof.output_type === "file" ? "📁 File Proof" : "📄 Text Proof"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(proof.timestamp).toLocaleDateString()} at {new Date(proof.timestamp).toLocaleTimeString()}
            </p>
          </div>
          <div className={`transform transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}>
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* Creator Badge */}
        {isOwn && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            <span className="text-xs font-medium text-accent">Your Proof</span>
          </div>
        )}

        {/* Collapsed View */}
        {!expanded && (
          <div className="space-y-2">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Prompt Hash</p>
              <p className="font-mono text-xs text-primary truncate">{proof.prompt_hash}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Output Hash</p>
              <p className="font-mono text-xs text-accent truncate">{proof.output_hash}</p>
            </div>
          </div>
        )}

        {/* Expanded View */}
        {expanded && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="space-y-2 p-4 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-xs text-muted-foreground font-semibold">Prompt Hash</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-xs text-primary break-all flex-1">{proof.prompt_hash}</p>
                <CopyButton text={proof.prompt_hash} label="Copy" />
              </div>
            </div>

            <div className="space-y-2 p-4 rounded-lg bg-accent/5 border border-accent/10">
              <p className="text-xs text-muted-foreground font-semibold">Output Hash</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-xs text-accent break-all flex-1">{proof.output_hash}</p>
                <CopyButton text={proof.output_hash} label="Copy" />
              </div>
            </div>

            <div className="space-y-2 p-4 rounded-lg bg-secondary/5 border border-secondary/10">
              <p className="text-xs text-muted-foreground font-semibold">Creator Address</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-xs text-secondary break-all flex-1">{proof.creator}</p>
                <CopyButton text={proof.creator} label="Copy" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
