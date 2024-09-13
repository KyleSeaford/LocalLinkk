'use client'

import { useEffect } from 'react';
import { MapPin, Clock, Newspaper, Users, ArrowRight, ChevronDown, Mail } from "lucide-react";
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function HelpPage() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray text-gray-800 font-sans">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center" data-aos="fade-down">
          <div className="flex items-center space-x-2">
            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-68ORAVLCY6pkQ3uDq42zemDbZYVGT5.jpg" alt="LocalLinkk Logo" width={40} height={40} className="rounded-full" />
            <span className="text-2xl font-bold">LocalLinkk</span>
          </div>
          <nav className="space-x-4">
            <a href="/" className="hover:underline transition-colors">Home</a>
            <a href="#features" className="hover:underline transition-colors">Features</a>
            <a href="#about" className="hover:underline transition-colors">About</a>
            <a href="/help" className="hover:underline transition-colors">Help</a> {/* New link */}
          </nav>
        </div>
      </header>

      {/* Help Section */}
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12" data-aos="fade-up">Help & FAQs</h1>

          {/* FAQs Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6" data-aos="fade-up">FAQs</h2>
            <div className="space-y-6" data-aos="fade-right">
              <div>
                <h3 className="text-2xl font-semibold">Q1: How do I choose my location?</h3>
                <p>A: To select your location, go to the settings menu and tap on 'Location'. You can then choose from a list of available locations.</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold">Q2: How do I update my profile picture?</h3>
                <p>A: To update your profile picture, go to your profile page, tap the edit button, and select a new profile picture from your device's photo library.</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold">Q3: How do I change my profile name?</h3>
                <p>A: To change your profile name, go to the settings page, tap on 'Change Profile Name', and enter your new name in the text field. Make sure to save your changes by tapping the 'Save' button.</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold">Q4: How do I change my profile email address?</h3>
                <p>A: To change your profile email address, go to the settings page, tap on 'Change Email', and enter your new email address in the text field.</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold">Q5: How do I change my profile password?</h3>
                <p>A: To change your profile password, go to the settings page, tap on 'Change Password', and enter your new password. Make sure to save your changes by tapping the 'Save' button.</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold">Q6: How do I delete my account?</h3>
                <p>A: To delete your account, go to the settings page, tap on 'Delete Account', and confirm that you want to delete your account by typing 'DELETE' in the confirmation box. Note that this action is irreversible and will permanently delete all of your data associated with this account.</p>
              </div>
            </div>
          </section>

          {/* Troubleshooting Guides */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6" data-aos="fade-up">Troubleshooting Guides</h2>
            <div className="space-y-6" data-aos="fade-right">
              <div>
                <h3 className="text-2xl font-semibold">App not loading?</h3>
                <p>Try restarting the app or check if there are any updates available for download. If the issue persists, please contact our support team for assistance.</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold">Profile picture not updating?</h3>
                <p>Make sure that the image is less than 5MB in size and in a supported format (jpg, png). If you're still having issues, try clearing the app's cache or restarting the app.</p>
              </div>
            </div>
          </section>

          {/* Privacy & Legal */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6" data-aos="fade-up">Privacy & Legal</h2>
            <div className="space-y-6" data-aos="fade-right">
              <div>
                <h3 className="text-2xl font-semibold">Privacy Policy</h3>
                <p>Our privacy policy outlines how we handle your personal data, including what information we collect, how we use it, and how you can control its use. Please click here for more information:</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold">Terms of Service</h3>
                <p>Our terms of service explain the rules of using our app and what is expected of users. Please click here for more information:</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold">Data Storage</h3>
                <p>We take data security seriously and store all data securely. For more information on our data storage practices, please click here:</p>
              </div>
            </div>
          </section>

          {/* Miscellaneous */}
          <section>
            <h2 className="text-3xl font-bold mb-6" data-aos="fade-up">Miscellaneous</h2>
            <div className="space-y-6" data-aos="fade-right">
              <div>
                <h3 className="text-2xl font-semibold">About Us</h3>
                <p>Learn more about our company, team, and mission by clicking here:</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold">Version History</h3>
                <p>View the version history of our app by clicking here:</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-6">
        <div className="container mx-auto px-4 text-center" data-aos="fade-up">
          <p>&copy; 2024 LocalLinkk. All rights reserved. By <a href="https://insightxpert.co.uk/" target="blank">InsightXpert</a></p>
        </div>
      </footer>
    </div>
  );
}
