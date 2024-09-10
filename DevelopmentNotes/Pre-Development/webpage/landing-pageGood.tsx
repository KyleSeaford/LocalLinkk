'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Clock, Newspaper, Users, ArrowRight, ChevronDown, Mail } from "lucide-react"
import Image from "next/image"
import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function LandingPage() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    })
  }, [])

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-gray-200 font-sans">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1A1A1A] bg-opacity-90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-68ORAVLCY6pkQ3uDq42zemDbZYVGT5.jpg" alt="LocalLinkk Logo" width={40} height={40} className="rounded-full" />
            <span className="text-2xl font-bold text-white">LocalLinkk</span>
          </div>
          <nav className="space-x-4">
            <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a>
            <a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="h-screen flex items-center justify-center relative">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">Connect Your Community</h1>
              <p className="text-xl text-gray-400 mb-8">
                Discover local businesses, events, and connect with your neighbors. Join LocalLinkk to build a stronger, more vibrant community.
              </p>
              <div className="space-x-4">
                <Button className="bg-white text-[#1A1A1A] hover:bg-gray-200 px-8 py-3 rounded-full text-lg transition-colors">
                  Add User
                </Button>
                <Button className="bg-[#2A2A2A] text-white hover:bg-[#3A3A3A] px-8 py-3 rounded-full text-lg transition-colors">
                  Add Business
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 max-w-md w-full">
              <div className="bg-[#2A2A2A] p-8 rounded-lg shadow-xl border border-gray-700">
                <h2 className="text-2xl font-semibold mb-6 text-center text-white">Join LocalLinkk</h2>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                    <Input id="name" type="text" placeholder="John Doe" className="w-full bg-[#3A3A3A] border-gray-600 text-white placeholder-gray-500" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                    <Input id="email" type="email" placeholder="john@example.com" className="w-full bg-[#3A3A3A] border-gray-600 text-white placeholder-gray-500" />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                    <Input id="password" type="password" placeholder="••••••••" className="w-full bg-[#3A3A3A] border-gray-600 text-white placeholder-gray-500" />
                  </div>
                  <Button type="submit" className="w-full bg-white text-[#1A1A1A] hover:bg-gray-200 py-2 rounded-md transition-colors">
                    Sign Up <ArrowRight className="ml-2 h-4 w-4 inline" />
                  </Button>
                </form>
                <p className="text-gray-400 text-sm mt-4 text-center">
                  Already have an account? <a href="#" className="text-white hover:underline">Log in</a>
                </p>
              </div>
            </div>
          </div>
          <a href="#features" className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
            <ChevronDown className="w-8 h-8" />
          </a>
        </section>

        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-white">Our Features</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div data-aos="fade-up" className="space-y-4 bg-[#2A2A2A] p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <MapPin className="w-12 h-12 text-white" />
                <h3 className="text-2xl font-semibold text-white">Discover Local Gems</h3>
                <p className="text-gray-400">Find hidden treasures in your neighborhood, from cozy cafes to skilled artisans. Our platform helps you uncover unique local businesses and services that make your community special.</p>
              </div>
              <div data-aos="fade-up" data-aos-delay="100" className="space-y-4 bg-[#2A2A2A] p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <Clock className="w-12 h-12 text-white" />
                <h3 className="text-2xl font-semibold text-white">Engage in Local Events</h3>
                <p className="text-gray-400">Stay updated on community gatherings, workshops, and festivals happening near you. Never miss out on exciting local events that bring your neighborhood together.</p>
              </div>
              <div data-aos="fade-up" data-aos-delay="200" className="space-y-4 bg-[#2A2A2A] p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <Newspaper className="w-12 h-12 text-white" />
                <h3 className="text-2xl font-semibold text-white">Community Updates</h3>
                <p className="text-gray-400">Get the latest news and stories from your local area, keeping you connected and informed. Stay in the loop with important community announcements and developments.</p>
              </div>
              <div data-aos="fade-up" data-aos-delay="300" className="space-y-4 bg-[#2A2A2A] p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <Users className="w-12 h-12 text-white" />
                <h3 className="text-2xl font-semibold text-white">Build Connections</h3>
                <p className="text-gray-400">Network with local businesses and residents, fostering a strong community bond. Create meaningful relationships and collaborations within your neighborhood.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-20 bg-[#2A2A2A]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-white text-center">About LocalLinkk</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-white">Our Mission</h3>
                <p className="text-gray-300">
                  LocalLinkk is an innovative platform designed to strengthen local communities by facilitating connections between businesses and residents. Our mission is to create vibrant, connected neighborhoods where everyone can thrive.
                </p>
                <p className="text-gray-300">
                  We believe in the power of local connections to transform communities and improve lives. By bringing together businesses, residents, and local events, we're fostering a sense of belonging and mutual support.
                </p>
              </div>
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-white">What We Offer</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>A platform to discover and support local businesses</li>
                  <li>Easy access to community events and activities</li>
                  <li>Up-to-date local news and important updates</li>
                  <li>Opportunities to build meaningful relationships with neighbors</li>
                  <li>Tools for businesses to engage with their local customer base</li>
                </ul>
                <Button className="mt-4 bg-white text-[#1A1A1A] hover:bg-gray-200 px-6 py-2 rounded-full transition-colors">
                  Learn More About Us
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-20">
          <div className="container mx-auto px-4">
            <div className="bg-[#2A2A2A] p-12 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold mb-8 text-white text-center">Stay Connected</h2>
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="md:w-1/2 space-y-4">
                  <p className="text-xl text-gray-300">
                    Get exclusive updates on new features and be the first to know when LocalLinkk launches in your area.
                  </p>
                  <ul className="text-gray-400">
                    <li className="flex items-center space-x-2">
                      <Mail className="w-5 h-5" />
                      <span>Monthly newsletter with community highlights</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span>Early access to new features and events</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Users className="w-5 h-5" />
                      <span>Invitations to exclusive community meetups</span>
                    </li>
                  </ul>
                </div>
                <div className="md:w-1/2 w-full max-w-md">
                  <form className="space-y-4">
                    <Input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="w-full bg-[#3A3A3A] border-gray-600 text-white placeholder-gray-500"
                    />
                    <Button type="submit" className="w-full bg-white text-[#1A1A1A] hover:bg-gray-200 transition-colors">
                      Subscribe to Updates
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#2A2A2A] py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2023 LocalLinkk. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}