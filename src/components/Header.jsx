import React from 'react'
import { Link } from 'react-router-dom'

export default function Header(){
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="text-green-700 font-bold text-xl">AgroMart</Link>
        <nav className="space-x-4">
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  )
}
