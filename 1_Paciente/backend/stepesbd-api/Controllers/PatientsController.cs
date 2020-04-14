using System;
using System.Collections.Generic;
using System.Linq;  
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using stepesdb_api;

namespace stepesdb_api.Controllers
{    
    [ApiController]
    [Route("[controller]")]
    public class PatientsController : ControllerBase
    {
        private readonly stepes_bdContext _context;

        public PatientsController(stepes_bdContext context)
        {
            _context = context;         
        }

        // GET: api/Patients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Patient>>> Get()
        {
            List<Patient> p = await _context.Patient.ToListAsync();            
            return p;
        }

        // PUT: api/Patients/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Patient patient)
        {
            if (id != patient.PatId)
                return BadRequest(new BadRequest("O id da ulr deve ser igual do objeto"));

            try
            {
                _context.Entry(patient).State = EntityState.Modified;
                await _context.SaveChangesAsync();            
            }
            catch (Exception ex)
            {                
                return StatusCode(500,new InternalServerError(ex.Message));
            }

            return Ok(new Ok("Editado com sucesso"));
        }

        // POST: api/Patients
        [HttpPost]
        public async Task<ActionResult<Patient>> Post(Patient patient)
        {
            if (patient is null)
                return BadRequest(new BadRequest("O objeto patient é obrigatório"));

            try
            {
                _context.Patient.Add(patient);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500,new InternalServerError(ex.Message));
            }

            return CreatedAtAction("Get", new { id = patient.PatId }, patient);
        }

        // DELETE: api/Patients/5
        [HttpDelete("{id}/{UsuarioDeletadoId}")]
        public async Task<ActionResult<Patient>> Delete(long id)
        {
            Patient patientDel = await _context.Patient.Where(d=>d.PatId == id).FirstOrDefaultAsync();

            if(patientDel == null)            
                return BadRequest(new BadRequest("O registro não foi entrado"));

            try
            {
                _context.Entry(patientDel).State = EntityState.Deleted;
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {                
                return StatusCode(500,new InternalServerError(ex.Message));
            }            
            
            return Ok(new Ok("Deletado com sucesso"));
        }

        
    }
}
