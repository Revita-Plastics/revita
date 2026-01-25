import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { useLanguage } from '../context/LanguageContext';
import productsData from '../data/products.json';
import { ArrowLeft, Box, Scale, leaf, Leaf } from 'lucide-react';

export function ProductDetail() {
  const { id } = useParams();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    // In a real app we might fetch from API, here we find in local JSON
    const found = productsData.find(p => p.id === parseInt(id));
    if (found) {
        setProduct(found);
    } else {
        navigate('/');
    }
  }, [id, navigate]);

  if (!product) return null;

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '4rem' }}>
        <div className="container">
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                <ArrowLeft size={16} /> {t('product.back')}
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                {/* Image Section */}
                <div className="glass-panel" style={{ padding: '1rem', height: 'fit-content' }}>
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        style={{ width: '100%', borderRadius: '8px', objectFit: 'cover', aspectRatio: '1/1' }} 
                    />
                </div>

                {/* Info Section */}
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        {typeof product.name === 'object' ? product.name[lang] : product.name}
                    </h1>
                    <span style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: '600', 
                        color: 'var(--color-primary)',
                        display: 'block',
                        marginBottom: '1.5rem'
                    }}>
                        ${product.price.toFixed(2)}
                    </span>

                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                        {typeof product.description === 'object' ? product.description[lang] : product.description}
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
                        <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                            {t('product.add_to_cart')}
                        </button>
                    </div>

                    {/* Specs Grid */}
                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>{t('product.specs')}</h3>
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {/* Material */}
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ background: '#f0f4f1', padding: '0.5rem', borderRadius: '50%' }}>
                                    <Leaf size={20} color="var(--color-primary)" />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>{t('product.material')}</h4>
                                    <p style={{ fontWeight: '500' }}>
                                        {product.material && typeof product.material === 'object' ? product.material[lang] : product.material || '100% Recycled HDPE'}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Dimensions/Weight */}
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ background: '#f0f4f1', padding: '0.5rem', borderRadius: '50%' }}>
                                    <Scale size={20} color="var(--color-primary)" />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>{t('product.weight')}</h4>
                                    <p style={{ fontWeight: '500' }}>
                                        {product.weight && typeof product.weight === 'object' ? product.weight[lang] : product.weight || '250g'}
                                    </p>
                                </div>
                            </div>

                            {/* Impact */}
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ background: '#f0f4f1', padding: '0.5rem', borderRadius: '50%' }}>
                                    <Box size={20} color="var(--color-primary)" />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>{t('product.impact')}</h4>
                                    <p style={{ fontWeight: '500' }}>
                                        {product.impact && typeof product.impact === 'object' ? product.impact[lang] : product.impact || 'Saved ~15 bottles'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}
