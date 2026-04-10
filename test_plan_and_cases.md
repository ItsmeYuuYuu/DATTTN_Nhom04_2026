# Tài liệu Yêu cầu Kiểm thử và Danh sách Test Case Toàn diện: Hệ thống STUNexus (v3.0 - Professional Edition)

Tài liệu này là hồ sơ kiểm thử hoàn chỉnh cho dự án STUNexus, bao gồm các yêu cầu về môi trường, dữ liệu, hệ thống, backend, database và các luồng tích hợp phức tạp.

---

## 1. Yêu cầu về Môi trường và Dữ liệu (Prerequisites)

### 1.1. Môi trường Kiểm thử (Environment)
- **Hệ điều hành**: Windows 10/11 hoặc Linux (Ubuntu 22.04+).
- **Backend Runtime**: .NET 8.0 SDK.
- **Database**: SQL Server 2019 trở lên (Với hỗ trợ `FLOAT` cho GPS và `TIME` cho giờ học).
- **Frontend Runtime**: Node.js v18+, NPM v9+.
- **Trình duyệt**: Chrome (v110+), Edge, Safari (dành cho Mobile/Student view).

### 1.2. Yêu cầu Dữ liệu Test (Test Data)
- **Tập mẫu Sinh viên**: File Excel/JSON chứa ít nhất 50 sinh viên với các mã SV, email, số điện thoại đúng định dạng và có cả các bản ghi cố tình sai để test Validation.
- **Tập mẫu Giảng viên**: Tài khóa Admin và ít nhất 3 giảng viên ở các trạng thái khác nhau (Hoạt động, Đã khóa).
- **Cấu hình GPS**: Tọa độ mẫu của các phòng học thực tế để test bán kính điểm danh.

---

## 2. Phần 1: Kiểm thử Cấu hình Hệ thống và Middleware

Đảm bảo nền tảng của ứng dụng (nêu trong `Program.cs`) hoạt động ổn định.

| ID | Thành phần | Kịch bản kiểm thử | Kết quả mong đợi |
|:---|:---|:---|:---|
| SYS-CORS-01 | CORS Policy | Dùng một domain lạ (không phải localhost/domain thật) gọi API | Server phải chặn request (nếu cấu hình nghiêm ngặt) hoặc cho phép nếu để `AllowAll`. |
| SYS-ERR-01 | Global Exception | Cố tình tạo một lỗi NullReference trong Controller | Server trả về JSON `{ "success": false, "message": "..." }` thay vì trang HTML báo lỗi 500 mặc định. |
| SYS-SWG-01 | Swagger UI | Truy cập `/swagger` ở môi trường Development | Hiển thị đầy đủ danh sách các API và có khả năng Test thử trực tiếp. |
| SYS-SWG-02 | Swagger UI | Truy cập `/swagger` ở môi trường Production | Hệ thống phải ẩn trang Swagger để đảm bảo bảo mật. |

---

## 3. Phần 2: Kiểm thử Cấp độ Cơ sở dữ liệu (Database Integrity)

| ID | Thực thể | Loại kiểm thử | Kịch bản chi tiết | Kết quả mong đợi |
|:---|:---|:---|:---|:---|
| DB-FK-01 | MonHoc | Khóa ngoại | Xóa một `MonHoc` khi đang có `LopHoc` tham chiếu đến | SQL Server chặn xóa (Foreign Key Conflict) |
| DB-UQ-01 | SinhVien | Duy nhất | Chèn một `SinhVien` mới có `TaiKhoan` đã tồn tại | Chặn trùng lặp (Unique Constraint Violation) |
| DB-UQ-02 | DiemDanh | Duy nhất | Chèn 2 bản ghi `DiemDanh` cho cùng một `MaSV` trong cùng một `MaBuoiHoc` | SQL Server chặn bản ghi thứ 2 (UQ_DiemDanh_1Lan) |
| DB-NULL-01 | LopHoc | Nullability | Chèn `LopHoc` với `NgayBatDau` là NULL | Chặn vì cột NOT NULL |

