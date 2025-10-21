"use client"

import { useState, useEffect } from "react"
import { useWallet } from "../components/wallet-provider"

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
      const response = await fetch("/api/proofs")
      if (response.ok) {
        const data = await response.json()
        setProofs(data.proofs || [])
        setStats(data.stats || { totalProofs: 0, uniqueCreators: 0, myProofs: 0 })
      }
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
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Registered Proofs
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">View all AI content proofs registered on the blockchain</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-6 bg-card border border-border rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Total Proofs</p>
              <p className="text-3xl font-bold text-primary">{stats.totalProofs.toLocaleString()}</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Unique Creators</p>
              <p className="text-3xl font-bold text-accent">{stats.uniqueCreators.toLocaleString()}</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Your Proofs</p>
              <p className="text-3xl font-bold text-secondary">{stats.myProofs}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Search by hash or creator address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "recent" | "oldest")}
                className="px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as "all" | "my")}
                className="px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">All Proofs</option>
                <option value="my">My Proofs</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading proofs...</p>
            </div>
          ) : filteredProofs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No proofs found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Prompt Hash</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Output Hash</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Type</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Creator</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProofs.map((proof, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                      <td className="py-4 px-4 font-mono text-xs text-primary truncate">{proof.prompt_hash}</td>
                      <td className="py-4 px-4 font-mono text-xs text-accent truncate">{proof.output_hash}</td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                          {proof.output_type === "file" ? "📁 File" : "📄 Text"}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono text-xs text-muted-foreground truncate">{proof.creator}</td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {new Date(proof.timestamp).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
