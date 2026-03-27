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