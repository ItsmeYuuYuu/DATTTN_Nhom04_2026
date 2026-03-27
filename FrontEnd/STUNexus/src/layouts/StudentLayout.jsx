import React, { useContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaHistory, FaExclamationCircle, FaSignOutAlt } from 'react-icons/fa';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';

const StudentLayout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column vh-100 bg-light" style={{paddingBottom: '70px'}}>
      <Header />
      
      <main className="flex-grow-1 overflow-auto p-2 p-md-4 pt-4">
        <div className="container-fluid mx-auto" style={{maxWidth: '600px'}}>
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation for Mobile App Feel */}
      <nav className="bg-white position-fixed bottom-0 w-100 d-flex justify-content-around py-2 shadow-lg border-top" style={{zIndex: 1000}}>
        <NavLink to="/student/dashboard" className={({isActive}) => `text-decoration-none d-flex flex-column align-items-center p-2 rounded-3 ${isActive ? 'text-primary bg-primary bg-opacity-10' : 'text-muted'}`} style={{minWidth: '70px'}}>
          <FaHome className="fs-5 mb-1" />
          <span className="fw-medium" style={{fontSize: '0.65rem'}}>Trang chủ</span>
        </NavLink>
        <NavLink to="/student/history" className={({isActive}) => `text-decoration-none d-flex flex-column align-items-center p-2 rounded-3 ${isActive ? 'text-primary bg-primary bg-opacity-10' : 'text-muted'}`} style={{minWidth: '70px'}}>
          <FaHistory className="fs-5 mb-1" />
          <span className="fw-medium" style={{fontSize: '0.65rem'}}>Lịch sử</span>
        </NavLink>
        <NavLink to="/student/complaints" className={({isActive}) => `text-decoration-none d-flex flex-column align-items-center p-2 rounded-3 ${isActive ? 'text-danger bg-danger bg-opacity-10' : 'text-muted'}`} style={{minWidth: '70px'}}>
          <FaExclamationCircle className="fs-5 mb-1" />
          <span className="fw-medium" style={{fontSize: '0.65rem'}}>Phản hồi</span>
        </NavLink>
        <button onClick={handleLogout} className="btn btn-link text-decoration-none d-flex flex-column align-items-center p-2 rounded-3 text-muted border-0 bg-transparent" style={{minWidth: '70px'}}>
          <FaSignOutAlt className="fs-5 mb-1" />
          <span className="fw-medium" style={{fontSize: '0.65rem'}}>Đăng xuất</span>
        </button>
      </nav>
    </div>
  );
};
export default StudentLayout;
