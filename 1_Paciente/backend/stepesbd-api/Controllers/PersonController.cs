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
    public class PersonController : ControllerBase
    {
        private readonly stepes_bdContext _context;

        public PersonController(stepes_bdContext context)
        {
            _context = context;         
        }

        // GET: api/Person
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Person>>> Get()
        {
            List<Person> p = await _context.Person
            .OrderBy(x=>x.PerFirstName)
            .ToListAsync();            
            return p;
        }

        // PUT: api/Person/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Person person)
        {
            if (id != person.PerId)
                return BadRequest(new BadRequest("O id da ulr deve ser igual do objeto"));

            try
            {
                _context.Entry(person).State = EntityState.Modified;
                await _context.SaveChangesAsync();            
            }
            catch (Exception ex)
            {                
                return StatusCode(500,new InternalServerError(ex.Message));
            }

            return Ok(new Ok("Editado com sucesso"));
        }

        // POST: api/Person
        [HttpPost]
        public async Task<ActionResult<Patient>> Post(Person person)
        {
            if (person is null)
                return BadRequest(new BadRequest("O objeto person é obrigatório"));

            try
            {
                _context.Person.Add(person);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500,new InternalServerError(ex.Message));
            }

            return CreatedAtAction("Get", new { id = person.PerId }, person);
        }

        // DELETE: api/Person/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Patient>> Delete(long id)
        {
            Person persondel = await _context.Person.Where(d=>d.PerId == id).FirstOrDefaultAsync();

            if(persondel == null)            
                return BadRequest(new BadRequest("O registro não foi entrado"));

            try
            {
                _context.Entry(persondel).State = EntityState.Deleted;
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
