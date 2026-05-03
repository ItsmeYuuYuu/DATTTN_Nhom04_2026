# Đặc Tả Kiểm Thử Tổng Thể STUNexus (Bản Tiếng Việt)

## 1) Thông tin tài liệu
- Dự án: STUNexus Attendance System
- Phạm vi: Yêu cầu test + bộ testcase đầy đủ cho UI flow, API, DB side-effect
- Phiên bản: 1.0
- Ngày: 2026-05-03
- Phụ trách: QA

## 2) Mục tiêu kiểm thử
- Xác minh đầy đủ luồng nghiệp vụ của Admin, Giảng viên, Sinh viên.
- Xác minh toàn bộ API backend (happy path, negative, edge, security).
- Xác minh logic chống gian lận: QR động, GPS bán kính, Passkey/WebAuthn.
- Xác minh tính toàn vẹn dữ liệu SQL Server sau các hành động quan trọng.
- Xác minh hành vi UI khi lỗi/timeout/input sai.

## 3) Thành phần trong phạm vi
- Frontend: `FrontEnd/STUNexus/src/**`
- Backend: `BackEnd/DiemDanhLopHoc/**`
- CSDL: `Database/QuanLyDiemDanh.sql`
- Bộ test tích hợp nền tảng: `BackEnd/DiemDanhLopHoc.Tests/**`

## 4) Ngoài phạm vi
- Cơ chế nội bộ của dịch vụ bên thứ ba (Cloudinary, authenticator OS).
- Kiểm thử tải internet quy mô lớn (chỉ mức staging/concurrency trong tài liệu này).

## 5) Môi trường test
- ENV-LOCAL: FE + BE localhost + SQL test DB.
- ENV-STAGING: domain HTTPS (bắt buộc để test WebAuthn thực tế).
- ENV-PREPROD: tùy chọn, mirror production.

## 6) Yêu cầu test bắt buộc
1. RQ-ENV-001: Bắt buộc dùng DB test riêng, không dùng DB production.
2. RQ-ENV-002: Backend .NET 8 và SQL Server phải sẵn sàng trước khi test.
3. RQ-ENV-003: FE phải chạy đúng `VITE_API_BASE_URL`.
4. RQ-SEC-001: Mọi endpoint đều test input lỗi/thiếu field.
5. RQ-SEC-002: Mọi luồng trọng yếu đều test unauthorized/expired token.
6. RQ-SEC-003: Luồng anti-fraud bắt buộc có test replay/tamper.
7. RQ-DB-001: Ràng buộc FK/Unique phải có assert trong test.
8. RQ-NFR-001: Có test đồng thời nhiều sinh viên checkin cùng buổi.
9. RQ-NFR-002: Có test phục hồi khi lỗi GPS/mạng/API timeout.
10. RQ-AUD-001: Mọi lượt chạy test phải lưu bằng chứng API + DB delta.

## 7) Tài khoản test cốt lõi
- ADMIN_01: tài khoản admin hợp lệ
- LEC_01_ACTIVE: giảng viên hoạt động
- LEC_02_LOCKED: giảng viên bị khóa (`TrangThai=0`)
- STU_01_PASSKEY: sinh viên đã có passkey + thiết bị đã bind
- STU_02_NOPASSKEY: sinh viên chưa có passkey
- STU_03_OTHER_DEVICE: sinh viên có thiết bị khác đã bind

## 8) Quy ước kết quả API mong đợi
- Success: trả `success=true` hoặc payload hợp lệ theo thiết kế endpoint.
- Failure: HTTP status đúng bản chất lỗi + message có ý nghĩa.
- Không được trả trang HTML lỗi mặc định cho API.

## 9) Test FrontEnd (UI/E2E) đầy đủ

