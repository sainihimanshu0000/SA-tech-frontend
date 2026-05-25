import React, { useEffect, useState } from 'react';
import API from '../api/axios';

export default function VendorDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const r = await API.get('/vendors/me/dashboard');
        setData(r.data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Vendor Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-xs text-gray-400">Total Sales</div>
          <div className="text-xl font-bold text-[#2E7D32]">₹{data.totalSales.toFixed(2)}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-xs text-gray-400">Orders</div>
          <div className="text-xl font-bold text-gray-800">{data.ordersCount}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-xs text-gray-400">Pending Payouts</div>
          <div className="text-xl font-bold text-[#FBC02D]">₹{data.pendingPayouts.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
