
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
  items?: Array<{ key: TabKey; label: string; icon?: string }>;
}

const DEFAULT_ITEMS: Array<{ key: TabKey; label: string; icon: string }> = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'games', label: 'Games', icon: '🎮' },
  { key: 'categories', label: 'Categories', icon: '📁' },
  { key: 'users', label: 'Users', icon: '👥' },
  { key: 'orders', label: 'Orders', icon: '🛒' },
  { key: 'reports', label: 'Reports', icon: '📈' },
  { key: 'settings', label: 'Settings', icon: '⚙️' },
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
            {it.icon && <span className="navIcon">{it.icon}</span>}
            <span>{it.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export type { TabKey };
