import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/images/revita-logo.png';

export function Hero() {
  const { t } = useLanguage();

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
        <img src={logo} alt="Revita Logo" style={{ height: '450px', marginBottom: '1rem' }} />
        
        <div style={{ 
            background: 'rgba(148, 191, 162, 0.1)', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '2rem', 
            marginBottom: '2rem',
            color: 'var(--color-primary-dark)',
            fontWeight: '600',
            fontSize: '1.1rem'
        }}>
            {t('hero.badge')}
        </div>
        
        <p style={{ 
            maxWidth: '600px', 
            color: 'var(--color-text-muted)', 
            fontSize: '1.25rem', 
            marginBottom: '2.5rem',
            lineHeight: 1.6
        }}>
            {t('hero.subtitle')}
        </p>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
            <span 
                onClick={() => document.getElementById('products')?.scrollIntoView({behavior: 'smooth'})} 
                className="btn btn-primary" 
                style={{ fontSize: '1.1rem', padding: '1rem 2rem', cursor: 'pointer' }}
            >
                {t('hero.cta_shop')}
            </span>
            <button className="btn btn-outline" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                {t('hero.cta_learn')}
            </button>
        </div>
    </section>
  );
}
