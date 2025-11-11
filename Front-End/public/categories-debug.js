// 🎮 CATEGORIES FEATURE - DEMO & DEBUG HELPER
// Copy code này vào Browser Console để test các chức năng

// ═══════════════════════════════════════════════════════
// 1. CHECK IF CATEGORIES PAGE IS ACCESSIBLE
// ═══════════════════════════════════════════════════════

console.log('%c🎮 CATEGORIES FEATURE DEBUG HELPER', 'background: #3b82f6; color: white; font-size: 16px; padding: 8px; border-radius: 4px;');

// Test navigate to categories page
function testCategoriesPage() {
    console.log('%c[TEST] Navigating to /categories...', 'color: #60a5fa');
    window.location.href = '/categories';
}

// Test navigate to store with category filter
function testCategoryFilter(categoryName) {
    console.log(`%c[TEST] Filtering by category: ${categoryName}`, 'color: #60a5fa');
    window.location.href = `/store?category=${encodeURIComponent(categoryName)}`;
}

// Test navigate to store with platform filter
function testPlatformFilter(platformName) {
    console.log(`%c[TEST] Filtering by platform: ${platformName}`, 'color: #60a5fa');
    window.location.href = `/store?platform=${encodeURIComponent(platformName)}`;
}

// ═══════════════════════════════════════════════════════
// 2. CHECK CATEGORIES DATA
// ═══════════════════════════════════════════════════════

async function checkCategoriesAPI() {
    console.log('%c[API] Checking /category endpoint...', 'color: #fbbf24');
    try {
        const response = await fetch('http://localhost:8080/identity/category');
        const data = await response.json();
        console.log('%c[API] ✓ Categories loaded:', 'color: #10b981', data);
        console.log(`%c[API] Total categories: ${data.length || data.result?.length || 0}`, 'color: #10b981');
        return data;
    } catch (error) {
        console.error('%c[API] ✗ Failed to load categories:', 'color: #ef4444', error);
        return null;
    }
}

// ═══════════════════════════════════════════════════════
// 3. CHECK GAMES DATA
// ═══════════════════════════════════════════════════════

async function checkGamesAPI() {
    console.log('%c[API] Checking /games endpoint...', 'color: #fbbf24');
    try {
        const response = await fetch('http://localhost:8080/identity/games/by-price-asc');
        const data = await response.json();
        console.log('%c[API] ✓ Games loaded:', 'color: #10b981', data);
        console.log(`%c[API] Total games: ${data.length || data.result?.length || 0}`, 'color: #10b981');
        return data;
    } catch (error) {
        console.error('%c[API] ✗ Failed to load games:', 'color: #ef4444', error);
        return null;
    }
}

// ═══════════════════════════════════════════════════════
// 4. CALCULATE CATEGORY COUNTS
// ═══════════════════════════════════════════════════════

async function calculateCategoryCounts() {
    const games = await checkGamesAPI();
    if (!games) return;
    
    const counts = {};
    (Array.isArray(games) ? games : games.result || []).forEach(game => {
        game.categories?.forEach(cat => {
            counts[cat.name] = (counts[cat.name] || 0) + 1;
        });
    });
    
    console.log('%c[STATS] Category counts:', 'color: #a855f7', counts);
    console.table(counts);
    return counts;
}

// ═══════════════════════════════════════════════════════
// 5. CHECK NAVBAR DROPDOWNS
// ═══════════════════════════════════════════════════════

function checkNavbarDropdowns() {
    console.log('%c[UI] Checking navbar dropdowns...', 'color: #fbbf24');
    
    const categoryDropdown = document.querySelector('.category-dropdown');
    const platformDropdown = document.querySelector('.platform-dropdown');
    
    if (categoryDropdown) {
        console.log('%c[UI] ✓ Category dropdown found', 'color: #10b981');
    } else {
        console.log('%c[UI] ⚠ Category dropdown not visible (click "Thể loại" to open)', 'color: #f59e0b');
    }
    
    if (platformDropdown) {
        console.log('%c[UI] ✓ Platform dropdown found', 'color: #10b981');
    } else {
        console.log('%c[UI] ⚠ Platform dropdown not visible (click "Nền tảng" to open)', 'color: #f59e0b');
    }
}

