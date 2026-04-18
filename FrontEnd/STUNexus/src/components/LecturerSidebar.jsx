import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUserGraduate, FaChartPie, FaBook, FaCalendarDay, FaBell } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const LecturerSidebar = () => {
  const { user } = useContext(AuthContext);
  const [pendingCount, setPendingCount] = React.useState(0);

  React.useEffect(() => {
    const maGv = user?.MaGV || user?.MaId;
    if (!maGv) return;
    import('../utils/axiosClient').then(({ default: axiosClient }) => {
      axiosClient.get(`/phanhoi/lecturer/${maGv}`)
        .then(res => {
          const pending = (res.data?.data || []).filter(a => a.trangThai === 0).length;
          setPendingCount(pending);
        })
        .catch(() => {});
    });
  }, [user]);

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
        <NavLink to="/lecturer/attendance-today" className={({isActive}) => `nav-item-link ${isActive ? 'active' : ''}`}>
          <FaCalendarDay />
          <span>Quản lý Điểm danh</span>
        </NavLink>
        <NavLink to="/lecturer/subjects" className={({isActive}) => `nav-item-link ${isActive ? 'active' : ''}`}>
          <FaBook />
          <span>Quản lý Môn / Lớp Học</span>
        </NavLink>
        <NavLink to="/lecturer/appeals" className={({isActive}) => `nav-item-link ${isActive ? 'active' : ''}`}>
          <FaBell />
          <span>Xử lý Khiếu Nại</span>
          {pendingCount > 0 && (
            <span className="badge bg-danger rounded-pill ms-auto" style={{fontSize:'0.65rem'}}>{pendingCount}</span>
          )}
        </NavLink>
      </div>
    </div>
  );
};

export default LecturerSidebar;
