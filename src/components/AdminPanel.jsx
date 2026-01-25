import React, { useState, useEffect } from 'react';
import { github } from '../services/github';
import { Link } from 'react-router-dom';
import { Settings, LogOut, Plus, Edit, Trash, Save, X, Loader } from 'lucide-react';
import defaultContent from '../data/content.json';

export function AdminPanel() {
  const [token, setToken] = useState(localStorage.getItem('revita_token') || '');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Repo Config
  const [config, setConfig] = useState({
    owner: localStorage.getItem('revita_owner') || 'Revita-Plastics',
    repo: localStorage.getItem('revita_repo') || 'revita',
    path: 'src/data/products.json'
  });

  // Theme State
  const [theme, setTheme] = useState({ primary: '#94bfa2', background: '#ffffff', radius: '12px' });
  const [themeSha, setThemeSha] = useState(null);

  // Content State
  const [content, setContent] = useState(null);
  const [contentSha, setContentSha] = useState(null);

  // Data
  const [products, setProducts] = useState([]);
  const [sha, setSha] = useState(null); 
  
  // UI State
  const [activeTab, setActiveTab] = useState('products'); 
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // [NEW] For instant upload feedback

  // Initial Auth Check
  useEffect(() => {
    if (token) {
        verifyToken(token);
    }
  }, []);

  const verifyToken = async (t) => {
    setIsLoading(true);
    setError('');
    try {
        const u = await github.getUser(t);
        setUser(u);
        localStorage.setItem('revita_token', t);
        
        // If we have config, try to fetch products and theme
        if (config.owner && config.repo) {
            fetchProducts(t, config);
            fetchTheme(t, config);
            fetchContent(t, config);
        } else {
            setActiveTab('settings');
        }
    } catch (err) {
        setError('Invalid Token');
        setToken('');
        localStorage.removeItem('revita_token');
    } finally {
        setIsLoading(false);
    }
  };

  const fetchProducts = async (t = token, c = config) => {
    if (!c.owner || !c.repo) return;
    setIsLoading(true);
    setError('');
    try {
        const result = await github.getFile(t, c.owner, c.repo, c.path);
        setProducts(result.content);
        setSha(result.sha);
    } catch (err) {
        setError(`Failed to load products: ${err.message}`);
    } finally {
        setIsLoading(false);
    }
  };

  const fetchTheme = async (t = token, c = config) => {
    try {
        const result = await github.getFile(t, c.owner, c.repo, 'src/data/theme.json');
        setTheme(result.content);
        setThemeSha(result.sha);
    } catch (err) {
        console.log('No theme file found, using defaults');
    }
  }; 

  const fetchContent = async (t = token, c = config) => {
    try {
        const result = await github.getFile(t, c.owner, c.repo, 'src/data/content.json');
        setContent(result.content);
        setContentSha(result.sha);
    } catch (err) {
        console.log('No content file found, using defaults');
        setContent(defaultContent);
        // We don't have a SHA yet, which is fine, saving will create a new file
    }
  };
  
  // Helper to normalize product data (String vs Object)
  const normalizeProduct = (p) => {
    return {
        ...p,
        name: typeof p.name === 'object' ? p.name : { nl: p.name, en: p.name },
        description: typeof p.description === 'object' ? p.description : { nl: p.description, en: p.description },
        material: typeof p.material === 'object' ? p.material : { nl: p.material || '', en: p.material || '' },
        weight: typeof p.weight === 'object' ? p.weight : { nl: p.weight || '', en: p.weight || '' },
        impact: typeof p.impact === 'object' ? p.impact : { nl: p.impact || '', en: p.impact || '' },
    };
  };

  // ...

  // ... (Login/Logout handlers remain same)

  const handleLogin = (e) => {
    e.preventDefault();
    const t = e.target.token.value;
    setToken(t);
    verifyToken(t);
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('revita_token');
  };

  const saveConfig = (e) => {
    e.preventDefault();
    const newConfig = {
        ...config,
        owner: e.target.owner.value,
        repo: e.target.repo.value,
    };
    setConfig(newConfig);
    localStorage.setItem('revita_owner', newConfig.owner);
    localStorage.setItem('revita_repo', newConfig.repo);
    fetchProducts(token, newConfig);
    fetchTheme(token, newConfig);
    fetchContent(token, newConfig);
    setActiveTab('products');
  };

  // Image Upload Handler
  const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
          alert('File matches 5MB limit. Please allow a smaller file.');
          return;
      }

      setIsLoading(true);
      try {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = async () => {
              const base64Content = reader.result.split(',')[1];
              const fileName = `public/uploads/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`; // Clean filename
              
              // Set preview immediately
              setPreviewUrl(reader.result);
              
              await github.uploadImage(token, config.owner, config.repo, fileName, base64Content, `Upload image: ${fileName}`);
              
              // Set image URL in form (assuming GitHub Pages structure)
              // URL format: https://owner.github.io/repo/uploads/filename
              const publicUrl = `https://${config.owner.split('/')[0]}.github.io/${config.repo}/${fileName.replace('public/', '')}`;
              setEditForm(prev => ({ ...prev, image: publicUrl }));
              setIsLoading(false);
          };
      } catch (err) {
          setError(`Upload failed: ${err.message}`);
          setIsLoading(false);
      }
  };

  // Theme Save Handler
  const handleSaveTheme = async () => {
      setIsLoading(true);
      try {
          const res = await github.updateFile(token, config.owner, config.repo, 'src/data/theme.json', theme, themeSha, 'Update theme settings');
          setThemeSha(res.content.sha);
          alert('Theme updated! It may take a minute to reflect on the live site.');
      } catch (err) {
          setError(`Failed to save theme: ${err.message}`);
      } finally {
          setIsLoading(false);
      }
  };
  
  // Content Save Handler
  const handleSaveContent = async () => {
      setIsLoading(true);
      try {
          const res = await github.updateFile(token, config.owner, config.repo, 'src/data/content.json', content, contentSha, 'Update site content');
          setContentSha(res.content.sha);
          alert('Content updated! It may take a minute to reflect on the live site.');
      } catch (err) {
          setError(`Failed to save content: ${err.message}`);
      } finally {
          setIsLoading(false);
      }
  };

  const restoreDefaults = () => {
      if(window.confirm('Reset all design settings to default?')) {
          setTheme({ primary: '#94bfa2', background: '#ffffff', radius: '12px' });
      }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
        let newProducts;
        let message;
        
        // Helper to get name for log
        const logName = typeof editForm.name === 'object' ? (editForm.name.nl || editForm.name.en) : editForm.name;

        if (editForm.id) {
            // Update
            newProducts = products.map(p => p.id === editForm.id ? { ...editForm, price: parseFloat(editForm.price) } : p);
            message = `Update product: ${logName}`;
        } else {
            // Create
            const newId = Math.max(...products.map(p => p.id), 0) + 1;
            newProducts = [...products, { ...editForm, id: newId, price: parseFloat(editForm.price) }];
            message = `Add product: ${logName}`;
        }

        // Commit to GitHub
        const res = await github.updateFile(token, config.owner, config.repo, config.path, newProducts, sha, message);
        
        setSha(res.content.sha); // Update SHA for next commit
        setProducts(newProducts);
        setIsEditing(false);
        setEditForm(null);
    } catch (err) {
        setError(`Failed to save: ${err.message}`);
    } finally {
        setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this product?')) return;
    setIsLoading(true);
    try {
        const newProducts = products.filter(p => p.id !== id);
        const message = `Remove product ID: ${id}`;
        
        const res = await github.updateFile(token, config.owner, config.repo, config.path, newProducts, sha, message);
        
        setSha(res.content.sha);
        setProducts(newProducts);
    } catch (err) {
        setError(`Failed to delete: ${err.message}`);
    } finally {
        setIsLoading(false);
    }
  };
  
  // Recursively render content fields
  const renderContentFields = (data, path = [], lang = 'nl') => {
      if (!data) return null;
      return Object.keys(data).map(key => {
          const value = data[key];
          const newPath = [...path, key];
          
          if (typeof value === 'object' && value !== null) {
              return (
                  <div key={key} style={{ marginLeft: '1rem', marginTop: '1rem', borderLeft: '2px solid #eee', paddingLeft: '1rem' }}>
                      <h4 style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase' }}>{key}</h4>
                      {renderContentFields(value, newPath, lang)}
                  </div>
              );
          }
          
          return (
              <div key={key} style={{ marginBottom: '0.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.2rem' }}>{key}</label>
                  <input 
                    value={value || ''} 
                    onChange={e => {
                        const newVal = e.target.value;
                        setContent(prev => {
                            const newState = JSON.parse(JSON.stringify(prev));
                            // Traverse to set
                            let current = newState[lang];
                             for(let i=0; i<path.length; i++) current = current[path[i]];
                            current[key] = newVal;
                            return newState;
                        });
                    }}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
              </div>
          );
      });
  };

  // -- RENDER HELPERS --

  if (!user) {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Admin Access</h2>
                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Admin Access Key (GitHub Token)</label>
                        <input 
                            name="token" 
                            type="password" 
                            required 
                            placeholder="ghp_..."
                            style={{ 
                                width: '100%', 
                                padding: '0.75rem', 
                                borderRadius: 'var(--radius)', 
                                border: '1px solid #ddd' 
                            }} 
                        />
                    </div>
                    
                    <div style={{ marginBottom: '1.5rem', fontSize: '0.85rem', color: '#666', background: 'rgba(255,255,255,0.5)', padding: '1rem', borderRadius: '8px' }}>
                        <p style={{ marginBottom: '0.5rem', fontWeight: '600' }}>How to get a key?</p>
                        <ol style={{ paddingLeft: '1.2rem', margin: 0 }}>
                            <li>Go to GitHub Settings &rarr; Developer Settings</li>
                            <li>Personal Access Tokens &rarr; Tokens (classic)</li>
                            <li>Generate new token (classic)</li>
                            <li>Select scope: <b>repo</b> or <b>public_repo</b></li>
                            <li>Copy and paste here.</li>
                        </ol>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.8 }}>
                            * This key maps directly to your GitHub user permissions. It is saved only in your browser.
                        </p>
                    </div>

                    {error && <div style={{ color: '#d63031', marginBottom: '1rem', fontSize: '0.9rem', background: '#ffebeb', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isLoading}>
                        {isLoading ? 'Verifying...' : 'Unlock Admin'}
                    </button>
                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <Link to="/" style={{ fontSize: '0.9rem', color: 'var(--color-primary)' }}>Return to Home</Link>
                    </div>
                </form>
            </div>
        </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
        <div className="container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h1 style={{ fontSize: '1.5rem' }}>Revita Admin</h1>
                    <span style={{ fontSize: '0.8rem', background: '#eee', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        Logged in as {user.login}
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                   <button onClick={() => setActiveTab('products')} className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-outline'}`}>
                        Products
                   </button>
                   <button onClick={() => setActiveTab('content')} className={`btn ${activeTab === 'content' ? 'btn-primary' : 'btn-outline'}`}>
                        Content
                   </button>
                   <button onClick={() => setActiveTab('design')} className={`btn ${activeTab === 'design' ? 'btn-primary' : 'btn-outline'}`}>
                        Design
                   </button>
                   <button onClick={() => setActiveTab('settings')} className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-outline'}`}>
                        <Settings size={18} />
                   </button>
                   <button onClick={handleLogout} className="btn btn-outline" style={{ borderColor: '#ff6b6b', color: '#ff6b6b' }}>
                        <LogOut size={18} />
                   </button>
                </div>
            </header>

            {error && <div style={{ background: '#ffebeb', color: '#d63031', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}>{error}</div>}

            {activeTab === 'settings' && (
                <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Repository Settings</h2>
                    <form onSubmit={saveConfig}>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Repo Owner (Username/Org)</label>
                                <input name="owner" defaultValue={config.owner} required style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Repo Name</label>
                                <input name="repo" defaultValue={config.repo} required style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd' }} />
                                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'gray' }}>Usually <code>revita-plastics-site</code> or similar.</p>
                            </div>
                            <button type="submit" className="btn btn-primary">Save Configuration</button>
                        </div>
                    </form>
                </div>
            )}
            
            {activeTab === 'content' && content && (
                <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ margin: 0 }}>Site Content</h2>
                        <button onClick={handleSaveContent} disabled={isLoading} className="btn btn-primary">
                            {isLoading ? 'Saving...' : 'Save Content'}
                        </button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div>
                             <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>🇳🇱 Dutch (NL)</h3>
                             {renderContentFields(content.nl, [], 'nl')}
                        </div>
                        <div>
                             <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#666' }}>🇬🇧 English (EN)</h3>
                             {renderContentFields(content.en, [], 'en')}
                        </div>
                    </div>
                </div>
            )}
            
            {activeTab === 'design' && (
                <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Design Settings
                        <button onClick={restoreDefaults} style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }} className="btn btn-outline">Restore Defaults</button>
                    </h2>
                    
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Primary Color</label>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <input type="color" value={theme.primary} onChange={e => setTheme({...theme, primary: e.target.value})} style={{ width: '50px', height: '50px', padding: 0, border: 'none', cursor: 'pointer' }} />
                                <input value={theme.primary} onChange={e => setTheme({...theme, primary: e.target.value})} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd' }} />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Page Background</label>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <input type="color" value={theme.background} onChange={e => setTheme({...theme, background: e.target.value})} style={{ width: '50px', height: '50px', padding: 0, border: 'none', cursor: 'pointer' }} />
                                <input value={theme.background} onChange={e => setTheme({...theme, background: e.target.value})} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd' }} />
                            </div>
                        </div>
                        
                         <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Border Radius</label>
                            <input value={theme.radius} onChange={e => setTheme({...theme, radius: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd' }} placeholder="e.g. 8px or 1rem" />
                        </div>

                        <button onClick={handleSaveTheme} disabled={isLoading} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                            {isLoading ? 'Saving...' : 'Save Design Settings'}
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'products' && (
               <>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                    <button className="btn btn-primary" onClick={() => { 
                        setEditForm({
                            name: { nl: '', en: '' },
                            description: { nl: '', en: '' },
                            material: { nl: '', en: '' },
                            weight: { nl: '', en: '' },
                            impact: { nl: '', en: '' },
                            price: '',
                            image: '' 
                        }); 
                        setPreviewUrl(null);
                        setIsEditing(true); 
                    }}>
                        <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Product
                    </button>
                 </div>

                 {isEditing ? (
                    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
                         <h2 style={{ marginBottom: '1.5rem' }}>{editForm.id ? 'Edit Product' : 'New Product'}</h2>
                         <form onSubmit={handleSaveProduct}>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {/* Shared Fields */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label>Price</label>
                                        <input type="number" step="0.01" value={editForm.price || ''} onChange={e => setEditForm({...editForm, price: e.target.value})} required style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }} />
                                    </div>
                                    <div>
                                        <label>Image URL</label>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input value={editForm.image || ''} onChange={e => setEditForm({...editForm, image: e.target.value})} required style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }} />
                                        </div>
                                        <div style={{ marginTop: '0.5rem' }}>
                                            <label style={{ fontSize: '0.8rem', background: '#eee', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                                                Upload Image (Max 5MB)
                                                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                                            </label>
                                            {isLoading && <span style={{ fontSize: '0.8rem', marginLeft: '0.5rem' }}>Uploading...</span>}
                                        </div>
                                        {/* Image Preview */}
                                        {previewUrl && (
                                            <div style={{ marginTop: '0.5rem', border: '1px solid #ddd', padding: '0.5rem', borderRadius: '4px', textAlign: 'center' }}>
                                                <img src={previewUrl} alt="Preview" style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain' }} />
                                            </div>
                                        )}
                                        {/* Image Helper Box */}
                                        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#666', background: 'rgba(255,255,255,0.5)', padding: '0.8rem', borderRadius: '6px' }}>
                                            <strong>Note:</strong> Uploaded images are saved to your repo. It may take <strong>1-2 minutes</strong> for the live URL to work (build delay).
                                            The preview above is your specific file.
                                        </div>
                                    </div>
                                </div>
                                
                                {/* ... Bilingual layouts ... */}
                                {/* Bilingual Tabs/Sections */}
                                <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px', border: '1px solid #eee' }}>
                                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>🇳🇱 Dutch Content (NL)</h3>
                                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                                        <div>
                                            <label>Naam</label>
                                            <input 
                                                value={editForm.name?.nl || ''} 
                                                onChange={e => setEditForm({...editForm, name: { ...editForm.name, nl: e.target.value }})} 
                                                required 
                                                style={{ width: '100%', padding: '0.5rem' }} 
                                            />
                                        </div>
                                        <div>
                                            <label>Beschrijving</label>
                                            <textarea 
                                                value={editForm.description?.nl || ''} 
                                                onChange={e => setEditForm({...editForm, description: { ...editForm.description, nl: e.target.value }})} 
                                                required 
                                                style={{ width: '100%', padding: '0.5rem', minHeight: '60px' }} 
                                            />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                                            <input placeholder="Materiaal (HDPE)" value={editForm.material?.nl || ''} onChange={e => setEditForm({...editForm, material: { ...editForm.material, nl: e.target.value }})} style={{ width: '100%', padding: '0.5rem' }} />
                                            <input placeholder="Gewicht (250g)" value={editForm.weight?.nl || ''} onChange={e => setEditForm({...editForm, weight: { ...editForm.weight, nl: e.target.value }})} style={{ width: '100%', padding: '0.5rem' }} />
                                            <input placeholder="Impact (Redt 5 flessen)" value={editForm.impact?.nl || ''} onChange={e => setEditForm({...editForm, impact: { ...editForm.impact, nl: e.target.value }})} style={{ width: '100%', padding: '0.5rem' }} />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px', border: '1px solid #eee' }}>
                                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#666' }}>🇬🇧 English Content (EN)</h3>
                                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                                        <div>
                                            <label>Name</label>
                                            <input 
                                                value={editForm.name?.en || ''} 
                                                onChange={e => setEditForm({...editForm, name: { ...editForm.name, en: e.target.value }})} 
                                                style={{ width: '100%', padding: '0.5rem' }} 
                                            />
                                        </div>
                                        <div>
                                            <label>Description</label>
                                            <textarea 
                                                value={editForm.description?.en || ''} 
                                                onChange={e => setEditForm({...editForm, description: { ...editForm.description, en: e.target.value }})} 
                                                style={{ width: '100%', padding: '0.5rem', minHeight: '60px' }} 
                                            />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                                            <input placeholder="Material" value={editForm.material?.en || ''} onChange={e => setEditForm({...editForm, material: { ...editForm.material, en: e.target.value }})} style={{ width: '100%', padding: '0.5rem' }} />
                                            <input placeholder="Weight" value={editForm.weight?.en || ''} onChange={e => setEditForm({...editForm, weight: { ...editForm.weight, en: e.target.value }})} style={{ width: '100%', padding: '0.5rem' }} />
                                            <input placeholder="Impact" value={editForm.impact?.en || ''} onChange={e => setEditForm({...editForm, impact: { ...editForm.impact, en: e.target.value }})} style={{ width: '100%', padding: '0.5rem' }} />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="button" onClick={() => setIsEditing(false)} className="btn btn-outline">Cancel</button>
                                    <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Product'}</button>
                                </div>
                            </div>
                         </form>
                    </div>
                 ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {products.map(p => (
                            <div key={p.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <img src={p.image} alt={p.name.en || p.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                                    <div>
                                        <h3 style={{ margin: 0 }}>
                                            {typeof p.name === 'object' ? p.name.nl || p.name.en : p.name}
                                        </h3>
                                        <p style={{ color: 'gray', margin: 0 }}>${p.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => { 
                                        const norm = normalizeProduct(p);
                                        setEditForm(norm); 
                                        setPreviewUrl(norm.image); // Show existing image
                                        setIsEditing(true); 
                                    }} className="btn btn-outline" style={{ padding: '0.5rem' }}>
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(p.id)} className="btn btn-outline" style={{ padding: '0.5rem', color: '#ff6b6b', borderColor: '#ff6b6b' }}>
                                        <Trash size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {products.length === 0 && !isLoading && <p style={{ textAlign: 'center', color: 'gray' }}>No products found. Start by adding one or check Settings.</p>}
                        {isLoading && <div style={{ textAlign: 'center', padding: '2rem' }}><Loader className="spin" /> Loading...</div>}
                    </div>
                 )}
               </>
            )}
        </div>
    </div>
  );
}