// ═══════════════════════════════════════════════════════
// 6. CHECK CATEGORIES PAGE ELEMENTS
// ═══════════════════════════════════════════════════════

function checkCategoriesPageElements() {
    console.log('%c[UI] Checking Categories page elements...', 'color: #fbbf24');
    
    const hero = document.querySelector('.categories-hero');
    const grid = document.querySelector('.categories-grid');
    const stats = document.querySelector('.stats-section');
    
    console.log('%c[UI] Hero section:', 'color: #60a5fa', hero ? '✓ Found' : '✗ Not found');
    console.log('%c[UI] Categories grid:', 'color: #60a5fa', grid ? '✓ Found' : '✗ Not found');
    console.log('%c[UI] Stats section:', 'color: #60a5fa', stats ? '✓ Found' : '✗ Not found');
    
    if (grid) {
        const cards = grid.querySelectorAll('.category-card');
        console.log(`%c[UI] ✓ Found ${cards.length} category cards`, 'color: #10b981');
    }
}

// ═══════════════════════════════════════════════════════
// 7. RUN ALL CHECKS
// ═══════════════════════════════════════════════════════

async function runAllChecks() {
    console.clear();
    console.log('%c🎮 RUNNING ALL CATEGORIES FEATURE CHECKS', 'background: #3b82f6; color: white; font-size: 18px; padding: 10px; border-radius: 4px;');
    console.log('');
    
    await checkCategoriesAPI();
    console.log('');
    
    await checkGamesAPI();
    console.log('');
    
    await calculateCategoryCounts();
    console.log('');
    
    checkNavbarDropdowns();
    console.log('');
    
    checkCategoriesPageElements();
    console.log('');
    
    console.log('%c✨ ALL CHECKS COMPLETED!', 'background: #10b981; color: white; font-size: 16px; padding: 8px; border-radius: 4px;');
}

// ═══════════════════════════════════════════════════════
// 8. EXPORT FUNCTIONS TO WINDOW
// ═══════════════════════════════════════════════════════

window.CategoriesDebug = {
    testCategoriesPage,
    testCategoryFilter,
    testPlatformFilter,
    checkCategoriesAPI,
    checkGamesAPI,
    calculateCategoryCounts,
    checkNavbarDropdowns,
    checkCategoriesPageElements,
    runAllChecks
};

// ═══════════════════════════════════════════════════════
// 9. USAGE INSTRUCTIONS
// ═══════════════════════════════════════════════════════

console.log('%cUSAGE INSTRUCTIONS:', 'color: #fbbf24; font-weight: bold; font-size: 14px;');
console.log('%cRun these commands in console:', 'color: #94a3b8;');
console.log('');
console.log('%c  CategoriesDebug.runAllChecks()', 'color: #60a5fa;', '- Run all checks');
console.log('%c  CategoriesDebug.testCategoriesPage()', 'color: #60a5fa;', '- Go to /categories');
console.log('%c  CategoriesDebug.testCategoryFilter("Action")', 'color: #60a5fa;', '- Filter by category');
console.log('%c  CategoriesDebug.testPlatformFilter("PC")', 'color: #60a5fa;', '- Filter by platform');
console.log('%c  CategoriesDebug.checkCategoriesAPI()', 'color: #60a5fa;', '- Check API endpoint');
console.log('%c  CategoriesDebug.calculateCategoryCounts()', 'color: #60a5fa;', '- Show category stats');
console.log('');
console.log('%c💡 TIP: Run runAllChecks() first to see full status!', 'color: #a855f7; font-style: italic;');

// Auto-run checks if on categories page
if (window.location.pathname === '/categories') {
    console.log('%c📍 You are on the Categories page - running checks...', 'color: #10b981');
    setTimeout(() => runAllChecks(), 1000);
}
