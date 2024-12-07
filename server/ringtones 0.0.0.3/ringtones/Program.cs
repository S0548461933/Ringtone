using System;
using System.Collections.Generic;
using System.Linq;
using System.Media;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;
//using <namespace>.Properties;
namespace ringtones
{
    internal class Program
    {
        static void Main(string[] args)
        {
            string filePath = "C:\\Users\\user\\Documents\\Ringtones\\server\\ringtones 0.0.0.3\\ringtones\\Playlists.json";
            DailyRingtonesCharging dailyRingtonesCharging = new DailyRingtonesCharging(filePath);
            dailyRingtonesCharging.LoadRingtone();


            //Playlists.json
            //Program.cs
            //לייצר קלאס חדש שיש לו שיר, ויש לו פונקציה שפעילה שיר
            //  ringtone Ringtone = new Ringtone();
        }


    }
}
