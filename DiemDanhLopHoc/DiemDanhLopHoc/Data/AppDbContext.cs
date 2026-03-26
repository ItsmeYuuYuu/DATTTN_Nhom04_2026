using DiemDanhLopHoc.Models;
using Microsoft.EntityFrameworkCore;

namespace DiemDanhLopHoc.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Khai báo ánh xạ các bảng vào C#
        public DbSet<QuanTriVien> QuanTriViens { get; set; }
        public DbSet<GiangVien> GiangViens { get; set; }
        public DbSet<SinhVien> SinhViens { get; set; }
        public DbSet<LopHoc> LopHocs { get; set; }
        public DbSet<ChiTietLopHoc> ChiTietLopHocs { get; set; }
        public DbSet<BuoiHoc> BuoiHocs { get; set; }
        public DbSet<DiemDanh> DiemDanhs { get; set; }

        // Cấu hình các ràng buộc đặc biệt (Fluent API)
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 1. Setup Khóa chính kép cho bảng trung gian (N-M)
            modelBuilder.Entity<ChiTietLopHoc>()
                .HasKey(c => new { c.MaLop, c.MaSV });

            // 2. Ràng buộc quan trọng: 1 SV chỉ có tối đa 1 dòng điểm danh trong 1 Buổi học (Anti-spam)
            modelBuilder.Entity<DiemDanh>()
                .HasIndex(d => new { d.MaBuoiHoc, d.MaSV })
                .IsUnique();

            // 3. Setup các cột Tài khoản không được trùng nhau
            modelBuilder.Entity<QuanTriVien>().HasIndex(u => u.TaiKhoan).IsUnique();
            modelBuilder.Entity<GiangVien>().HasIndex(u => u.TaiKhoan).IsUnique();
            modelBuilder.Entity<SinhVien>().HasIndex(u => u.TaiKhoan).IsUnique();
        }
    }
}