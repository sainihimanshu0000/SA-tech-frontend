import React from 'react'
import { Link } from 'react-router-dom'
import { IoLogoFacebook, IoLogoTwitter, IoLogoInstagram, IoMail, IoCall } from 'react-icons/io5'

export default function Footer(){
  return (
    <footer className="bg-agro-dark text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌾</span>
              <h3 className="font-bold text-lg">AgroMart</h3>
            </div>
            <p className="text-sm text-gray-300">Premium agricultural products for modern farming.</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-3">Shopping</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-green-400 transition">Shop Products</Link></li>
              <li><Link to="/blog" className="hover:text-green-400 transition">Blog</Link></li>
              <li><Link to="/wishlist" className="hover:text-green-400 transition">Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-green-400 transition">Cart</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-3">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/solar-services" className="hover:text-green-400 transition">Solar Services</Link></li>
              <li><Link to="/crop-advisory" className="hover:text-green-400 transition">Crop Advisory</Link></li>
              <li><Link to="/emi-calculator" className="hover:text-green-400 transition">EMI Calculator</Link></li>
              <li><a href="#" className="hover:text-green-400 transition">Subsidies</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3">Account</h4>
            <div className="space-y-2 text-sm">
              <div><Link to="/login" className="hover:text-green-400 transition">Login</Link></div>
              <div><Link to="/register" className="hover:text-green-400 transition">Register</Link></div>
              <div><a href="#" className="hover:text-green-400 transition">Orders & Shipping</a></div>
              <div><a href="#" className="hover:text-green-400 transition">Help & Support</a></div>
            </div>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="border-t border-agro-primary-light pt-6 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-gray-300">&copy; 2024 AgroMart. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-agro-accent transition"><IoLogoFacebook size={20} /></a>
            <a href="#" className="hover:text-agro-accent transition"><IoLogoTwitter size={20} /></a>
            <a href="#" className="hover:text-agro-accent transition"><IoLogoInstagram size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
