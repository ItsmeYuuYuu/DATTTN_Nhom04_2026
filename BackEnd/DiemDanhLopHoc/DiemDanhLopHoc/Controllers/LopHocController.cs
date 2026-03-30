using DiemDanhLopHoc.Data;
using DiemDanhLopHoc.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DiemDanhLopHoc.Controllers
{
    [Route("api/lophoc")]
    [ApiController]
    public class LopHocController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LopHocController(AppDbContext context)
        {
            _context = context;
        }

        // --- DTOs ---

        // DTO trả về danh sách lớp học (kèm tên môn và tên giảng viên)
        public class LopHocDto
        {
            public string MaLop { get; set; } = null!;
            public string TenLop { get; set; } = null!;
            public string? MaMon { get; set; }
            public string? TenMon { get; set; }
            public string? MaGv { get; set; }
            public string? TenGiangVien { get; set; }
        }

        // DTO nhận dữ liệu khi tạo lớp mới
        public class TaoLopHocRequest
        {
            public string MaLop { get; set; } = null!;
            public string TenLop { get; set; } = null!;
            public string? MaMon { get; set; }
            public string? MaGv { get; set; }
        }

        // DTO nhận mã sinh viên khi thêm vào lớp
        public class ThemSinhVienRequest
        {
            public string MaSv { get; set; } = null!;
        }

        // DTO trả về thông tin sinh viên trong lớp
        public class SinhVienDto
        {
            public string MaSv { get; set; } = null!;
            public string HoTen { get; set; } = null!;
            public string? Email { get; set; }
            public string? SoDienThoai { get; set; }
        }

        // --- 1. GET /api/lophoc: Lấy danh sách lớp học kèm TenMon và HoTen giảng viên ---
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            // Include navigation để lấy TenMon và HoTen giảng viên, dùng Select để tránh vòng lặp tuần hoàn
            var danhSach = await _context.LopHocs
                .Include(l => l.MaMonNavigation)
                .Include(l => l.MaGvNavigation)
                .Select(l => new LopHocDto
                {
                    MaLop = l.MaLop,
                    TenLop = l.TenLop,
                    MaMon = l.MaMon,
                    TenMon = l.MaMonNavigation != null ? l.MaMonNavigation.TenMon : null,
                    MaGv = l.MaGv,
                    TenGiangVien = l.MaGvNavigation != null ? l.MaGvNavigation.HoTen : null
                })
                .ToListAsync();

            return Ok(danhSach);
        }

        // --- 2. POST /api/lophoc: Tạo lớp học mới ---
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TaoLopHocRequest request)
        {
            // Kiểm tra mã lớp đã tồn tại chưa
            var daTonTai = await _context.LopHocs.AnyAsync(l => l.MaLop == request.MaLop);
            if (daTonTai) return BadRequest(new { Message = "Mã lớp học đã tồn tại trong hệ thống!" });

            // Kiểm tra môn học hợp lệ (nếu có truyền lên)
            if (request.MaMon != null)
            {
                var monHocTonTai = await _context.MonHocs.AnyAsync(m => m.MaMon == request.MaMon);
                if (!monHocTonTai) return BadRequest(new { Message = "Mã môn học không tồn tại!" });
            }

            // Kiểm tra giảng viên hợp lệ (nếu có truyền lên)
            if (request.MaGv != null)
            {
                var giangVienTonTai = await _context.GiangViens.AnyAsync(g => g.MaGv == request.MaGv);
                if (!giangVienTonTai) return BadRequest(new { Message = "Mã giảng viên không tồn tại!" });
            }

            var lopHocMoi = new LopHoc
            {
                MaLop = request.MaLop,
                TenLop = request.TenLop,
                MaMon = request.MaMon,
                MaGv = request.MaGv
            };

            _context.LopHocs.Add(lopHocMoi);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Tạo lớp học thành công!", Data = request });
        }

        // --- 3. POST /api/lophoc/{maLop}/add-student: Thêm sinh viên vào lớp ---
        [HttpPost("{maLop}/add-student")]
        public async Task<IActionResult> AddStudent(string maLop, [FromBody] ThemSinhVienRequest request)
        {
            // Lấy lớp học kèm danh sách sinh viên hiện tại để kiểm tra trùng
            var lopHoc = await _context.LopHocs
                .Include(l => l.MaSvs)
                .FirstOrDefaultAsync(l => l.MaLop == maLop);

            if (lopHoc == null) return NotFound(new { Message = "Không tìm thấy lớp học!" });

            // Kiểm tra sinh viên tồn tại
            var sinhVien = await _context.SinhViens.FirstOrDefaultAsync(s => s.MaSv == request.MaSv);
            if (sinhVien == null) return NotFound(new { Message = "Không tìm thấy sinh viên!" });

            // Kiểm tra sinh viên đã có trong lớp chưa
            var daCoTrongLop = lopHoc.MaSvs.Any(s => s.MaSv == request.MaSv);
            if (daCoTrongLop) return BadRequest(new { Message = "Sinh viên đã có trong lớp học này!" });

            // EF Core tự động thêm dòng vào bảng ChiTietLopHoc qua navigation collection
            lopHoc.MaSvs.Add(sinhVien);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Thêm sinh viên vào lớp thành công!" });
        }

        // --- 4. GET /api/lophoc/{maLop}/students: Lấy danh sách sinh viên của lớp ---
        [HttpGet("{maLop}/students")]
        public async Task<IActionResult> GetStudents(string maLop)
        {
            // Kiểm tra lớp tồn tại
            var lopTonTai = await _context.LopHocs.AnyAsync(l => l.MaLop == maLop);
            if (!lopTonTai) return NotFound(new { Message = "Không tìm thấy lớp học!" });

            // Truy vấn sinh viên qua quan hệ nhiều-nhiều (bảng ChiTietLopHoc)
            var danhSachSinhVien = await _context.LopHocs
                .Where(l => l.MaLop == maLop)
                .SelectMany(l => l.MaSvs)
                .Select(s => new SinhVienDto
                {
                    MaSv = s.MaSv,
                    HoTen = s.HoTen,
                    Email = s.Email,
                    SoDienThoai = s.SoDienThoai
                })
                .ToListAsync();

            return Ok(danhSachSinhVien);
        }
    }
}
