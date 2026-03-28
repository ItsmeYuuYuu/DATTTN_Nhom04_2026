import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import { getTable, updateTable } from '../../services/mockService';

const LecturerManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [lecturers, setLecturers] = useState([]);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ MaGV: '', HoTen: '', TaiKhoan: '', MatKhau: '', Email: '', SoDienThoai: '' });

  useEffect(() => {
    setLecturers(getTable('GiangVien'));
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    let updated;
    if (editMode) {
      updated = lecturers.map(l => l.MaGV === formData.MaGV ? { ...l, ...formData } : l);
    } else {
      updated = [...lecturers, { ...formData, MaGV: formData.MaGV || `GV${Date.now().toString().slice(-4)}` }];
    }
    setLecturers(updated);
    updateTable('GiangVien', updated);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Hành động này không thể hoàn tác. Bạn có chắc xoá giảng viên này? Các lớp học liên đới có thể mất dữ liệu.')) {
      const updated = lecturers.filter(l => l.MaGV !== id);
      setLecturers(updated);
      updateTable('GiangVien', updated);
    }
  };

  const openAdd = () => {
    setFormData({ MaGV: '', HoTen: '', TaiKhoan: '', MatKhau: '', Email: '', SoDienThoai: '' });
    setEditMode(false);
    setShowModal(true);
  };

  const openEdit = (gv) => {
    setFormData(gv);
    setEditMode(true);
    setShowModal(true);
  };

  const filtered = lecturers.filter(item => 
    item.HoTen.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.MaGV.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
        <h3 className="m-0 fw-bold text-dark">Quản lý Giảng viên</h3>
        <button onClick={openAdd} className="btn btn-primary d-flex align-items-center gap-2 shadow-sm" style={{borderRadius: '8px', padding: '10px 20px'}}>
          <FaUserPlus /> Thêm Giảng Viên Mới
        </button>
      </div>

      <div className="card glass-panel border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="row mb-4">
            <div className="col-md-6 col-lg-4">
              <div className="input-group overflow-hidden shadow-sm" style={{borderRadius: '8px'}}>
                <span className="input-group-text bg-white border-0 text-muted"><FaSearch /></span>
                <input type="text" className="form-control border-0 bg-white" placeholder="Tìm kiếm tên hoặc mã giảng viên..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-custom table-hover w-100 align-middle">
              <thead><tr><th>Mã Giảng Viên</th><th>Họ Tên</th><th>Tài khoản</th><th>Trạng thái dữ liệu</th><th className="text-end">Thao tác</th></tr></thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item.MaGV}>
                    <td className="fw-semibold text-primary">{item.MaGV}</td>
                    <td className="fw-medium text-dark">{item.HoTen}</td>
                    <td><span className="font-monospace text-muted">{item.TaiKhoan}</span></td>
                    <td><span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill">Hoạt động bình thường</span></td>
                    <td className="text-end">
                      <button onClick={() => openEdit(item)} className="btn btn-sm btn-light border me-2 text-primary hover-primary"><FaEdit /></button>
                      <button onClick={() => handleDelete(item.MaGV)} className="btn btn-sm btn-light border text-danger hover-danger"><FaTrash /></button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan="5" className="text-center py-5 text-muted">Không có dữ liệu. Hãy tạo mới.</td></tr>}
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
                  <h5 className="modal-title fw-bold text-dark">{editMode ? 'Chỉnh sửa Hồ Sơ Giảng Viên' : 'Khai báo Giảng Viên'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSave}>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-bold text-muted">Mã Giảng Viên <span className="text-danger">*</span></label>
                        <input type="text" className="form-control bg-light border-0" value={formData.MaGV} onChange={e => setFormData({...formData, MaGV: e.target.value})} required disabled={editMode} placeholder="VD: GV06" />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-bold text-muted">Họ Tên <span className="text-danger">*</span></label>
                        <input type="text" className="form-control bg-light border-0" value={formData.HoTen} onChange={e => setFormData({...formData, HoTen: e.target.value})} required placeholder="TS. Nguyễn Văn A" />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-bold text-muted">Tài khoản truy cập <span className="text-danger">*</span></label>
                        <input type="text" className="form-control bg-light border-0" value={formData.TaiKhoan} onChange={e => setFormData({...formData, TaiKhoan: e.target.value})} required />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-bold text-muted">Mật khẩu cấp phát <span className="text-danger">*</span></label>
                        <input type="text" className="form-control bg-light border-0" value={formData.MatKhau} onChange={e => setFormData({...formData, MatKhau: e.target.value})} required />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-bold text-muted">Email liên hệ</label>
                        <input type="email" className="form-control bg-light border-0" value={formData.Email} onChange={e => setFormData({...formData, Email: e.target.value})} />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-bold text-muted">Số Điện Thoại</label>
                        <input type="text" className="form-control bg-light border-0" value={formData.SoDienThoai} onChange={e => setFormData({...formData, SoDienThoai: e.target.value})} />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-0 bg-light rounded-bottom-4">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowModal(false)}>Hủy bỏ</button>
                    <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">Thực Thi Dữ Liệu</button>
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
export default LecturerManagement;
