using System;
using System.Collections.Generic;

namespace DiemDanhLopHoc.Models
{
    public partial class BuoiHoc
    {
        public BuoiHoc()
        {
            DiemDanhs = new HashSet<DiemDanh>();
        }

        public int MaBuoiHoc { get; set; }
        public string? MaLop { get; set; }
        public DateTime? NgayHoc { get; set; }
        public TimeSpan? GioBatDau { get; set; }
        public TimeSpan? GioKetThuc { get; set; }
        public string? GhiChu { get; set; }
        public double? ToaDoGocLat { get; set; }
        public double? ToaDoGocLong { get; set; }

        public virtual LopHoc? MaLopNavigation { get; set; }
        public virtual ICollection<DiemDanh> DiemDanhs { get; set; }
    }
}
