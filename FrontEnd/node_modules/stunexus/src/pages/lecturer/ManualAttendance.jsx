import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import mockData from '../../data/mockDb.json';
import { FaArrowLeft, FaSave, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

const ManualAttendance = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [sessionInfo, setSessionInfo] = useState({ date: new Date().toLocaleDateString('vi-VN'), time: '07:30 - 09:30' });

  useEffect(() => {
    // Lấy sinh viên thuộc lớp
    const studentIds = mockData.ChiTietLopHoc.filter(c => c.MaLop === classId).map(c => c.MaSV);
    const classStudents = mockData.SinhVien.filter(s => studentIds.includes(s.MaSV));
    
    const initialStudents = classStudents.map(s => ({
      ...s,
      status: 'Có mặt', 
      note: ''
    }));
    setStudents(initialStudents);
  }, [classId]);

  const handleStatusChange = (id, newStatus) => {
    setStudents(prev => prev.map(s => s.MaSV === id ? { ...s, status: newStatus } : s));
  };

  const handleNoteChange = (id, newNote) => {
    setStudents(prev => prev.map(s => s.MaSV === id ? { ...s, note: newNote } : s));
  };

  const saveAttendance = () => {
    alert('Lưu điểm danh thành công!');
    navigate('/lecturer/classes');
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-light rounded-circle shadow-sm" style={{width: '40px', height: '40px'}} onClick={() => navigate(-1)}><FaArrowLeft /></button>
          <h3 className="m-0 fw-bold text-dark">Điểm danh tay - Lớp {classId}</h3>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm" onClick={saveAttendance} style={{borderRadius: '8px'}}>
          <FaSave /> Lưu Danh Sách
        </button>
      </div>
      
      <div className="card glass-panel border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="row mb-4 bg-light p-3 rounded-3 mx-0">
            <div className="col-md-4"><strong>Ngày học:</strong> {sessionInfo.date}</div>
            <div className="col-md-4"><strong>Giờ học:</strong> {sessionInfo.time}</div>
            <div className="col-md-4"><strong>Sĩ số:</strong> {students.length}</div>
          </div>

          <div className="table-responsive">
            <table className="table table-custom table-hover w-100 align-middle">
              <thead>
                <tr>
                  <th>Mã SV</th>
                  <th>Họ Tên</th>
                  <th style={{width: '220px'}}>Trạng Thái Điểm Danh</th>
                  <th>Ghi Chú</th>
                </tr>
              </thead>
              <tbody>
                {students.map((sv) => (
                  <tr key={sv.MaSV}>
                    <td className="fw-semibold text-primary">{sv.MaSV}</td>
                    <td>
                      <div className="d-flex align-items-center py-1">
                        <div className="me-3 bg-secondary bg-opacity-25 text-dark rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{width: '35px', height: '35px', fontWeight: 'bold'}}>
                          {sv.HoTen.charAt(0)}
                        </div>
                        <span className="fw-medium text-dark">{sv.HoTen}</span>
                      </div>
                    </td>
                    <td>
                      <select 
                        className={`form-select form-select-sm fw-bold border-0 shadow-sm ${
                          sv.status === 'Có mặt' ? 'bg-success bg-opacity-10 text-success' : 
                          sv.status === 'Đi trễ' ? 'bg-warning bg-opacity-10 text-warning' : 'bg-danger bg-opacity-10 text-danger'
                        }`}
                        value={sv.status}
                        onChange={(e) => handleStatusChange(sv.MaSV, e.target.value)}
                        style={{height: '38px', borderRadius: '8px'}}
                      >
                        <option value="Có mặt">Có mặt</option>
                        <option value="Đi trễ">Đi trễ</option>
                        <option value="Vắng có phép">Vắng có phép</option>
                        <option value="Vắng không phép">Vắng không phép</option>
                      </select>
                    </td>
                    <td>
                      <input 
                        type="text" 
                        className="form-control form-control-sm border-0 bg-light" 
                        placeholder="Thêm ghi chú..."
                        value={sv.note}
                        onChange={(e) => handleNoteChange(sv.MaSV, e.target.value)}
                        style={{height: '38px', borderRadius: '8px'}}
                      />
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr><td colSpan="4" className="text-center text-muted py-5"><FaExclamationTriangle className="fs-1 text-warning mb-3 d-block mx-auto"/><p>Lớp hiện không có sinh viên</p></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ManualAttendance;
