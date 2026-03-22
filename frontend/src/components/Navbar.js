import React from 'react';

export default function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login'; // navigate to login page
  };

  return (
    <nav
      style={{
        background: 'linear-gradient(90deg, #4b6cb7 0%, #182848 100%)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#fff',
        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
      }}
    >
      <h1 style={{ margin: 0, fontWeight: '700', fontSize: '1.5rem', letterSpacing: '1px' }}>
        Store Rating App
      </h1>
      <button
        onClick={handleLogout}
        style={{
          backgroundColor: '#ff4757',
          border: 'none',
          padding: '0.5rem 1.25rem',
          borderRadius: '4px',
          color: '#fff',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e84118')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ff4757')}
      >
        Logout
      </button>
    </nav>
  );
}



