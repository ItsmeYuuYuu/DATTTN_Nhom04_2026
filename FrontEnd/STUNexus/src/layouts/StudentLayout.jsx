import React, { useState, useContext } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FaHome, FaHistory, FaExclamationCircle, FaBook, FaQrcode, FaTimes } from 'react-icons/fa';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';

const StudentLayout = () => {
  const { user } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const menuItems = [
    { name: 'Trang chủ', path: '/student/dashboard', icon: <FaHome /> },
    { name: 'Quét mã điểm danh', path: '/student/qr-scan', icon: <FaQrcode /> },
    { name: 'Lớp học của tôi', path: '/student/classes', icon: <FaBook /> },
    { name: 'Lịch sử điểm danh', path: '/student/history', icon: <FaHistory /> },
    { name: 'Gửi phản hồi', path: '/student/complaints', icon: <FaExclamationCircle /> },
  ];

  return (
    <div className="d-flex flex-column vh-100 bg-light">
      <Header onMenuClick={toggleSidebar} />
      
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" 
          style={{zIndex: 1100}}
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`position-fixed top-0 start-0 h-100 bg-white shadow-lg transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          width: '280px', 
          zIndex: 1200, 
          transition: 'transform 0.3s ease-in-out',
          transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
        }}
      >
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-primary text-white">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-white rounded-circle d-flex align-items-center justify-content-center text-primary fw-bold" style={{width: '40px', height: '40px'}}>
              {user?.HoTen?.charAt(0)}
            </div>
            <div>
              <div className="fw-bold small">{user?.HoTen}</div>
              <div className="small opacity-75" style={{fontSize: '0.7rem'}}>{user?.MaSV}</div>
            </div>
          </div>
          <button className="btn btn-link text-white p-0" onClick={toggleSidebar}>
            <FaTimes />
          </button>
        </div>
        
        <div className="py-3">
          {menuItems.map((item, index) => (
            <NavLink 
              key={index} 
              to={item.path} 
              onClick={toggleSidebar}
              className={({isActive}) => `text-decoration-none d-flex align-items-center gap-3 px-4 py-3 fw-medium ${isActive ? 'text-primary bg-primary bg-opacity-10 border-start border-4 border-primary' : 'text-dark'}`}
            >
              <span className="fs-5 d-flex">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
        
        <div className="position-absolute bottom-0 w-100 p-4 border-top text-center text-muted small">
          STUNexus v1.0 • 2026
        </div>
      </div>

      <main className="flex-grow-1 overflow-auto p-2 p-md-4 pt-4">
        <div className="container-fluid mx-auto" style={{maxWidth: '600px'}}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};
export default StudentLayout;
