import { useState } from "react";

interface Product {
  id: number;
  name: string;
  category?: string;
  price?: string;
  image?: string;
  description?: string;
  benefits?: string[];
  ingredients?: string[];
}

interface Settings {
  siteName: string;
  aboutText: string;
  primaryColor: string;
}

interface AdminPageProps {
  products: Product[];
  setProducts: (p: Product[] | ((p: Product[]) => Product[])) => void;
  settings: Settings;
  setSettings: (s: Settings | ((s: Settings) => Settings)) => void;
}

export function AdminPage({
  products,
  setProducts,
  settings,
  setSettings,
}: AdminPageProps) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Simple client-side credentials; prefer to use settings-admin password if available
  const VALID_USERNAME = "admin";
  const VALID_PASSWORD = (settings && (settings as any).adminPassword) || "revita123";

  // Product form state
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>({});

  const login = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      setLoggedIn(true);
    } else {
      alert("Onjuiste gebruikersnaam of wachtwoord");
    }
  };

  const logout = () => {
    setLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  const startAdd = () => {
    setEditing(null);
    setForm({});
  };

  // helper to read file as data URL
  const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const startEdit = (p: Product) => {
    setEditing(p);
    setForm({ ...p });
  };

  const saveProduct = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!form.name) {
      alert("Vul een productnaam in");
      return;
    }
    if (editing) {
      setProducts((prev: Product[]) =>
        prev.map((p) =>
          p.id === editing.id ? { ...p, ...(form as Product) } : p
        )
      );
    } else {
      const nextId = products.length
        ? Math.max(...products.map((p) => p.id)) + 1
        : 1;
      setProducts((prev: Product[]) => [
        ...prev,
        { id: nextId, ...(form as Product) },
      ]);
    }
    setEditing(null);
    setForm({});
  };

  const deleteProduct = (id: number) => {
    if (!confirm("Weet je zeker dat je dit product wilt verwijderen?")) return;
    setProducts((prev: Product[]) => prev.filter((p) => p.id !== id));
  };

  const saveSettings = (e?: React.FormEvent) => {
    e?.preventDefault();
    // settings are bound to inputs via local state below
  };

  if (!loggedIn) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-2xl mb-4">Admin login</h2>
        <form onSubmit={login} className="space-y-4">
          <div>
            <label className="block text-sm">Gebruikersnaam</label>
            <input
              className="mt-1 block w-full border rounded px-3 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm">Wachtwoord</label>
            <input
              type="password"
              className="mt-1 block w-full border rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              className="bg-emerald-600 text-white px-4 py-2 rounded"
              type="submit"
            >
              Inloggen
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl">Admin paneel</h2>
        <div className="flex items-center gap-3">
          <button className="px-3 py-2 bg-gray-100 rounded" onClick={startAdd}>
            Nieuw product
          </button>
          <button className="px-3 py-2 bg-red-100 rounded" onClick={logout}>
            Log uit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h3 className="mb-3">Producten</h3>
          <div className="space-y-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="border rounded p-3 flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-gray-600">
                    {p.category} • {p.price}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-2 py-1 bg-emerald-100 rounded"
                    onClick={() => startEdit(p)}
                  >
                    Bewerk
                  </button>
                  <button
                    className="px-2 py-1 bg-red-100 rounded"
                    onClick={() => deleteProduct(p.id)}
                  >
                    Verwijder
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-4">
            <h4 className="mb-2">Product formulier</h4>
            <form onSubmit={saveProduct} className="space-y-3">
              <div>
                <label className="block text-sm">Naam</label>
                <input
                  className="mt-1 block w-full border rounded px-3 py-2"
                  value={form.name || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm">Categorie</label>
                <input
                  className="mt-1 block w-full border rounded px-3 py-2"
                  value={form.category || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm">Prijs</label>
                <input
                  className="mt-1 block w-full border rounded px-3 py-2"
                  value={form.price || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm">
                  Afbeelding (URL of upload)
                </label>
                <input
                  className="mt-1 block w-full border rounded px-3 py-2"
                  value={form.image || ""}
                  placeholder="Plak een URL of upload een bestand"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, image: e.target.value }))
                  }
                />
                <div className="mt-2 flex gap-2 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files && e.target.files[0];
                      if (!file) return;
                      try {
                        const dataUrl = await fileToDataUrl(file);
                        setForm((f) => ({ ...f, image: dataUrl }));
                      } catch (err) {
                        alert("Kan bestand niet lezen");
                      }
                    }}
                  />
                  {/* If Cloudinary config present, offer upload */}
                  {((settings as any)?.cloudinaryCloudName && (settings as any)?.cloudinaryUploadPreset) && (
                    <button
                      type="button"
                      className="px-3 py-1 bg-indigo-600 text-white rounded"
                      onClick={async () => {
                        const input = document.querySelector('input[type=file]') as HTMLInputElement | null;
                        const file = input?.files?.[0];
                        if (!file) return alert('Selecteer eerst een bestand');
                        try {
                          const formData = new FormData();
                          formData.append('file', file);
                          formData.append('upload_preset', (settings as any).cloudinaryUploadPreset);
                          const cloudName = (settings as any).cloudinaryCloudName;
                          const resp = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                            method: 'POST',
                            body: formData,
                          });
                          const json = await resp.json();
                          if (json.secure_url) {
                            setForm((f) => ({ ...f, image: json.secure_url }));
                          } else {
                            alert('Upload mislukt');
                          }
                        } catch (err) {
                          alert('Upload fout: ' + (err as any).message);
                        }
                      }}
                    >
                      Upload naar Cloudinary
                    </button>
                  )}
                  {form.image && (
                    <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={form.image}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm">Beschrijving</label>
                <textarea
                  className="mt-1 block w-full border rounded px-3 py-2"
                  value={form.description || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                />
              </div>

              <div className="flex gap-2">
                <button
                  className="px-4 py-2 bg-emerald-600 text-white rounded"
                  type="submit"
                >
                  Opslaan
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 rounded"
                  onClick={() => {
                    setEditing(null);
                    setForm({});
                  }}
                >
                  Annuleren
                </button>
              </div>
            </form>
          </div>
        </div>

        <div>
          <h3 className="mb-3">Instellingen</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // settings are updated inline via inputs below
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-sm">Site naam</label>
              <input
                className="mt-1 block w-full border rounded px-3 py-2"
                value={settings.siteName}
                onChange={(e) =>
                  setSettings({ ...settings, siteName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm">Over tekst</label>
              <textarea
                className="mt-1 block w-full border rounded px-3 py-2"
                value={settings.aboutText}
                onChange={(e) =>
                  setSettings({ ...settings, aboutText: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm">Primaire kleur</label>
              <input
                type="color"
                className="mt-1 block w-24 h-10 border rounded"
                value={settings.primaryColor}
                onChange={(e) =>
                  setSettings({ ...settings, primaryColor: e.target.value })
                }
              />
            </div>

            <div>
              <button
                type="button"
                className="px-4 py-2 bg-emerald-600 text-white rounded"
                onClick={() => {
                  // bump settings state to trigger parent updates (already done onChange)
                  alert("Instellingen opgeslagen (in geheugen)");
                }}
              >
                Opslaan
              </button>
            </div>
            <div className="mt-4">
              <small className="text-gray-600">
                Wijzigingen blijven lokaal in geheugen totdat je publiceert naar
                GitHub.
              </small>
              <div className="mt-2">
                <button
                  className="px-3 py-2 bg-blue-600 text-white rounded"
                  onClick={async () => {
                    const confirmPublish = confirm(
                      "Publiceer huidige producten naar GitHub?\nDit zal een workflow triggeren die het file src/data/products.json bijwerkt in de repository."
                    );
                    if (!confirmPublish) return;

                    const token = prompt(
                      "Plak hier een GitHub Personal Access Token (repo:contents write)\n(LET OP: dit is client-side en niet veilig voor productie)"
                    );
                    if (!token) return;

                    try {
                      const owner = "Revita-Plastics";
                      const repo = "revita";
                      const url = `https://api.github.com/repos/${owner}/${repo}/dispatches`;
                      const payload = {
                        products: JSON.stringify(products, null, 2),
                        settings: JSON.stringify(settings, null, 2),
                      };

                      const r = await fetch(url, {
                        method: "POST",
                        headers: {
                          Authorization: `token ${token}`,
                          Accept: "application/vnd.github+json",
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          event_type: "save-data",
                          client_payload: payload,
                        }),
                      });

                      if (r.ok) {
                        alert(
                          "Publicatie gestart — de workflow werkt het bestand bij en pusht naar main."
                        );
                      } else {
                        const txt = await r.text();
                        alert("Fout bij publiceren: " + r.status + " " + txt);
                      }
                    } catch (err) {
                      alert("Fout bij publiceren: " + (err as any).message);
                    }
                  }}
                >
                  Publiceer naar GitHub
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
