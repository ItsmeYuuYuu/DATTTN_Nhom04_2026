using System;
using System.Collections.Generic;

namespace DiemDanhLopHoc.Models
{
    public partial class MonHoc
    {
        public MonHoc()
        {
            LopHocs = new HashSet<LopHoc>();
        }

        public string MaMon { get; set; } = null!;
        public string TenMon { get; set; } = null!;

        public virtual ICollection<LopHoc> LopHocs { get; set; }
    }
}
