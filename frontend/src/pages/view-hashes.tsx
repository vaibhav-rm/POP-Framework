"use client"

import { useState, useEffect } from "react"
import { useWallet } from "../components/wallet-provider"
import { getAllProofs, getProofCount, getCreatorCount } from "../api/api"
import { ProofCard } from "../components/proof-card"
import { LoadingSpinner } from "../components/loading-spinner"

export default function ViewHashes() {
  const { address } = useWallet()
  const [proofs, setProofs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"recent" | "oldest">("recent")
  const [filterType, setFilterType] = useState<"all" | "my">("all")
  const [stats, setStats] = useState({ totalProofs: 0, uniqueCreators: 0, myProofs: 0 })

  useEffect(() => {
    fetchProofs()
    const interval = setInterval(fetchProofs, 30000)
    return () => clearInterval(interval)
  }, [address])

  const fetchProofs = async () => {
    try {
      const [proofData, proofCount, creatorCount] = await Promise.all([
        getAllProofs(),
        getProofCount(),
        getCreatorCount(),
      ])

      setProofs(proofData.proofs || [])
      setStats({
        totalProofs: proofCount.total || proofData.proofs.length,
        uniqueCreators: creatorCount.total || 0,
        myProofs: proofData.proofs.filter((p: any) => p.creator.toLowerCase() === address?.toLowerCase()).length,
      })
    } catch (error) {
      console.error("Error fetching proofs:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProofs = proofs
    .filter((proof) => {
      if (filterType === "my" && address) {
        return proof.creator.toLowerCase() === address.toLowerCase()
      }
      return true
    })
    .filter((proof) =>
      searchTerm === ""
        ? true
        : proof.prompt_hash.includes(searchTerm) ||
          proof.output_hash.includes(searchTerm) ||
          proof.creator.includes(searchTerm),
    )
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      }
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    })

  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-background via-background to-background/50">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="text-center space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Registered Proofs
              </span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
              View all AI content proofs registered on the blockchain
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            {[
              { label: "Total Proofs", value: stats.totalProofs, color: "primary", icon: "⛓️" },
              { label: "Unique Creators", value: stats.uniqueCreators, color: "accent", icon: "👥" },
              { label: "Your Proofs", value: stats.myProofs, color: "secondary", icon: "📌" },
            ].map((stat, i) => (
              <div
                key={i}
                className={`group p-4 sm:p-6 bg-card border border-border rounded-lg hover:border-${stat.color}/50 transition-all hover:shadow-lg hover:shadow-${stat.color}/10 hover:-translate-y-1 cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">{stat.label}</p>
                  <span className="text-lg sm:text-xl">{stat.icon}</span>
                </div>
                <p
                  className={`text-2xl sm:text-3xl font-bold text-${stat.color} group-hover:scale-110 transition-transform`}
                >
                  {stat.value.toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <input
              type="text"
              placeholder="Search by hash or creator address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
            />
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "recent" | "oldest")}
                className="px-3 sm:px-4 py-2 sm:py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-xs sm:text-sm"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as "all" | "my")}
                className="px-3 sm:px-4 py-2 sm:py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-xs sm:text-sm"
              >
                <option value="all">All Proofs</option>
                <option value="my">My Proofs</option>
              </select>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20">
              <LoadingSpinner />
              <p className="text-muted-foreground text-sm mt-4">Loading proofs...</p>
            </div>
          ) : filteredProofs.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-muted-foreground text-sm">No proofs found</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4 animate-in fade-in duration-500 delay-300">
              {filteredProofs.map((proof, i) => (
                <div
                  key={i}
                  className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <ProofCard proof={proof} isOwn={proof.creator.toLowerCase() === address?.toLowerCase()} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
