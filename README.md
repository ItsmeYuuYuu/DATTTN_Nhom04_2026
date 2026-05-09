# 🎓 STUNexus — Hệ thống Điểm danh Sinh viên Chống gian lận
### ĐATN Nhóm 04 — 2026

[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](#)
[![SQL Server](https://img.shields.io/badge/SQL_Server-CC2927?logo=microsoft-sql-server&logoColor=white)](#)
[![WebAuthn](https://img.shields.io/badge/WebAuthn-FIDO2-blue?logo=webauthn&logoColor=white)](#)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel&logoColor=white)](#)

Giải pháp tự động hóa và minh bạch hóa quy trình điểm danh tại giảng đường. Hệ thống kết hợp **mã QR động (TOTP 30s)** + **GPS bán kính 60m** + **Passkey sinh trắc học (FIDO2/WebAuthn)** để ngăn chặn tuyệt đối các hành vi gian lận như điểm danh hộ, điểm danh từ xa, hay mượn thiết bị.

---

## 🌟 Tính năng nổi bật

### 👨‍🏫 Dành cho Giảng viên
- **Lịch học Tự động (Auto-Scheduling):** Thiết lập tham số đầu kỳ (ngày bắt đầu, số buổi, thứ trong tuần), hệ thống tự sinh toàn bộ lịch học kỳ.
- **Phiên Điểm danh (Dynamic QR):** Trình chiếu mã QR **tự động làm mới mỗi 30 giây** lên màn hình lớp học.
- **Theo dõi Real-time:** Cập nhật trạng thái điểm danh sinh viên ngay lập tức không cần tải lại trang (WebSocket / SignalR).
- **Xử lý Ngoại lệ:** Báo nghỉ, xếp lịch học bù, can thiệp điểm danh thủ công.
- **Import Hàng loạt:** Nhập danh sách sinh viên bằng file Excel (`.xlsx`).
- **Thống kê & Báo cáo:** Biểu đồ chuyên cần trực quan theo từng lớp, từng buổi.
- **Reset Thiết bị:** Giải phóng khóa thiết bị cho sinh viên đổi điện thoại.

### 👨‍🎓 Dành cho Sinh viên
- **Điểm danh bằng QR:** Quét mã QR trên màn hình giảng viên bằng điện thoại.
- **Xác thực Sinh trắc học (Passkey):** Dùng **vân tay / FaceID / Windows Hello** để xác nhận danh tính trong quá trình điểm danh — không cần nhập mật khẩu.
- **Tra cứu Lịch sử:** Xem chi tiết trạng thái đi học từng buổi học.
- **Khiếu nại Trực tuyến:** Gửi phản hồi đến giảng viên nếu phát hiện sai sót.

### 🖥️ Dành cho Quản trị viên
- **Dashboard Thông minh:** Bộ lọc nhanh hoạt động điểm danh **"Nghi vấn gian lận"** nổi bật màu đỏ tức thì.
- **Quản lý toàn hệ thống:** Sinh viên, Giảng viên, Môn học, Lớp học.
- **Giám sát Bảo mật:** Xem log điểm danh, xử lý các ca nghi vấn.

---

## 🛡️ Cơ chế Chống gian lận 3 Lớp

| Lớp | Tên | Mô tả |
|-----|-----|--------|
| **1** | 🔲 **QR Động (TOTP)** | Token thay đổi mỗi 30 giây — vô hiệu hóa việc chụp ảnh QR gửi bạn bè. |
| **2** | 📍 **GPS Bán kính 60m** | Tính khoảng cách Haversine giữa thiết bị sinh viên và tọa độ phòng học — chặn điểm danh từ xa. |
| **3** | 🔐 **Passkey (FIDO2/WebAuthn)** | Khóa cứng 1 tài khoản — 1 thiết bị vật lý duy nhất bằng chip bảo mật phần cứng. Không thể sao chép hay giả mạo. |

### Cơ chế khóa thiết bị chi tiết (Lớp 3)
- Khi sinh viên đăng ký Passkey lần đầu, hệ thống ghi nhận **DeviceUUID** của trình duyệt và lưu cả **Credential FIDO2** vào chip bảo mật của thiết bị.
- **Chốt chặn 1 — Chống ghi đè tài khoản:** Nếu tài khoản đã có Passkey, mọi yêu cầu đăng ký mới bị từ chối. Sinh viên phải yêu cầu Giảng viên "Reset" nếu đổi máy.
- **Chốt chặn 2 — Chống mượn máy:** Nếu một DeviceUUID đã được gắn với tài khoản khác, hệ thống chặn ngay, không cho đăng ký thêm.
- **Xác thực phần cứng:** Khi điểm danh, trình duyệt yêu cầu chip TPM/Secure Enclave **ký số** bản xác nhận. Không thể làm giả chữ ký này dù đã biết DeviceUUID.

---

## 🛠️ Công nghệ sử dụng

### Backend
| Công nghệ | Mục đích |
|-----------|----------|
| **C# / ASP.NET Core Web API (.NET 8)** | Framework chính xây dựng REST API |
| **Entity Framework Core** | ORM — tương tác với SQL Server |
| **Microsoft SQL Server** | Cơ sở dữ liệu quan hệ |
| **JWT (JSON Web Token)** | Xác thực & phân quyền (Admin / Lecturer / Student) |
| **Fido2NetLib** | Thư viện xử lý WebAuthn/FIDO2 phía Server |
| **SignalR** | Real-time WebSocket cho cập nhật điểm danh trực tiếp |
| **Cloudinary** | Lưu trữ ảnh đại diện sinh viên |

### Frontend
| Công nghệ | Mục đích |
|-----------|----------|
| **React 19 + Vite 8** | Framework UI và build tool |
| **@simplewebauthn/browser** | Thư viện WebAuthn phía Client (đăng ký & xác thực Passkey) |
| **React Router v7** | Điều hướng & phân quyền theo role |
| **Axios** | HTTP Client gọi Backend API |
| **Bootstrap 5** | CSS framework giao diện |
| **html5-qrcode** | Quét mã QR bằng camera điện thoại |
| **qrcode.react** | Sinh mã QR hiển thị cho giảng viên |
| **xlsx** | Đọc & xuất file Excel |
| **react-icons** | Bộ icon giao diện |

### Triển khai
| Môi trường | Dịch vụ |
|------------|---------|
| **Frontend** | Vercel (CDN toàn cầu) |
| **Backend API** | SmarterASP / Render / IIS |
| **Database** | SQL Server trên Cloud |

---

## 📂 Cấu trúc dự án

```
DATTTN_NHOM04_2026/
├── BackEnd/
│   └── DiemDanhLopHoc/
│       ├── Controllers/
│       │   ├── AuthController.cs       # Đăng nhập, đổi mật khẩu
│       │   ├── WebAuthnController.cs   # Đăng ký & xác thực Passkey (FIDO2)
│       │   ├── GiangVienController.cs  # Quản lý GV + Reset thiết bị SV
│       │   ├── SinhVienController.cs   # Quản lý Sinh viên
│       │   ├── LopHocController.cs     # Quản lý Lớp học & Buổi học
│       │   ├── DiemDanhController.cs   # Logic điểm danh (QR + GPS + Passkey)
│       │   └── AdminController.cs      # Dashboard & thống kê Admin
│       ├── Models/                     # Entity models (SinhVien, BuoiHoc, DiemDanh...)
│       ├── DTOs/                       # Data Transfer Objects
│       ├── Data/
│       │   └── AppDbContext.cs         # EF Core DbContext
│       └── Utils/
│           └── TimeUtils.cs            # Tiện ích múi giờ Việt Nam (UTC+7)
│
└── FrontEnd/
    └── STUNexus/
        └── src/
            ├── context/
            │   └── AuthContext.jsx     # Session JWT + Passkey registration
            ├── layouts/
            │   ├── AdminLayout.jsx
            │   ├── LecturerLayout.jsx
            │   └── StudentLayout.jsx
            ├── components/
            │   ├── Header.jsx
            │   ├── Sidebar.jsx          # Admin sidebar
            │   ├── LecturerSidebar.jsx
            │   └── StudentSidebar.jsx
            └── pages/
                ├── admin/
                ├── lecturer/
                └── student/
                    ├── StudentDashboard.jsx
                    ├── StudentCheckin.jsx   # Trang xác thực QR + GPS + Passkey
                    └── StudentProfile.jsx   # Quản lý Passkey cá nhân
```

---

## 🚀 Hướng dẫn chạy dự án

### Yêu cầu
- .NET 8 SDK
- Node.js 18+
- SQL Server (LocalDB hoặc Express)

### Backend
```bash
cd BackEnd/DiemDanhLopHoc
# Cập nhật chuỗi kết nối trong appsettings.json
dotnet run
# API chạy tại: https://localhost:7xxx
Hoặc
Mở folder BackEnd → double click file DiemDanhLopHoc.sln để mở bằng Visual Studio.
Trong Solution Explorer, tìm file appsettings.json (trong project DiemDanhLopHoc).
Sửa ConnectionStrings cho đúng:
JSON
"ConnectionStrings": {
  "DefaultConnection": "Server=.;Database= QuanLyDiemDanh.sql;Trusted_Connection=True;TrustServerCertificate=True;"
}
Server=. hoặc (localdb)\MSSQLLocalDB nếu dùng LocalDB.
Thay tên QuanLyDiemDanh.sql bằng tên DB vừa tạo.
Build solution (Ctrl + Shift + B). Nếu lỗi package thì Restore NuGet Packages.
Nhấn F5 (hoặc IIS Express) để chạy.
→ Backend thường chạy ở https://localhost:7xxx hoặc http://localhost:5xxx. Ghi lại port này.
```

### Cập nhật Database (lần đầu hoặc sau khi thêm cột mới)
```bash
Mở SSMS, kết nối với SQL Server (LocalDB hoặc Express).
Vào folder Database trong repo.
Tìm file script SQL QuanLyDiemDanh.sql.
Mở file đó trong SSMS → Execute (F5) toàn bộ để tạo database + tables + data mẫu.
```

### Frontend
```bash
Mở VS Code, mở folder FrontEnd/STUNexus.
Mở terminal trong VS Code (`Ctrl + ``) và chạy lần lượt:
npm install
npm run dev
→ FE sẽ chạy ở http://localhost:5173 (Vite mặc định).
Config API URL:
Tìm file config (thường trong src/config.js, env, hoặc axios instance).
Đổi baseURL thành địa chỉ Backend vừa chạy (ví dụ: https://localhost:7123 hoặc port tương ứng).
```

> ⚠️ **Lưu ý:** WebAuthn (Passkey) **bắt buộc phải chạy trên HTTPS** hoặc `localhost`. Trên Android, sinh viên cần dùng trình duyệt **Chrome** hoặc **Safari** (iOS) — các trình duyệt bên thứ ba như Cốc Cốc, Zalo In-app có thể không hỗ trợ.
## #Thứ tự chạy khuyến nghị:
- Chạy Database trước (SSMS).
- Chạy Backend (Visual Studio) → kiểm tra API bằng Swagger (thường là /swagger).
- Chạy Frontend (VS Code).
---

## 👥 Nhóm thực hiện

**Nhóm 04 — Đồ án Tốt nghiệp 2026**
