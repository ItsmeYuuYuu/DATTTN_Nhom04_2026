using System;
using System.Collections.Generic;

namespace DiemDanhLopHoc.Models
{
    public partial class DiemDanh
    {
        public int MaDiemDanh { get; set; }
        public int? MaBuoiHoc { get; set; }
        public string? MaSV { get; set; }
        public string? TrangThai { get; set; }
        public DateTime? ThoiGianQuet { get; set; }
        public string? GhiChu { get; set; }
        public string? NguoiCapNhat { get; set; }
        public string? FingerprintId { get; set; }
        public double? ToaDoSvLat { get; set; }
        public double? ToaDoSvLong { get; set; }

        public virtual BuoiHoc? MaBuoiHocNavigation { get; set; }
        public virtual SinhVien? MaSVNavigation { get; set; }
    }
}
