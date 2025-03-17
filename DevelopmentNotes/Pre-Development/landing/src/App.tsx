import React, { useState } from 'react';
import { Link, ExternalLink, Menu, X, MapPin, Calendar, Newspaper, Store, Users, ChevronRight } from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1A1A1A]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="#home" className="flex items-center gap-2">
            <Link className="h-6 w-6 text-[#6c63ff]" />
            <span className="text-xl font-bold">Local<span className="text-[#6c63ff]">Linkk</span><span className="text-sm font-normal text-gray-400"></span></span>
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="hover:text-[#6c63ff] transition-colors">Home</a>
            <a href="#about" className="hover:text-[#6c63ff] transition-colors">About</a>
            <a href="#discover" className="hover:text-[#6c63ff] transition-colors">Discover</a>
            <a href="#users" className="hover:text-[#6c63ff] transition-colors">Users</a>
            <a 
              href="https://github.com/KyleSeaford/LocalLinkk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#6c63ff] hover:bg-[#5a52d5] px-4 py-2 rounded-full transition-colors"
            >
              Get Started
            </a>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#252525] py-4">
            <div className="container mx-auto px-4 flex flex-col gap-4">
              <a href="#home" className="py-2 hover:text-[#6c63ff] transition-colors" onClick={toggleMenu}>Home</a>
              <a href="#about" className="py-2 hover:text-[#6c63ff] transition-colors" onClick={toggleMenu}>About</a>
              <a href="#discover" className="py-2 hover:text-[#6c63ff] transition-colors" onClick={toggleMenu}>Discover</a>
              <a href="#users" className="py-2 hover:text-[#6c63ff] transition-colors" onClick={toggleMenu}>Users</a>
              <a 
                href="https://github.com/KyleSeaford/LocalLinkk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#6c63ff] hover:bg-[#5a52d5] px-4 py-2 rounded-full transition-colors text-center"
                onClick={toggleMenu}
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="text-[#6c63ff]">Connected</span> Better
              </h1>
              <p className="text-lg text-gray-300">
                LocalLinkk bridges the gap between local businesses and residents, helping them connect and thrive. 
                Our platform offers a variety of features, including a local events calendar, community news, and business listings.
              </p>
              <div className="pt-4">
                <a 
                  href="https://github.com/KyleSeaford/LocalLinkk" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#6c63ff] hover:bg-[#5a52d5] px-6 py-3 rounded-full text-white font-medium transition-all transform hover:scale-105"
                >
                  Learn More
                  <ChevronRight size={18} />
                </a>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-[#6c63ff]/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative bg-[#252525]/80 p-6 rounded-2xl shadow-2xl backdrop-blur-sm border border-[#6c63ff]/20">
                  <img 
                    src="https://api.metaboost.dev/icon.png" 
                    alt="LocalLinkk Community" 
                    className="w-full h-80 object-cover rounded-lg"
                  />
                  <div className="mt-4 flex gap-2">
                    <div className="bg-[#252525] p-3 rounded-lg flex-1">
                      <Calendar className="h-6 w-6 text-[#6c63ff] mb-2" />
                      <p className="text-sm">Local Events</p>
                    </div>
                    <div className="bg-[#252525] p-3 rounded-lg flex-1">
                      <Store className="h-6 w-6 text-[#6c63ff] mb-2" />
                      <p className="text-sm">Businesses</p>
                    </div>
                    <div className="bg-[#252525] p-3 rounded-lg flex-1">
                      <Newspaper className="h-6 w-6 text-[#6c63ff] mb-2" />
                      <p className="text-sm">News</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-[#252525]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 order-2 md:order-1">
              <div className="relative">
                <div className="absolute -inset-4 bg-[#6c63ff]/20 rounded-full blur-xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Community Connection" 
                  className="w-full rounded-2xl shadow-2xl relative"
                />
              </div>
            </div>
            <div className="md:w-1/2 space-y-6 order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold">
                About <span className="text-[#6c63ff]">LocalLinkk</span>
              </h2>
              <p className="text-gray-300">
                LocalLinkk is designed to bridge the gap between local businesses and residents, helping them connect and thrive.
                Our platform provides a space for local businesses to advertise their services or events directly to an audience of residents looking for exciting
                activities, services, and events in their area.
              </p>
              <p className="text-gray-300">
                LocalLinkk is the perfect platform for local businesses to reach a wider audience and for residents to
                discover new and exciting opportunities in their community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Discover Section */}
      <section id="discover" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What You Can <span className="text-[#6c63ff]">Find</span> on LocalLinkk
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Discover everything your local community has to offer, from events and services to special deals and community news.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#252525]/50 p-6 rounded-xl hover:bg-[#252525] transition-colors group">
              <div className="bg-[#252525] p-4 rounded-lg inline-block mb-4 group-hover:bg-[#6c63ff] transition-colors">
                <Calendar className="h-8 w-8 text-[#6c63ff] group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Events</h3>
              <p className="text-gray-400">
                From community festivals to charity runs, find exciting events happening near you.
              </p>
            </div>
            
            <div className="bg-[#252525]/50 p-6 rounded-xl hover:bg-[#252525] transition-colors group">
              <div className="bg-[#252525] p-4 rounded-lg inline-block mb-4 group-hover:bg-[#6c63ff] transition-colors">
                <Store className="h-8 w-8 text-[#6c63ff] group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">New Openings</h3>
              <p className="text-gray-400">
                Be the first to know about new restaurants, shops, and entertainment venues opening in your neighborhood.
              </p>
            </div>
            
            <div className="bg-[#252525]/50 p-6 rounded-xl hover:bg-[#252525] transition-colors group">
              <div className="bg-[#252525] p-4 rounded-lg inline-block mb-4 group-hover:bg-[#6c63ff] transition-colors">
                <MapPin className="h-8 w-8 text-[#6c63ff] group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Local Services</h3>
              <p className="text-gray-400">
                Find local businesses offering services such as car valeting, plumbing, dog walking, and more.
              </p>
            </div>
            
            <div className="bg-[#252525]/50 p-6 rounded-xl hover:bg-[#252525] transition-colors group">
              <div className="bg-[#252525] p-4 rounded-lg inline-block mb-4 group-hover:bg-[#6c63ff] transition-colors">
                <ExternalLink className="h-8 w-8 text-[#6c63ff] group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Special Deals</h3>
              <p className="text-gray-400">
                Exclusive promotions and discounts from local businesses.
              </p>
            </div>
            
            <div className="bg-[#252525]/50 p-6 rounded-xl hover:bg-[#252525] transition-colors group">
              <div className="bg-[#252525] p-4 rounded-lg inline-block mb-4 group-hover:bg-[#6c63ff] transition-colors">
                <Newspaper className="h-8 w-8 text-[#6c63ff] group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community News</h3>
              <p className="text-gray-400">
                Updates and announcements about what's happening in your area.
              </p>
            </div>
            
            <div className="bg-[#252525]/50 p-6 rounded-xl hover:bg-[#252525] transition-colors group">
              <div className="bg-[#252525] p-4 rounded-lg inline-block mb-4 group-hover:bg-[#6c63ff] transition-colors">
                <Users className="h-8 w-8 text-[#6c63ff] group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Hobby Groups and Classes</h3>
              <p className="text-gray-400">
                Discover local hobby groups, fitness classes, and workshops.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Businesses Section */}
      <section id="users" className="py-20 bg-[#252525]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                For <span className="text-[#6c63ff]">Local Businesses</span>
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-[#1A1A1A] p-2 rounded-lg mt-1">
                    <ChevronRight className="h-5 w-5 text-[#6c63ff]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Promote</h3>
                    <p className="text-gray-300">Your services or events directly to an audience of potential customers</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-[#1A1A1A] p-2 rounded-lg mt-1">
                    <ChevronRight className="h-5 w-5 text-[#6c63ff]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Reach</h3>
                    <p className="text-gray-300">Locals who are actively seeking things to do and services they need in their community</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-[#1A1A1A] p-2 rounded-lg mt-1">
                    <ChevronRight className="h-5 w-5 text-[#6c63ff]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Increase</h3>
                    <p className="text-gray-300">Visibility and drive sales through our platform</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-[#6c63ff]/20 rounded-full blur-xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Local Business" 
                  className="w-full rounded-2xl shadow-2xl relative"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Users Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 order-2 md:order-1">
              <div className="relative">
                <div className="absolute -inset-4 bg-[#6c63ff]/20 rounded-full blur-xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Local Users" 
                  className="w-full rounded-2xl shadow-2xl relative"
                />
              </div>
            </div>
            
            <div className="md:w-1/2 space-y-6 order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold">
                For <span className="text-[#6c63ff]">Local Users</span>
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-[#1A1A1A] p-2 rounded-lg mt-1">
                    <ChevronRight className="h-5 w-5 text-[#6c63ff]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Discover</h3>
                    <p className="text-gray-300">New and interesting activities and services in your local area</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-[#1A1A1A] p-2 rounded-lg mt-1">
                    <ChevronRight className="h-5 w-5 text-[#6c63ff]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Stay Informed</h3>
                    <p className="text-gray-300">About special deals, community news, hobby groups, and classes</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-[#1A1A1A] p-2 rounded-lg mt-1">
                    <ChevronRight className="h-5 w-5 text-[#6c63ff]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Support Local</h3>
                    <p className="text-gray-300">Businesses and help your community thrive</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#6c63ff]/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to <span className="text-[#6c63ff]">Connect</span> with Your Community?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the LocalLinkk community today and start connecting with your neighbors!
            Advertise for less than a cup of coffee.
          </p>
          <a 
            href="https://github.com/KyleSeaford/LocalLinkk" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#6c63ff] hover:bg-[#5a52d5] px-8 py-4 rounded-full text-white font-medium transition-all transform hover:scale-105 text-lg"
          >
            Get Started Now
            <ChevronRight size={20} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <Link className="h-6 w-6 text-[#6c63ff]" />
              <span className="text-xl font-bold">Local<span className="text-[#6c63ff]">Linkk</span></span>
            </div>
            
            <div className="flex gap-8 mb-6 md:mb-0">
              <a href="#home" className="hover:text-[#6c63ff] transition-colors">Home</a>
              <a href="#about" className="hover:text-[#6c63ff] transition-colors">About</a>
              <a href="#discover" className="hover:text-[#6c63ff] transition-colors">Discover</a>
              <a href="#users" className="hover:text-[#6c63ff] transition-colors">Users</a>
            </div>
            
            <div>
              <a 
                href="https://github.com/KyleSeaford/LocalLinkk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#6c63ff] hover:text-[#5a52d5] transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} LocalLinkk. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;