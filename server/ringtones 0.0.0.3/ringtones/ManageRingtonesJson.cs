//using Microsoft.AspNetCore.Mvc;
//using Newtonsoft.Json;
//using System;
//using System.Collections.Generic;
//using System.IO;
//using System.Linq;
//using System.Net;
//using System.Text;
//using System.Threading.Tasks;
//using System.Xml;

//namespace ringtones
//{
//    public class ManageRingtonesJson
//    {
   

//    public class Data
//    {
//        public List<ringtone> Ringtones { get; set; }
//        public List<Song> Songs { get; set; }
//    }

//    class Program
//    {
//        static void Main()
//        {
//            string filePath = "Playlists.json";

//            // קריאת הנתונים מקובץ JSON
//            Data data = ReadData(filePath);

//            // הוספת צלצול חדש
//            var newRingtone = new Ringtone
//            {
//                Id = data.Ringtones.Count + 1,
//                Description = "Evening Alarm",
//                IsActive = true,
//                StartDate = DateTime.Parse("2024-05-01"),
//                EndDate = DateTime.Parse("2024-12-31"),
//                SongId = 2,
//                DailySchedule = new List<string> { "Monday", "Wednesday", "Friday" },
//                MonthlySchedule = new List<int> { 1, 15 },
//                ActivationTime = "18:00:00"
//            };
//            data.Ringtones.Add(newRingtone);

//            // הוספת שיר חדש
//            var newSong = new Song
//            {
//                Id = data.Songs.Count + 1,
//                FilePath = "songs/song_three.mp3",
//                DurationSeconds = 240
//            };
//            data.Songs.Add(newSong);

//            // כתיבת הנתונים לקובץ JSON
//            WriteData(filePath, data);
//        }

//        static Data ReadData(string filePath)
//        {
//            if (!File.Exists(filePath))
//            {
//                return new Data { Ringtones = new List<ringtone>(), Songs = new List<Song>() };
//            }

//            string json = File.ReadAllText(filePath);
//            return JsonConvert.DeserializeObject<Data>(json);
//        }

//        static void WriteData(string filePath, Data data)
//        {
//            string json = JsonConvert.SerializeObject(data, Formatting.Indented);
//            File.WriteAllText(filePath, json);
//        }

//            public ActionResult SaveUploadedFile(string test)
//            {
//                using (WebResponse wrs = wrq.GetResponse())
//                using (Stream stream = wrs.GetResponseStream())
//                using (StreamReader reader = new StreamReader(stream))
//                {
//                    string json = reader.ReadToEnd();
//                    tempJson = json;
//                }
//            }
//        }
