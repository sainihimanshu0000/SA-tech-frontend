import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import useSocket from '../hooks/useSocket';
import { Bell } from 'lucide-react';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const socketRef = useSocket();

  useEffect(() => {
    async function load() {
      try {
        const r = await API.get('/notifications');
        setNotifs(r.data.notifications || []);
      } catch (err) {
        // ignore
      }
    }
    load();
  }, []);

  useEffect(() => {
    const s = socketRef.current;
    if (!s) return;
    const onNotification = (n) => setNotifs(prev => [n, ...prev]);
    const onOrder = (o) => setNotifs(prev => [{ title: `Order ${o.orderId}`, message: `Status: ${o.status}`, createdAt: new Date() }, ...prev]);
    s.on('notification', onNotification);
    s.on('orderUpdated', onOrder);
    return () => {
      s.off('notification', onNotification);
      s.off('orderUpdated', onOrder);
    };
  }, [socketRef.current]);

  const unread = notifs.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 text-white hover:bg-[#2E7D32] rounded-full transition-colors">
        <Bell className="w-6 h-6 text-white" />
        {unread > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-[#1B5E20] rounded-full"></span>}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden text-gray-900 z-50">
          <div className="bg-[#2E7D32] text-white px-4 py-3 flex justify-between items-center">
            <h3 className="font-semibold text-sm">Live Notifications</h3>
            <button onClick={() => setNotifs(notifs.map(n => ({ ...n, read: true })))} className="text-xs text-[#81C784]">Clear unread</button>
          </div>
          <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
            {notifs.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-xs">No alerts recorded.</div>
            ) : (
              notifs.map((n, i) => (
                <div key={i} className={`p-3 text-xs hover:bg-[#F1F8E9] transition-colors ${!n.read ? 'bg-[#F1F8E9]/50 font-medium' : ''}`}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#2E7D32] font-semibold">{n.title}</span>
                    <span className="text-gray-400 text-[10px]">{new Date(n.createdAt || Date.now()).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-600 line-clamp-2">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
