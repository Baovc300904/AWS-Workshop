import { useEffect, useState } from 'react';
import { Game, fetchGamesByPrice, createGame, updateGame, deleteGame, fetchCategories, Category, setAuthToken, fetchMonthlySales, createCategory } from '../../api/client';
import './AdminPage.css';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import type { TabKey } from '../../components/admin/AdminNavbar';
import { DashboardSection } from '../../components/admin/DashboardSection';
import { GamesSection } from '../../components/admin/GamesSection';
import { CategoriesSection } from '../../components/admin/CategoriesSection';
import { SettingsSection } from './sections/SettingsSection';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<{ id?: string; name: string; price: number | ''; quantity: number | ''; salePercent?: number | '' }>(()=>({ name:'', price:'', quantity:'' }));
  const [filter, setFilter] = useState('');
  const [cats, setCats] = useState<Category[]>([]);
  const [catsLoading, setCatsLoading] = useState(false);
  const [catsError, setCatsError] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true); setError(null);
    try { setGames(await fetchGamesByPrice('asc')); } catch(e:any){ setError(e?.response?.data?.message||'Failed'); } finally { setLoading(false); }
  };
  useEffect(()=>{ if (activeTab==='games' || activeTab==='dashboard') { reload(); } }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'categories') return;
    let cancelled = false;
    setCatsLoading(true); setCatsError(null);
    fetchCategories()
      .then((arr)=>{ if (!cancelled) setCats(arr||[]); })
      .catch((e:any)=>{ if (!cancelled) setCatsError(e?.response?.data?.message || 'Failed to load categories'); })
      .finally(()=>{ if (!cancelled) setCatsLoading(false); });
    return () => { cancelled = true; };
  }, [activeTab]);

  const handleCreateCategory = async (data: { name: string; description?: string }) => {
    await createCategory(data);
    // refresh list
    setCatsLoading(true); setCatsError(null);
    try { const arr = await fetchCategories(); setCats(arr||[]); }
    catch (e:any) { setCatsError(e?.response?.data?.message || 'Failed to load categories'); }
    finally { setCatsLoading(false); }
  };

  const [monthly, setMonthly] = useState<Array<{ month: string; amount: number }> | null>(null);
  const [monthlyErr, setMonthlyErr] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setMonthlyErr(null);
      try {
        const data = await fetchMonthlySales();
        if (!cancelled) setMonthly(data ?? []);
      } catch (e:any) {
        if (!cancelled) setMonthlyErr(e?.response?.data?.message || 'Failed to load monthly sales');
      }
    };
    if (activeTab === 'dashboard') run();
    return () => { cancelled = true; };
  }, [activeTab]);

  const Chart = () => {
    const months = monthly?.map(m => m.month) ?? ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const values = monthly?.map(m => m.amount) ?? (()=>{
      const base = games.reduce((s,g)=> s + (Number(g.price)||0), 0) || 1;
      const arr:number[] = [];
      for (let i=0;i<12;i++) { const factor = 0.6 + (i/18) + ((i%3)-1)*0.04; arr.push(Math.max(0, Math.round(base * factor/12))); }
      return arr;
    })();

    const w = 1000, h = 240, pad = { l:40, r:20, t:24, b:36 };
    const max = Math.max(1, ...values);
    const x = (i:number) => pad.l + (i*(w - pad.l - pad.r)/ (months.length-1));
    const y = (v:number) => pad.t + (h - pad.t - pad.b) - (v / max) * (h - pad.t - pad.b);
    const points = values.map((v,i)=> `${x(i)},${y(v)}`).join(' ');
    return (
      <svg className="chartSvg" viewBox={`0 0 ${w} ${h}`}>
        <line className="chartAxis" x1={pad.l} y1={y(0)} x2={w-pad.r} y2={y(0)} />
        <polyline className="chartLine" fill="none" strokeWidth={4} points={points} />
        {values.map((v,i)=> (
          <g key={i}>
            <circle className="chartPoint" cx={x(i)} cy={y(v)} r={5} />
            <text className="chartLabel" x={x(i)} y={y(v)-10} textAnchor="middle">{v.toLocaleString('en-US', { notation:'compact', compactDisplay:'short' })}</text>
            <text className="chartLabel" x={x(i)} y={h-12} textAnchor="middle">{months[i]}</text>
          </g>
        ))}
        <text className="chartLabel" x={w/2} y={18} textAnchor="middle" fontWeight={800}>Sales Trend</text>
        {monthlyErr && <text className="chartLabel" x={w-10} y={18} textAnchor="end">(fallback)</text>}
      </svg>
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload:any = { name: form.name, price: Number(form.price), quantity: Number(form.quantity) };
      if (form.salePercent !== '' && typeof form.salePercent !== 'undefined') payload.salePercent = Number(form.salePercent);
      if (form.id) { await updateGame(form.id, payload); } else { await createGame(payload); }
      setForm({ name:'', price:'', quantity:'' });
      await reload();
    } catch (e:any) { alert(e?.response?.data?.message||'Failed'); }
  };

  const startEdit = (g:Game) => setForm({ id: g.id, name: g.name, price: g.price as any, quantity: g.quantity as any, salePercent: (g as any).salePercent as any });
  const doDelete = async (g:Game) => { if (!confirm(`Delete ${g.name}?`)) return; await deleteGame(g.id); await reload(); };

  const shown = games.filter(g => g.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="adminRoot">
      <div className="adminLayout">
        <aside className="adminSidebar">
          <div className="adminBrand">Devteria Admin</div>
          <AdminNavbar active={activeTab} onChange={setActiveTab} />
        </aside>
        <main className="adminMain">
          <div className="adminTopbar">
            <div className="topbarLeft">
              <h2 className="adminTitle">{activeTab.charAt(0).toUpperCase()+activeTab.slice(1)}</h2>
              {activeTab==='dashboard' && (
                <div className="searchWrap"><input className="input" placeholder="Search..." /></div>
              )}
            </div>
            <div className="topbarActions">
              {activeTab==='dashboard' && <button className="btn">Add Video</button>}
              <button className="btn" onClick={()=>{ 
                try { 
                  localStorage.removeItem('wgs_token'); 
                  localStorage.removeItem('token'); 
                  setAuthToken(null); 
                } catch {} finally { 
                  window.location.href = '/login'; 
                } 
              }}>Logout</button>
            </div>
          </div>
          <div className="adminContent">
            {activeTab==='dashboard' && (<DashboardSection />)}
            {activeTab==='dashboard' && (
              <section className="panel chartWrap"><Chart /></section>
            )}
            {activeTab==='games' && (
              <GamesSection
                form={form}
                loading={loading}
                error={error}
                filter={filter}
                shown={shown}
                onSubmit={onSubmit}
                setForm={setForm}
                setFilter={setFilter}
                startEdit={startEdit}
                doDelete={doDelete}
              />
            )}
            {activeTab==='categories' && (
              <CategoriesSection cats={cats} loading={catsLoading} error={catsError} onCreate={handleCreateCategory} />
            )}
            {(activeTab==='users' || activeTab==='orders' || activeTab==='reports') && (
              <section className="panel">
                <div className="panelHeader">
                  <h3 className="panelTitle">{activeTab.charAt(0).toUpperCase()+activeTab.slice(1)}</h3>
                </div>
                <div className="loading">This section is a placeholder. Implement {activeTab} management here.</div>
              </section>
            )}
            {activeTab==='settings' && (
              <SettingsSection />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
