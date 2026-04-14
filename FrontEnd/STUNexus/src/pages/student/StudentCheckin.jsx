import React, { useState, useEffect, useContext } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import { AuthContext } from '../../context/AuthContext';
import { signPayload } from '../../utils/cryptoUtils';
import { FaMapMarkerAlt, FaCheckCircle, FaExclamationTriangle, FaShieldAlt, FaQrcode } from 'react-icons/fa';

const StudentCheckin = () => {
  const { classId } = useParams(); // classId is MaBuoiHoc
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { user } = useContext(AuthContext);
  
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('Đang chuẩn bị xác thực thiết bị...');
  const [gps, setGps] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    const performCheckin = async () => {
      try {
        const maSv = user?.MaSV || user?.MaId;
        if (!maSv) throw new Error('Không xác định được tài khoản sinh viên.');

        setMessage('Đang lấy tọa độ GPS...');
        if (!navigator.geolocation) throw new Error('Trình duyệt không hỗ trợ GPS.');

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setGps({ lat: latitude, lng: longitude });
            setMessage('Đang ký xác thực thiết bị...');

            try {
              // Tạo Payload gộm: maSv|maBuoiHoc|lat|long|timestamp
              // Timestamp bị ràng buộc thời gian, chữ ký này chỉ dùng được 1 lần
              const timestamp = Date.now();
              const rawPayload = `${maSv}|${classId}|${latitude.toFixed(6)}|${longitude.toFixed(6)}|${timestamp}`;

              // Ký payload bằng Private Key (khóa cứng trong thiết bị, không thể copy)
              const signature = await signPayload(maSv, rawPayload);

              setMessage('Đang gửi lên máy chủ...');

              // Gửi cả payload gốc + chữ ký lên Backend
              const res = await axiosClient.post('/diemdanh/submit', {
                maBuoiHoc: parseInt(classId),
                maSv: maSv,
                lat: latitude,
                long: longitude,
                rawPayload: rawPayload,
                signature: signature
              });

              setStatus('success');
              setMessage('Điểm danh thành công!');
              if (res.data.distance !== undefined) setDistance(res.data.distance);
            } catch (err) {
              setStatus('error');
              setMessage(err.response?.data?.message || err.message || 'Điểm danh thất bại!');
              if (err.response?.data?.distance !== undefined) setDistance(err.response.data.distance);
            }
          },
          () => {
            setStatus('error');
            setMessage('Không thể lấy vị trí. Vui lòng bật GPS cho trình duyệt!');
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Xác thực thiết bị thất bại.');
      }
    };

    setTimeout(() => { performCheckin(); }, 800);
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
              <div className="d-flex align-items-center">
                <div className="bg-white p-2 rounded-circle me-3 shadow-sm"><FaMapMarkerAlt className="text-success" /></div>
                <div>
                  <div className="small fw-bold text-dark">Khoảng cách xác thực</div>
                  <div className={`small fw-bold ${distance !== null && distance <= 30 ? 'text-success' : 'text-muted'}`}>
                    {distance !== null ? `${distance} mét` : 'Đã xác thực vị trí'}
                  </div>
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
              <div className="d-flex align-items-center">
                <div className="bg-white p-2 rounded-circle me-3 shadow-sm"><FaMapMarkerAlt className="text-danger" /></div>
                <div>
                  <div className="small fw-bold text-dark">Lỗi xác thực không gian</div>
                  <div className={`small fw-bold text-danger`}>
                    {distance !== null ? `Bạn đang cách điểm quét ${distance} mét` : (gps ? 'Vị trí không hợp lệ' : 'Bị từ chối GPS')}
                  </div>
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
