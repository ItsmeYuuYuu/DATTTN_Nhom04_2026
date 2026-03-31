namespace DiemDanhLopHoc.DTOs
{
    // DTO để trả về danh sách Giảng Viên (Giấu cột MatKhau)
    public class GiangVienResponseDto
    {
        public string MaGv { get; set; } = null!;
        public string TaiKhoan { get; set; } = null!;
        public string HoTen { get; set; } = null!;
        public string? Email { get; set; }
        public string? SoDienThoai { get; set; }
        public bool? TrangThai { get; set; }
    }

    // DTO để trả về danh sách Sinh Viên (Giấu cột MatKhau)
    public class SinhVienResponseDto
    {
        public string MaSv { get; set; } = null!;
        public string TaiKhoan { get; set; } = null!;
        public string HoTen { get; set; } = null!;
        public DateTime? NgaySinh { get; set; }
        public string? Email { get; set; }
        public string? SoDienThoai { get; set; }
        public string? AnhDaiDien { get; set; }
    }
}