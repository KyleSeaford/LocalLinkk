'use client'

import { MapPin, Clock, Newspaper, Users, ArrowRight, ChevronDown, Mail, CheckCheck, MessageCircleQuestion , ShieldCheck, Activity } from "lucide-react"
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
            <a href="/" className="hover:underline transition-colors">Home</a>
            <a href="#features" className="hover:underline transition-colors">Features</a>
            <a href="#about" className="hover:underline transition-colors">About</a>
            <a href="#help" className="hover:underline transition-colors">Help</a> 
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
                    <input id="password" type="password" placeholder="•••••••••••" className="w-full bg-gray-700 border-gray-600" />
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
            <a href="#features" className="absolute bottom-8 left-1/2 transform -translate-x-1/2 place-self-center" data-aos="fade-up">
            <ChevronDown className="w-8 h-8"/>
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
          </div >
          <div  id="help"></div>
        </section >

        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12" data-aos="fade-up">Help & FAQs</h1>

        {/* FAQs Section */ }
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center" data-aos="fade-up">FAQs</h2>
          <div className="space-y-6" data-aos="fade-right">
            {/* FAQ Item 1 */}
            <div className="p-4 bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold flex items-center">
                <MessageCircleQuestion  className="w-6 h-6 mr-2" /> Q1: How do I choose my location?
              </h3>
              <p className="mt-2 text-gray-600">
                A: To select your location, go to the settings menu and tap on 'Location'. You can then choose from a list of available locations.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="p-4 bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold flex items-center">
                <MessageCircleQuestion  className="w-6 h-6 mr-2" /> Q2: How do I update my profile picture?
              </h3>
              <p className="mt-2 text-gray-600">
                A: To update your profile picture, go to your profile page, tap the edit button, and select a new profile picture from your device's photo library.
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="p-4 bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold flex items-center">
                <MessageCircleQuestion  className="w-6 h-6 mr-2" /> Q3: How do I change my profile name?
              </h3>
              <p className="mt-2 text-gray-600">
                A: To change your profile name, go to the settings page, tap on 'Change Profile Name', and enter your new name in the text field.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="p-4 bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold flex items-center">
                <MessageCircleQuestion  className="w-6 h-6 mr-2" /> Q4: How do I report a bug or issue?
              </h3>
              <p className="mt-2 text-gray-600">
                A: To report a bug or issue, go to the settings page, tap on 'Report Issue', and describe the problem you're experiencing. Our support team will investigate and resolve the issue as soon as possible.
              </p>
            </div>

            {/* FAQ Item 5 */}
            <div className="p-4 bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold flex items-center">
                <MessageCircleQuestion  className="w-6 h-6 mr-2" /> Q5: How do I delete my account?
              </h3>
              <p className="mt-2 text-gray-600">
                A: To delete your account, go to the settings page, tap on 'Delete Account', and follow the instructions to permanently remove your account and data from our servers.
              </p>
            </div>
          </div>
        </section>


          {/* Troubleshooting Guides */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center" data-aos="fade-up">Troubleshooting Guides</h2>

            <div className="space-y-6" data-aos="fade-left">

              <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold flex items-center">
                  <CheckCheck className="w-6 h-6 mr-2" /> App not loading?
                </h3>
                <p className="mt-2 text-gray-600">Try restarting the app or check if there are any updates available for download. If the issue persists, please contact our support team for assistance.</p>
              </div>

              <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold flex items-center">
                  <CheckCheck className="w-6 h-6 mr-2" /> Profile picture not updating?
                </h3>
                <p className="mt-2 text-gray-600">Make sure that the image is less than 5MB in size and in a supported format (jpg, png). If you're still having issues, try clearing the app's cache or restarting the app.</p>
              </div>

              <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold flex items-center">
                  <CheckCheck className="w-6 h-6 mr-2" /> Notifications not working?
                </h3>
                <p className="mt-2 text-gray-600">Check your device settings to ensure that notifications are enabled for the LocalLinkk app. If notifications are enabled and you're still not receiving them, try reinstalling the app.</p>
              </div>

              <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold flex items-center">
                  <CheckCheck className="w-6 h-6 mr-2" /> Account login issues?
                </h3>
                <p className="mt-2 text-gray-600">If you're having trouble logging into your account, try resetting your password or using the 'Forgot Password' feature. If the issue persists, contact our support team for further assistance.</p>
              </div>

              <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold flex items-center">
                  <CheckCheck className="w-6 h-6 mr-2" /> Location services not working?
                </h3>
                <p className="mt-2 text-gray-600">Ensure that location services are enabled for the LocalLinkk app in your device settings. If location services are enabled and you're still experiencing issues, try restarting your device or reinstalling the app.</p>
              </div>
            </div>
          </section>

          {/* Privacy & Legal */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center" data-aos="fade-up">Privacy & Legal</h2>
            <div className="space-y-6" data-aos="fade-right">
            <div className="space-y-6" data-aos="fade-left">
            <div className="p-4 bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold flex items-center">
                <ShieldCheck className="w-6 h-6 mr-2" /> Privacy Policy
              </h3>
              <p className="mt-2 text-gray-600">
                At LocalLinkk, we prioritize the privacy and security of your personal information. This Privacy Policy outlines how we collect, use, and protect your data when you use our app and services.
              </p>
              
              <h4 className="text-xl font-semibold mt-4">1. Information We Collect</h4>
              <ul className="list-disc list-inside mt-2 text-gray-600">
                <li>
                  <strong>Personal Information</strong>: When you register for an account or use certain features, we may collect your name, email address, and location data.
                </li>
                <li>
                  <strong>Usage Data</strong>: We collect information about how you interact with the app, such as the pages you visit, features you use, and any content you engage with.
                </li>
                <li>
                  <strong>Location Data</strong>: With your permission, we collect your device’s location to provide localized services such as nearby events, businesses, and promotions.
                </li>
              </ul>

              <h4 className="text-xl font-semibold mt-4">2. How We Use Your Information</h4>
              <ul className="list-disc list-inside mt-2 text-gray-600">
                <li>Personalize your experience by showing relevant local events and services.</li>
                <li>Send notifications about upcoming events, promotions, or updates.</li>
                <li>Improve the app and provide customer support.</li>
                <li>Analyze app usage to improve performance and add new features.</li>
              </ul>

              <h4 className="text-xl font-semibold mt-4">3. Sharing of Information</h4>
              <p className="mt-2 text-gray-600">
                We do not sell or share your personal information with third parties, except:
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-600">
                <li>To comply with legal obligations or protect our rights.</li>
                <li>With trusted service providers who assist us in operating the app (e.g., hosting providers), under strict confidentiality agreements.</li>
              </ul>

              <h4 className="text-xl font-semibold mt-4">4. Data Security</h4>
              <p className="mt-2 text-gray-600">
                We use industry-standard security measures to protect your data. However, no method of transmission over the internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
              </p>

              <h4 className="text-xl font-semibold mt-4">5. Your Choices</h4>
              <ul className="list-disc list-inside mt-2 text-gray-600">
                <li>
                  <strong>Location Services</strong>: You can choose to enable or disable location tracking at any time through your device settings.
                </li>
                <li>
                  <strong>Communication</strong>: You can opt-out of receiving notifications or promotional emails by following the unsubscribe instructions.
                </li>
              </ul>

              <h4 className="text-xl font-semibold mt-4">6. Contact Us</h4>
              <p className="mt-2 text-gray-600">
                If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:dev@locallinkk.com" className="text-blue-600 underline"><strong>dev@locallinkk.com</strong></a>
              </p>
            </div>
          </div>


              <div className="space-y-6" data-aos="fade-left">
                <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                  <h3 className="text-2xl font-semibold flex items-center">
                    <ShieldCheck className="w-6 h-6 mr-2" /> Terms of Service
                  </h3>
                  <p className="mt-2 text-gray-600">By using LocalLinkk, you agree to comply with our terms and conditions. These rules govern the use of our app, including user conduct, content ownership, and limitations of liability. 
                  You are responsible for any activity on your account and must adhere to local laws while using the app. Unauthorized use, including harmful or fraudulent activity, is strictly prohibited.
                  For a detailed overview of our terms, including user responsibilities and rights.</p>
                </div>
              </div>

              <div className="space-y-6" data-aos="fade-left">
                <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                  <h3 className="text-2xl font-semibold flex items-center">
                    <ShieldCheck className="w-6 h-6 mr-2" /> Cookie Policy
                  </h3>
                  <p className="mt-2 text-gray-600">LocalLinkk uses cookies to improve user experience and provide personalized content. Cookies are small text files stored on your device that help us track usage patterns and preferences. By using the app, you consent to the use of cookies as outlined in our Cookie Policy.</p>
                </div>
              </div>

              <div className="space-y-6" data-aos="fade-left">
                <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                  <h3 className="text-2xl font-semibold flex items-center">
                    <ShieldCheck className="w-6 h-6 mr-2" /> Data Storage
                  </h3>
                  <p className="mt-2 text-gray-600">At LocalLinkk, we take the protection of your data seriously. All personal information and usage data are stored securely using industry-standard encryption and security practices. We regularly review our data storage procedures to ensure your information remains safe from unauthorized access or breaches.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Miscellaneous */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center" data-aos="fade-up">Miscellaneous</h2>

            <div className="space-y-6" data-aos="fade-right">
              <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold flex items-center">
                  <Activity className="w-6 h-6 mr-2" /> About Us
                </h3>
                <p className="mt-2 text-gray-600">LocalLinkk is an innovative platform designed to strengthen local communities by facilitating connections between businesses and residents. Our mission is to create vibrant, connected neighborhoods where everyone can thrive.
                We believe in the power of local connections to transform communities and improve lives. By bringing together businesses, residents, and local events, we're fostering a sense of belonging and mutual support.
                </p>
              </div>

              <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold flex items-center">
                  <Activity className="w-6 h-6 mr-2" /> Version History
                </h3>
                <p className="mt-2 text-gray-600">The current version of the LocalLinkk app is designated as 0.1</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-gray-800 py-6">
        <div className="container mx-auto px-4 text-center" data-aos="fade-up">
          <p>&copy; 2024 LocalLinkk. All rights reserved. Made By <a href="https://insightxpert.co.uk/" target="blank">InsightXpert</a></p>
        </div>
      </footer>
    </div>
  )
}
