import React, { useState, useEffect } from 'react';
import axiosClient from '../../utils/axiosClient';
import { FaUsers, FaChalkboardTeacher, FaLayerGroup, FaBook } from 'react-icons/fa';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/admin/stats');
      setData(res.data?.data);
    } catch (err) {
      console.error('Lỗi tải tổng quan admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 1: return <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1">Có mặt</span>;
      case 2: return <span className="badge bg-warning bg-opacity-10 text-warning rounded-pill px-3 py-1">Đi trễ</span>;
      case 5: return <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-1">Nghi vấn gian lận</span>;
      default: return <span className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-3 py-1">Vắng / Lỗi</span>;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '--:--';
    const date = new Date(timeString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-3 text-muted">Đang phân tích dữ liệu hệ thống...</p>
    </div>
  );

  return (
    <div className="container-fluid">
      <h3 className="mb-4 mt-2 fw-bold text-dark">Tổng Quan Hệ Thống</h3>
      
      {/* 5 Stats Cards */}
      <div className="row g-4 mb-4">
        {/* Card: Sinh viên */}
        <div className="col-12 col-md-6 col-xl">
          <div className="card glass-panel border-0 border-start border-primary border-4 py-3 shadow-sm h-100" style={{borderRadius: '12px'}}>
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-xs fw-bold text-primary text-uppercase mb-1" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>Tổng Sinh Viên</div>
                  <div className="h3 mb-0 fw-bold text-dark">{data?.totalStudents || 0}</div>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                  <FaUsers className="text-primary" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Card: Giảng viên */}
        <div className="col-12 col-md-6 col-xl">
          <div className="card glass-panel border-0 border-start border-success border-4 py-3 shadow-sm h-100" style={{borderRadius: '12px'}}>
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-xs fw-bold text-success text-uppercase mb-1" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>Giảng Viên</div>
                  <div className="h3 mb-0 fw-bold text-dark">{data?.totalLecturers || 0}</div>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                  <FaChalkboardTeacher className="text-success" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card: Môn học */}
        <div className="col-12 col-md-6 col-xl">
          <div className="card glass-panel border-0 border-start border-4 py-3 shadow-sm h-100" style={{borderRadius: '12px', borderColor: '#6f42c1 !important', borderLeftColor: '#6f42c1'}}>
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="fw-bold text-uppercase mb-1" style={{fontSize: '0.75rem', letterSpacing: '0.5px', color: '#6f42c1'}}>Môn Học</div>
                  <div className="h3 mb-0 fw-bold text-dark">{data?.totalSubjects || 0}</div>
                </div>
                <div className="p-3 rounded-circle" style={{backgroundColor: 'rgba(111,66,193,0.1)'}}>
                  <FaBook size={24} style={{color: '#6f42c1'}} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card: Lớp học */}
        <div className="col-12 col-md-6 col-xl">
          <div className="card glass-panel border-0 border-start border-warning border-4 py-3 shadow-sm h-100" style={{borderRadius: '12px'}}>
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-xs fw-bold text-warning text-uppercase mb-1" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>Lớp Học</div>
                  <div className="h3 mb-0 fw-bold text-dark">{data?.totalClasses || 0}</div>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                  <FaLayerGroup className="text-warning" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card: Điểm danh hôm nay */}
        <div className="col-12 col-md-6 col-xl">
          <div className="card glass-panel border-0 border-start border-info border-4 py-3 shadow-sm h-100" style={{borderRadius: '12px'}}>
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-xs fw-bold text-info text-uppercase mb-1" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>Điểm danh Hôm nay</div>
                  <div className="h3 mb-0 fw-bold text-dark">{data?.todayAttendance || 0}</div>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded-circle">
                  <FaLayerGroup className="text-info" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activities Table */}
      <div className="row">
        <div className="col-12">
          <div className="card glass-panel border-0 shadow-sm" style={{borderRadius: '16px'}}>
            <div className="card-header bg-transparent border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
              <h6 className="m-0 fw-bold text-dark">Hoạt Động Gần Đây</h6>
              <span className="badge bg-light text-dark fw-normal">Dữ liệu thời gian thực</span>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive border-0">
                <table className="table table-hover align-middle mb-0 mobile-card-view">
                  <thead className="bg-light bg-opacity-50">
                    <tr>
                      <th className="px-4 py-3 border-0 small text-muted text-uppercase fw-bold">Sinh Viên</th>
                      <th className="px-4 py-3 border-0 small text-muted text-uppercase fw-bold">Lớp / Môn Học</th>
                      <th className="px-4 py-3 border-0 small text-muted text-uppercase fw-bold text-center">Trạng Thái</th>
                      <th className="px-4 py-3 border-0 small text-muted text-uppercase fw-bold text-end">Thời Gian</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.recentActivities?.map((act, index) => (
                      <tr key={index}>
                        <td data-label="Sinh Viên" className="px-4 py-3">
                          <div className="d-flex align-items-center">
                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3 d-none d-md-flex" style={{width: '32px', height: '32px', fontSize: '0.8rem'}}>
                              {act.studentName.charAt(0)}
                            </div>
                            <div>
                              <div className="fw-bold text-dark small">{act.studentName}</div>
                              <div className="text-muted" style={{fontSize: '0.7rem'}}>{act.studentId}</div>
                            </div>
                          </div>
                        </td>
                        <td data-label="Lớp / Môn" className="px-4 py-3">
                          <div className="fw-medium text-dark small">{act.subjectName}</div>
                          <div className="text-muted" style={{fontSize: '0.7rem'}}>ID Lớp: {act.classId}</div>
                        </td>
                        <td data-label="Trạng Thái" className="px-4 py-3 text-center">
                          {getStatusBadge(act.status)}
                        </td>
                        <td data-label="Thời Gian" className="px-4 py-3 text-end text-muted small fw-medium">
                          {formatTime(act.time)}
                        </td>
                      </tr>
                    ))}
                    {(!data?.recentActivities || data?.recentActivities.length === 0) && (
                      <tr>
                        <td colSpan="4" className="text-center py-5 text-muted">
                          Chưa ghi nhận hoạt động nào trong thời gian gần đây.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
