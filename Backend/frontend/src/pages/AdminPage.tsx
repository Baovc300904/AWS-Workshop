import { useEffect, useMemo, useState } from 'react';
import { Game, fetchGamesByPrice, createGame, updateGame, deleteGame } from '../api/client';

export default function AdminPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<{ 
    id?: string; 
    name: string; 
    price: number | ''; 
    quantity: number | ''; 
    salePercent?: number | '';
    image?: string;
    releaseDate?: string;
    cover?: string;
    video?: string;
    categoriesText?: string;
  }>(()=>({ name:'', price:'', quantity:'', categoriesText:'' }));
  const [filter, setFilter] = useState('');

  const reload = async () => {
    setLoading(true); setError(null);
    try { setGames(await fetchGamesByPrice('asc')); } catch(e:any){ setError(e?.response?.data?.message||'Failed'); } finally { setLoading(false); }
  };
  useEffect(()=>{ reload(); }, []);

  const totalRevenue = useMemo(()=>{
    // demo revenue: sum(price * 100 sold) fake; replace with real endpoint later
    return games.reduce((s,g)=> s + (Number(g.price)||0), 0);
  }, [games]);

  // Simple line chart (SVG) for monthly revenue trend (demo)
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthly = useMemo(()=>{
    // demo: distribute current total across months with slight trend
    const base = totalRevenue || 1;
    const arr:number[] = [];
    for (let i=0;i<12;i++) {
      const factor = 0.6 + (i/18) + ((i%3)-1)*0.04; // wave + upward tilt
      arr.push(Math.max(0, Math.round(base * factor/12)));
    }
    return arr;
  }, [totalRevenue]);

  const Chart = () => {
    const w = 1000, h = 240, pad = { l:40, r:20, t:24, b:36 };
    const max = Math.max(1, ...monthly);
    const x = (i:number) => pad.l + (i*(w - pad.l - pad.r)/ (months.length-1));
    const y = (v:number) => pad.t + (h - pad.t - pad.b) - (v / max) * (h - pad.t - pad.b);
    const points = monthly.map((v,i)=> `${x(i)},${y(v)}`).join(' ');
    return (
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width:'100%', height:260, background:'#101820', border:'1px solid #1f2c36', borderRadius:12 }}>
        {/* axes */}
        <line x1={pad.l} y1={y(0)} x2={w-pad.r} y2={y(0)} stroke="#2a3b4d" />
        <polyline fill="none" stroke="#66c0f4" strokeWidth={4} points={points} />
        {monthly.map((v,i)=> (
          <g key={i}>
            <circle cx={x(i)} cy={y(v)} r={5} fill="#66c0f4" />
            <text x={x(i)} y={y(v)-10} textAnchor="middle" fontSize={12} fill="#c7e7ff">{v.toLocaleString('en-US', { notation:'compact', compactDisplay:'short' })}</text>
            <text x={x(i)} y={h-12} textAnchor="middle" fontSize={12} fill="#9fb6c0">{months[i]}</text>
          </g>
        ))}
        <text x={w/2} y={18} textAnchor="middle" fontSize={16} fill="#e6f7ff" fontWeight={800}>Sales Trend</text>
      </svg>
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload:any = {
        name: form.name,
        price: Number(form.price),
        quantity: Number(form.quantity),
        categories: (form.categoriesText || '')
          .split(',')
          .map(s=>s.trim())
          .filter(Boolean)
      };
      if (form.salePercent !== '' && typeof form.salePercent !== 'undefined') payload.salePercent = Number(form.salePercent);
      if (form.image && form.image.trim()) payload.image = form.image;
      if (form.releaseDate && form.releaseDate.trim()) payload.releaseDate = form.releaseDate;
      if (form.cover && form.cover.trim()) payload.cover = form.cover;
      if (form.video && form.video.trim()) payload.video = form.video;
      if (form.id) {
        await updateGame(form.id, payload);
      } else {
        await createGame(payload);
      }
      setForm({ name:'', price:'', quantity:'', categoriesText:'' });
      await reload();
    } catch (e:any) { alert(e?.response?.data?.message||'Failed'); }
  };

  const startEdit = (g:Game) => setForm({ 
    id: g.id, 
    name: g.name, 
    price: g.price as any, 
    quantity: g.quantity as any, 
    salePercent: (g as any).salePercent as any,
    image: (g as any).image || '',
    releaseDate: (g as any).releaseDate || '',
    cover: (g as any).cover || '',
    video: (g as any).video || '',
    categoriesText: ((g as any).categories||[]).map((c:any)=>c.name).join(', ')
  });
  const doDelete = async (g:Game) => { if (!confirm(`Delete ${g.name}?`)) return; await deleteGame(g.id); await reload(); };

  const shown = games.filter(g => g.name.toLowerCase().includes(filter.toLowerCase()));

  const labelS: React.CSSProperties = { display:'block', marginBottom:4, color:'#c7e7ff', fontWeight:700 };
  const inputS: React.CSSProperties = { width:'100%', background:'#1b2838', color:'#e6f7ff', border:'1px solid #2a3b4d', borderRadius:6, padding:'8px 10px' };

  return (
    <div style={{ maxWidth: 1100, margin: '24px auto', padding: 16, color: '#e6f7ff' }}>
      <h2 style={{ marginBottom: 12 }}>Admin Dashboard</h2>
      <div style={{ background:'#101820', border:'1px solid #1f2c36', borderRadius:12, padding:16, marginBottom:16 }}>
        <div style={{ fontWeight:900 }}>Revenue</div>
        <div style={{ fontWeight:900, color:'#8be28b' }}>{totalRevenue.toLocaleString('vi-VN', { style:'currency', currency:'VND' })}</div>
      </div>

      <form onSubmit={onSubmit} style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:12, alignItems:'end', background:'#101820', border:'1px solid #1f2c36', borderRadius:12, padding:16 }}>
        <div>
          <label style={labelS}>Name</label>
          <input value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))} style={inputS} placeholder="Game name" />
        </div>
        <div>
          <label style={labelS}>Price</label>
          <input type="number" value={form.price} onChange={e=>setForm(f=>({...f, price:e.target.value as any}))} style={inputS} placeholder="VND" />
        </div>
        <div>
          <label style={labelS}>Quantity</label>
          <input type="number" value={form.quantity} onChange={e=>setForm(f=>({...f, quantity:e.target.value as any}))} style={inputS} placeholder="Stock" />
        </div>
        <div>
          <label style={labelS}>Sale %</label>
          <input type="number" min={0} max={100} step={1} value={form.salePercent ?? ''} onChange={e=>setForm(f=>({...f, salePercent:e.target.value as any}))} style={inputS} placeholder="0-100" />
        </div>
        <div>
          <label style={labelS}>Categories (comma separated)</label>
          <input value={form.categoriesText ?? ''} onChange={e=>setForm(f=>({...f, categoriesText:e.target.value}))} style={inputS} placeholder="e.g. Action, Horror, Co-op" />
        </div>
        <div>
          <label style={labelS}>Image URL</label>
          <input value={form.image ?? ''} onChange={e=>setForm(f=>({...f, image:e.target.value}))} style={inputS} placeholder="Image URL" />
        </div>
        <div>
          <label style={labelS}>Release Date</label>
          <input type="date" value={form.releaseDate ?? ''} onChange={e=>setForm(f=>({...f, releaseDate:e.target.value}))} style={inputS} />
        </div>
        <div>
          <label style={labelS}>Cover URL</label>
          <input value={form.cover ?? ''} onChange={e=>setForm(f=>({...f, cover:e.target.value}))} style={inputS} placeholder="Cover URL" />
        </div>
        <div>
          <label style={labelS}>Video URL</label>
          <input value={form.video ?? ''} onChange={e=>setForm(f=>({...f, video:e.target.value}))} style={inputS} placeholder="Video URL" />
        </div>
        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center' }}>
          <button type="submit" style={{ height:36, padding: '0 24px' }}>{form.id ? 'Update' : 'Create'}</button>
        </div>
      </form>

      {/* Sales line chart */}
      <div style={{ marginTop:16 }}>
        <Chart />
      </div>

      <div style={{ display:'flex', justifyContent:'space-between', margin:'12px 0' }}>
        <div style={{ fontWeight:800 }}>Games</div>
        <input placeholder="Filter by name" value={filter} onChange={(e)=>setFilter(e.target.value)} />
      </div>

      {loading ? (<div>Loading...</div>) : error ? (<div style={{ color:'#ff8a80' }}>{error}</div>) : (
        <table style={{ width:'100%', borderCollapse:'collapse', background:'#101820', border:'1px solid #1f2c36', borderRadius:12 }}>
          <thead>
            <tr style={{ textAlign:'left' }}>
              <th style={{ padding:10 }}>Name</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Sale %</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {shown.map(g => (
              <tr key={g.id}>
                <td style={{ padding:10 }}>{g.name}</td>
                <td>{(g.price as any).toLocaleString('vi-VN', { style:'currency', currency:'VND' })}</td>
                <td>{g.quantity}</td>
                <td>{(g as any).salePercent ?? 0}</td>
                <td style={{ display:'flex', gap:8 }}>
                  <button onClick={()=>startEdit(g)}>Edit</button>
                  <button onClick={()=>doDelete(g)} style={{ background:'#a33', color:'#fff' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


