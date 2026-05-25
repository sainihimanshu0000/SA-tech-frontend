import React from 'react';
import API from '../api/axios';

export default function Subscriptions() {
  const subscribe = async () => {
    try {
      const r = await API.post('/subscriptions/create', { productId: 'sample', qty: 1, interval: 'monthly' });
      if (r.data.url) window.location.href = r.data.url;
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Subscriptions & Billing</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-600">Manage recurring supplies via Stripe Billing.</p>
        <button onClick={subscribe} className="mt-3 px-4 py-2 bg-[#2E7D32] text-white rounded">Create Subscription</button>
      </div>
    </div>
  );
}
