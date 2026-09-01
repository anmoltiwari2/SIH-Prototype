'use client'

import React from 'react';

export function LogoutButton() {
  const handleLogout = () => {
    document.cookie = 'mock_user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'mock_phone=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/login';
  };

  return (
    <button 
      onClick={handleLogout}
      className="text-sm font-semibold opacity-80 hover:opacity-100 hover:text-red-500 transition-colors"
    >
      Logout
    </button>
  );
}
