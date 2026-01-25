import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="glass-panel" style={{
      position: 'fixed',
      top: '1.5rem',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 3rem)',
      maxWidth: '1200px',
      padding: '0.75rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1000
    }}>
        <Link to="/" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            fontWeight: '700', 
            fontSize: '1.5rem', 
            color: 'var(--color-primary)',
            letterSpacing: '-0.03em'
        }}>
            <Leaf size={24} strokeWidth={2.5} />
            Revita
        </Link>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', fontWeight: '500' }}>
            <Link to="/" style={{ color: 'var(--color-text)' }}>Home</Link>
            <a href="#products" style={{ color: 'var(--color-text)' }}>Products</a>
            <Link to="/about" style={{ color: 'var(--color-text)' }}>Our Mission</Link>
        </div>
        <Link to="/admin" className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
            Admin
        </Link>
    </nav>
  );
}
