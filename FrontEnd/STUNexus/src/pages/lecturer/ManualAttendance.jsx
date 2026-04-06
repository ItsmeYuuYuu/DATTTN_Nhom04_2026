import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import { FaArrowLeft, FaSave, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

const ManualAttendance = () => {
  const { classId } = useParams(); // URL là /manual/:classId -> classId ở đây thực chất là MaBuoiHoc
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [sessionInfo, setSessionInfo] = useState({ date: '', time: '', tenLop: '' });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const maBuoiHoc = parseInt(classId);
      
      // 1. Lấy chi tiết buổi học (để lấy MaLop và thông tin hiển thị)
      const sessionRes = await axiosClient.get(`/buoihoc/${maBuoiHoc}`);
      const session = sessionRes.data;
      setSessionInfo({
        date: session.ngayHoc,
        time: `${session.gioBatDau} - ${session.gioKetThuc}`,
        tenLop: session.tenLop
      });

      // 2. Lấy danh sách SV của lớp đó
      const studentsRes = await axiosClient.get(`/lophoc/${session.maLop}/students`);
      const allStudents = studentsRes.data?.data || [];

      // 3. Lấy dữ liệu điểm danh hiện tại (nếu có)
      const attendRes = await axiosClient.get(`/diemdanh/session/${maBuoiHoc}`);
      const currentAttendance = attendRes.data || [];

      // 4. Merge dữ liệu
      const merged = allStudents.map(s => {
        const att = currentAttendance.find(a => a.maSv === s.maSv);
        return {
          ...s,
          trangThai: att ? att.trangThai : 1, // Mặc định 1 (Có mặt) nếu chưa có record
          ghiChu: att ? att.ghiChu : ''
        };
      });

      setStudents(merged);
    } catch (err) {
      console.error('Lỗi tải dữ liệu điểm danh:', err);
      alert('Không thể tải dữ liệu buổi học!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [classId]);

  const handleStatusChange = (id, newStatus) => {
    setStudents(prev => prev.map(s => s.maSv === id ? { ...s, trangThai: parseInt(newStatus) } : s));
  };

  const handleNoteChange = (id, newNote) => {
    setStudents(prev => prev.map(s => s.maSv === id ? { ...s, ghiChu: newNote } : s));
  };

  const saveAttendance = async () => {
    try {
      const maBuoiHoc = parseInt(classId);
      const payload = students.map(s => ({
        maBuoiHoc: maBuoiHoc,
        maSv: s.maSv,
        trangThai: s.trangThai,
        ghiChu: s.ghiChu
      }));

      await axiosClient.post('/diemdanh/bulk-update', payload);
      alert('Lưu bảng điểm danh thành công!');
      navigate(-1);
    } catch (err) {
      alert('Lỗi khi lưu dữ liệu!');
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-light rounded-circle shadow-sm" style={{width: '40px', height: '40px'}} onClick={() => navigate(-1)}><FaArrowLeft /></button>
          <h3 className="m-0 fw-bold text-dark">Sổ tay Điểm danh - {sessionInfo.tenLop}</h3>
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
                  <tr key={sv.maSv}>
                    <td className="fw-semibold text-primary">{sv.maSv}</td>
                    <td>
                      <div className="d-flex align-items-center py-1">
                        <div className="me-3 bg-secondary bg-opacity-25 text-dark rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{width: '35px', height: '35px', fontWeight: 'bold'}}>
                          {sv.hoTen?.charAt(0)}
                        </div>
                        <span className="fw-medium text-dark">{sv.hoTen}</span>
                      </div>
                    </td>
                    <td>
                      <select 
                        className={`form-select form-select-sm fw-bold border-0 shadow-sm ${
                          sv.trangThai === 1 ? 'bg-success bg-opacity-10 text-success' : 
                          sv.trangThai === 2 ? 'bg-warning bg-opacity-10 text-warning' : 'bg-danger bg-opacity-10 text-danger'
                        }`}
                        value={sv.trangThai}
                        onChange={(e) => handleStatusChange(sv.maSv, e.target.value)}
                        style={{height: '38px', borderRadius: '8px'}}
                      >
                        <option value="1">Có mặt</option>
                        <option value="2">Đi trễ</option>
                        <option value="3">Vắng có phép</option>
                        <option value="4">Vắng không phép</option>
                      </select>
                    </td>
                    <td>
                      <input 
                        type="text" 
                        className="form-control form-control-sm border-0 bg-light" 
                        placeholder="Thêm ghi chú..."
                        value={sv.ghiChu}
                        onChange={(e) => handleNoteChange(sv.maSv, e.target.value)}
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
