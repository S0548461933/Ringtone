using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Text.Json;

[ApiController]
[Route("[controller]")]
public class RingtonesController : ControllerBase
{
    [HttpGet("songs")]
    public IActionResult GetSongs()
    {
        var json = System.IO.File.ReadAllText("Data/songs.json");
        var songs = JsonSerializer.Deserialize<List<Song>>(json);
        return Ok(songs);
    }

    // Add similar methods for schedules and holidays
}

public class Song
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Url { get; set; }
}
