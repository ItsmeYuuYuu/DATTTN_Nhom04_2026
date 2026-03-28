import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlus, FaArrowRight, FaArrowLeft, FaUsers, FaTrash } from 'react-icons/fa';
import { getTable, updateTable } from '../../services/mockService';
import { AuthContext } from '../../context/AuthContext';

const ClassManagement = () => {
  const { monId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [classes, setClasses] = useState([]);
  const [subjectInfo, setSubjectInfo] = useState(null);
  const [studentDetails, setStudentDetails] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ MaLop: '', TenLop: '' });

  useEffect(() => {
    const allSubjects = getTable('MonHoc');
    const target = allSubjects.find(m => m.MaMon === monId);
    setSubjectInfo(target);

    const allClasses = getTable('LopHoc');
    setClasses(allClasses.filter(c => c.MaMon === monId));
    
    setStudentDetails(getTable('ChiTietLopHoc'));
  }, [monId]);

  const handleSave = (e) => {
    e.preventDefault();
    const newClass = {
      ...formData,
      MaMon: monId,
      MaGV: user?.MaGV || 'GV01' 
    };
    
    const allClasses = getTable('LopHoc');
    const updated = [...allClasses, newClass];
    updateTable('LopHoc', updated);
    
    setClasses([...classes, newClass]);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if(window.confirm('Cảnh báo: Đóng/Xoá lớp học này sẽ khiến mọi buổi học điểm danh bị lỗi. Xác nhận xoá?')){
      const allClasses = getTable('LopHoc');
      const updated = allClasses.filter(c => c.MaLop !== id);
      updateTable('LopHoc', updated);
      
      setClasses(classes.filter(c => c.MaLop !== id));
    }
  }

  const openAdd = () => {
    setFormData({ MaLop: `LPT_${Date.now().toString().slice(-5)}`, TenLop: `${subjectInfo?.TenMon || 'Lớp'} - Ca ` });
    setShowModal(true);
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-light rounded-circle shadow-sm" style={{width: '40px', height: '40px'}} onClick={() => navigate('/lecturer/subjects')}><FaArrowLeft /></button>
          <h3 className="m-0 fw-bold text-dark">Quản lý Lớp học - <span className="text-primary">{subjectInfo?.TenMon || monId}</span></h3>
        </div>
        <button onClick={openAdd} className="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm" style={{borderRadius: '8px'}}>
          <FaPlus /> Mở Lớp Học Phần Mới
        </button>
      </div>

      <div className="row g-4">
        {classes.length > 0 ? classes.map(c => {
           const numStudents = studentDetails.filter(x => x.MaLop === c.MaLop).length;
           return (
            <div className="col-12 col-md-6 col-xl-4" key={c.MaLop}>
              <div className="card glass-panel border-0 shadow-sm h-100 position-relative overflow-hidden" style={{borderRadius: '12px'}}>
                <button onClick={() => handleDelete(c.MaLop)} className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle shadow d-flex justify-content-center align-items-center" style={{zIndex: 10, width: '30px', height: '30px', padding: 0}} title="Xóa Lớp"><FaTrash/></button>
                <div className="card-body p-4 d-flex flex-column pt-5">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-3">
                      <FaUsers className="fs-3" />
                    </div>
                    <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill">Đang mở</span>
                  </div>
                  <h5 className="fw-bold mb-1 text-dark pe-4">{c.TenLop}</h5>
                  <p className="text-muted small mb-4">Mã Lớp: {c.MaLop} • Sĩ số: {numStudents} SV</p>
                  
                  <div className="mt-auto">
                    <button onClick={() => navigate(`/lecturer/sessions/${c.MaLop}`)} className="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2 fw-semibold py-2 rounded-pill shadow-sm">
                      Quản lý Điểm danh <FaArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            </div>
           );
        }) : (
          <div className="col-12 text-center py-5 bg-white rounded-4 shadow-sm border-0">
            <h5 className="text-muted fw-bold mb-2">Chưa có lớp nào mở</h5>
            <p className="text-muted">Môn học này chưa có lớp học phần nào được khởi tạo.</p>
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
                  <h5 className="modal-title fw-bold text-dark">Lập Lớp Học Phần Mới</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSave}>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted">Mã Lớp Học <span className="text-danger">*</span></label>
                      <input type="text" className="form-control bg-light border-0 py-2" value={formData.MaLop} onChange={e => setFormData({...formData, MaLop: e.target.value})} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted">Tên Danh Nghĩa Lớp Học <span className="text-danger">*</span></label>
                      <input type="text" className="form-control bg-light border-0 py-2" value={formData.TenLop} onChange={e => setFormData({...formData, TenLop: e.target.value})} required placeholder="VD: Lập trình Web - Ca 1 - Thứ 5" />
                    </div>
                  </div>
                  <div className="modal-footer border-0 bg-light rounded-bottom-4">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowModal(false)}>Hủy bỏ</button>
                    <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">Khởi Tạo Lớp</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
export default ClassManagement;
