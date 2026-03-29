import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const result = login(username, password);
    if (result.success) {
      if (result.role === 'admin') navigate('/admin/dashboard');
      else if (result.role === 'lecturer') navigate('/lecturer/classes');
      else if (result.role === 'student') navigate('/student/dashboard'); 
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light" style={{backgroundImage: 'url("https://vtv1.mediacdn.vn/2019/10/24/photo-1-15719001150411784860161.jpg")', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="card glass-panel border-0 shadow-lg" style={{width: '100%', maxWidth: '450px', borderRadius: '16px', backgroundColor: 'rgba(255, 255, 255, 0.85)'}}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <img src="/logo.png" alt="STU Logo" style={{height: '60px', objectFit: 'contain'}} className="mb-3"/>
            <h4 className="fw-bold text-primary">Điểm Danh Hệ Thống</h4>
            <p className="text-muted small">Cổng thông tin STU Nexus</p>
          </div>
          
          {error && <div className="alert alert-danger py-2 small fw-bold bg-danger bg-opacity-10 border-0 text-danger">{error}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label fw-bold text-secondary small">Tài Khoản</label>
              <input 
                type="text" 
                className="form-control py-2 bg-light border-0" 
                placeholder="Nhập mã số hoặc tên đăng nhập" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                required 
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold text-secondary small">Mật Khẩu</label>
              <input 
                type="password" 
                className="form-control py-2 bg-light border-0" 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 fw-bold py-3 shadow-sm rounded-pill mt-2">
              Đăng Nhập
            </button>
          </form>
          
          <div className="mt-4 text-center p-3 bg-light rounded-3 border">
            <h6 className="fw-bold text-dark mb-2 text-start small border-bottom pb-2">📋 Tài khoản truy cập mẫu (Từ SQL):</h6>
            <div className="d-flex flex-column text-muted small px-2 text-start">
              <span className="fw-bold text-danger mb-2">Admin: <span className="fw-normal text-dark user-select-all">admin_super / hash_password_123</span></span>
              <span className="fw-bold text-success mb-2">Giảng viên: <span className="fw-normal text-dark user-select-all">thanh.nv / pass_gv_1</span></span>
              <span className="fw-bold text-primary">Sinh viên: <span className="fw-normal text-dark user-select-all">201101 / pass_sv_1</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
