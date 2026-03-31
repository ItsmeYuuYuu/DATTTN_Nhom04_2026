import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserGraduate, FaSignOutAlt, FaHistory } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const StudentSidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="brand">
        <img src="/logo.png" alt="STU Portal" style={{maxHeight: '60px', objectFit: 'contain'}} />
      </div>
      
      <div className="sidebar-nav">
        <div className="px-4 py-2 mt-2 text-uppercase text-muted fw-bold" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>
          Cá Nhân
        </div>
        <NavLink to="/student/dashboard" className={({isActive}) => `nav-item-link ${isActive ? 'active' : ''}`}>
          <FaUserGraduate />
          <span>Lớp Theo Học</span>
        </NavLink>
        <NavLink to="/student/history" className={({isActive}) => `nav-item-link ${isActive ? 'active' : ''}`}>
          <FaHistory />
          <span>Lịch sử Điểm danh</span>
        </NavLink>
      </div>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2">
          <FaSignOutAlt /> Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default StudentSidebar;
