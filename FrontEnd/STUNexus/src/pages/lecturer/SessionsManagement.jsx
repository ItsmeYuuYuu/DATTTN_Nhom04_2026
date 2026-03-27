import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import mockData from '../../data/mockDb.json';
import { FaArrowLeft, FaPlus, FaQrcode, FaListUl, FaCalendarAlt } from 'react-icons/fa';

const SessionsManagement = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    // Lọc danh sách buổi học theo ClassID
    const classSessions = mockData.BuoiHoc.filter(b => b.MaLop === classId);
    setSessions(classSessions);
  }, [classId]);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-light rounded-circle shadow-sm" style={{width: '40px', height: '40px'}} onClick={() => navigate('/lecturer/classes')}><FaArrowLeft /></button>
          <h3 className="m-0 fw-bold text-dark">Quản lý Buổi học - {classId}</h3>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm" style={{borderRadius: '8px'}}>
          <FaPlus /> Tạo Buổi Mới
        </button>
      </div>

      <div className="row g-4">
        {sessions.length > 0 ? sessions.map(b => (
          <div className="col-12 col-md-6 col-xl-4" key={b.MaBuoiHoc}>
            <div className="card glass-panel border-0 shadow-sm h-100" style={{borderRadius: '12px'}}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-3 me-3">
                    <FaCalendarAlt className="fs-3" />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">Buổi học ngày: {b.NgayHoc}</h6>
                    <span className="text-muted fw-medium small">{b.GioBatDau} - {b.GioKetThuc}</span>
                  </div>
                </div>
                <p className="text-muted small mb-4 bg-light p-2 rounded-3 border-start border-4 border-warning">{b.GhiChu}</p>
                <div className="d-flex gap-2">
                  <button onClick={() => navigate(`/lecturer/qr-attendance/${b.MaLop}`)} className="btn btn-primary flex-grow-1 d-flex justify-content-center align-items-center gap-2 fw-semibold">
                    <FaQrcode /> Khởi Động QR
                  </button>
                  <button onClick={() => navigate(`/lecturer/manual/${b.MaLop}`)} className="btn btn-outline-secondary flex-grow-1 d-flex justify-content-center align-items-center gap-2 fw-semibold">
                    <FaListUl /> Xem sổ tay
                  </button>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-12 mt-4 text-center text-muted">
            <h5 className="fw-medium">Lớp này chưa có nhật ký buổi học nào được tạo.</h5>
            <p>Vui lòng bấm "Tạo Buổi Mới".</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default SessionsManagement;
