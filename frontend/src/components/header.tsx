"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useWallet } from "./wallet-provider"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { address, isConnected, connect, disconnect } = useWallet()
  const location = useLocation()

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/chat", label: "AI Chat" },
    { path: "/hashes", label: "Hashes" },
    { path: "/docs", label: "Docs" },
  ]

  const handleWalletClick = () => {
    if (isConnected) {
      disconnect()
    } else {
      connect()
    }
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 cursor-pointer flex-shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg shadow-primary/50">
              <span className="text-white font-bold text-sm sm:text-lg">⛓</span>
            </div>
            <div className="flex flex-col hidden sm:block">
              <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ProofChain
              </span>
              <span className="text-xs text-muted-foreground">AI Content Proof</span>
            </div>
          </Link>

          <nav className="hidden md:flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium rounded-lg transition-all ${
                  location.pathname === item.path
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            onClick={handleWalletClick}
            className={`hidden md:block px-4 lg:px-6 py-2 rounded-lg font-medium transition-all text-xs lg:text-sm ${
              isConnected
                ? "bg-accent/20 text-accent border border-accent/30 hover:bg-accent/30"
                : "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg hover:shadow-primary/50"
            }`}
          >
            {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : "Connect"}
          </button>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isOpen && (
          <nav className="md:hidden pb-4 space-y-2 border-t border-border/50 pt-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block w-full text-left px-4 py-2 text-sm font-medium rounded transition-all ${
                  location.pathname === item.path
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-card"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => {
                handleWalletClick()
                setIsOpen(false)
              }}
              className={`block w-full text-left px-4 py-2 text-sm font-medium rounded transition-all ${
                isConnected
                  ? "bg-accent/20 text-accent border border-accent/30"
                  : "bg-primary/20 text-primary border border-primary/30"
              }`}
            >
              {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : "Connect Wallet"}
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}
