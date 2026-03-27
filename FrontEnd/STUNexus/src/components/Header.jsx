import React, { useContext } from 'react';
import { FaBell } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user } = useContext(AuthContext);

  const getRoleLabel = (role) => {
    if (role === 'admin') return 'Quản Trị Viên';
    if (role === 'lecturer') return 'Giảng Viên';
    if (role === 'student') return 'Sinh Viên';
    return 'Khách';
  };

  return (
    <header className="top-header glass-panel border-0 border-bottom rounded-0">
      <div className="header-left">
        <h5 className="mb-0 text-dark fw-bold">Hệ thống Điểm danh</h5>
      </div>
      <div className="header-right d-flex align-items-center gap-4">
        <div className="position-relative cursor-pointer">
          <FaBell className="text-secondary fs-4" />
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.6rem'}}>
            3
          </span>
        </div>
        
        <div className="user-profile d-flex align-items-center gap-2 cursor-pointer">
          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{width: '35px', height: '35px'}}>
            {user?.HoTen ? user.HoTen.charAt(0) : 'U'}
          </div>
          <div className="d-none d-md-block">
            <p className="mb-0 fw-bold small text-dark">{user?.HoTen || 'Chưa đăng nhập'}</p>
            <p className="mb-0 text-muted" style={{fontSize: '0.75rem'}}>{getRoleLabel(user?.role)}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
