import React, { useState, useEffect } from 'react';
import mockData from '../../data/mockDb.json';
import { FaPlus, FaBook } from 'react-icons/fa';

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  
  useEffect(() => {
    setSubjects(mockData.MonHoc);
  }, []);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
        <h3 className="m-0 fw-bold text-dark">Quản lý Môn học</h3>
        <button className="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm" style={{borderRadius: '8px'}}>
          <FaPlus /> Thêm môn học
        </button>
      </div>

      <div className="row">
        {subjects.map(subj => (
          <div className="col-md-4 mb-4" key={subj.MaMon}>
            <div className="card glass-panel border-0 shadow-sm h-100">
              <div className="card-body p-4 text-center">
                <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                  <FaBook className="fs-4" />
                </div>
                <h5 className="fw-bold text-dark">{subj.TenMon}</h5>
                <p className="text-muted mb-0">Mã môn: {subj.MaMon}</p>
              </div>
              <div className="card-footer bg-transparent border-top p-3 text-center">
                <button className="btn btn-link text-decoration-none text-primary fw-medium">Chỉnh sửa</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SubjectManagement;
