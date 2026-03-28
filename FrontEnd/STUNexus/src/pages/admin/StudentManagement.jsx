import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import { getTable, updateTable } from '../../services/mockService';

const StudentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ MaSV: '', HoTen: '', TaiKhoan: '', MatKhau: '', NgaySinh: '', Email: '', SoDienThoai: '' });

  useEffect(() => {
    setStudents(getTable('SinhVien'));
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    let updated;
    if (editMode) {
      updated = students.map(s => s.MaSV === formData.MaSV ? { ...s, ...formData } : s);
    } else {
      updated = [...students, { ...formData }];
    }
    setStudents(updated);
    updateTable('SinhVien', updated);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Cảnh báo: Xoá thẻ sinh viên này sẽ vĩnh viễn xoá dữ liệu vắng học liên đới. Vẫn tiếp tục?')) {
      const updated = students.filter(s => s.MaSV !== id);
      setStudents(updated);
      updateTable('SinhVien', updated);
    }
  };

  const openAdd = () => {
    setFormData({ MaSV: '', HoTen: '', TaiKhoan: '', MatKhau: '', NgaySinh: '', Email: '', SoDienThoai: '' });
    setEditMode(false);
    setShowModal(true);
  };

  const openEdit = (gv) => {
    setFormData(gv);
    setEditMode(true);
    setShowModal(true);
  };

  const filtered = students.filter(item => 
    item.HoTen.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.MaSV.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
        <h3 className="m-0 fw-bold text-dark">Dữ liệu Sinh Viên Tổng</h3>
        <button onClick={openAdd} className="btn btn-primary d-flex align-items-center gap-2 shadow-sm" style={{borderRadius: '8px', padding: '10px 20px'}}>
          <FaUserPlus /> Ghi danh Sinh viên
        </button>
      </div>

      <div className="card glass-panel border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="row mb-4">
            <div className="col-md-6 col-lg-4">
              <div className="input-group overflow-hidden shadow-sm" style={{borderRadius: '8px'}}>
                <span className="input-group-text bg-white border-0 text-muted"><FaSearch /></span>
                <input type="text" className="form-control border-0 bg-white" placeholder="Tra cứu sinh viên theo tên/MSSV..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-custom table-hover w-100 align-middle">
              <thead><tr><th>Mã Sinh Viên</th><th>Họ Tên</th><th>Email liên hệ</th><th>Tài khoản cổng</th><th className="text-end">Tác vụ</th></tr></thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item.MaSV}>
                    <td className="fw-semibold text-primary">{item.MaSV}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold" style={{width: '35px', height: '35px'}}>
                          {item.HoTen.charAt(0)}
                        </div>
                        <span className="fw-medium text-dark">{item.HoTen}</span>
                      </div>
                    </td>
                    <td><span className="text-muted">{item.Email || 'Chưa cập nhật'}</span></td>
                    <td><span className="font-monospace text-muted">{item.TaiKhoan}</span></td>
                    <td className="text-end">
                      <button onClick={()=>openEdit(item)} className="btn btn-sm btn-light border me-2 text-primary hover-primary"><FaEdit /></button>
                      <button onClick={()=>handleDelete(item.MaSV)} className="btn btn-sm btn-light border text-danger hover-danger"><FaTrash /></button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan="5" className="text-center py-5 text-muted">Không tìm thấy sinh viên nào.</td></tr>}
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
                  <h5 className="modal-title fw-bold text-dark">{editMode ? 'Chỉnh sửa Hồ Sơ Sinh viên' : 'Đăng ký Sinh viên mới'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSave}>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-bold text-muted">MSSV <span className="text-danger">*</span></label>
                        <input type="text" className="form-control bg-light border-0" value={formData.MaSV} onChange={e => setFormData({...formData, MaSV: e.target.value})} required disabled={editMode} />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-bold text-muted">Họ và Tên SV <span className="text-danger">*</span></label>
                        <input type="text" className="form-control bg-light border-0" value={formData.HoTen} onChange={e => setFormData({...formData, HoTen: e.target.value})} required />
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
                        <label className="form-label small fw-bold text-muted">Ngày sinh</label>
                        <input type="date" className="form-control bg-light border-0" value={formData.NgaySinh || ''} onChange={e => setFormData({...formData, NgaySinh: e.target.value})}/>
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-bold text-muted">Email sinh viên</label>
                        <input type="email" className="form-control bg-light border-0" value={formData.Email || ''} onChange={e => setFormData({...formData, Email: e.target.value})} />
                      </div>
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
export default StudentManagement;