### 9.1 Xác thực & phiên làm việc
| ID | Tiêu đề | Điều kiện | Bước chạy | Kỳ vọng UI | Kỳ vọng API/DB | Ưu tiên | Mức độ |
|---|---|---|---|---|---|---|---|
| UI-AUTH-001 | Đăng nhập admin thành công | Có ADMIN_01 | Login đúng thông tin | Redirect `/admin/dashboard` | `POST /auth/login` 200, JWT hợp lệ | P0 | S1 |
| UI-AUTH-002 | Đăng nhập giảng viên thành công | Có LEC_01_ACTIVE | Login đúng | Redirect `/lecturer/dashboard` | API 200 | P0 | S1 |
| UI-AUTH-003 | Đăng nhập sinh viên thành công | Có STU_01_PASSKEY | Login đúng | Redirect `/student/dashboard` | API 200, hasPasskey=true | P0 | S1 |
| UI-AUTH-004 | Chặn giảng viên bị khóa | Có LEC_02_LOCKED | Login | Hiện lỗi, không redirect | API 401 | P0 | S1 |
| UI-AUTH-005 | Sai mật khẩu | Có user hợp lệ | Nhập sai pass | Hiện lỗi | API 401 | P0 | S2 |
| UI-AUTH-006 | Bỏ trống thông tin | Không cần | Submit form rỗng | Validation hiển thị | API 400 | P1 | S3 |
| UI-AUTH-007 | Khôi phục phiên sau F5 | Đã login | F5 | Vẫn đăng nhập | Dùng token localStorage | P0 | S2 |
| UI-AUTH-008 | Token hết hạn | Token expired | Gọi API bảo vệ | Về `/login` | API 401 + interceptor xử lý | P0 | S1 |
| UI-AUTH-009 | Tự logout khi không hoạt động | Đang login | Chờ >5 phút | Auto logout | Xóa localStorage | P1 | S2 |
| UI-AUTH-010 | Chặn route sai vai trò | Login sinh viên | Vào `/admin/dashboard` | Redirect về khu sinh viên | Guard hoạt động đúng | P0 | S2 |

### 9.2 Luồng Admin
| ID | Tiêu đề | Điều kiện | Bước chạy | Kỳ vọng UI | Kỳ vọng API/DB | Ưu tiên | Mức độ |
|---|---|---|---|---|---|---|---|
| UI-ADM-001 | Dashboard tải số liệu | Admin login | Mở dashboard | Card + activity hiển thị | `GET /admin/stats` 200 | P0 | S2 |
| UI-ADM-002 | Lọc activity | Có dữ liệu activity | Chọn all/fraud/success | Dòng lọc đúng | Không đổi DB | P2 | S4 |
| UI-ADM-003 | Tạo sinh viên thủ công | Admin login | Nhập form tạo SV | Báo thành công, có dòng mới | `POST /sinhvien` 201 + DB insert | P0 | S1 |
| UI-ADM-004 | Cập nhật sinh viên | SV tồn tại | Sửa thông tin | Danh sách cập nhật | `PUT /sinhvien/{id}` | P0 | S2 |
| UI-ADM-005 | Xóa sinh viên | SV không vướng FK | Xóa SV | Mất khỏi danh sách | `DELETE /sinhvien/{id}` | P1 | S2 |
| UI-ADM-006 | Import SV bằng Excel | Có file hợp lệ | Upload | Có summary import | `POST /sinhvien/import` + DB batch insert | P0 | S2 |
| UI-ADM-007 | Tạo giảng viên | Admin login | Thêm GV | Hiển thị GV mới | `POST /giangvien` + DB insert | P0 | S1 |
| UI-ADM-008 | Khóa/mở giảng viên | GV tồn tại | Sửa `TrangThai` | Badge thay đổi đúng | `PUT /giangvien/{id}` + DB update | P0 | S1 |
| UI-ADM-009 | Tạo môn học | Admin login | Thêm môn | Có môn mới | `POST /monhocs` | P1 | S2 |
| UI-ADM-010 | Tạo lớp + auto lịch | Có môn + GV | Tạo lớp với `SoBuoiHoc` | Có class card | `POST /lophoc`, DB sinh đủ N buổi | P0 | S1 |
| UI-ADM-011 | Xóa lớp + dữ liệu liên đới | Lớp có buổi/điểm danh | Xóa lớp | Lớp biến mất | `DELETE /lophoc/{id}` + cleanup | P0 | S1 |
| UI-ADM-012 | Thêm SV vào lớp | Có lớp + SV | Add from class screen | SV xuất hiện | `POST /lophoc/{maLop}/add-new-student` | P0 | S2 |
| UI-ADM-013 | Gỡ SV khỏi lớp | SV có trong lớp | Remove student | SV mất khỏi lớp | `DELETE /lophoc/{maLop}/remove-student/{maSv}` + xóa điểm danh liên quan | P0 | S1 |
| UI-ADM-014 | Reset passkey/thiết bị | SV đã bind passkey | Bấm reset | Báo thành công | `POST /giangvien/{maSv}/reset-device` + passkey null | P0 | S1 |