---

## 4. Phần 3: Kiểm thử Backend API Siêu Chi tiết (Hyper-Detailed)

### 4.1. Module Xác thực và Phân quyền (Auth & Security)
| ID | Method | Endpoint | Scenario | Expected Result |
|:---|:---|:---|:---|:---|
| API-AUTH-01 | POST | `/login` | SQL Injection vào trường tài khoản | 401 Unauthorized (Không được leak data) |
| API-AUTH-02 | POST | `/login` | Tài khoản GV hợp lệ nhưng bị khóa (TrangThai=0) | 401 Unauthorized + Thông báo "Tài khoản bị khóa" |
| API-SEC-01 | GET | `/api/sinhvien` | Student dùng Token của mình gọi API lấy toàn bộ DS sinh viên | 403 Forbidden (Chỉ Admin mới có quyền) |

### 4.2. Module Điểm danh và Anti-Cheat (Core Logic)
| ID | Method | Endpoint | Scenario | Expected Result |
|:---|:---|:---|:---|:---|
| API-DD-01 | POST | `/submit` | Điểm danh sai tọa độ (Cách xa > 100m) | 400 Bad Request + Thông báo "Bạn quá xa vị trí lớp học" |
| API-DD-02 | POST | `/submit` | Quét mã bằng thiết bị thứ 2 | 400 Bad Request + Thông báo "Thiết bị không trùng khớp" |
| API-DD-03 | POST | `/submit` | Điểm danh trùng lặp trong cùng 1 buổi | 400 Bad Request + "Bạn đã điểm danh buổi này rồi" |

---

## 5. Phần 4: Kiểm thử Khả năng Phục hồi (Resilience & Recovery)

| ID | Thành phần | Kịch bản kiểm thử | Kết quả mong đợi |
|:---|:---|:---|:---|
| RES-DB-01 | SQL Retry | Ngắt kết nối mạng database trong 5 giây khi đang thực hiện Query | Hệ thống tự động thử lại (Retry) nhờ cấu hình trong `Program.cs` và thành công sau khi có mạng. |
| RES-CON-01 | Connectivity | Mất mạng trong lúc đang quét mã (về phía SV) | Frontend hiển thị thông báo "Mất kết nối", cho phép thử lại khi có mạng. |

---

## 6. Phần 5: Kiểm thử Luồng nghiệp vụ E2E và Frontend

### 6.1. Xử lý Trạng thái API & Phản hồi UI
- **Loading State**: Mọi API gọi lâu (> 1s) phải hiện Spinner.
- **Redirection**: Khi Token 401, tự động xóa Session và về trang Login.
- **Toast Notify**: Thành công (Xanh), Cảnh báo (Vàng), Lỗi (Đỏ).

### 6.2. Luồng nghiệp vụ chính
1. **Admin**: Import 200 SV từ Excel -> Kiểm tra xem có bản ghi bị sót hay lỗi format không.
2. **Giảng viên**: Tạo lớp học -> Kiểm tra xem DB có tự đẻ đúng số lượng BuoiHoc không.
3. **Sinh viên**: Đổi mật khẩu -> Đăng nhập lại bằng mật khẩu mới -> Điểm danh -> Xem thống kê cá nhân.

---

## 7. Danh mục Kiểm tra Bảo mật (Security Checklist)
- [ ] Mật khẩu trong Database có được Hash không? (Bắt buộc).
- [ ] Token JWT có mang đúng `ClaimTypes.Role` để phân quyền không?
- [ ] Thông tin nhạy cảm có bị lộ trong Logs không?

---
**Chốt tài liệu:** Tài liệu này hiện đã bao trùm mọi ngóc ngách từ hệ thống đến nghiệp vụ của STUNexus. Đảm bảo tính sẵn sàng cao cho quá trình kiểm thử thực tế.

**Người soạn thảo**: Antigravity AI
**Ngày**: 2026-04-10
