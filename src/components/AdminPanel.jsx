import React, { useState, useEffect } from 'react';
import { github } from '../services/github';
import { Link } from 'react-router-dom';
import { Settings, LogOut, Plus, Edit, Trash, Save, X, Loader } from 'lucide-react';

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

  // Data
  const [products, setProducts] = useState([]);
  const [sha, setSha] = useState(null); // File SHA for updates
  
  // UI State
  const [activeTab, setActiveTab] = useState('products'); // products, settings
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);

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
        
        // If we have config, try to fetch products
        if (config.owner && config.repo) {
            fetchProducts(t, config);
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
    setActiveTab('products');
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
        let newProducts;
        let message;
        if (editForm.id) {
            // Update
            newProducts = products.map(p => p.id === editForm.id ? { ...editForm, price: parseFloat(editForm.price) } : p);
            message = `Update product: ${editForm.name}`;
        } else {
            // Create
            const newId = Math.max(...products.map(p => p.id), 0) + 1;
            newProducts = [...products, { ...editForm, id: newId, price: parseFloat(editForm.price) }];
            message = `Add product: ${editForm.name}`;
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

            {activeTab === 'products' && (
               <>
                 <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                    <button className="btn btn-primary" onClick={() => { setEditForm({}); setIsEditing(true); }}>
                        <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Product
                    </button>
                 </div>

                 {isEditing ? (
                    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
                         <h2 style={{ marginBottom: '1.5rem' }}>{editForm.id ? 'Edit Product' : 'New Product'}</h2>
                         <form onSubmit={handleSaveProduct}>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <div>
                                    <label>Name</label>
                                    <input value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} required style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }} />
                                </div>
                                <div>
                                    <label>Price</label>
                                    <input type="number" step="0.01" value={editForm.price || ''} onChange={e => setEditForm({...editForm, price: e.target.value})} required style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }} />
                                </div>
                                <div>
                                    <label>Image URL</label>
                                    <input value={editForm.image || ''} onChange={e => setEditForm({...editForm, image: e.target.value})} required style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }} />
                                </div>
                                <div>
                                    <label>Description</label>
                                    <textarea value={editForm.description || ''} onChange={e => setEditForm({...editForm, description: e.target.value})} required style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem', minHeight: '100px' }} />
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
                                    <img src={p.image} alt={p.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                                    <div>
                                        <h3 style={{ margin: 0 }}>{p.name}</h3>
                                        <p style={{ color: 'gray', margin: 0 }}>${p.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => { setEditForm(p); setIsEditing(true); }} className="btn btn-outline" style={{ padding: '0.5rem' }}>
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
