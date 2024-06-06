using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Media;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using WMPLib;
//using System.Windows.Media.MediaPlayer;
namespace ringtones
{
    public class Ringtone
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int SongId { get; set; }
        public List<string> DailySchedule { get; set; }
        public List<string> MonthlySchedule { get; set; }
        public DateTime ActivationTime { get; set; }
        public Song Song { get; set; }







        public Ringtone(string description,bool isActive, DateTime activationTime)
        {
            Song = new Song();

            Description = description;
            IsActive = isActive;
            ActivationTime = activationTime;
        }


        // הפונקציה צריכה לקבל את הנתיב, ואת זמן ההשהיה, בנוסף צריכה להפעיל את השירים בווליום קבוע
        //private void Play()
        //{
        //    string url = "C:\\Projects\\S0548461933\\Ringtone\\server\\ringtones 0.0.0.3\\ringtones\\Ringtones\\01-שלום ילדים.mp3";
        //    WindowsMediaPlayer player = new WindowsMediaPlayer();
        //    player.URL = song.url;
        //    player.controls.play();
         
        //    Thread.Sleep(10000);

        //}
    }
}