### 9.3 Luồng Giảng viên
| ID | Tiêu đề | Điều kiện | Bước chạy | Kỳ vọng UI | Kỳ vọng API/DB | Ưu tiên | Mức độ |
|---|---|---|---|---|---|---|---|
| UI-LEC-001 | Dashboard giảng viên | Login GV | Mở dashboard | Có metrics + warning list | `GET /diemdanh/lecturer-stats/{maGv}` | P0 | S2 |
| UI-LEC-002 | Quản lý buổi học | Có lớp | Mở sessions | Có danh sách buổi | `GET /buoihoc/class/{maLop}` | P0 | S2 |
| UI-LEC-003 | Thêm buổi bù | Có lớp | Thêm session | Session tăng | `POST /buoihoc` | P1 | S2 |
| UI-LEC-004 | Xóa buổi | Có buổi | Xóa session | Card biến mất | `DELETE /buoihoc/{id}` | P1 | S2 |
| UI-LEC-005 | Mở QR có GPS | Cho phép GPS | Start QR | QR + countdown hiển thị | `PUT /buoihoc/{id}/status` có lat/lng | P0 | S1 |
| UI-LEC-006 | Mở QR từ chối GPS | Deny GPS | Start QR | Có cảnh báo nhưng vẫn mở | `PUT status` không tọa độ | P1 | S3 |
| UI-LEC-007 | QR tự đổi 30s | QR đang chạy | Quan sát 31s | Token đổi | `GET /buoihoc/{id}/qr-token` gọi định kỳ | P0 | S1 |
| UI-LEC-008 | Chốt phiên điểm danh | QR đang chạy | Stop | Trạng thái kết thúc | `PUT status=2` | P0 | S2 |
| UI-LEC-009 | Lưu sổ tay điểm danh | Có SV + session | Sửa trạng thái và lưu | Báo thành công | `POST /diemdanh/bulk-update` + DB upsert | P0 | S1 |
| UI-LEC-010 | Xuất Excel theo buổi | Có dữ liệu buổi | Export | Tải file | `GET /excel/session/{id}` | P1 | S3 |
| UI-LEC-011 | Xuất Excel toàn kỳ | Có dữ liệu lớp | Export | Tải file | `GET /excel/class/{maLop}` | P1 | S3 |
| UI-LEC-012 | Cập nhật hồ sơ GV | GV tồn tại | Sửa email/sđt | Lưu thành công | `PUT /giangvien/{id}` | P1 | S3 |
| UI-LEC-013 | Đổi mật khẩu GV | Old pass đúng | Submit form | Thành công | `POST /auth/change-password` | P1 | S3 |
| UI-LEC-014 | Danh sách khiếu nại | Có khiếu nại | Mở trang appeals | Hiện pending/resolved | `GET /phanhoi/lecturer/{maGv}` | P0 | S2 |
| UI-LEC-015 | Duyệt khiếu nại | Có pending appeal | Approve | Appeal cập nhật trạng thái | `PUT /phanhoi/{id}/resolve` status=1 + DiemDanh=1 | P0 | S1 |
| UI-LEC-016 | Từ chối khiếu nại | Có pending appeal | Reject | Appeal rejected | `PUT /phanhoi/{id}/resolve` status=2 | P0 | S2 |

