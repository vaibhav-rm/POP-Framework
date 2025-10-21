import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import Header from "./components/header"
import Footer from "./components/footer"
import Home from "./pages/home"
import Dashboard from "./pages/dashboard"
import ViewHashes from "./pages/view-hashes"
import Documentation from "./pages/documentation"
import GeminiChat from "./pages/gemini-chat"
import { WalletProvider } from "./components/wallet-provider"

export default function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-background text-foreground">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/hashes" element={<ViewHashes />} />
              <Route path="/docs" element={<Documentation />} />
              <Route path="/chat" element={<GeminiChat />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster />
      </Router>
    </WalletProvider>
  )
}
