import { Category } from '../../api/client';
import { useState } from 'react';

export interface CategoriesSectionProps {
  cats: Category[];
  loading: boolean;
  error: string | null;
  onCreate?: (data: { name: string; description?: string }) => Promise<void> | void;
}

export function CategoriesSection({ cats, loading, error, onCreate }: CategoriesSectionProps) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const doSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onCreate) return;
    if (!name.trim()) { alert('Name is required'); return; }
    try { setSubmitting(true); await onCreate({ name: name.trim(), description: desc.trim() || undefined }); setName(''); setDesc(''); }
    finally { setSubmitting(false); }
  };
  return (
    <section className="panel">
      <div className="panelHeader">
        <h3 className="panelTitle">Categories</h3>
      </div>
      {onCreate && (
        <form onSubmit={doSubmit} className="catForm">
          <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="input" placeholder="Description (optional)" value={desc} onChange={e=>setDesc(e.target.value)} />
          <button disabled={submitting} className="btn" type="submit">{submitting? 'Adding...' : 'Add'}</button>
        </form>
      )}
      {loading ? (<div className="loading">Loading...</div>) : error ? (<div className="error">{error}</div>) : (
        <table className="adminTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {cats.map(c => (
              <tr key={c.name}>
                <td>{c.name}</td>
                <td>{c.description || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
