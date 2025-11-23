namespace Ringtones.Api.Models
{
    public class RingtoneScheduleDto
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public int Day { get; set; }
        public string Time { get; set; } = "";   // "HH:mm"

        public int? RingtoneId { get; set; }
        public string RingtoneSource { get; set; } = "default"; // "default" או "upload"
        public string? RingtoneName { get; set; }
    }
}
