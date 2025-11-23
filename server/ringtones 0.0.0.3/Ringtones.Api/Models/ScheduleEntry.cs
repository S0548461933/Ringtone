namespace Ringtones.Api.Models
{
    // שורה אחת של צלצול מתוזמן
    public class ScheduleEntry
    {
        // תאריך בפורמט "YYYY-MM-DD", לדוגמה "2025-03-10"
        public string Date { get; set; } = "";

        // שעה בפורמט "HH:mm", לדוגמה "09:00"
        public string Time { get; set; } = "";

        // שם קובץ ה-mp3, לדוגמה "pulse.mp3"
        public string RingtoneFile { get; set; } = "";
    }
}
