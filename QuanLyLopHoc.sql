-- 1. Tạo Database
CREATE DATABASE QuanLyLopHoc;
GO
USE QuanLyLopHoc;
GO

-----------------------------------------------------------
-- NHÓM 1: QUẢN LÝ NGƯỜI DÙNG (USERS)
-----------------------------------------------------------
CREATE TABLE QuanTriVien (
    MaQTV VARCHAR(20) PRIMARY KEY,
    TaiKhoan VARCHAR(50) UNIQUE NOT NULL,
    MatKhau VARCHAR(255) NOT NULL,
    HoTen NVARCHAR(100)
);

CREATE TABLE GiangVien (
    MaGV VARCHAR(20) PRIMARY KEY,
    TaiKhoan VARCHAR(50) UNIQUE NOT NULL,
    MatKhau VARCHAR(255) NOT NULL,
    HoTen NVARCHAR(100) NOT NULL,
    Email VARCHAR(100),
    SoDienThoai VARCHAR(15),
    TrangThai BIT DEFAULT 1
);

CREATE TABLE SinhVien (
    MaSV VARCHAR(20) PRIMARY KEY,
    TaiKhoan VARCHAR(50) UNIQUE NOT NULL,
    MatKhau VARCHAR(255) NOT NULL,
    HoTen NVARCHAR(100) NOT NULL,
    NgaySinh DATE,
    Email VARCHAR(100),
    SoDienThoai VARCHAR(15),
    AnhDaiDien VARCHAR(255) NULL
);

-----------------------------------------------------------
-- NHÓM 2: NGHIỆP VỤ LỚP HỌC & ĐIỂM DANH (CORE)
-----------------------------------------------------------

CREATE TABLE MonHoc (
    MaMon VARCHAR(20) PRIMARY KEY,
    TenMon NVARCHAR(100) NOT NULL
);

CREATE TABLE LopHoc (
    MaLop VARCHAR(20) PRIMARY KEY,
    TenLop NVARCHAR(100) NOT NULL,
    MaMon VARCHAR(20) FOREIGN KEY REFERENCES MonHoc(MaMon),
    MaGV VARCHAR(20) FOREIGN KEY REFERENCES GiangVien(MaGV)
);

CREATE TABLE ChiTietLopHoc (
    MaLop VARCHAR(20) FOREIGN KEY REFERENCES LopHoc(MaLop),
    MaSV VARCHAR(20) FOREIGN KEY REFERENCES SinhVien(MaSV),
    PRIMARY KEY (MaLop, MaSV)
);

CREATE TABLE BuoiHoc (
    MaBuoiHoc INT IDENTITY(1,1) PRIMARY KEY,
    MaLop VARCHAR(20) FOREIGN KEY REFERENCES LopHoc(MaLop),
    NgayHoc DATE DEFAULT GETDATE(),
    GioBatDau TIME,
    GioKetThuc TIME,
    GhiChu NVARCHAR(255),
    ToaDoGoc_Lat FLOAT NULL,
    ToaDoGoc_Long FLOAT NULL
);

CREATE TABLE DiemDanh (
    MaDiemDanh INT IDENTITY(1,1) PRIMARY KEY,
    MaBuoiHoc INT FOREIGN KEY REFERENCES BuoiHoc(MaBuoiHoc),
    MaSV VARCHAR(20) FOREIGN KEY REFERENCES SinhVien(MaSV),
    TrangThai NVARCHAR(50) CHECK (TrangThai IN (N'Có mặt', N'Đi trễ', N'Vắng có phép', N'Vắng không phép')),
    ThoiGianQuet DATETIME DEFAULT GETDATE(),
    GhiChu NVARCHAR(255),
    NguoiCapNhat NVARCHAR(100),
    FingerprintID VARCHAR(255) NULL, 
    ToaDoSV_Lat FLOAT NULL,
    ToaDoSV_Long FLOAT NULL,
    CONSTRAINT UNIQUE_SV_PER_SESSION UNIQUE (MaBuoiHoc, MaSV)
);


-- Quản trị viên
INSERT INTO QuanTriVien (MaQTV, TaiKhoan, MatKhau, HoTen) VALUES 
('AD01', 'admin_super', 'hash_password_123', N'Nguyễn Quản Trị'),
('AD02', 'it_support', 'hash_password_456', N'Trần Kỹ Thuật');

