import { Game, uploadImageToS3 } from '../../api/client';
import { useState } from 'react';

export interface GamesSectionProps {
  form: { id?: string; name: string; price: number | ''; quantity: number | ''; salePercent?: number | ''; image?: string; cover?: string; video?: string };
  loading: boolean;
  error: string | null;
  filter: string;
  shown: Game[];
  onSubmit: (e: React.FormEvent) => void;
  setForm: React.Dispatch<React.SetStateAction<{ id?: string; name: string; price: number | ''; quantity: number | ''; salePercent?: number | ''; image?: string; cover?: string; video?: string }>>;
  setFilter: (v: string) => void;
  startEdit: (g: Game) => void;
  doDelete: (g: Game) => void;
}

export function GamesSection({ form, loading, error, filter, shown, onSubmit, setForm, setFilter, startEdit, doDelete }: GamesSectionProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const url = await uploadImageToS3(file);
      setForm(f => ({ ...f, [field]: url }));
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to upload image';
      setUploadError(`Upload failed: ${errorMsg}. You can enter image URL manually below.`);
      console.error('S3 upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <section className="panel">
        <div className="panelHeader">
          <h3 className="panelTitle">Create / Edit Game</h3>
        </div>
        {uploadError && <div className="error" style={{ margin: '1rem', padding: '0.75rem', background: '#fee', color: '#c00', borderRadius: '8px' }}>{uploadError}</div>}
        <form className="adminForm" onSubmit={onSubmit}>
          <div className="field">
            <label className="label">Name</label>
            <input className="input" value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))} placeholder="Game name" required />
          </div>
          
          <div className="field">
            <label className="label">Main Image 🖼️</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleImageUpload(e, 'image')}
              disabled={uploading}
              className="input"
              title="Upload main image"
            />
            <small style={{ display: 'block', marginTop: '0.25rem', color: '#888' }}>Or enter image URL:</small>
            <input 
              className="input" 
              value={form.image || ''} 
              onChange={e=>setForm(f=>({...f, image:e.target.value}))} 
              placeholder="https://example.com/image.jpg"
              style={{ marginTop: '0.5rem' }}
            />
            {form.image && (
              <div style={{ marginTop: '0.5rem' }}>
                <img src={form.image} alt="Preview" style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '8px', border: '2px solid #ddd' }} />
                <button 
                  type="button" 
                  className="btn danger" 
                  style={{ marginLeft: '1rem', padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                  onClick={() => setForm(f => ({ ...f, image: '' }))}
                >
                  Remove
                </button>
              </div>
            )}
            {uploading && <small style={{ color: '#888' }}>Uploading to S3...</small>}
          </div>

          <div className="field">
            <label className="label">Cover Image 🎨</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleImageUpload(e, 'cover')}
              disabled={uploading}
              className="input"
              title="Upload cover image"
            />
            <small style={{ display: 'block', marginTop: '0.25rem', color: '#888' }}>Or enter image URL:</small>
            <input 
              className="input" 
              value={form.cover || ''} 
              onChange={e=>setForm(f=>({...f, cover:e.target.value}))} 
              placeholder="https://example.com/cover.jpg"
              style={{ marginTop: '0.5rem' }}
            />
            {form.cover && (
              <div style={{ marginTop: '0.5rem' }}>
                <img src={form.cover} alt="Cover Preview" style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '8px', border: '2px solid #ddd' }} />
                <button 
                  type="button" 
                  className="btn danger" 
                  style={{ marginLeft: '1rem', padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                  onClick={() => setForm(f => ({ ...f, cover: '' }))}
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="field">
            <label className="label">Video URL 🎬 (YouTube or S3)</label>
            <input 
              className="input" 
              value={form.video || ''} 
              onChange={e=>setForm(f=>({...f, video:e.target.value}))} 
              placeholder="https://youtube.com/watch?v=..." 
            />
          </div>

          <div className="field">
            <label className="label">Price 💰</label>
            <input className="input" type="number" value={form.price} onChange={e=>setForm(f=>({...f, price:e.target.value as any}))} placeholder="VND" required />
          </div>
          <div className="field">
            <label className="label">Quantity 📦</label>
            <input className="input" type="number" value={form.quantity} onChange={e=>setForm(f=>({...f, quantity:e.target.value as any}))} placeholder="Stock" required />
          </div>
          <div className="field">
            <label className="label">Sale % 🏷️</label>
            <input className="input" type="number" min={0} max={100} step={1} value={form.salePercent ?? ''} onChange={e=>setForm(f=>({...f, salePercent:e.target.value as any}))} placeholder="0-100" />
          </div>
          <button className="btn primary" type="submit" disabled={uploading || loading}>
            {uploading ? 'Uploading...' : (form.id ? '✏️ Update Game' : '➕ Create Game')}
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <h3 className="panelTitle">Games</h3>
          <input className="input" placeholder="Filter by name" value={filter} onChange={(e)=>setFilter(e.target.value)} />
        </div>
        {loading ? (<div className="loading">Loading...</div>) : error ? (<div className="error">{error}</div>) : (
          <table className="adminTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Sale %</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(shown || []).map(g => (
                <tr key={g?.id || Math.random()}>
                  <td>{g?.name || 'Unknown'}</td>
                  <td>
                    {typeof g?.price === 'number' 
                      ? g.price.toLocaleString('vi-VN', { style:'currency', currency:'VND' })
                      : '0₫'}
                  </td>
                  <td>{g?.quantity ?? 0}</td>
                  <td>{(g as any)?.salePercent ?? 0}%</td>
                  <td>
                    <div className="tableActions">
                      <button className="btn" onClick={()=>startEdit(g)}>Edit</button>
                      <button className="btn danger" onClick={()=>doDelete(g)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
