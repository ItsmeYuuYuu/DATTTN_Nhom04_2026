import React, { useState, useEffect } from 'react';
import mockData from '../../data/mockDb.json';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUserGraduate } from 'react-icons/fa';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load student data from mock
    setStudents(mockData.SinhVien);
  }, []);

  const filteredStudents = students.filter(sv => 
    sv.HoTen.toLowerCase().includes(searchTerm.toLowerCase()) || 
    sv.MaSV.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
        <h3 className="m-0 fw-bold text-dark" style={{letterSpacing: '-0.5px'}}>Quản lý Sinh viên</h3>
        <button className="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm" style={{borderRadius: '8px'}}>
          <FaPlus /> Thêm sinh viên
        </button>
      </div>

      <div className="card glass-panel border-0 mb-4">
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
                  placeholder="Tìm kiếm theo mã hoặc tên SV..." 
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
                  <th>Mã SV</th>
                  <th>Họ và Tên</th>
                  <th>Tài Khoản</th>
                  <th>Ngày Sinh</th>
                  <th>Email</th>
                  <th>Số Điện Thoại</th>
                  <th className="text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((sv) => (
                    <tr key={sv.MaSV} style={{transition: 'all 0.2s'}}>
                      <td className="fw-semibold text-primary">{sv.MaSV}</td>
                      <td>
                        <div className="d-flex align-items-center py-1">
                          <div className="me-3 bg-gradient text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{width: '40px', height: '40px', fontWeight: 'bold', backgroundColor: 'var(--primary-color)'}}>
                            {sv.HoTen.charAt(0)}
                          </div>
                          <div>
                            <span className="fw-medium d-block text-dark">{sv.HoTen}</span>
                          </div>
                        </div>
                      </td>
                      <td className="text-muted">{sv.TaiKhoan}</td>
                      <td className="text-muted">{sv.NgaySinh}</td>
                      <td><a href={`mailto:${sv.Email}`} className="text-decoration-none">{sv.Email}</a></td>
                      <td className="text-muted">{sv.SoDienThoai}</td>
                      <td className="text-center">
                        <button className="btn btn-sm btn-light text-primary me-2 rounded-circle" style={{width: '35px', height: '35px'}} title="Chỉnh sửa"><FaEdit /></button>
                        <button className="btn btn-sm btn-light text-danger rounded-circle" style={{width: '35px', height: '35px'}} title="Xóa"><FaTrash /></button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      <div className="d-flex flex-column align-items-center">
                        <FaUserGraduate className="fs-1 mb-3 text-light" />
                        <p className="mb-0">Không tìm thấy sinh viên nào</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
            <span className="text-muted small">Hiển thị {filteredStudents.length} trên tổng số {students.length} sinh viên</span>
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className="page-item disabled"><a className="page-link" href="#">Trước</a></li>
                <li className="page-item active"><a className="page-link" href="#">1</a></li>
                <li className="page-item disabled"><a className="page-link" href="#">Sau</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;
