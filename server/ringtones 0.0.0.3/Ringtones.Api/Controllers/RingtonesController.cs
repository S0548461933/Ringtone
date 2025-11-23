using Microsoft.AspNetCore.Mvc;
using Ringtones.Api.Models;
using System.Text.Json;

namespace Ringtones.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RingtonesController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public RingtonesController(IWebHostEnvironment env)
        {
            _env = env;
        }
        private string GetRingtonesFolder()
        {
            var path = Path.Combine(_env.ContentRootPath, "Ringtones");
            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);

            return path;
        }

     

        // נתיב לקובץ schedules.json בתוך הפרויקט
        private string GetSchedulesFilePath()
        {
            var dataFolder = Path.Combine(_env.ContentRootPath, "Data");
            if (!Directory.Exists(dataFolder))
                Directory.CreateDirectory(dataFolder);

            return Path.Combine(dataFolder, "schedules.json");
        }

        // ----------------------------------------------------
        //  GET /api/ringtones/schedules
        //  מחזיר את כל התזמונים השמורים
        // ----------------------------------------------------
        [HttpGet("schedules")]
        public ActionResult<List<ScheduleEntry>> GetSchedules()
        {
            var path = GetSchedulesFilePath();
            if (!System.IO.File.Exists(path))
            {
                return Ok(new List<ScheduleEntry>()); // אין קובץ -> מחזירים רשימה ריקה
            }

            var json = System.IO.File.ReadAllText(path);
            var list = JsonSerializer.Deserialize<List<ScheduleEntry>>(json) ?? new List<ScheduleEntry>();
            return Ok(list);
        }

        // ----------------------------------------------------
        //  POST /api/ringtones/schedules
        //  שמירת רשימת תזמונים חדשה (מגיעה מהאנגולר)
        // ----------------------------------------------------
        [HttpPost("schedules")]
        public async Task<IActionResult> SaveSchedules([FromBody] List<ScheduleEntry> schedules)
        {
            if (schedules == null || schedules.Count == 0)
                return BadRequest("Empty schedules list");

            var path = GetSchedulesFilePath();

            var json = JsonSerializer.Serialize(
                schedules,
                new JsonSerializerOptions { WriteIndented = true });

            await System.IO.File.WriteAllTextAsync(path, json);

            return Ok(new { message = "Schedules saved", count = schedules.Count });
        }

        // ----------------------------------------------------
        //  POST /api/ringtones/upload
        //  העלאת קובץ mp3 ושמירתו בתיקיית Ringtones
        // ----------------------------------------------------
        [HttpPost("upload")]
        public async Task<ActionResult<UploadRingtoneResponse>> UploadRingtone([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var ringtonesFolder = GetRingtonesFolder();

            var fileName = Path.GetFileName(file.FileName);
            var physicalPath = Path.Combine(ringtonesFolder, fileName);

            using (var stream = new FileStream(physicalPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var relativePath = Path.Combine("Ringtones", fileName).Replace("\\", "/");

            var response = new UploadRingtoneResponse
            {
                FileName = fileName,
                RelativePath = relativePath
            };

            return Ok(response);
        }
    }
}
