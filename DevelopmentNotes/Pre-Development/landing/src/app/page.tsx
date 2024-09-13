'use client'

import { MapPin, Clock, Newspaper, Users, ArrowRight, ChevronDown, Mail } from "lucide-react"
import { useEffect } from 'react';
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
    <div className="min-h-screen bg-gray text-gray-800 font-sans">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center" data-aos="fade-down">
          <div className="flex items-center space-x-2">
            <img src="favicon.ico" alt="LocalLinkk Logo" width={40} height={40} className="rounded-full" />
            <span className="text-2xl font-bold">LocalLinkk</span>
          </div>
          <nav className="space-x-4">
            <a href="#features" className="hover:underline transition-colors">Features</a>
            <a href="#about" className="hover:underline transition-colors">About</a>
            <a href="#contact" className="hover:underline transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="h-screen flex items-center justify-center relative" data-aos="fade-up">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2" data-aos="fade-right">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">Connect Your Community</h1>
              <p className="text-xl mb-8">
                Discover local businesses, events, and connect with your neighbors. Join LocalLinkk to build a stronger, more vibrant community.
              </p>
              <div className="space-x-4">
                <button className="bg-gray-800 text-white hover:bg-gray-700 px-8 py-3 rounded-full text-lg transition-colors">
                  Add User
                </button>
                <button className="bg-gray-600 text-white hover:bg-gray-700 px-8 py-3 rounded-full text-lg transition-colors">
                  Add Business
                </button>
              </div>
            </div>
            <div className="md:w-1/2 max-w-md w-full" data-aos="fade-left">
              <div className="bg-gray-600 p-8 rounded-lg shadow-xl">
                <h2 className="text-2xl font-semibold mb-6 text-center">Join LocalLinkk</h2>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                    <input id="name" type="text" placeholder="John Doe" className="w-full bg-gray-700 border-gray-600" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                    <input id="email" type="email" placeholder="john@example.com" className="w-full bg-gray-700 border-gray-600" />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                    <input id="password" type="password" placeholder="••••••••" className="w-full bg-gray-700 border-gray-600" />
                  </div>
                  <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded-md transition-colors">
                    Sign Up <ArrowRight className="ml-2 h-4 w-4 inline" />
                  </button>
                </form>
                <p className="text-sm mt-4 text-center">
                  Already have an account? <a href="#" className="hover:underline">Log in</a>
                </p>
              </div>
            </div>
          </div>
          <a href="#features" className="absolute bottom-8 left-1/2 transform -translate-x-1/2" data-aos="fade-up">
            <ChevronDown className="w-8 h-8" />
          </a>
        </section>

        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center" data-aos="fade-up">Our Features</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div data-aos="fade-up" className="space-y-4 bg-gray-700 p-6 rounded-lg shadow-lg">
                <MapPin className="w-12 h-12" />
                <h3 className="text-2xl font-semibold">Discover Local Gems</h3>
                <p className="text-gray-400">Find hidden treasures in your neighborhood, from cozy cafes to skilled artisans. Our platform helps you uncover unique local businesses and services that make your community special.</p>              </div>
              <div data-aos="fade-up" data-aos-delay="100" className="space-y-4 bg-gray-700 p-6 rounded-lg shadow-lg">
                <Clock className="w-12 h-12" />
                <h3 className="text-2xl font-semibold">Engage in Local Events</h3>
                <p className="text-gray-400">Stay updated on community gatherings, workshops, and festivals happening near you. Never miss out on exciting local events that bring your neighborhood together.</p>              </div>
              <div data-aos="fade-up" data-aos-delay="200" className="space-y-4 bg-gray-700 p-6 rounded-lg shadow-lg">
                <Newspaper className="w-12 h-12" />
                <h3 className="text-2xl font-semibold">Community Updates</h3>
                <p className="text-gray-400">Get the latest news and stories from your local area, keeping you connected and informed. Stay in the loop with important community announcements and developments.</p>              </div>
              <div data-aos="fade-up" data-aos-delay="300" className="space-y-4 bg-gray-700 p-6 rounded-lg shadow-lg">
                <Users className="w-12 h-12" />
                <h3 className="text-2xl font-semibold">Build Connections</h3>
                <p className="text-gray-400">Network with local businesses and residents, fostering a strong community bond. Create meaningful relationships and collaborations within your neighborhood.</p>              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-20 bg-gray-700">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center" data-aos="fade-up">About LocalLinkk</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6" data-aos="fade-right">
                <h3 className="text-2xl font-semibold">Our Mission</h3>
                <p className="text-gray-300">
                  LocalLinkk is an innovative platform designed to strengthen local communities by facilitating connections between businesses and residents. Our mission is to create vibrant, connected neighborhoods where everyone can thrive.
                </p>
                <p className="text-gray-300">
                  We believe in the power of local connections to transform communities and improve lives. By bringing together businesses, residents, and local events, we're fostering a sense of belonging and mutual support.
                </p>
              </div>
              <div className="space-y-6" data-aos="fade-left">
                <h3 className="text-2xl font-semibold">What We Offer</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>A platform to discover and support local businesses</li>
                  <li>Easy access to community events and activities</li>
                  <li>Up-to-date local news and important updates</li>
                  <li>Opportunities to build meaningful relationships with neighbors</li>
                  <li>Tools for businesses to engage with their local customer base</li>
                </ul>
                <button className="mt-4 bg-gray-800 text-white hover:bg-gray-700 px-6 py-2 rounded-full transition-colors">
                  Learn More About Us
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-20">
          <div className="container mx-auto px-4" data-aos="fade-up">
            <div className="bg-gray-700 p-12 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold mb-8 text-center">Stay Connected</h2>
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="md:w-1/2 space-y-4" data-aos="fade-right">
                  <p className="text-xl">
                    Get exclusive updates on new features and be the first to know when LocalLinkk launches in your area.
                  </p>
                  <ul>
                    <li className="flex items-center space-x-2">
                      <Mail className="w-5 h-5" />
                      <span>Exclusive updates on LocalLinkk</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span>Early access to new features and events</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5" />
                      <span>Recommendations for local businesses</span>
                    </li>
                  </ul>
                </div>
                <div className="md:w-1/2" data-aos="fade-left">
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="email-newsletter" className="block text-sm font-medium mb-1">Email Address</label>
                      <input id="email-newsletter" type="email" placeholder="john@example.com" className="w-full bg-gray-700 border-gray-600" />
                    </div>
                    <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded-md transition-colors">
                      Subscribe Now <ArrowRight className="ml-2 h-4 w-4 inline" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 py-6">
        <div className="container mx-auto px-4 text-center" data-aos="fade-up">
          <p>&copy; 2023 LocalLinkk. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
