using System;
using System.Collections.Generic;

namespace DiemDanhLopHoc.Models
{
    public partial class LopHoc
    {
        public LopHoc()
        {
            BuoiHocs = new HashSet<BuoiHoc>();
            MaSVs = new HashSet<SinhVien>();
        }

        public string MaLop { get; set; } = null!;
        public string TenLop { get; set; } = null!;
        public string? MonHoc { get; set; }
        public string? MaGV { get; set; }

        public virtual GiangVien? MaGVNavigation { get; set; }
        public virtual ICollection<BuoiHoc> BuoiHocs { get; set; }

        public virtual ICollection<SinhVien> MaSVs { get; set; }

        public ICollection<ChiTietLopHoc> ChiTietLopHocs { get; set; }
    }
}
