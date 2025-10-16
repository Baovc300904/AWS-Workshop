import { Game } from '../../api/client';

export interface GamesSectionProps {
  form: { id?: string; name: string; price: number | ''; quantity: number | ''; salePercent?: number | '' };
  loading: boolean;
  error: string | null;
  filter: string;
  shown: Game[];
  onSubmit: (e: React.FormEvent) => void;
  setForm: React.Dispatch<React.SetStateAction<{ id?: string; name: string; price: number | ''; quantity: number | ''; salePercent?: number | '' }>>;
  setFilter: (v: string) => void;
  startEdit: (g: Game) => void;
  doDelete: (g: Game) => void;
}

export function GamesSection({ form, loading, error, filter, shown, onSubmit, setForm, setFilter, startEdit, doDelete }: GamesSectionProps) {
  return (
    <>
      <section className="panel">
        <div className="panelHeader">
          <h3 className="panelTitle">Create / Edit Game</h3>
        </div>
        <form className="adminForm" onSubmit={onSubmit}>
          <div className="field">
            <label className="label">Name</label>
            <input className="input" value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))} placeholder="Game name" />
          </div>
          <div className="field">
            <label className="label">Price</label>
            <input className="input" type="number" value={form.price} onChange={e=>setForm(f=>({...f, price:e.target.value as any}))} placeholder="VND" />
          </div>
          <div className="field">
            <label className="label">Quantity</label>
            <input className="input" type="number" value={form.quantity} onChange={e=>setForm(f=>({...f, quantity:e.target.value as any}))} placeholder="Stock" />
          </div>
          <div className="field">
            <label className="label">Sale %</label>
            <input className="input" type="number" min={0} max={100} step={1} value={form.salePercent ?? ''} onChange={e=>setForm(f=>({...f, salePercent:e.target.value as any}))} placeholder="0-100" />
          </div>
          <button className="btn primary" type="submit">{form.id ? 'Update' : 'Create'}</button>
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
              {shown.map(g => (
                <tr key={g.id}>
                  <td>{g.name}</td>
                  <td>{(g.price as any).toLocaleString('vi-VN', { style:'currency', currency:'VND' })}</td>
                  <td>{g.quantity}</td>
                  <td>{(g as any).salePercent ?? 0}</td>
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
