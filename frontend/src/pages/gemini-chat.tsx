"use client"

import { useState } from "react"
import { chatAndRegister } from "../api/api"

export default function GeminiChat() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const data = await chatAndRegister({ message: input })

      if (data?.response) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }])
      } else {
        console.error("Invalid API response:", data)
      }
    } catch (error) {
      console.error("Error in chat:", error)
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Something went wrong with the AI response." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex flex-col flex-1">
        <div className="space-y-4 sm:space-y-8 flex-1 flex flex-col">
          <div className="text-center space-y-2 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AI Chat Assistant
              </span>
            </h1>
            <p className="text-xs sm:text-base lg:text-lg text-muted-foreground">
              This is a demo implementation of the ProofChain API. All the prompts are hashed on the blockchain with your wallet ID.  
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 sm:p-6 h-64 sm:h-96 overflow-y-auto space-y-4 flex-1">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p className="text-sm">Start a conversation...</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm ${
                      msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 sm:gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all disabled:opacity-50 text-sm"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