-- Giảng viên
INSERT INTO GiangVien (MaGV, TaiKhoan, MatKhau, HoTen, Email, SoDienThoai, TrangThai) VALUES 
('GV001', 'thanh.nv', 'pass_gv_1', N'Nguyễn Văn Thành', 'thanh.nv@university.edu.vn', '0901234567', 1),
('GV002', 'lan.pt', 'pass_gv_2', N'Phạm Thị Lan', 'lan.pt@university.edu.vn', '0912345678', 1),
('GV003', 'dung.hoang', 'pass_gv_3', N'Hoàng Anh Dũng', 'dung.ha@university.edu.vn', '0988888888', 1);

INSERT INTO SinhVien (MaSV, TaiKhoan, MatKhau, HoTen, NgaySinh, Email, SoDienThoai) VALUES 
('SV001', '201101', 'pass_sv_1', N'Lê Minh Anh', '2002-05-15', '201101@student.edu.vn', '0345000001'),
('SV002', '201102', 'pass_sv_2', N'Trần Thu Thảo', '2002-11-20', '201102@student.edu.vn', '0345000002'),
('SV003', '201103', 'pass_sv_3', N'Nguyễn Hoàng Nam', '2002-01-10', '201103@student.edu.vn', '0345000003'),
('SV004', '201104', 'pass_sv_4', N'Phạm Bảo Châu', '2003-08-25', '201104@student.edu.vn', '0345000004'),
('SV005', '201105', 'pass_sv_5', N'Vũ Đức Trọng', '2002-03-30', '201105@student.edu.vn', '0345000005');

-- Môn học
INSERT INTO MonHoc (MaMon, TenMon) VALUES 
('CS101', N'Cơ sở dữ liệu'),
('CS102', N'Lập trình Web'),
('BA201', N'Kinh tế vĩ mô');

-- Lớp học
INSERT INTO LopHoc (MaLop, TenLop, MaMon, MaGV) VALUES 
('L01', N'Lớp CSDL - Sáng Thứ 2', 'CS101', 'GV001'),
('L02', N'Lớp Web - Chiều Thứ 4', 'CS102', 'GV002'),
('L03', N'Lớp Kinh tế - Sáng Thứ 6', 'BA201', 'GV003');

-- Chi tiết lớp học (Gán sinh viên vào lớp)
INSERT INTO ChiTietLopHoc (MaLop, MaSV) VALUES 
('L01', 'SV001'), ('L01', 'SV002'), ('L01', 'SV003'),
('L02', 'SV001'), ('L02', 'SV004'), ('L02', 'SV005'),
('L03', 'SV002'), ('L03', 'SV003'), ('L03', 'SV005');

-- Buổi học
-- Toa do 10.771, 106.698 (Gần Dinh Độc Lập làm chuẩn)
INSERT INTO BuoiHoc (MaLop, NgayHoc, GioBatDau, GioKetThuc, GhiChu, ToaDoGoc_Lat, ToaDoGoc_Long) VALUES 
('L01', '2023-10-02', '07:30:00', '11:30:00', N'Chương 1: Tổng quan', 10.7719, 106.6983),
('L01', '2023-10-09', '07:30:00', '11:30:00', N'Chương 2: Mô hình ER', 10.7719, 106.6983);

-- Điểm danh cho Buổi học 1 (MaBuoiHoc = 1)
INSERT INTO DiemDanh (MaBuoiHoc, MaSV, TrangThai, ThoiGianQuet, GhiChu, ToaDoSV_Lat, ToaDoSV_Long) VALUES 
(1, 'SV001', N'Có mặt', '2023-10-02 07:25:00', N'Đúng giờ', 10.7718, 106.6982),
(1, 'SV002', N'Đi trễ', '2023-10-02 07:45:00', N'Trễ 15p', 10.7720, 106.6984),
(1, 'SV003', N'Vắng không phép', NULL, N'Không liên lạc được', NULL, NULL);

-- Điểm danh cho Buổi học 2 (MaBuoiHoc = 2)
INSERT INTO DiemDanh (MaBuoiHoc, MaSV, TrangThai, ThoiGianQuet, GhiChu, ToaDoSV_Lat, ToaDoSV_Long) VALUES 
(2, 'SV001', N'Có mặt', '2023-10-09 07:20:00', N'Quét vân tay', 10.7719, 106.6983),
(2, 'SV002', N'Vắng có phép', NULL, N'Nghỉ ốm', NULL, NULL),
(2, 'SV003', N'Có mặt', '2023-10-09 07:28:00', N'Đúng giờ', 10.7717, 106.6981);