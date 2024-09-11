'use client'

import { useState } from "react"
import { Send, ChevronDown } from "lucide-react"

export default function XpertAILanding() {
  const [message, setMessage] = useState("")
  const [showMore, setShowMore] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Message sent:", message)
    setMessage("")
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <main className="container mx-auto px-4 flex-grow flex flex-col justify-center items-center">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <svg className="w-24 h-24 mx-auto mb-6" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" stroke="#6366F1" strokeWidth="10"/>
              <path d="M30 50 L50 70 L70 30" stroke="#6366F1" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1 className="text-4xl font-bold mb-4 text-indigo-400">XpertAI</h1>
            <p className="text-xl mb-8 text-gray-400">
              Your intelligent companion for any question.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-4 items-center mb-8">
            <input
              type="text"
              placeholder="Ask XpertAI anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-grow text-lg py-6 bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
            />
            <button type="submit" size="lg" className="px-8 bg-indigo-600 hover:bg-indigo-700">
              <Send className="h-5 w-5 mr-2" />
              Send
            </button>
          </form>
        </div>
        {!showMore && (
          <button
            variant="ghost"
            size="sm"
            className="mt-8 text-gray-400 hover:text-gray-200"
            onClick={() => setShowMore(true)}
          >
            Learn More <ChevronDown className="ml-2 h-4 w-4" />
          </button>
        )}
      </main>

      {showMore && (
        <>
          <section className="py-20 bg-gray-800">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 text-indigo-400">Key Features</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { title: "Advanced Learning", description: "Continuously improves and adapts to your needs" },
                  { title: "Natural Conversations", description: "Engage in human-like dialogues with ease" },
                  { title: "Powerful Processing", description: "Handle complex tasks with lightning speed" },
                  { title: "Secure & Private", description: "Your data is always protected and confidential" },
                ].map((feature, index) => (
                  <div key={index} className="bg-gray-700 p-6 rounded-lg shadow-md transition-transform hover:scale-105">
                    <h3 className="text-xl font-semibold mb-2 text-indigo-300">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-20 bg-indigo-900">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-6 text-indigo-200">Ready to experience the future?</h2>
              <p className="mb-8 text-indigo-100">Join our waitlist and be among the first to try XpertAI</p>
              <form className="flex gap-4 justify-center max-w-md mx-auto">
                <input type="email" placeholder="Enter your email" className="flex-grow bg-indigo-800 border-indigo-700 text-indigo-100 placeholder-indigo-300" />
                <button variant="secondary" className="bg-indigo-500 hover:bg-indigo-600 text-indigo-100">Join Waitlist</button>
              </form>
            </div>
          </section>

          <footer className="container mx-auto px-4 py-8 text-center text-gray-500">
            <p>&copy; 2023 XpertAI. All rights reserved.</p>
          </footer>
        </>
      )}
    </div>
  )
}