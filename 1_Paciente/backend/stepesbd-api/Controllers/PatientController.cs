using System;
using System.Collections.Generic;
using System.Linq;  
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using stepesdb_api;

using System.IO;
using System.Net;
using System.Web;

namespace stepesdb_api.Controllers
{    
    [ApiController]
    [Route("[controller]")]
    public class PatientController : ControllerBase
    {
        private readonly stepes_bdContext _context;

        public PatientController(stepes_bdContext context)
        {
            _context = context;         
        }

        // GET: api/Patient
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Patient>>> Get()
        {
            List<Patient> pacientes = await _context.Patient
            .Include(x=>x.Per)
                .ThenInclude(d=>d.Add)
            .ToListAsync();    
            
            List<Patient> pacientes2 = new List<Patient>();
            foreach(Patient p in pacientes)
            {
                if(p.Per != null)
                {
                    if(p.Per.Add != null)
                        pacientes2.Add(p);
                }

            }

            return pacientes2;
        }

        // PUT: api/Patient/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Patient patient)
        {
            if (id != patient.PatId)
                return BadRequest(new BadRequest("O id da ulr deve ser igual do objeto"));

            try
            {            
                _context.Entry(patient.Per).State = EntityState.Modified;
                await _context.SaveChangesAsync(); 

                _context.Entry(patient.Per.Add).State = EntityState.Modified;
                await _context.SaveChangesAsync();        
            }
            catch (Exception ex)
            {                
                return StatusCode(500,new InternalServerError(ex.Message));
            }

            return Ok(new Ok("Editado com sucesso"));
        }

        public List<String> GetLatLongbyCep(string cep)
        {
            List<String> latlong = new List<String>();

            HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(string.Format("https://www.cepaberto.com/api/v3/cep?cep={0}", cep));

            request.Method = "GET";
            request.Headers.Add("Authorization", "Token token=ed3c65f56f6e7ff359d039cd7118de57");
            request.Timeout = 120000;

            var result = "";

            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            {
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    using (StreamReader streamReader = new StreamReader(response.GetResponseStream()))
                    {
                        result = streamReader.ReadToEnd();
                    }

                    //profissionais = Newtonsoft.Json.JsonConvert.DeserializeObject<List<ProfissionalAgendaBeakt>>(result.ToString());                
                }
            }
            return latlong;
        }

        // POST: api/Patient
        [HttpPost]
        public async Task<ActionResult<Patient>> Post(Patient patient)
        {
            if (patient is null)
                return BadRequest(new BadRequest("O objeto patient é obrigatório"));

            //List<String> latlong = GetLatLongbyCep(patient.Per.Add.AddZipcode);
            //patient.Per.Add.AddLatitude = latlong[0];
            //patient.Per.Add.AddLongitude = latlong[1];
            //return null;
            
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

        // DELETE: api/Patient/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Patient>> Delete(long id)
        {
            Patient patientDel = await _context.Patient
            .Where(d=>d.PatId == id)
            .FirstOrDefaultAsync();

            Person personDel = await _context.Person
            .Where(d=>d.PerId == patientDel.PerId)
            .FirstOrDefaultAsync();

            if(patientDel == null)            
                return BadRequest(new BadRequest("O registro não foi entrado"));

            try
            {
                if(personDel.AddId != null)
                {
                    Address addDel = await _context.Address
                    .Where(d=>d.AddId == personDel.AddId)
                    .FirstOrDefaultAsync();

                    _context.Entry(addDel).State = EntityState.Deleted;
                    await _context.SaveChangesAsync();
                }

                _context.Entry(personDel).State = EntityState.Deleted;
                await _context.SaveChangesAsync();               

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
