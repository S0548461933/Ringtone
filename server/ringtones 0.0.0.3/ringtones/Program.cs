using System;
using System.Collections.Generic;
using System.Linq;
using System.Media;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace ringtones
{
    internal class Program
    {
        static void Main(string[] args)
        {
            string filePath ="C:\\Projects\\S0548461933\\Ringtone\\server\\ringtones 0.0.0.3\\ringtones\\Playlists.json";
            DailyRingtonesCharging dailyRingtonesCharging = new DailyRingtonesCharging(filePath);
            dailyRingtonesCharging.LoadRingtone();


            //לייצר קלאס חדש שיש לו שיר, ויש לו פונקציה שפעילה שיר
            //  ringtone Ringtone = new Ringtone();
        }


    }
}
