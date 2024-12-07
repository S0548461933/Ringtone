using Microsoft.Azure.Amqp.Framing;
using Microsoft.Xrm.Sdk.Messages;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace ringtones
{
    public class DailyRingtonesCharging
    {
        public List<Ringtone> DailyRingtones { get; set; }
        public string FilePath { get; set; }
        
        public DailyRingtonesCharging(string filePath)
        {
            FilePath = filePath;
            DailyRingtones = new List<Ringtone>();
        }

        public void LoadRingtone()
        //קריאה של ה JSON ומעבר עליו כדי למלא את הליסט החמוד שלנו

        {
            // קריאת הקובץ JSON
            if (!File.Exists(FilePath))
            {
                   throw new FileNotFoundException("The specified file was not found.", FilePath);
            }
            string json = File.ReadAllText(FilePath);
            List<Data> dataList = JsonConvert.DeserializeObject<List<Data>>(json);



            // יצירת מילון של שירים לגישה מהירה לפי SongId
            Dictionary<int, Song> songsById = new Dictionary<int, Song>();
            foreach (var data in dataList)
            {
               
                // מילוי רשימת הצלצולים היומיים
                foreach (var ringtone in data.Ringtones)
                {
                    if (ringtone.IsActive && IsWithinDateRange(ringtone))
                    {
                        if (songsById.TryGetValue(ringtone.Id, out Song song))
                        {
                            ringtone.Song = song;
                            DailyRingtones.Add(ringtone);
                        }
                    }
                }
            }
        }
        private bool IsWithinDateRange(Ringtone ringtone)
        {
            DateTime today = DateTime.Today;
            return today >= ringtone.StartDate && today <= ringtone.EndDate;
           // return true;
        }
    }

    public class Data
    {
        public List<Ringtone> Ringtones { get; set; }
        public List<Song> Songs { get; set; }
    }

}
