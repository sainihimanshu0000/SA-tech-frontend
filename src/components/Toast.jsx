import React from 'react'
import { IoCheckmark, IoClose, IoAlertCircle, IoInformationCircle } from 'react-icons/io5'

export default function Toast({ type = 'success', message, onClose }){
  const icons = {
    success: <IoCheckmark className="text-green-500" size={20} />,
    error: <IoClose className="text-agro-error" size={20} />,
    warning: <IoAlertCircle className="text-yellow-500" size={20} />,
    info: <IoInformationCircle className="text-blue-500" size={20} />
  }

  const colors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-agro-error',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  }

  return (
    <div className={`fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg border-2 ${colors[type]} shadow-hover animate-slide-in z-50`}>
      {icons[type]}
      <span className="text-sm font-medium text-agro-dark">{message}</span>
      <button onClick={onClose} className="ml-2 text-gray-500 hover:text-agro-dark">
        <IoClose size={18} />
      </button>
    </div>
  )
}
