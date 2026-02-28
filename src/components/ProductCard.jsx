import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export function ProductCard({ product }) {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();

  return (
    <div className="glass-panel" style={{ 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        height: '100%'
    }}
    onClick={() => navigate(`/product/${product.id}`)}
    onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
    }}
    onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
    }}
    >
      <div style={{ height: '280px', overflow: 'hidden', background: '#f0f0f0' }}>
        <img 
            src={product.image} 
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        />
      </div>
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: '600', margin: 0 }}>
                {typeof product.name === 'object' ? product.name[lang] || product.name['en'] : product.name}
            </h3>
            <span style={{ 
                color: 'var(--color-primary-hover)', 
                fontWeight: '700', 
                background: 'rgba(148, 191, 162, 0.15)',
                padding: '0.25rem 0.75rem',
                borderRadius: '2rem',
                fontSize: '0.9rem'
            }}>€{product.price.toFixed(2)}</span>
        </div>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem', flex: 1, lineHeight: '1.6' }}>
            {typeof product.description === 'object' ? product.description[lang] || product.description['en'] : product.description}
        </p>
        <button className="btn btn-outline" style={{ width: '100%', marginTop: 'auto' }}>{t('product.view_details')}</button>
      </div>
    </div>
  );
}