### 9.4 Luồng Sinh viên
| ID | Tiêu đề | Điều kiện | Bước chạy | Kỳ vọng UI | Kỳ vọng API/DB | Ưu tiên | Mức độ |
|---|---|---|---|---|---|---|---|
| UI-STU-001 | Dashboard SV | Có lịch sử điểm danh | Mở dashboard | Card thống kê đúng | `GET /diemdanh/student/{maSv}` | P0 | S2 |
| UI-STU-002 | Bật scanner QR | Cho phép camera | Mở scanner | Camera mở | Scanner khởi động | P0 | S2 |
| UI-STU-003 | Quét QR sai định dạng | Scanner chạy | Quét QR lạ | Báo lỗi | Không gọi checkin API | P1 | S3 |
| UI-STU-004 | Checkin thành công | Buổi mở, token hợp lệ, có passkey, trong bán kính | Quét + xác thực | Màn hình thành công | assertion-options 200 + assertion-verify 200 + DB status=1 | P0 | S1 |
| UI-STU-005 | Checkin fail do từ chối GPS | Buổi mở | Từ chối geolocation | Fail message | Không có verify thành công | P0 | S2 |
| UI-STU-006 | Checkin fail do QR hết hạn | Dùng token cũ | Checkin | Fail message | assertion-options 400 | P0 | S1 |
| UI-STU-007 | Checkin ngoài phạm vi >60m | Có tọa độ gốc lớp | Checkin từ xa | Fraud message | assertion-options 403 + DB status=5 | P0 | S1 |
| UI-STU-008 | Checkin trùng buổi | Đã checkin trước đó | Checkin lại | Duplicate error | assertion-options 400 | P0 | S2 |
| UI-STU-009 | Đăng ký passkey lần đầu | SV chưa có passkey | Trigger register | Thành công | register-options + register-verify, DB passkey set | P0 | S1 |
| UI-STU-010 | Đăng ký passkey khi đã có | SV đã có passkey | Register lại | Bị chặn | register-options 400 | P0 | S1 |
| UI-STU-011 | Đăng ký bằng thiết bị đã bind SV khác | DeviceUUID đã dùng | Register | Bị chặn | register-options 400 | P0 | S1 |
| UI-STU-012 | Cập nhật profile SV | SV tồn tại | Sửa email/sđt | Lưu thành công | `PUT /sinhvien/{id}` | P1 | S3 |
| UI-STU-013 | Upload avatar hợp lệ | jpg/png <=5MB | Upload | Lưu thành công | `POST /sinhvien/{id}/upload-avatar` 200 | P1 | S3 |
| UI-STU-014 | Upload avatar lỗi định dạng/kích thước | .pdf hoặc >5MB | Upload | Báo lỗi | API 400 | P1 | S3 |
| UI-STU-015 | Đổi mật khẩu SV | Old pass đúng | Submit | Thành công | `POST /auth/change-password` | P1 | S3 |
| UI-STU-016 | Xem lớp của tôi | SV có lớp | Mở classes | Hiển thị lớp | `GET /sinhvien/{maSv}/classes` | P1 | S3 |
| UI-STU-017 | Gửi khiếu nại thành công | Có bản ghi điểm danh đủ điều kiện | Submit complaint | Thành công, vào history | `POST /phanhoi` 201 + DB insert | P0 | S2 |
| UI-STU-018 | Chặn gửi khiếu nại trùng pending | Đã có pending complaint | Gửi lại cùng MaDiemDanh | Báo conflict | `POST /phanhoi` 409 | P0 | S2 |
| UI-STU-019 | Xem lịch sử khiếu nại | Có complaint | Mở tab history | Trạng thái hiển thị đúng | `GET /phanhoi/student/{maSv}` | P1 | S3 |

## 10) Test BackEnd API theo endpoint

### 10.1 AuthController
- API-AUTH-LOGIN-001..009: kiểm tra login admin/GV/SV, khóa tài khoản, thiếu field, sai mật khẩu, payload xấu.
- API-AUTH-CHG-001..005: đổi mật khẩu cho 3 role, sai old pass, new pass rỗng.

### 10.2 AdminController
- API-ADM-STATS-001..004: dữ liệu thường, dữ liệu rỗng, giới hạn 10 activity, exception path.

### 10.3 BuoiHocController
- API-BH-GET-001..002: lấy chi tiết buổi.
- API-BH-CLS-001..003: lấy danh sách buổi theo lớp.
- API-BH-CREATE-001..002: tạo buổi bù.
- API-BH-TODAY-001..002: buổi hôm nay theo giảng viên.
- API-BH-STATUS-001..003: mở/chốt phiên điểm danh.
- API-BH-DEL-001..002: xóa buổi.
- API-BH-QR-001..003: token QR động 30s.

### 10.4 DiemDanhController
- API-DD-STU-001..003: lịch sử điểm danh sinh viên.
- API-DD-SES-001..002: điểm danh theo buổi.
- API-DD-BULK-001..004: bulk update/upsert.
- API-DD-LSTAT-001..003: thống kê giảng viên + ngưỡng cảnh báo.

### 10.5 ExcelExportController
- API-EX-SES-001..003: xuất excel theo buổi.
- API-EX-CLS-001..003: xuất excel toàn kỳ.

### 10.6 GiangVienController
- API-GV-GETALL-001, API-GV-GET-001..002.
- API-GV-CREATE-001..002.
- API-GV-RESET-001..002.
- API-GV-UPD-001..003.
- API-GV-DEL-001..002.

### 10.7 LopHocController
- API-LH-GETALL-001..002.
- API-LH-CREATE-001..002.
- API-LH-ADD-001..005.
- API-LH-STU-001..002.
- API-LH-ADDNEW-001..004.
- API-LH-IMP-001..003.
- API-LH-REM-001..003.
- API-LH-DEL-001..002.

