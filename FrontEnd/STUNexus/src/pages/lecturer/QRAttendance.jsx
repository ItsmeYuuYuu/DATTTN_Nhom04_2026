import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { FaSync, FaArrowLeft, FaStopCircle } from 'react-icons/fa';
import axiosClient from '../../utils/axiosClient';

const QRAttendance = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [timeLeft, setTimeLeft] = useState(15);
  const [isActive, setIsActive] = useState(true);

  const generateToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  useEffect(() => {
    // Cập nhật trạng thái buổi học lên Server: 1 = Đang mở QR, 2 = Đã chốt
    axiosClient.put(`/buoihoc/${classId}/status`, { trangThaiBh: isActive ? 1 : 2 })
      .catch(err => console.error('Lỗi cập nhật trạng thái buổi học:', err));

    if (!isActive) return;
    setToken(generateToken());
    setTimeLeft(15);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setToken(generateToken());
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  const qrUrl = `${window.location.protocol}//${window.location.host}/student/checkin/${classId}?token=${token}`;

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-light rounded-circle shadow-sm" style={{width: '40px', height: '40px'}} onClick={() => navigate(-1)}><FaArrowLeft /></button>
          <h3 className="m-0 fw-bold text-dark">Mã QR - Lớp {classId}</h3>
        </div>
        <button 
          className={`btn ${isActive ? 'btn-danger' : 'btn-success'} d-flex align-items-center gap-2 px-4 shadow-sm fw-bold`}
          onClick={() => setIsActive(!isActive)}
          style={{borderRadius: '8px'}}
        >
          {isActive ? <><FaStopCircle /> Dừng Điểm Danh</> : <><FaSync /> Tiếp tục</>}
        </button>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card glass-panel border-0 shadow-sm text-center py-5 px-3" style={{borderRadius: '16px'}}>
            <h4 className="fw-bold mb-4 text-primary">Quét mã QR để điểm danh</h4>
            <div className="qr-container bg-white p-4 rounded-4 shadow-sm d-inline-block mx-auto mb-4 border" style={{width: 'fit-content'}}>
              {isActive ? (
                <QRCodeSVG value={qrUrl} size={280} level={"H"} />
              ) : (
                <div style={{width: 280, height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa'}} className="text-muted rounded">
                  <h5 className="mb-0 fw-bold">Đã dừng thao tác</h5>
                </div>
              )}
            </div>
            {isActive && (
              <div className="bg-light p-3 rounded-3 text-dark mx-auto" style={{maxWidth: '400px'}}>
                <p className="mb-1 fw-medium">Mã QR sẽ tự làm mới sau <span className="text-danger fs-5 fw-bold mx-1">{timeLeft}</span> giây.</p>
                <small className="text-muted">Việc này triệt tiêu nguy cơ gửi màn hình chụp hộ.</small>
              </div>
            )}
            {!isActive && <p className="text-danger fw-bold fs-5">Buổi điểm danh đã kết thúc.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRAttendance;
