import React, { useState } from 'react';
import API from '../api/axios';

export default function BulkSimulator() {
  const [qty, setQty] = useState(1);
  const [priceInfo, setPriceInfo] = useState(null);
  const productId = '000000000000000000000000'; // replace with sample product id

  const fetchPrice = async () => {
    try {
      const r = await API.get(`/products/${productId}/price`, { params: { qty } });
      setPriceInfo(r.data.pricing);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">B2B Bulk Price Simulator</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-3">
          <input type="range" min="1" max="1000" value={qty} onChange={e => setQty(e.target.value)} className="w-full" />
          <div className="w-24 text-right">{qty}</div>
        </div>
        <div className="mt-4">
          <button className="px-4 py-2 bg-[#2E7D32] text-white rounded" onClick={fetchPrice}>Calculate</button>
        </div>
        {priceInfo && (
          <div className="mt-4 text-sm">
            <div>Base Total: ₹{priceInfo.baseTotal}</div>
            <div>Discount: {priceInfo.discountPercent}% (₹{priceInfo.discountAmount})</div>
            <div className="font-bold text-[#1B5E20]">Final: ₹{priceInfo.final}</div>
          </div>
        )}
      </div>
    </div>
  );
}
