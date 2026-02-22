import React from 'react'
import { Card, Badge } from './UI'
import { IoStar, IoCart } from 'react-icons/io5'

export default function ProductCard({ product, onAddToCart }){
  return (
    <Card hover>
      <div className="aspect-square bg-agro-background rounded-lg overflow-hidden mb-3 flex items-center justify-center">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl">🌱</span>
        )}
      </div>
      
      <div className="space-y-2">
        <Badge color="secondary">{product.category}</Badge>
        <h3 className="font-bold text-agro-dark line-clamp-2">{product.name}</h3>
        
        <p className="text-sm text-gray-600">{product.description?.substring(0, 50)}...</p>
        
        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="text-2xl font-bold text-agro-primary">${product.price}</p>
            {product.avgRating && (
              <div className="flex items-center gap-1 mt-1">
                <IoStar className="text-agro-accent" size={14} />
                <span className="text-xs text-gray-600">{product.avgRating.toFixed(1)}</span>
              </div>
            )}
          </div>
          <button 
            onClick={() => onAddToCart?.(product)}
            className="bg-agro-primary text-white p-2 rounded-lg hover:bg-agro-dark transition-all hover:shadow-hover active:scale-95"
          >
            <IoCart size={20} />
          </button>
        </div>

        {product.stock <= 5 && product.stock > 0 && (
          <p className="text-xs text-agro-error font-semibold">Only {product.stock} left!</p>
        )}
        {product.stock === 0 && (
          <p className="text-xs text-agro-error font-semibold">Out of Stock</p>
        )}
      </div>
    </Card>
  )
}
