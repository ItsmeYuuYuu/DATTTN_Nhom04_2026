import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import mockData from '../../data/mockDb.json';
import { FaUserGraduate, FaCalendarCheck, FaExclamationTriangle } from 'react-icons/fa';

const LecturerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalStudents: 0, avgAttendance: 0, warningStudents: 0 });

  useEffect(() => {
    if (!user) return;
    
    // Lấy danh sách ID lớp phụ trách
    const myClassIds = mockData.LopHoc.filter(l => l.MaGV === user.MaGV).map(l => l.MaLop);
    
    // Đếm lượng sinh viên tổng
    const myStudentsRaw = mockData.ChiTietLopHoc.filter(c => myClassIds.includes(c.MaLop)).map(c => c.MaSV);
    const uniqueStudents = [...new Set(myStudentsRaw)];
    
    // Đếm điểm danh chuyên cần
    const sessionIds = mockData.BuoiHoc.filter(b => myClassIds.includes(b.MaLop)).map(b => b.MaBuoiHoc);
    const attendances = mockData.DiemDanh.filter(d => sessionIds.includes(d.MaBuoiHoc));
    
    const coMatCount = attendances.filter(a => a.TrangThai === 'Có mặt').length;
    const totalCount = attendances.length;
    const avgAttendance = totalCount === 0 ? 0 : Math.round((coMatCount / totalCount) * 100);
    
    // Tính sinh viên vắng nhiều >= 3
    const warningMap = {};
    attendances.forEach(a => {
      if (a.TrangThai.includes('Vắng') || a.TrangThai.includes('trễ')) {
        warningMap[a.MaSV] = (warningMap[a.MaSV] || 0) + 1;
      }
    });
    const warningStudents = Object.values(warningMap).filter(v => v >= 3).length;

    setStats({
      totalStudents: uniqueStudents.length,
      avgAttendance,
      warningStudents
    });
  }, [user]);

  return (
    <div className="container-fluid">
      <h3 className="mb-4 mt-2 fw-bold text-dark">Báo Cáo Chuyên Cần</h3>
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-4">
          <div className="card glass-panel border-0 border-start border-primary border-4 p-4 shadow-sm" style={{borderRadius: '12px'}}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted fw-bold mb-1 text-uppercase" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>TỔNG SINH VIÊN Q.LÝ</p>
                <h2 className="fw-bold mb-0 text-dark">{stats.totalStudents}</h2>
              </div>
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                <FaUserGraduate className="fs-2 text-primary" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card glass-panel border-0 border-start border-success border-4 p-4 shadow-sm" style={{borderRadius: '12px'}}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted fw-bold mb-1 text-uppercase" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>TỶ LỆ ĐI HỌC (T.BÌNH)</p>
                <h2 className="fw-bold mb-0 text-success">{stats.avgAttendance}%</h2>
              </div>
              <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                <FaCalendarCheck className="fs-2 text-success" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card glass-panel border-0 border-start border-danger border-4 p-4 shadow-sm" style={{borderRadius: '12px'}}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted fw-bold mb-1 text-uppercase" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>SV VẮNG/TRỄ CAO (≥3)</p>
                <h2 className="fw-bold mb-0 text-danger">{stats.warningStudents}</h2>
              </div>
              <div className="bg-danger bg-opacity-10 p-3 rounded-circle">
                <FaExclamationTriangle className="fs-2 text-danger" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card glass-panel border-0 shadow-sm mt-5">
        <div className="card-header bg-white border-bottom py-3">
          <h6 className="m-0 fw-bold text-dark">Cảnh báo Sinh viên cấm thi</h6>
        </div>
        <div className="card-body p-5 text-center">
          <div className="bg-warning bg-opacity-10 d-inline-flex justify-content-center align-items-center rounded-circle mb-3" style={{width: '80px', height: '80px'}}>
            <FaExclamationTriangle className="text-warning fs-1" />
          </div>
          <p className="text-muted fw-medium fs-5 mb-0">Không có sinh viên nào rơi vào ngưỡng cấm thi trong tuần này.</p>
        </div>
      </div>
    </div>
  );
};
export default LecturerDashboard;
