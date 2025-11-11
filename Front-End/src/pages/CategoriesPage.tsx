import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCategories, fetchGamesByPrice, Category, Game } from '../api/client';
import './CategoriesPage.css';

export default function CategoriesPage() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [games, setGames] = useState<Game[]>([]);
    const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    // Category icons mapping
    const categoryIcons: Record<string, string> = {
        'Action': '🎯',
        'Adventure': '🗺️',
        'RPG': '🧙',
        'Strategy': '♟️',
        'Sports': '⚽',
        'Racing': '🏎️',
        'Simulation': '🛠️',
        'Horror': '👻',
        'Puzzle': '🧩',
        'Shooter': '🔫',
        '3D': '🎮',
        'Abilities': '⚡',
        'Action-Adventure': '🎬',
        'Battle Royale': '🎖️',
        'Blood Types': '🩸',
        'Boss Rushes': '👹',
        'Casual': '🎲',
        'Co-op': '🤝',
        'Competitive': '🏆',
        'Fighting': '🥊',
        'FPS': '🎯',
        'MMORPG': '🌍',
        'Platformer': '🪜',
        'Sandbox': '🏗️',
        'Survival': '🔥',
        'Stealth': '🕵️',
        'Tower Defense': '🗼',
        'VR': '🥽'
    };

    const getCategoryIcon = (categoryName: string): string => {
        return categoryIcons[categoryName] || '🎮';
    };

    useEffect(() => {
        let cancelled = false;

        const loadData = async () => {
            try {
                setLoading(true);
                
                // Load categories and games in parallel
                const [categoriesData, gamesData] = await Promise.all([
                    fetchCategories(),
                    fetchGamesByPrice('asc')
                ]);

                if (cancelled) return;

                setCategories(categoriesData || []);
                setGames(gamesData || []);

                // Calculate game counts per category
                const counts: Record<string, number> = {};
                (gamesData || []).forEach(game => {
                    game.categories?.forEach(cat => {
                        counts[cat.name] = (counts[cat.name] || 0) + 1;
                    });
                });
                setCategoryCounts(counts);

            } catch (err) {
                console.error('Failed to load categories:', err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadData();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleCategoryClick = (categoryName: string) => {
        navigate(`/store?category=${encodeURIComponent(categoryName)}`);
    };

    return (
        <div className="categories-page">
            {/* Hero Section */}
            <section className="categories-hero">
                <div className="hero-content">
                    <div className="hero-badge">🎮 Game Categories</div>
                    <h1 className="hero-title">Khám phá thế giới Game</h1>
                    <p className="hero-subtitle">
                        Tìm kiếm và khám phá hàng ngàn tựa game qua {categories.length} danh mục phong phú
                    </p>
                </div>
                <div className="hero-bg">
                    <div className="hero-glow hero-glow-1"></div>
                    <div className="hero-glow hero-glow-2"></div>
                    <div className="hero-glow hero-glow-3"></div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="categories-section container">
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Đang tải danh mục...</p>
                    </div>
                ) : (
                    <>
                        <div className="section-header">
                            <h2>Tất cả danh mục</h2>
                            <p className="section-subtitle">
                                {categories.length} thể loại game đang chờ bạn khám phá
                            </p>
                        </div>

                        <div className="categories-grid">
                            {categories.map((category, index) => {
                                const count = categoryCounts[category.name] || 0;
                                
                                return (
                                    <div 
                                        key={category.name}
                                        className="category-card"
                                        onClick={() => handleCategoryClick(category.name)}
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <div className="category-icon-wrapper">
                                            <span className="category-icon">
                                                {getCategoryIcon(category.name)}
                                            </span>
                                        </div>
                                        <div className="category-info">
                                            <h3 className="category-name">{category.name}</h3>
                                            {category.description && (
                                                <p className="category-desc">{category.description}</p>
                                            )}
                                            <div className="category-meta">
                                                <span className="game-count">
                                                    🎯 {count} {count === 1 ? 'game' : 'games'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="category-arrow">→</div>
                                        <div className="category-glow"></div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">🎮</div>
                            <div className="stat-value">{categories.length}</div>
                            <div className="stat-label">Danh mục</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🎯</div>
                            <div className="stat-value">{games.length}</div>
                            <div className="stat-label">Tựa game</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">⭐</div>
                            <div className="stat-value">4.8</div>
                            <div className="stat-label">Đánh giá TB</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🔥</div>
                            <div className="stat-value">
                                {Object.values(categoryCounts).reduce((a, b) => a + b, 0)}
                            </div>
                            <div className="stat-label">Tổng entries</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
