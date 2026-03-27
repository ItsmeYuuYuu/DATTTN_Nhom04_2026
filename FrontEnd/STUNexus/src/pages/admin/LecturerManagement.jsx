import React, { useState, useEffect } from 'react';
import mockData from '../../data/mockDb.json';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const LecturerManagement = () => {
  const [lecturers, setLecturers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLecturers(mockData.GiangVien);
  }, []);

  const filteredLecturers = lecturers.filter(gv => 
    gv.HoTen.toLowerCase().includes(searchTerm.toLowerCase()) || 
    gv.MaGV.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
        <h3 className="m-0 fw-bold text-dark">Quản lý Giảng viên</h3>
        <button className="btn btn-success d-flex align-items-center gap-2 px-4 shadow-sm" style={{borderRadius: '8px'}}>
          <FaPlus /> Thêm giảng viên
        </button>
      </div>

      <div className="card glass-panel border-0 mb-4 shadow-sm">
        <div className="card-body p-4">
          <div className="row mb-4">
            <div className="col-md-6 col-lg-5">
              <div className="input-group drop-shadow-sm">
                <span className="input-group-text bg-white border-end-0 rounded-start-3">
                  <FaSearch className="text-muted" />
                </span>
                <input 
                  type="text" 
                  className="form-control border-start-0 ps-0 rounded-end-3" 
                  placeholder="Tìm kiếm theo mã hoặc tên GV..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{boxShadow: 'none'}}
                />
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-custom table-hover w-100 align-middle">
              <thead>
                <tr>
                  <th>Mã GV</th>
                  <th>Họ và Tên</th>
                  <th>Tài Khoản</th>
                  <th>Email</th>
                  <th>Số Điện Thoại</th>
                  <th>Trạng Thái</th>
                  <th className="text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredLecturers.map((gv) => (
                  <tr key={gv.MaGV} style={{transition: 'all 0.2s'}}>
                    <td className="fw-semibold text-success">{gv.MaGV}</td>
                    <td><span className="fw-medium text-dark">{gv.HoTen}</span></td>
                    <td className="text-muted">{gv.TaiKhoan}</td>
                    <td><a href={`mailto:${gv.Email}`} className="text-decoration-none text-muted">{gv.Email}</a></td>
                    <td className="text-muted">{gv.SoDienThoai}</td>
                    <td>
                      <span className={`badge-status ${gv.TrangThai ? 'badge-active' : 'badge-inactive'}`}>
                        {gv.TrangThai ? 'Đang hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-light text-primary me-2 rounded-circle" style={{width: '35px', height: '35px'}}><FaEdit /></button>
                      <button className="btn btn-sm btn-light text-warning rounded-circle" style={{width: '35px', height: '35px'}} title="Khóa tài khoản"><FaTrash /></button>
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
export default LecturerManagement;
