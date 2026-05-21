import React from 'react'
import { IoStar, IoStarHalf, IoStarOutline } from 'react-icons/io5'

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  ...props 
}){
  const baseStyle = 'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2'
  
  const variants = {
    primary: 'bg-agro-primary text-white hover:bg-agro-dark active:scale-95 shadow-soft hover:shadow-hover disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-agro-primary-light text-white hover:bg-agro-primary active:scale-95 shadow-soft disabled:opacity-50',
    accent: 'bg-agro-accent text-agro-dark hover:bg-yellow-500 active:scale-95 disabled:opacity-50',
    outline: 'border-2 border-agro-primary text-agro-primary hover:bg-agro-background disabled:opacity-50',
    ghost: 'text-agro-primary hover:bg-agro-background disabled:opacity-50',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50',
  }

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-3 text-lg',
    xl: 'px-10 py-4 text-lg',
  }

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export function Input({ 
  label, 
  error, 
  icon: Icon,
  className = '',
  ...props 
}){
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-agro-dark mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-3 text-agro-primary" size={20} />}
        <input 
          className={`w-full px-4 py-2 border-2 rounded-lg focus:border-agro-primary outline-none transition ${
            Icon ? 'pl-10' : ''
          } ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

export function Rating({ rating = 0, size = 'md', interactive = false, onRate }){
  const [hoverRating, setHoverRating] = React.useState(0)
  const displayRating = hoverRating || rating

  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-2xl',
  }

  return (
    <div className="flex gap-1 items-center">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`${sizes[size]} ${interactive ? 'cursor-pointer' : 'cursor-default'} transition hover:scale-110`}
            onClick={() => interactive && onRate && onRate(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
          >
            {displayRating >= star ? (
              <IoStar className="text-yellow-400" />
            ) : displayRating >= star - 0.5 ? (
              <IoStarHalf className="text-yellow-400" />
            ) : (
              <IoStarOutline className="text-gray-300" />
            )}
          </button>
        ))}
      </div>
      {rating > 0 && <span className="text-sm text-gray-600 ml-2">{rating.toFixed(1)}/5</span>}
    </div>
  )
}

export function Badge({ children, variant = 'primary', size = 'sm' }){
  const variants = {
    primary: 'bg-agro-primary text-white',
    secondary: 'bg-agro-secondary text-white',
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    new: 'bg-blue-100 text-blue-800',
    sale: 'bg-red-500 text-white',
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  return (
    <span className={`inline-block rounded-full font-semibold ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  )
}

export function Card({ children, className = '', hover = false }){
  return (
    <div className={`bg-white rounded-lg shadow-soft p-4 ${hover ? 'hover:shadow-hover transition' : ''} ${className}`}>
      {children}
    </div>
  )
}

export function Skeleton({ width = 'w-full', height = 'h-4', className = '' }){
  return (
    <div className={`${width} ${height} bg-gray-200 rounded animate-pulse ${className}`}></div>
  )
}

export function Toast({ message, type = 'success', onClose }){
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const types = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  }

  return (
    <div className={`fixed bottom-4 right-4 ${types[type]} text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in z-50`}>
      {message}
    </div>
  )
}
