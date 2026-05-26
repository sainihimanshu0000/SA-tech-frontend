import React from 'react'
import { Link } from 'react-router-dom'

export default function Header(){
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="text-green-700 font-bold text-xl">AgroMart</Link>
        <nav className="space-x-4 hidden md:flex items-center">
          <Link to="/" className="text-gray-700 hover:text-green-600">Home</Link>
          <Link to="/products" className="text-gray-700 hover:text-green-600">Products</Link>
          <Link to="/services" className="text-gray-700 hover:text-green-600">Services</Link>
          <Link to="/solar-services" className="text-gray-700 hover:text-green-600">Solar</Link>
          <Link to="/subsidy" className="text-gray-700 hover:text-green-600">Subsidy</Link>
          <Link to="/blog" className="text-gray-700 hover:text-green-600">Blog</Link>
          <Link to="/contact" className="text-gray-700 hover:text-green-600">Contact</Link>
          <Link to="/cart" className="text-gray-700 hover:text-green-600">Cart</Link>
          <Link to="/login" className="text-green-700 font-semibold ml-4">Login</Link>
        </nav>
        <div className="md:hidden">
          <Link to="/menu" className="text-gray-700">Menu</Link>
        </div>
      </div>
    </header>
  )
}
