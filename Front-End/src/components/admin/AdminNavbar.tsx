
type TabKey =
  | 'dashboard'
  | 'games'
  | 'categories'
  | 'users'
  | 'orders'
  | 'reports'
  | 'settings';

export interface AdminNavbarProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
  className?: string;
  items?: Array<{ key: TabKey; label: string }>;
}

const DEFAULT_ITEMS: Array<{ key: TabKey; label: string }> = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'games', label: 'Games' },
  { key: 'categories', label: 'Categories' },
  { key: 'users', label: 'Users' },
  { key: 'orders', label: 'Orders' },
  { key: 'reports', label: 'Reports' },
  { key: 'settings', label: 'Settings' },
];

export function AdminNavbar({ active, onChange, className, items = DEFAULT_ITEMS }: AdminNavbarProps) {
  return (
    <nav className={className} aria-label="Admin Navigation">
      <div className="adminNavGroup">
        {items.map(it => (
          <button
            key={it.key}
            className={`adminNavBtn ${active === it.key ? 'active' : ''}`}
            aria-current={active === it.key ? 'page' : undefined}
            onClick={() => onChange(it.key)}
          >
            {it.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

export type { TabKey };
