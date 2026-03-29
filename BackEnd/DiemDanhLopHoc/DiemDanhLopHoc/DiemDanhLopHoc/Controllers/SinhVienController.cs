using DiemDanhLopHoc.Data;
using DiemDanhLopHoc.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DiemDanhLopHoc.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SinhViensController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SinhViensController(AppDbContext context)
        {
            _context = context;
        }

        // Lấy danh sách Sinh Viên an toàn
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var danhSach = await _context.SinhViens
                .Select(sv => new SinhVienResponseDto
                {
                    MaSv = sv.MaSv,
                    TaiKhoan = sv.TaiKhoan,
                    HoTen = sv.HoTen,
                    NgaySinh = sv.NgaySinh,
                    Email = sv.Email,
                    SoDienThoai = sv.SoDienThoai,
                    AnhDaiDien = sv.AnhDaiDien
                })
                .ToListAsync();

            return Ok(danhSach);
        }
    }
}