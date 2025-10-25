"use client"

import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { getProofCount, getCreatorCount } from "../api/api"

export default function Home() {
  const [stats, setStats] = useState({
    totalProofs: 0,
    uniqueCreators: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [proofData, creatorData] = await Promise.all([getProofCount(), getCreatorCount()])
      setStats({
        totalProofs: proofData.proof_count || 0,
        uniqueCreators: creatorData.creator_count || 0,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/30 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute top-1/3 right-1/4 w-56 h-56 sm:w-80 sm:h-80 bg-accent/20 rounded-full blur-3xl opacity-15 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-0 left-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-secondary/20 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Section */}
          <div className="space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-primary/10 border border-primary/30 rounded-full backdrop-blur-sm hover:bg-primary/15 transition-colors text-xs sm:text-sm">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="font-medium text-primary">Live on Sepolia Testnet</span>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
                <span className="block text-foreground">Immutable</span>
                <span className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  Proof of Creation
                </span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                Register AI-generated content on the blockchain. Establish creator authenticity, protect intellectual
                property, and create permanent records of your digital creations.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <Link
                to="/dashboard"
                className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/50 hover:scale-105 text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative flex items-center justify-center gap-2">
                  Register Proof
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"
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
                className="px-6 sm:px-8 py-3 sm:py-4 border border-primary/50 text-primary rounded-lg font-semibold hover:bg-primary/10 hover:border-primary/80 transition-all backdrop-blur-sm text-center"
              >
                View Documentation
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-border/50">
              <div className="space-y-2 group cursor-pointer">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary group-hover:text-accent transition-colors">
                  {stats.totalProofs}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Proofs</p>
              </div>
              <div className="space-y-2 group cursor-pointer">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-accent group-hover:text-primary transition-colors">
                  {stats.uniqueCreators}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">Creators</p>
              </div>
              <div className="space-y-2 group cursor-pointer">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary group-hover:text-primary transition-colors">
                  ∞
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">Immutable</p>
              </div>
            </div>
          </div>

          <div className="relative h-80 sm:h-96 md:h-full md:min-h-96 flex items-center justify-center mt-8 lg:mt-0">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-2xl blur opacity-30 animate-pulse"></div>

              <div className="relative bg-card/80 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 sm:p-8 space-y-6 sm:space-y-8 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`,
                    }}
                  ></div>
                </div>

                <div className="relative space-y-4 sm:space-y-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
                    <svg
                      className="w-7 h-7 sm:w-8 sm:h-8 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground">Blockchain Verified</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Your content is permanently recorded on the Sepolia testnet
                    </p>
                  </div>

                  <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-4">
                    {[
                      { label: "Prompt Hash", icon: "📝" },
                      { label: "Output Hash", icon: "📄" },
                      { label: "Creator Address", icon: "👤" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2 sm:p-3 rounded-lg bg-primary/5 border border-primary/10 hover:border-primary/30 transition-colors group/item cursor-pointer"
                      >
                        <span className="text-base sm:text-lg">{item.icon}</span>
                        <span className="text-xs sm:text-sm font-medium text-foreground group-hover/item:text-primary transition-colors">
                          {item.label}
                        </span>
                        <div className="ml-auto w-2 h-2 rounded-full bg-primary/50 group-hover/item:bg-primary transition-colors"></div>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/hashes"
                    className="block w-full mt-4 sm:mt-6 px-4 py-2 sm:py-3 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-primary rounded-lg font-semibold hover:bg-gradient-to-r hover:from-primary/30 hover:to-accent/30 hover:border-primary/50 transition-all text-center text-sm sm:text-base"
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
