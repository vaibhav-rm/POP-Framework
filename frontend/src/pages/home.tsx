"use client"

import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { getProofCount, getCreatorCount } from "../api/api" // ✅ import from api.ts

export default function Home() {
  const [stats, setStats] = useState({
    totalProofs: 0,
    uniqueCreators: 0,
    myProofs: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // ✅ Use the helper functions from api.ts
      const [proofData, creatorData] = await Promise.all([getProofCount(), getCreatorCount()])

      setStats({
        totalProofs: proofData.proof_count || 0,
        uniqueCreators: creatorData.creator_count || 0,
        myProofs: 0, // optional — can later be fetched by wallet address
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute top-1/3 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl opacity-15 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-0 left-1/2 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Section */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full backdrop-blur-sm hover:bg-primary/15 transition-colors">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-sm font-medium text-primary">Live on Sepolia Testnet</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
                <span className="block text-foreground">Immutable</span>
                <span className="block bg-linear-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  Proof of Creation
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                Register AI-generated content on the blockchain. Establish creator authenticity, protect intellectual
                property, and create permanent records of your digital creations.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/dashboard"
                className="group relative px-8 py-4 bg-linear-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/50 hover:scale-105"
              >
                <div className="absolute inset-0 bg-linear-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative flex items-center justify-center gap-2">
                  Register Proof
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>

              <Link
                to="/docs"
                className="px-8 py-4 border border-primary/50 text-primary rounded-lg font-semibold hover:bg-primary/10 hover:border-primary/80 transition-all backdrop-blur-sm"
              >
                View Documentation
              </Link>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border/50">
              <div className="space-y-2 group cursor-pointer">
                <p className="text-3xl md:text-4xl font-bold text-primary group-hover:text-accent transition-colors">
                  {stats.totalProofs}
                </p>
                <p className="text-sm text-muted-foreground">Total Proofs</p>
              </div>
              <div className="space-y-2 group cursor-pointer">
                <p className="text-3xl md:text-4xl font-bold text-accent group-hover:text-primary transition-colors">
                  {stats.uniqueCreators}
                </p>
                <p className="text-sm text-muted-foreground">Creators</p>
              </div>
              <div className="space-y-2 group cursor-pointer">
                <p className="text-3xl md:text-4xl font-bold text-secondary group-hover:text-primary transition-colors">
                  {stats.myProofs}
                </p>
                <p className="text-sm text-muted-foreground">Your Proofs</p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="relative h-96 md:h-full md:min-h-96 flex items-center justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-1 bg-linear-to-r from-primary via-accent to-secondary rounded-2xl blur opacity-30 animate-pulse"></div>

              <div className="relative bg-card/80 backdrop-blur-xl border border-primary/30 rounded-2xl p-8 space-y-8 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`,
                    }}
                  ></div>
                </div>

                <div className="relative space-y-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-linear-to-brrom-primary/20 to-accent/20 border border-primary/30">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-foreground">Blockchain Verified</h3>
                    <p className="text-sm text-muted-foreground">
                      Your content is permanently recorded on the Sepolia testnet
                    </p>
                  </div>

                  <div className="space-y-3 pt-4">
                    {[
                      { label: "Prompt Hash", icon: "📝" },
                      { label: "Output Hash", icon: "📄" },
                      { label: "Creator Address", icon: "👤" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10 hover:border-primary/30 transition-colors group/item cursor-pointer"
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-sm font-medium text-foreground group-hover/item:text-primary transition-colors">
                          {item.label}
                        </span>
                        <div className="ml-auto w-2 h-2 rounded-full bg-primary/50 group-hover/item:bg-primary transition-colors"></div>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/hashes"
                    className="block w-full mt-6 px-4 py-3 bg-linear-to-r from-primary/20 to-accent/20 border border-primary/30 text-primary rounded-lg font-semibold hover:bg-linear-to-r hover:from-primary/30 hover:to-accent/30 hover:border-primary/50 transition-all text-center"
                  >
                    View All Proofs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
