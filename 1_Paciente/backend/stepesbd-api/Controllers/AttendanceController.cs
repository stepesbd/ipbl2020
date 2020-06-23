using System;
using System.Collections.Generic;
using System.Linq;  
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using stepesdb_api;
using stepesdb_dto;

namespace stepesdb_api.Controllers
{    
    [ApiController]
    [Route("[controller]")]
    public class AttendanceController : ControllerBase
    {
        private readonly stepes_bdContext _context;

        public AttendanceController(stepes_bdContext context)
        {
            _context = context;         
        }

        // POST: api/Attendance/login
        [Route("login")]
        [HttpPost]
        public async Task<ActionResult<Patient>> Post(Login login)
        {
            if (login is null)
                return BadRequest(new BadRequest("O objeto login é obrigatório"));

            Person p = await _context.Person
            .Where(x=>x.PerCpf == login.Cpf
                    && x.PerSenha == login.Senha)
            .FirstOrDefaultAsync();

            if(p == null)
                return null;
            
            Patient pa = await _context.Patient
            .Where(x=>x.PerId == p.PerId)
            .Include(x=>x.Per)
                .ThenInclude(x=>x.Add)
            .FirstOrDefaultAsync();

            return pa;
        }  

        // GET: api/Attendance
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Attendance>>> Get()
        {
            List<Attendance> list = await _context.Attendance
            .Take(100)
            .ToListAsync();    
            

            return list;
        }


        // POST: api/Attendance
        [HttpPost]
        public async Task<ActionResult<Attendance>> Post(Attendance attendance)
        {
            if (attendance is null)
                return BadRequest(new BadRequest("O objeto attendance é obrigatório"));
            
            try
            {
                _context.Attendance.Add(attendance);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500,new InternalServerError(ex.Message));
            }

            return CreatedAtAction("Get", new { id = attendance.AttId }, attendance);
        }        
    }
}
