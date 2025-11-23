using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace ringtones
{
    public class DailyRingtonesCharging
    {
        // רשימת הצלצולים הרגילים מה-Playlists.json (אם תרצי להשתמש גם בהם)
        public List<Ringtone> DailyRingtones { get; set; }

        // הנתיב לקובץ Playlists.json
        public string PlaylistsFilePath { get; set; }

        // הנתיב לקובץ Schedules.json (הקובץ שמגיע מה-API החדש)
        public string SchedulesFilePath { get; set; }

        // מודל אחד של רשומה מה-Schedules.json
        // [
        //   { "Date": "2025-03-21", "Time": "08:15", "RingtoneFile": "Champagne_Edition.mp3" },
        //   ...
        // ]
        public class ScheduleEntry
        {
            public string Date { get; set; }       // פורמט: "yyyy-MM-dd"
            public string Time { get; set; }       // פורמט: "HH:mm"
            public string RingtoneFile { get; set; }
        }

        public DailyRingtonesCharging(string playlistsFilePath, string schedulesFilePath)
        {
            PlaylistsFilePath = playlistsFilePath;
            SchedulesFilePath = schedulesFilePath;
            DailyRingtones = new List<Ringtone>();
        }

        /// <summary>
        /// טעינת הצלצולים מה-Playlists.json (אם תרצי להשתמש בזה בהמשך)
        /// </summary>
        public void LoadRingtone()
        {
            if (!File.Exists(PlaylistsFilePath))
                throw new FileNotFoundException("Playlists file not found.", PlaylistsFilePath);

            string json = File.ReadAllText(PlaylistsFilePath);

            // כאן ההנחה שהמבנה הוא:  List<Data> (כמו שהיה אצלך)
            List<Data> dataList = JsonConvert.DeserializeObject<List<Data>>(json);

            if (dataList == null)
                return;

            // מילון שירים לפי Id לצימוד מהיר
            Dictionary<int, Song> songsById = new Dictionary<int, Song>();

            foreach (var data in dataList)
            {
                if (data.Songs != null)
                {
                    foreach (var song in data.Songs)
                    {
                        if (!songsById.ContainsKey(song.Id))
                            songsById[song.Id] = song;
                    }
                }

                if (data.Ringtones != null)
                {
                    foreach (var ringtone in data.Ringtones)
                    {
                        if (ringtone.IsActive && IsWithinDateRange(ringtone))
                        {
                            if (songsById.TryGetValue(ringtone.Id, out Song song))
                            {
                                ringtone.Song = song;
                            }
                            DailyRingtones.Add(ringtone);
                        }
                    }
                }
            }
        }

        /// <summary>
        /// טעינת כל הרשומות מה-Schedules.json (מה-API)
        /// </summary>
        public List<ScheduleEntry> LoadSchedules()
        {
            if (!File.Exists(SchedulesFilePath))
                return new List<ScheduleEntry>();

            string json = File.ReadAllText(SchedulesFilePath);

            return JsonConvert.DeserializeObject<List<ScheduleEntry>>(json)
                   ?? new List<ScheduleEntry>();
        }

        /// <summary>
        /// מחזיר רק את הצלצולים של היום הנוכחי
        
        /// </summary>
        public List<ScheduleEntry> GetTodaySchedules()
        {
            var all = LoadSchedules();

            // פורמט תאריך כמו שנשמר בקובץ מה-API: yyyy-MM-dd
            string todayKey = DateTime.Today.ToString("yyyy-MM-dd");

            return all
                .Where(s => string.Equals(s.Date, todayKey, StringComparison.Ordinal))
                .ToList();
        }

        private bool IsWithinDateRange(Ringtone ringtone)
        {
            DateTime today = DateTime.Today;
            return today >= ringtone.StartDate && today <= ringtone.EndDate;
        }
    }


    // זה נשאר כמו שהיה אצלך – המודל של ה-Playlists.json
    public class Data
    {
        public List<Ringtone> Ringtones { get; set; }
        public List<Song> Songs { get; set; }
    }
}
