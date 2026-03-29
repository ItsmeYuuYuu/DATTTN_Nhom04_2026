import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUserGraduate, FaChartPie, FaBook } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const LecturerSidebar = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="sidebar">
      <div className="brand">
        <img src="/logo.png" alt="STU Portal" style={{maxHeight: '60px', objectFit: 'contain'}} />
      </div>
      
      <div className="sidebar-nav">
        <div className="px-4 py-2 mt-2 text-uppercase text-muted fw-bold" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>
          Không Gian Quản Lý
        </div>
        <NavLink to="/lecturer/dashboard" className={({isActive}) => `nav-item-link ${isActive ? 'active' : ''}`}>
          <FaChartPie />
          <span>Thống kê & Báo cáo</span>
        </NavLink>
        <NavLink to="/lecturer/students" className={({isActive}) => `nav-item-link ${isActive ? 'active' : ''}`}>
          <FaUserGraduate />
          <span>Quản lý Sinh Viên</span>
        </NavLink>
        <NavLink to="/lecturer/subjects" className={({isActive}) => `nav-item-link ${isActive ? 'active' : ''}`}>
          <FaBook />
          <span>Quản lý Môn / Lớp Học</span>
        </NavLink>
      </div>
    </div>
  );
};

export default LecturerSidebar;
