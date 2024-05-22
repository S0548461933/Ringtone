using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class RingtonesController : ControllerBase
{
    private readonly string jsonFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "ringtone-schedule.json");

    [HttpGet]
    public async Task<IActionResult> GetSchedules()
    {
        var json = await System.IO.File.ReadAllTextAsync(jsonFilePath);
        var schedules = JsonConvert.DeserializeObject<List<RingtoneSchedule>>(json);
        return Ok(schedules);
    }

    [HttpPost]
    public async Task<IActionResult> SaveSchedule([FromBody] RingtoneSchedule schedule)
    {
        var json = await System.IO.File.ReadAllTextAsync(jsonFilePath);
        var schedules = JsonConvert.DeserializeObject<List<RingtoneSchedule>>(json) ?? new List<RingtoneSchedule>();
        schedules.Add(schedule);
        await System.IO.File.WriteAllTextAsync(jsonFilePath, JsonConvert.SerializeObject(schedules));
        return Ok(schedule);
    }
}

public class RingtoneSchedule
{
    public string Title { get; set; }
    public string FileName { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool Recurring { get; set; }
}
