import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mockData from '../../data/mockDb.json';
import { FaChalkboard, FaArrowRight } from 'react-icons/fa';

const LecturerClasses = () => {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();
  // Assume logged in as GV01
  const lecturerId = 'GV01';

  useEffect(() => {
    // Filter classes assigned to GV01
    const myClasses = mockData.LopHoc.filter(c => c.MaGV === lecturerId).map(c => {
      const subject = mockData.MonHoc.find(m => m.MaMon === c.MaMon);
      return { ...c, TenMon: subject ? subject.TenMon : 'Chưa có Môn' };
    });
    setClasses(myClasses);
  }, []);

  return (
    <div className="container-fluid">
      <h3 className="mb-4 mt-2 fw-bold text-dark">Lớp Học Phụ Trách</h3>
      <div className="row g-4">
        {classes.length > 0 ? classes.map(c => (
          <div className="col-12 col-md-6 col-xl-4" key={c.MaLop}>
            <div className="card glass-panel border-0 border-start border-primary border-4 shadow-sm h-100" style={{borderRadius: '12px'}}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 text-primary rounded d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                    <FaChalkboard className="fs-4" />
                  </div>
                  <span className="badge bg-light text-secondary border px-3 py-2 rounded-pill shadow-sm">{c.MaLop}</span>
                </div>
                <h5 className="fw-bold text-dark text-truncate mb-1" title={c.TenLop}>{c.TenLop}</h5>
                <p className="text-muted fw-medium mb-4">{c.TenMon}</p>
                <button 
                  onClick={() => navigate(`/lecturer/sessions/${c.MaLop}`)} 
                  className="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2 py-2 fw-bold shadow-sm rounded-pill">
                  Vào Lớp Học <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-12">
            <p className="text-muted">Không có lớp học nào được phân công.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LecturerClasses;
