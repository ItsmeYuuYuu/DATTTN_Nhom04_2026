using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace DiemDanhLopHoc.Models
{
    public partial class QuanLyLopHocContext : DbContext
    {
        public QuanLyLopHocContext()
        {
        }

        public QuanLyLopHocContext(DbContextOptions<QuanLyLopHocContext> options)
            : base(options)
        {
        }

        public virtual DbSet<BuoiHoc> BuoiHocs { get; set; } = null!;
        public virtual DbSet<DiemDanh> DiemDanhs { get; set; } = null!;
        public virtual DbSet<GiangVien> GiangViens { get; set; } = null!;
        public virtual DbSet<LopHoc> LopHocs { get; set; } = null!;
        public virtual DbSet<QuanTriVien> QuanTriViens { get; set; } = null!;
        public virtual DbSet<SinhVien> SinhViens { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=localhost;Database=QuanLyLopHoc;Trusted_Connection=True;TrustServerCertificate=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BuoiHoc>(entity =>
            {
                entity.HasKey(e => e.MaBuoiHoc)
                    .HasName("PK__BuoiHoc__53302506CE48FFCF");

                entity.ToTable("BuoiHoc");

                entity.Property(e => e.GhiChu).HasMaxLength(255);

                entity.Property(e => e.MaLop)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.NgayHoc)
                    .HasColumnType("date")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.ToaDoGocLat).HasColumnName("ToaDoGoc_Lat");

                entity.Property(e => e.ToaDoGocLong).HasColumnName("ToaDoGoc_Long");

                entity.HasOne(d => d.MaLopNavigation)
                    .WithMany(p => p.BuoiHocs)
                    .HasForeignKey(d => d.MaLop)
                    .HasConstraintName("FK__BuoiHoc__MaLop__5AEE82B9");
            });

            modelBuilder.Entity<DiemDanh>(entity =>
            {
                entity.HasKey(e => e.MaDiemDanh)
                    .HasName("PK__DiemDanh__1512439D372BCC1F");

                entity.ToTable("DiemDanh");

                entity.HasIndex(e => new { e.MaBuoiHoc, e.MaSV }, "UNIQUE_SV_PER_SESSION")
                    .IsUnique();

                entity.Property(e => e.FingerprintId)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("FingerprintID");

                entity.Property(e => e.GhiChu).HasMaxLength(255);

                entity.Property(e => e.MaSV)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("MaSV");

                entity.Property(e => e.NguoiCapNhat).HasMaxLength(100);

                entity.Property(e => e.ThoiGianQuet)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.ToaDoSvLat).HasColumnName("ToaDoSV_Lat");

                entity.Property(e => e.ToaDoSvLong).HasColumnName("ToaDoSV_Long");

                entity.Property(e => e.TrangThai).HasMaxLength(50);

                entity.HasOne(d => d.MaBuoiHocNavigation)
                    .WithMany(p => p.DiemDanhs)
                    .HasForeignKey(d => d.MaBuoiHoc)
                    .HasConstraintName("FK__DiemDanh__MaBuoi__5FB337D6");

                entity.HasOne(d => d.MaSVNavigation)
                    .WithMany(p => p.DiemDanhs)
                    .HasForeignKey(d => d.MaSV)
                    .HasConstraintName("FK__DiemDanh__MaSV__60A75C0F");
            });

            modelBuilder.Entity<GiangVien>(entity =>
            {
                entity.HasKey(e => e.MaGV)
                    .HasName("PK__GiangVie__2725AEF36B26DDC9");

                entity.ToTable("GiangVien");

                entity.HasIndex(e => e.TaiKhoan, "UQ__GiangVie__D5B8C7F0893D3994")
                    .IsUnique();

                entity.Property(e => e.MaGV)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("MaGV");

                entity.Property(e => e.Email)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.HoTen).HasMaxLength(100);

                entity.Property(e => e.MatKhau)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.SoDienThoai)
                    .HasMaxLength(15)
                    .IsUnicode(false);

                entity.Property(e => e.TaiKhoan)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.TrangThai).HasDefaultValueSql("((1))");
            });

            modelBuilder.Entity<LopHoc>(entity =>
            {
                entity.HasKey(e => e.MaLop)
                    .HasName("PK__LopHoc__3B98D27318AF637F");

                entity.ToTable("LopHoc");

                entity.Property(e => e.MaLop)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.MaGV)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("MaGV");

                entity.Property(e => e.MonHoc).HasMaxLength(100);

                entity.Property(e => e.TenLop).HasMaxLength(100);

                entity.HasOne(d => d.MaGVNavigation)
                    .WithMany(p => p.LopHocs)
                    .HasForeignKey(d => d.MaGV)
                    .HasConstraintName("FK__LopHoc__MaGV__5441852A");

                entity.HasMany(d => d.MaSVs)
                    .WithMany(p => p.MaLops)
                    .UsingEntity<Dictionary<string, object>>(
                        "ChiTietLopHoc",
                        l => l.HasOne<SinhVien>().WithMany().HasForeignKey("MaSV").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK__ChiTietLop__MaSV__5812160E"),
                        r => r.HasOne<LopHoc>().WithMany().HasForeignKey("MaLop").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK__ChiTietLo__MaLop__571DF1D5"),
                        j =>
                        {
                            j.HasKey("MaLop", "MaSV").HasName("PK__ChiTietL__89EA82F2E1649642");

                            j.ToTable("ChiTietLopHoc");

                            j.IndexerProperty<string>("MaLop").HasMaxLength(20).IsUnicode(false);

                            j.IndexerProperty<string>("MaSV").HasMaxLength(20).IsUnicode(false).HasColumnName("MaSV");
                        });
            });

            modelBuilder.Entity<QuanTriVien>(entity =>
            {
                entity.HasKey(e => e.MaQTV)
                    .HasName("PK__QuanTriV__396E9996DF657E64");

                entity.ToTable("QuanTriVien");

                entity.HasIndex(e => e.TaiKhoan, "UQ__QuanTriV__D5B8C7F0980A99F1")
                    .IsUnique();

                entity.Property(e => e.MaQTV)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("MaQTV");

                entity.Property(e => e.HoTen).HasMaxLength(100);

                entity.Property(e => e.MatKhau)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.TaiKhoan)
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<SinhVien>(entity =>
            {
                entity.HasKey(e => e.MaSV)
                    .HasName("PK__SinhVien__2725081A4D152F2E");

                entity.ToTable("SinhVien");

                entity.HasIndex(e => e.TaiKhoan, "UQ__SinhVien__D5B8C7F088FA120D")
                    .IsUnique();

                entity.Property(e => e.MaSV)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("MaSV");

                entity.Property(e => e.AnhDaiDien)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Email)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.HoTen).HasMaxLength(100);

                entity.Property(e => e.MatKhau)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.NgaySinh).HasColumnType("date");

                entity.Property(e => e.SoDienThoai)
                    .HasMaxLength(15)
                    .IsUnicode(false);

                entity.Property(e => e.TaiKhoan)
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
