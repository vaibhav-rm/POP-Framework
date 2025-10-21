"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface WalletContextType {
  address: string | null
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
  chainId: number | null
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [chainId, setChainId] = useState<number | null>(null)

  useEffect(() => {
    checkWalletConnection()

    if (typeof window !== "undefined" && (window as any).ethereum) {
      const handleAccountsChanged = (newAccounts: string[]) => {
        if (newAccounts.length === 0) {
          setAddress(null)
          setIsConnected(false)
        } else {
          setAddress(newAccounts[0])
          setIsConnected(true)
        }
      }

      const handleChainChanged = (newChainId: string) => {
        setChainId(Number.parseInt(newChainId, 16))
      }
      ;(window as any).ethereum.on("accountsChanged", handleAccountsChanged)
      ;(window as any).ethereum.on("chainChanged", handleChainChanged)

      return () => {
        ;(window as any).ethereum.removeListener("accountsChanged", handleAccountsChanged)
        ;(window as any).ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [])

  const checkWalletConnection = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          setAddress(accounts[0])
          setIsConnected(true)
          const chainIdHex = await (window as any).ethereum.request({ method: "eth_chainId" })
          setChainId(Number.parseInt(chainIdHex, 16))
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error)
      }
    }
  }

  const connect = async () => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      alert("Please install MetaMask or another Web3 wallet")
      return
    }

    try {
      const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" })
      setAddress(accounts[0])
      setIsConnected(true)

      const chainIdHex = await (window as any).ethereum.request({ method: "eth_chainId" })
      const chainIdNum = Number.parseInt(chainIdHex, 16)
      setChainId(chainIdNum)

      if (chainIdNum !== 11155111) {
        alert("Please switch to Sepolia testnet")
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
    }
  }

  const disconnect = () => {
    setAddress(null)
    setIsConnected(false)
    setChainId(null)
  }

  return (
    <WalletContext.Provider value={{ address, isConnected, connect, disconnect, chainId }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider")
  }
  return context
}
