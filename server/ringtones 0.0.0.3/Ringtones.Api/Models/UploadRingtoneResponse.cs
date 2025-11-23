namespace Ringtones.Api.Models
{
    // התשובה לאחר העלאת קובץ צלצול
    public class UploadRingtoneResponse
    {
        public string FileName { get; set; } = "";
        public string RelativePath { get; set; } = "";   // לדוגמה "Ringtones/pulse.mp3"
    }
}
