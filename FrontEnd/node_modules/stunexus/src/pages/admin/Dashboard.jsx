import React, { useState, useEffect } from 'react';
import mockData from '../../data/mockDb.json';
import { FaUsers, FaChalkboardTeacher, FaLayerGroup } from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState({ sv: 0, gv: 0, lop: 0 });

  useEffect(() => {
    setStats({
      sv: mockData.SinhVien?.length || 0,
      gv: mockData.GiangVien?.length || 0,
      lop: mockData.LopHoc?.length || 0
    });
  }, []);

  return (
    <div className="container-fluid">
      <h3 className="mb-4 mt-2 fw-bold text-dark">Tổng Quan Hệ Thống</h3>
      <div className="row g-4">
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card glass-panel border-0 border-start border-primary border-4 py-3 shadow-sm" style={{borderRadius: '12px'}}>
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-primary text-uppercase mb-1" style={{fontSize: '0.8rem'}}>Tổng Số Sinh Viên</div>
                  <div className="h3 mb-0 fw-bold text-dark">{stats.sv}</div>
                </div>
                <div className="col-auto">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                    <FaUsers className="text-primary" size={32} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card glass-panel border-0 border-start border-success border-4 py-3 shadow-sm" style={{borderRadius: '12px'}}>
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-success text-uppercase mb-1" style={{fontSize: '0.8rem'}}>Giảng Viên</div>
                  <div className="h3 mb-0 fw-bold text-dark">{stats.gv}</div>
                </div>
                <div className="col-auto">
                  <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                    <FaChalkboardTeacher className="text-success" size={32} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card glass-panel border-0 border-start border-warning border-4 py-3 shadow-sm" style={{borderRadius: '12px'}}>
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-warning text-uppercase mb-1" style={{fontSize: '0.8rem'}}>Lớp Học Đang Mở</div>
                  <div className="h3 mb-0 fw-bold text-dark">{stats.lop}</div>
                </div>
                <div className="col-auto">
                  <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                    <FaLayerGroup className="text-warning" size={32} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-12">
          <div className="card glass-panel border-0 shadow-sm">
            <div className="card-header bg-transparent border-bottom py-3">
              <h6 className="m-0 fw-bold text-primary">Hoạt Động Gần Đây</h6>
            </div>
            <div className="card-body p-4 text-center text-muted">
              Biểu đồ và báo cáo chi tiết sẽ hiển thị ở đây.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
