"use client"

import { useState } from "react"

export default function GeminiChat() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

const handleSend = async () => {
  if (!input.trim()) return

  const userMessage = { role: "user", content: input }
  setMessages([...messages, userMessage])
  setInput("")
  setLoading(true)

  try {
    const response = await fetch("http://127.0.0.1:8000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    })

    if (response.ok) {
      const data = await response.json()
      // Add AI message
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }])
    } else {
      console.error("Error:", await response.text())
    }
  } catch (error) {
    console.error("Error:", error)
  } finally {
    setLoading(false)
  }
}


  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                AI Chat Assistant
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">Ask questions about ProofChain and AI content registration</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 h-96 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Start a conversation...</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
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
                <div className="bg-muted text-foreground px-4 py-2 rounded-lg">Thinking...</div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="px-6 py-3 bg-linear-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
