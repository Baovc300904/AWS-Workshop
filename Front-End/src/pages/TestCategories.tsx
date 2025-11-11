import { useNavigate } from 'react-router-dom';

// Simple test component to verify navigation
export default function TestCategories() {
    const navigate = useNavigate();

    const testLinks = [
        { path: '/', label: 'Home' },
        { path: '/store', label: 'Store' },
        { path: '/categories', label: 'Categories' },
        { path: '/store?category=Action', label: 'Store (Action filter)' },
        { path: '/store?platform=PC', label: 'Store (PC filter)' },
    ];

    return (
        <div style={{
            padding: '2rem',
            maxWidth: '600px',
            margin: '0 auto',
            background: '#1e293b',
            borderRadius: '16px',
            marginTop: '2rem'
        }}>
            <h2 style={{ color: '#fff', marginBottom: '1.5rem' }}>
                🧪 Test Navigation
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {testLinks.map((link) => (
                    <button
                        key={link.path}
                        onClick={() => {
                            console.log(`[TEST] Navigating to: ${link.path}`);
                            navigate(link.path);
                        }}
                        style={{
                            padding: '1rem',
                            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.4)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        {link.label} → <code style={{ fontSize: '0.85rem', opacity: 0.8 }}>{link.path}</code>
                    </button>
                ))}
            </div>
            
            <div style={{
                marginTop: '2rem',
                padding: '1rem',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
                <h3 style={{ color: '#60a5fa', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                    📊 Current Location:
                </h3>
                <code style={{
                    color: '#fff',
                    fontSize: '0.875rem',
                    display: 'block',
                    padding: '0.5rem',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '8px'
                }}>
                    {window.location.pathname + window.location.search}
                </code>
            </div>

            <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
                <h3 style={{ color: '#10b981', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                    ✅ Instructions:
                </h3>
                <ol style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem', lineHeight: '1.6', margin: 0, paddingLeft: '1.5rem' }}>
                    <li>Click any button above to test navigation</li>
                    <li>Check browser console for logs</li>
                    <li>Verify URL changes correctly</li>
                    <li>If navigation fails, check console for errors</li>
                </ol>
            </div>
        </div>
    );
}
