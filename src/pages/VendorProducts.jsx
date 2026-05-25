import React, { useEffect, useState } from 'react';
import API from '../api/axios';

export default function VendorProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const r = await API.get('/vendors/me/products');
        setProducts(r.data.products || []);
      } catch (err) { console.error(err); }
    }
    load();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">My Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p._id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm font-semibold text-gray-800">{p.name}</div>
            <div className="text-xs text-gray-400">₹{p.price}</div>
            <div className="mt-3 flex gap-2">
              <button className="px-3 py-1 bg-[#2E7D32] text-white rounded text-xs">Edit</button>
              <button className="px-3 py-1 bg-red-500 text-white rounded text-xs">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
