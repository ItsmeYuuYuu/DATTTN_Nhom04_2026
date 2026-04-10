import React, { useState, useEffect, useContext } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import { AuthContext } from '../../context/AuthContext';
import fpPromise from '@fingerprintjs/fingerprintjs';
import { FaMapMarkerAlt, FaCheckCircle, FaExclamationTriangle, FaFingerprint, FaQrcode } from 'react-icons/fa';

const StudentCheckin = () => {
  const { classId } = useParams(); // classId is MaBuoiHoc
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { user } = useContext(AuthContext);
  
  const [status, setStatus] = useState('checking'); // checking | success | error
  const [message, setMessage] = useState('Đang lấy thông tin định vị và thiết bị...');
  const [gps, setGps] = useState(null);
  const [fingerprint, setFingerprint] = useState(null);

  useEffect(() => {
    const performCheckin = async () => {
      try {
        // 1. Lấy Fingerprint hash
        const fp = await fpPromise.load();
        const result = await fp.get();
        const deviceId = result.visitorId;
        setFingerprint(deviceId);

        // 2. Lấy định vị GPS
        if (!navigator.geolocation) {
          throw new Error('Trình duyệt không hỗ trợ truy cập GPS');
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setGps({ lat: latitude, lng: longitude });
            
            try {
               // Gọi API Submit điểm danh thật
               await axiosClient.post('/diemdanh/submit', {
                  maBuoiHoc: parseInt(classId),
                  maSv: user?.MaSV || user?.MaId,
                  lat: latitude,
                  long: longitude,
                  deviceToken: deviceId
               });
               
               setStatus('success');
               setMessage('Điểm danh thành công! Đã ghi nhận thiết bị hợp lệ.');
            } catch (err) {
               setStatus('error');
               setMessage(err.response?.data?.message || 'Điểm danh thất bại! Có thể bạn đã điểm danh rồi hoặc sai mã QR.');
            }
          },
          (err) => {
            setStatus('error');
            setMessage('Không thể lấy vị trí. Vui lòng bật kết nối vị trí (GPS) cho trình duyệt!');
          },
          { enableHighAccuracy: true, timeout: 5000 }
        );

      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Xác thực thiết bị thất bại, vui lòng thử lại');
      }
    };

    setTimeout(() => {
      performCheckin();
    }, 1500); // Fake delay for UX
  }, [classId, token]);

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100" style={{backgroundColor: '#eef2f7'}}>
      <div className="card glass-panel border-0 shadow-lg p-4 p-md-5" style={{maxWidth: '450px', width: '100%', borderRadius: '20px'}}>
        <div className="text-center mb-4">
          <div className="bg-primary text-white d-inline-block rounded-circle mb-3 p-3 shadow-sm">
            <FaQrcode style={{fontSize: '2rem'}} />
          </div>
          <h4 className="fw-bold text-dark mb-1">Check-in Lớp {classId}</h4>
          <p className="text-muted small">Token xác minh: <span className="text-primary font-monospace">{token?.substring(0,8)}</span></p>
        </div>

        {status === 'checking' && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" style={{width: '3.5rem', height: '3.5rem'}} role="status"></div>
            <h6 className="fw-medium text-dark">{message}</h6>
            <p className="text-muted small px-3 mt-3">Hệ thống đang đối chiếu vị trí GPS của bạn với giảng viên để đảm bảo tính minh bạch.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center py-4">
            <FaCheckCircle className="text-success mb-3" style={{fontSize: '5rem'}} />
            <h4 className="fw-bold text-success mb-3">Thành công!</h4>
            <p className="text-muted fw-medium">{message}</p>
            
            <div className="bg-success bg-opacity-10 p-3 rounded-4 text-start mt-4 border border-success border-opacity-25">
              <div className="d-flex align-items-center mb-2">
                <div className="bg-white p-2 rounded-circle me-3 shadow-sm"><FaMapMarkerAlt className="text-success" /></div>
                <div>
                  <div className="small fw-bold text-dark">Toạ độ xác thực</div>
                  <div className="small text-muted">{gps?.lat.toFixed(4)}, {gps?.lng.toFixed(4)}</div>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className="bg-white p-2 rounded-circle me-3 shadow-sm"><FaFingerprint className="text-success" /></div>
                <div>
                  <div className="small fw-bold text-dark">Device Fingerprint</div>
                  <div className="small text-muted">{fingerprint?.substring(0,10)}...</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-4">
            <FaExclamationTriangle className="text-danger mb-3" style={{fontSize: '5rem'}} />
            <h4 className="fw-bold text-danger mb-3">Thất bại</h4>
            <p className="text-danger fw-medium px-3">{message}</p>
            
            <div className="bg-danger bg-opacity-10 p-3 rounded-4 text-start mt-4 border border-danger border-opacity-25">
              <div className="d-flex align-items-center mb-2">
                <div className="bg-white p-2 rounded-circle me-3 shadow-sm"><FaMapMarkerAlt className="text-danger" /></div>
                <div>
                  <div className="small fw-bold text-dark">Toạ độ thiết bị</div>
                  <div className="small text-muted">{gps?.lat ? `${gps.lat.toFixed(4)}, ${gps.lng.toFixed(4)}` : 'Bị từ chối GPS'}</div>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className="bg-white p-2 rounded-circle me-3 shadow-sm"><FaFingerprint className="text-danger" /></div>
                <div>
                  <div className="small fw-bold text-dark">Device Fingerprint</div>
                  <div className="small text-muted">{fingerprint ? fingerprint.substring(0,10) + '...' : 'Đang lấy...'}</div>
                </div>
              </div>
            </div>
            
            <button className="btn btn-primary mt-4 py-2 w-100 shadow-sm fw-bold rounded-pill" onClick={() => window.location.reload()}>
              Thử Lại Trực Tiếp Tại Lớp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCheckin;
