import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, Category } from '../../api/client';
import './AdminCategoriesPage.css';

export function AdminCategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/category');
      const categoriesData = response.data.result || [];
      setCategories(categoriesData);
    } catch (err: any) {
      console.error('[AdminCategoriesPage] Error loading categories:', err);
      setError('Không thể tải danh sách danh mục. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Tên danh mục không được để trống!');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/category', {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined
      });
      
      // Reset form and reload
      setFormData({ name: '', description: '' });
      setShowAddModal(false);
      await loadCategories();
    } catch (err: any) {
      console.error('[AdminCategoriesPage] Error creating category:', err);
      alert('Lỗi tạo danh mục: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !formData.name.trim()) {
      alert('Tên danh mục không được để trống!');
      return;
    }

    try {
      setSubmitting(true);
      await api.put(`/category/${editingCategory.name}`, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined
      });
      
      // Reset and reload
      setFormData({ name: '', description: '' });
      setEditingCategory(null);
      setShowEditModal(false);
      await loadCategories();
    } catch (err: any) {
      console.error('[AdminCategoriesPage] Error updating category:', err);
      alert('Lỗi cập nhật danh mục: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (categoryName: string) => {
    if (!confirm(`Bạn có chắc muốn xóa danh mục "${categoryName}"?`)) {
      return;
    }

    try {
      await api.delete(`/category/${categoryName}`);
      await loadCategories();
    } catch (err: any) {
      console.error('[AdminCategoriesPage] Error deleting category:', err);
      alert('Lỗi xóa danh mục: ' + (err.response?.data?.message || err.message));
    }
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setShowEditModal(true);
  };

  const filteredCategories = categories.filter(cat => {
    const search = searchTerm.toLowerCase();
    return (
      (cat.name || '').toLowerCase().includes(search) ||
      (cat.description || '').toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="adminCategoriesContainer">
        <div className="adminCategoriesLoading">
          <div className="spinner"></div>
          <p>Đang tải danh sách danh mục...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="adminCategoriesContainer">
      <div className="adminCategoriesHeader">
        <div className="headerTop">
          <button className="btnBack" onClick={() => navigate('/admin')}>
            ← Quay lại Dashboard
          </button>
          <h1>📂 Quản lý danh mục</h1>
        </div>
        <div className="headerActions">
          <div className="searchBox">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btnAddCategory" onClick={() => setShowAddModal(true)}>
            ➕ Thêm danh mục
          </button>
        </div>
      </div>

      {error && (
        <div className="adminCategoriesError">
          <span>⚠️</span>
          <p>{error}</p>
          <button onClick={loadCategories}>🔄 Thử lại</button>
        </div>
      )}

      {!error && (
        <div className="adminCategoriesContent">
          <div className="categoriesStats">
            <div className="statCard">
              <div className="statIcon">📂</div>
              <div className="statInfo">
                <h3>Tổng danh mục</h3>
                <p className="statValue">{categories.length}</p>
              </div>
            </div>
            <div className="statCard">
              <div className="statIcon">✍️</div>
              <div className="statInfo">
                <h3>Có mô tả</h3>
                <p className="statValue">{categories.filter(c => c.description).length}</p>
              </div>
            </div>
            <div className="statCard">
              <div className="statIcon">📋</div>
              <div className="statInfo">
                <h3>Chưa có mô tả</h3>
                <p className="statValue">{categories.filter(c => !c.description).length}</p>
              </div>
            </div>
            <div className="statCard">
              <div className="statIcon">🔍</div>
              <div className="statInfo">
                <h3>Đang hiển thị</h3>
                <p className="statValue">{filteredCategories.length}</p>
              </div>
            </div>
          </div>

          {filteredCategories.length === 0 ? (
            <div className="noCategories">
              <div className="noCategoriesIcon">🔍</div>
              <h3>Không tìm thấy danh mục</h3>
              <p>Thử tìm kiếm với từ khóa khác hoặc thêm danh mục mới</p>
            </div>
          ) : (
            <div className="categoriesGrid">
              {filteredCategories.map((cat, idx) => (
                <div key={cat.name || idx} className="categoryCard">
                  <div className="categoryHeader">
                    <div className="categoryIcon">📂</div>
                    <h3>{cat.name}</h3>
                  </div>
                  <div className="categoryBody">
                    <p className="categoryDescription">
                      {cat.description || 'Chưa có mô tả'}
                    </p>
                  </div>
                  <div className="categoryActions">
                    <button className="btnEdit" onClick={() => openEditModal(cat)}>
                      ✏️ Sửa
                    </button>
                    <button className="btnDelete" onClick={() => handleDelete(cat.name)}>
                      🗑️ Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="modalOverlay" onClick={() => setShowAddModal(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2>➕ Thêm danh mục mới</h2>
              <button className="btnClose" onClick={() => setShowAddModal(false)}>✖</button>
            </div>
            <form onSubmit={handleAdd}>
              <div className="formGroup">
                <label>Tên danh mục *</label>
                <input
                  type="text"
                  placeholder="Nhập tên danh mục..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="formGroup">
                <label>Mô tả</label>
                <textarea
                  placeholder="Nhập mô tả chi tiết..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="modalActions">
                <button type="button" className="btnCancel" onClick={() => setShowAddModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btnSubmit" disabled={submitting}>
                  {submitting ? 'Đang thêm...' : 'Thêm danh mục'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingCategory && (
        <div className="modalOverlay" onClick={() => setShowEditModal(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2>✏️ Chỉnh sửa danh mục</h2>
              <button className="btnClose" onClick={() => setShowEditModal(false)}>✖</button>
            </div>
            <form onSubmit={handleEdit}>
              <div className="formGroup">
                <label>Tên danh mục *</label>
                <input
                  type="text"
                  placeholder="Nhập tên danh mục..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="formGroup">
                <label>Mô tả</label>
                <textarea
                  placeholder="Nhập mô tả chi tiết..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="modalActions">
                <button type="button" className="btnCancel" onClick={() => setShowEditModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btnSubmit" disabled={submitting}>
                  {submitting ? 'Đang cập nhật...' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
