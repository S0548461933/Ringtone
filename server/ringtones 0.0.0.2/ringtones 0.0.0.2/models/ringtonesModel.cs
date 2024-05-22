public class Song
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Artist { get; set; }
    public string FilePath { get; set; }
}

public class Schedule
{
    public int Id { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public int SongId { get; set; }
    public bool IsRecurring { get; set; }
}
