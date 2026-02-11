import React, { useEffect } from 'react';
import { Navbar } from './Navbar';
import { useLanguage } from '../context/LanguageContext';
import { Recycle, Trees, Heart, Settings, Mail, MapPin } from 'lucide-react';
import logo from '../assets/images/revita-logo.png';

export function Mission() {
  const { t } = useLanguage();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const steps = [
    { icon: <Trees size={32} />, title: t('mission.step1'), desc: 'Inzamelen & Sorteren' },
    { icon: <Settings size={32} />, title: t('mission.step2'), desc: 'Versnipperen & Wassen' },
    { icon: <Recycle size={32} />, title: t('mission.step3'), desc: 'Smelten & Vormen' },
    { icon: <Heart size={32} />, title: t('mission.step4'), desc: 'Afwerking' },
  ];

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '80px', minHeight: '100vh', paddingBottom: '4rem' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
             
             {/* Header with Logo - Green Area */}
             <div style={{ textAlign: 'center', padding: '3rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <img src={logo} alt="Revita Logo" style={{ height: '80px' }} />
                <h1 style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--color-primary-dark)', margin: 0 }}>Revita</h1>
             </div>

             {/* Main Text Content - Blue Area */}
             <div style={{ 
                background: 'white', 
                padding: '3rem', 
                borderRadius: 'var(--radius)', 
                boxShadow: 'var(--shadow-sm)',
                lineHeight: '1.8',
                fontSize: '1.1rem',
                marginBottom: '4rem'
             }}>
                <h2 style={{ color: 'var(--color-text)', marginBottom: '1rem' }}>{t('mission.title')}</h2>
                <p style={{ whiteSpace: 'pre-line', marginBottom: '2rem' }}>{t('mission.about_text')}</p>

                <h3 style={{ color: 'var(--color-primary-dark)', marginBottom: '0.5rem', fontSize: '1.4rem' }}>{t('mission.mission_title')}</h3>
                <p style={{ whiteSpace: 'pre-line', marginBottom: '2rem' }}>{t('mission.mission_text')}</p>

                <h3 style={{ color: 'var(--color-primary-dark)', marginBottom: '0.5rem', fontSize: '1.4rem' }}>{t('mission.values_title')}</h3>
                <p style={{ whiteSpace: 'pre-line', marginBottom: '2rem' }}>{t('mission.values_text')}</p>

                <h3 style={{ color: 'var(--color-primary-dark)', marginBottom: '0.5rem', fontSize: '1.4rem' }}>{t('mission.movement_title')}</h3>
                <p style={{ whiteSpace: 'pre-line' }}>{t('mission.movement_text')}</p>
             </div>

             {/* Process Section */}
             <div style={{ marginBottom: '4rem' }}>
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
                        </div>
                    ))}
                </div>
             </div>

             {/* Contact Section - Pink Area */}
             <div style={{ textAlign: 'center', padding: '2rem', background: '#f8f9fa', borderRadius: 'var(--radius)' }}>
                <h2 style={{ marginBottom: '2rem' }}>{t('mission.contact_title')}</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem' }}>
                        <MapPin style={{ color: 'var(--color-primary)' }} />
                        <div style={{ textAlign: 'left' }}>
                            <div>{t('mission.address_line1')}</div>
                            <div>{t('mission.address_line2')}</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem' }}>
                        <Mail style={{ color: 'var(--color-primary)' }} />
                        <a href={`mailto:${t('mission.email')}`} style={{ color: 'var(--color-text)', textDecoration: 'underline' }}>
                            {t('mission.email')}
                        </a>
                    </div>
                </div>
             </div>

        </div>
      </div>
    </>
  );
}
