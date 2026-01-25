import React from 'react';

export function Hero() {
  return (
    <section style={{ 
        minHeight: '90vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 1rem'
    }}>
        <div style={{ 
            background: 'rgba(148, 191, 162, 0.1)', 
            padding: '0.5rem 1rem', 
            borderRadius: '2rem', 
            marginBottom: '1.5rem',
            color: 'var(--color-primary-dark)',
            fontWeight: '600',
            fontSize: '0.9rem'
        }}>
            High Quality Recycled Goods
        </div>
        
        <h1 style={{ 
            fontSize: 'clamp(3rem, 8vw, 5rem)', 
            marginBottom: '1.5rem', 
            lineHeight: 1.1,
            fontWeight: '800',
            letterSpacing: '-0.02em',
            color: 'var(--color-text)'
        }}>
            Nature, <span style={{ color: 'var(--color-primary)' }}>Reclaimed.</span>
        </h1>
        
        <p style={{ 
            maxWidth: '600px', 
            color: 'var(--color-text-muted)', 
            fontSize: '1.25rem', 
            marginBottom: '2.5rem',
            lineHeight: 1.6
        }}>
            We transform local plastic waste into premium, durable, and aesthetic goods. 
            Sustainable design for a cleaner future.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#products" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                Shop Collection
            </a>
            <button className="btn btn-outline" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                Learn More
            </button>
        </div>
    </section>
  );
}
