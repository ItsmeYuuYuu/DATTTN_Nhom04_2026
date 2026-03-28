import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaLayerGroup, FaEdit, FaTrash } from 'react-icons/fa';
import { getTable, updateTable } from '../../services/mockService';
import { useNavigate } from 'react-router-dom';

const SubjectManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ MaMon: '', TenMon: '' });

  useEffect(() => {
    setSubjects(getTable('MonHoc'));
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    let updated;
    if (editMode) {
      updated = subjects.map(s => s.MaMon === formData.MaMon ? { ...s, ...formData } : s);
    } else {
      updated = [...subjects, { ...formData }];
    }
    setSubjects(updated);
    updateTable('MonHoc', updated);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Cảnh báo: Xoá học phần này có thể cắt đứt liên kết tới danh sách Các Lớp đang mở của môn này. Xác nhận xoá?')) {
      const updated = subjects.filter(s => s.MaMon !== id);
      setSubjects(updated);
      updateTable('MonHoc', updated);
    }
  };

  const openAdd = () => {
    setFormData({ MaMon: '', TenMon: '' });
    setEditMode(false);
    setShowModal(true);
  };

  const openEdit = (mon) => {
    setFormData(mon);
    setEditMode(true);
    setShowModal(true);
  };

  const filtered = subjects.filter(s => 
    s.TenMon.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.MaMon.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
        <h3 className="m-0 fw-bold text-dark">Quản lý Môn học</h3>
        <button onClick={openAdd} className="btn btn-primary d-flex align-items-center gap-2 shadow-sm" style={{borderRadius: '8px', padding: '10px 20px'}}>
          <FaPlus /> Thêm Môn Học Mới
        </button>
      </div>

      <div className="card glass-panel border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="row mb-4">
            <div className="col-md-6 col-lg-4">
              <div className="input-group overflow-hidden shadow-sm" style={{borderRadius: '8px'}}>
                <span className="input-group-text bg-white border-0 text-muted"><FaSearch /></span>
                <input type="text" className="form-control border-0 bg-white" placeholder="Tìm kiếm bộ môn..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-custom table-hover w-100 align-middle">
              <thead><tr><th style={{width: '20%'}}>Mã Môn</th><th style={{width: '50%'}}>Tên Môn Học Phần</th><th className="text-end" style={{width: '30%'}}>Hành Động</th></tr></thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.MaMon}>
                    <td className="fw-semibold text-primary">{item.MaMon}</td>
                    <td className="fw-medium text-dark">{item.TenMon}</td>
                    <td className="text-end">
                      <button onClick={() => navigate(`/lecturer/subjects/${item.MaMon}/classes`)} className="btn btn-sm btn-primary me-2 px-3 fw-bold shadow-sm" title="Quản lý Ca / Lớp học">
                        <FaLayerGroup className="me-1" /> Mở Lớp Học
                      </button>
                      <button onClick={() => openEdit(item)} className="btn btn-sm btn-light border me-2 text-primary hover-primary"><FaEdit /></button>
                      <button onClick={() => handleDelete(item.MaMon)} className="btn btn-sm btn-light border text-danger hover-danger"><FaTrash /></button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan="3" className="text-center py-4 text-muted">Không tìm thấy môn học nào phù hợp. Bấm "Thêm Môn Học Mới".</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <>
          <div className="modal-backdrop fade show" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header bg-light border-0 rounded-top-4">
                  <h5 className="modal-title fw-bold text-dark">{editMode ? 'Chỉnh sửa Môn Học' : 'Thêm Mới Môn Học'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSave}>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted">Mã Học Phần <span className="text-danger">*</span></label>
                      <input type="text" className="form-control bg-light border-0" value={formData.MaMon} onChange={e => setFormData({...formData, MaMon: e.target.value})} required disabled={editMode} placeholder="VD: THCB01" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted">Tên Môn Học <span className="text-danger">*</span></label>
                      <input type="text" className="form-control bg-light border-0" value={formData.TenMon} onChange={e => setFormData({...formData, TenMon: e.target.value})} required placeholder="Toán Cao Cấp 1" />
                    </div>
                  </div>
                  <div className="modal-footer border-0 bg-light rounded-bottom-4">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowModal(false)}>Hủy bỏ</button>
                    <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">Lưu Dữ Liệu</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default SubjectManagement;
