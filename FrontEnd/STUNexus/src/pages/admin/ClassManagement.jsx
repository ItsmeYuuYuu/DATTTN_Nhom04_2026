import React, { useState, useEffect } from 'react';
import mockData from '../../data/mockDb.json';
import { FaPlus, FaSearch } from 'react-icons/fa';

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  
  useEffect(() => {
    // Join LopHoc with MonHoc and GiangVien from mockData
    const joined = mockData.LopHoc.map(lop => {
      const monHoc = mockData.MonHoc.find(m => m.MaMon === lop.MaMon);
      const gv = mockData.GiangVien.find(g => g.MaGV === lop.MaGV);
      return {
        ...lop,
        TenMon: monHoc ? monHoc.TenMon : 'Unknown',
        TenGV: gv ? gv.HoTen : 'Chưa phân công'
      };
    });
    setClasses(joined);
  }, []);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
        <h3 className="m-0 fw-bold text-dark">Quản lý Lớp học</h3>
        <button className="btn btn-warning text-dark fw-bold d-flex align-items-center gap-2 px-4 shadow-sm" style={{borderRadius: '8px'}}>
          <FaPlus /> Tạo lớp học mới
        </button>
      </div>

      <div className="card glass-panel border-0 mb-4 shadow-sm">
        <div className="card-body p-4">
          <div className="table-responsive">
            <table className="table table-custom table-hover w-100 align-middle">
              <thead>
                <tr>
                  <th>Mã Lớp</th>
                  <th>Tên Lớp</th>
                  <th>Môn Học</th>
                  <th>Giảng Viên Phụ Trách</th>
                  <th className="text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls) => (
                  <tr key={cls.MaLop}>
                    <td className="fw-semibold text-warning">{cls.MaLop}</td>
                    <td className="fw-medium text-dark">{cls.TenLop}</td>
                    <td className="text-muted">{cls.TenMon}</td>
                    <td className="text-muted">{cls.TenGV}</td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-primary">Chi tiết điểm danh</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ClassManagement;