### 10.8 MonHocsController
- API-MH-GETALL-001.
- API-MH-GET-001..002.
- API-MH-CREATE-001..002.
- API-MH-UPD-001..002.
- API-MH-DEL-001..002.

### 10.9 PhanHoiController
- API-PH-CREATE-001..004.
- API-PH-STU-001..002.
- API-PH-LEC-001..002.
- API-PH-RES-001..005.

### 10.10 SinhVienController
- API-SV-GETALL-001.
- API-SV-GET-001..002.
- API-SV-CREATE-001..004.
- API-SV-IMP-001..002.
- API-SV-UPD-001..002.
- API-SV-DEL-001..002.
- API-SV-CLS-001..003.
- API-SV-AVT-001..005.

### 10.11 WebAuthnController
- API-WA-ROPT-001..005: register-options.
- API-WA-RVER-001..003: register-verify.
- API-WA-AOPT-001..006: assertion-options (gồm QR/GPS/fraud path).
- API-WA-AVER-001..003: assertion-verify (thành công/sai chữ ký/replay).

## 11) Test toàn vẹn dữ liệu DB
| ID | Kiểm tra | Bước | Kỳ vọng |
|---|---|---|---|
| DB-INT-001 | Unique điểm danh | Chèn trùng `(MaBuoiHoc, MaSV)` | Bị DB chặn |
| DB-INT-002 | FK lớp-môn | Xóa môn đang dùng | Bị FK chặn |
| DB-INT-003 | FK điểm danh-buổi | Xóa buổi có điểm danh không qua cleanup | Bị chặn hoặc fail đúng |
| DB-INT-004 | Quan hệ phản hồi | Xóa attendance có phản hồi | Đúng theo FK/cascade |
| DB-INT-005 | Unique logic DeviceUUID | Bind 1 device cho 2 SV qua API | Lần 2 bị chặn |

## 12) Test bảo mật
| ID | Loại | Mục tiêu | Bước | Kỳ vọng |
|---|---|---|---|---|
| SEC-001 | Injection | Login | SQLi payload | Không bypass, không crash |
| SEC-002 | Tamper | Checkin | Sửa token QR URL | Bị reject |
| SEC-003 | Replay | Checkin | Dùng token QR cũ | Bị reject |
| SEC-004 | Replay | Passkey assertion | Reuse assertion cũ | Bị reject |
| SEC-005 | Spoof thiết bị | Register | Dùng DeviceUUID của SV khác | Bị reject |
| SEC-006 | AuthZ | API bảo vệ | Gọi API không token | Bị chặn (yêu cầu hardening) |

## 13) Test đồng thời & độ ổn định
| ID | Kịch bản | Cách chạy | Kỳ vọng |
|---|---|---|---|
| PERF-001 | 100 SV checkin cùng phút | Gọi song song | Không trùng điểm danh, latency chấp nhận được |
| PERF-002 | Bulk-update đồng thời checkin | Gọi hỗn hợp | Dữ liệu nhất quán, không deadlock |
| REL-001 | Mất kết nối DB tạm thời | Chaos test | API fail graceful, không corrupt dữ liệu |
| REL-002 | Mất mạng khi checkin | Mô phỏng offline FE | UI có thông báo và retry path rõ |
| REL-003 | Timeout GPS | Giả lập geolocation timeout | Không báo thành công giả |

## 14) Danh sách regression trọng điểm
1. Rủi ro route FE truyền `maLop` thay vì `maBuoiHoc` ở vài màn GV.
2. Nhiều API chưa gắn `[Authorize]` (cần verify và raise blocker).
3. Bộ integration test cũ còn tham chiếu endpoint/field không còn dùng.
4. Secret hardcode trong config phải được coi là release blocker.

## 15) Ưu tiên tự động hóa
- Tier 1: login/auth, quyết định anti-fraud checkin, resolve khiếu nại.
- Tier 2: CRUD học vụ (SV/GV/môn/lớp/buổi).
- Tier 3: nội dung file excel, kiểm tra giao diện.

## 16) Tiêu chí kết thúc test
1. 100% testcase P0/P1 pass.
2. 0 lỗi S1 mở, tối đa 2 lỗi S2 đã chấp thuận workaround.
3. Không có vi phạm toàn vẹn dữ liệu DB.
4. Luồng anti-fraud pass trên staging HTTPS với thiết bị thật.

## 17) Deliverables
- Báo cáo chạy test theo suite + severity.
- Bộ bằng chứng API (request/response log).
- Script kiểm tra DB + snapshot trước/sau.
- Danh sách lỗi có bước tái hiện rõ ràng.

