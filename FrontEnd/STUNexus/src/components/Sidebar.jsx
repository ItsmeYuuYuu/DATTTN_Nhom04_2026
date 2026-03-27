import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaChalkboardTeacher, FaUserGraduate, FaLayerGroup, FaBook, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
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
        <NavLink to="/admin/dashboard" className={({isActive}) => `nav-item-link ${isActive ? 'active' : ''}`}>
          <FaChartBar />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/lecturers" className={({isActive}) => `nav-item-link ${isActive ? 'active' : ''}`}>
          <FaChalkboardTeacher />
          <span>Quản lý Giảng viên</span>
        </NavLink>
        <NavLink to="/admin/students" className={({isActive}) => `nav-item-link ${isActive ? 'active' : ''}`}>
          <FaUserGraduate />
          <span>Quản lý Sinh viên</span>
        </NavLink>
        <NavLink to="/admin/classes" className={({isActive}) => `nav-item-link ${isActive ? 'active' : ''}`}>
          <FaLayerGroup />
          <span>Quản lý Lớp học</span>
        </NavLink>
        <NavLink to="/admin/subjects" className={({isActive}) => `nav-item-link ${isActive ? 'active' : ''}`}>
          <FaBook />
          <span>Quản lý Môn học</span>
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

export default Sidebar;
