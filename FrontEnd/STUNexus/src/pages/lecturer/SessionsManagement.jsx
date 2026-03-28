import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaQrcode, FaListUl, FaCalendarAlt, FaTrash } from 'react-icons/fa';
import { getTable, updateTable } from '../../services/mockService';

const SessionsManagement = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ NgayHoc: '', GioBatDau: '07:30', GioKetThuc: '09:30', GhiChu: '' });

  useEffect(() => {
    const allSessions = getTable('BuoiHoc');
    setSessions(allSessions.filter(b => b.MaLop === classId));
  }, [classId]);

  const handleSave = (e) => {
    e.preventDefault();
    const newSession = {
      ...formData,
      MaBuoiHoc: `BH_${Date.now().toString().slice(-6)}`,
      MaLop: classId
    };
    
    // Ghi đè vào LocalStorage
    const allSessions = getTable('BuoiHoc');
    const updated = [...allSessions, newSession];
    updateTable('BuoiHoc', updated);
    
    setSessions([...sessions, newSession]);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if(window.confirm('Cảnh báo: Việc huỷ lịch buổi học sẽ xóa bỏ toàn bộ dữ liệu điểm danh tương ứng của ngày hôm đó nếu đã có. Bạn có chắc chắn muốn hủy ca này?')){
      const allSessions = getTable('BuoiHoc');
      const updated = allSessions.filter(b => b.MaBuoiHoc !== id);
      updateTable('BuoiHoc', updated);
      
      setSessions(sessions.filter(b => b.MaBuoiHoc !== id));
    }
  };

  const openAdd = () => {
    setFormData({ NgayHoc: new Date().toISOString().split('T')[0], GioBatDau: '07:30', GioKetThuc: '09:30', GhiChu: 'Buổi học lý thuyết' });
    setShowModal(true);
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-light rounded-circle shadow-sm" style={{width: '40px', height: '40px'}} onClick={() => navigate(-1)}><FaArrowLeft /></button>
          <h3 className="m-0 fw-bold text-dark">Lịch trình Buổi học - <span className="text-primary">{classId}</span></h3>
        </div>
        <button onClick={openAdd} className="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm" style={{borderRadius: '8px'}}>
          <FaPlus /> Lên Lịch Buổi Mới
        </button>
      </div>

      <div className="row g-4">
        {sessions.length > 0 ? sessions.map(b => (
          <div className="col-12 col-md-6 col-xl-4" key={b.MaBuoiHoc}>
            <div className="card glass-panel border-0 shadow-sm h-100 position-relative overflow-hidden" style={{borderRadius: '12px'}}>
              <button onClick={() => handleDelete(b.MaBuoiHoc)} className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle shadow d-flex justify-content-center align-items-center" style={{zIndex: 10, width: '30px', height: '30px', padding: 0}} title="Hủy Buổi Học này"><FaTrash/></button>
              <div className="card-body p-4 pt-5">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-3 me-3">
                    <FaCalendarAlt className="fs-3" />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">Ngày: {b.NgayHoc}</h6>
                    <span className="text-muted fw-medium small">{b.GioBatDau} - {b.GioKetThuc}</span>
                  </div>
                </div>
                <p className="text-muted small mb-4 bg-light p-2 rounded-3 border-start border-4 border-warning">{b.GhiChu}</p>
                <div className="d-flex gap-2 mt-auto">
                  <button onClick={() => navigate(`/lecturer/qr-attendance/${b.MaLop}`)} className="btn btn-primary flex-grow-1 d-flex justify-content-center align-items-center gap-2 fw-semibold shadow-sm">
                    <FaQrcode /> Khởi chạy QR
                  </button>
                  <button onClick={() => navigate(`/lecturer/manual/${b.MaLop}`)} className="btn btn-outline-secondary flex-grow-1 d-flex justify-content-center align-items-center gap-2 fw-semibold bg-white shadow-sm">
                    <FaListUl /> Sổ tay
                  </button>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-12 mt-4 text-center text-muted bg-white p-5 rounded-4 shadow-sm">
            <FaCalendarAlt className="fs-1 mb-3 opacity-25" />
            <h5 className="fw-medium text-dark">Lớp này hiện chưa có lịch học nào.</h5>
            <p className="mb-0">Vui lòng bấm nút "Lên Lịch Buổi Mới" để khai báo ngày giờ học vào hệ thống.</p>
          </div>
        )}
      </div>

      {showModal && (
        <>
          <div className="modal-backdrop fade show" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header bg-light border-0 rounded-top-4">
                  <h5 className="modal-title fw-bold text-dark">Xếp Lịch Buổi Học Mới</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSave}>
                  <div className="modal-body p-4">
                    <div className="mb-4">
                      <label className="form-label small fw-bold text-muted">Ngày Học <span className="text-danger">*</span></label>
                      <input type="date" className="form-control bg-light border-0 py-2" value={formData.NgayHoc} onChange={e => setFormData({...formData, NgayHoc: e.target.value})} required />
                    </div>
                    <div className="row g-3 mb-4">
                      <div className="col-6">
                        <label className="form-label small fw-bold text-muted">Giờ Bắt Đầu</label>
                        <input type="time" className="form-control bg-light border-0 py-2" value={formData.GioBatDau} onChange={e => setFormData({...formData, GioBatDau: e.target.value})} required />
                      </div>
                      <div className="col-6">
                         <label className="form-label small fw-bold text-muted">Giờ Kết Thúc</label>
                         <input type="time" className="form-control bg-light border-0 py-2" value={formData.GioKetThuc} onChange={e => setFormData({...formData, GioKetThuc: e.target.value})} required />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted">Nội dung / Ghi chú <span className="text-danger">*</span></label>
                      <textarea className="form-control bg-light border-0 p-3 rounded-4" rows="3" value={formData.GhiChu} onChange={e => setFormData({...formData, GhiChu: e.target.value})} placeholder="VD: Buổi 1 - Học lý thuyết và chia nhóm" required></textarea>
                    </div>
                  </div>
                  <div className="modal-footer border-0 bg-light rounded-bottom-4">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowModal(false)}>Hủy bỏ</button>
                    <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">Lưu Lịch Vào Hệ Thống</button>
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
export default SessionsManagement;
