import React, { useEffect } from 'react';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../context/LanguageContext';
import productsData from '../data/products.json';

export function Home() {
    const { t } = useLanguage();
    
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '60px' }}> {/* Spacing for fixed navbar */}
        <Hero />
        <section id="products" className="container" style={{ padding: '4rem 1.5rem 6rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <span style={{ 
                    color: 'var(--color-primary)', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.1em',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    display: 'block',
                    marginBottom: '0.5rem'
                }}>
                    {t('home.catalog_eyebrow')}
                </span>
                <h2 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-text)', fontWeight: '700' }}>{t('home.catalog_title')}</h2>
                <div style={{ width: '60px', height: '4px', background: 'var(--color-primary)', margin: '0 auto', borderRadius: '2px', opacity: 0.6 }}></div>
            </div>
            
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                gap: '2.5rem' 
            }}>
                {productsData.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
        
        <footer style={{ background: '#f0f4f1', padding: '4rem 0', marginTop: '2rem' }}>
            <div className="container" style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <h3 style={{ color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>Revita Plastics</h3>
                <p>&copy; {new Date().getFullYear()} Revita Plastics. All rights reserved.</p>
            </div>
        </footer>
      </div>
    </>
  );
}
