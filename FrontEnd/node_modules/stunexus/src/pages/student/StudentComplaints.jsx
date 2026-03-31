import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const StudentComplaints = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3500);
  };

  return (
    <div className="pb-4 pt-2">
      <h5 className="fw-bold text-dark mb-4 px-2">Phản Hồi Điểm Danh</h5>
      <div className="card bg-white border-0 shadow-sm rounded-4 p-4">
        {submitted ? (
           <div className="text-success text-center py-5">
             <FaCheckCircle className="fs-1 mb-3" />
             <h6 className="fw-bold">Gửi phản hồi thành công!</h6>
             <p className="text-muted small mb-0">Giảng viên sẽ xem lại minh chứng và cập nhật trạng thái cho bạn.</p>
           </div>
        ) : (
          <form onSubmit={handleSubmit} className="text-start">
            <div className="mb-4">
              <label className="form-label small fw-bold text-muted">Môn Học / Buổi Học bị sai</label>
              <select className="form-select bg-light border-0 py-3 rounded-3" required defaultValue="">
                <option value="" disabled>-- Bấm để chọn --</option>
                <option value="1">Lập trình Web - Sáng 27/03/2026</option>
                <option value="2">Cơ sở dữ liệu - Chiều 25/03/2026</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="form-label small fw-bold text-muted">Nội dung khiếu nại</label>
              <textarea className="form-control bg-light border-0 p-3 rounded-3" rows="4" placeholder="Ví dụ: Dạ thưa thầy, em có mặt ở lớp nhưng do lỗi GPS mạng 4G chập chờn nên máy báo vắng..." required></textarea>
            </div>
            <div className="mb-5">
              <label className="form-label small fw-bold text-muted">File minh chứng (Nếu có)</label>
              <input type="file" className="form-control bg-light border-0 py-2 rounded-3" />
              <p className="text-muted mt-2" style={{fontSize: '0.65rem'}}>Hỗ trợ ảnh chụp màn hình bị lỗi, độ trễ, hoặc hình chụp tại lớp.</p>
            </div>
            <button type="submit" className="btn btn-primary w-100 rounded-pill fw-bold py-3 shadow-sm">Gửi Hệ Thống</button>
          </form>
        )}
      </div>
    </div>
  );
};
export default StudentComplaints;
