import React, { useEffect } from 'react';
import { Navbar } from './Navbar';
import { useLanguage } from '../context/LanguageContext';
import { Recycle, Trees, Heart, Settings } from 'lucide-react';

export function Mission() {
  const { t } = useLanguage();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const steps = [
    { icon: <Trees size={32} />, title: t('mission.step1'), desc: 'Local plastic waste is collected.' },
    { icon: <Settings size={32} />, title: t('mission.step2'), desc: 'Material is cleaned and prepared.' },
    { icon: <Recycle size={32} />, title: t('mission.step3'), desc: 'Transformed into durable sheets.' },
    { icon: <Heart size={32} />, title: t('mission.step4'), desc: 'Handcrafted into beautiful goods.' },
  ];

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '80px', minHeight: '100vh', paddingBottom: '4rem' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
             <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: '800', color: 'var(--color-primary-dark)' }}>{t('mission.title')}</h1>
                <p style={{ fontSize: '1.5rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>{t('mission.subtitle')}</p>
                <div style={{ 
                    background: 'white', 
                    padding: '2rem', 
                    borderRadius: 'var(--radius)', 
                    boxShadow: 'var(--shadow-sm)',
                    lineHeight: '1.8',
                    fontSize: '1.1rem'
                }}>
                    {t('mission.desc')}
                </div>
             </div>

             <div style={{ marginTop: '4rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>{t('mission.process_title')}</h2>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '2rem' 
                }}>
                    {steps.map((step, i) => (
                        <div key={i} className="glass-panel" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
                                {step.icon}
                            </div>
                            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{step.title}</h3>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>{step.desc}</p>
                        </div>
                    ))}
                </div>
             </div>
        </div>
      </div>
    </>
  );
}
