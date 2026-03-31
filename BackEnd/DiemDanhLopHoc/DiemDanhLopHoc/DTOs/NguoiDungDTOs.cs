namespace DiemDanhLopHoc.DTOs
{
    public class NguoiDungDTOs
    {
        public class GiangVienCreateRequest
        {
            public string MaGv { get; set; }
            public string TaiKhoan { get; set; }
            public string MatKhau { get; set; }
            public string HoTen { get; set; }
        }
        public class GiangVienResponse
        {
            public string MaGv { get; set; }
            public string TaiKhoan { get; set; }
            public string HoTen { get; set; }
            public bool? TrangThai { get; set; }
            //  không để MatKhau 
        }
    }
}