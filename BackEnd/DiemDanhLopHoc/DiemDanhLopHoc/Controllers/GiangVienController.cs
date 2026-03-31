using DiemDanhLopHoc.Data;
using DiemDanhLopHoc.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DiemDanhLopHoc.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GiangViensController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GiangViensController(AppDbContext context)
        {
            _context = context;
        }

       
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var danhSach = await _context.GiangViens
                .Select(gv => new GiangVienResponseDto
                {
                    MaGv = gv.MaGv,
                    TaiKhoan = gv.TaiKhoan,
                    HoTen = gv.HoTen,
                    Email = gv.Email,
                    SoDienThoai = gv.SoDienThoai,
                    TrangThai = gv.TrangThai
                })
                .ToListAsync();

            return Ok(danhSach);
        }
    }
}