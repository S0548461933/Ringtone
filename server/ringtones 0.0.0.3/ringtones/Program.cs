using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;

namespace ringtones
{
    internal class Program
    {
        static void Main(string[] args)
        {
            // 1. נתיבים
            string playlistsPath = @"D:\Ringtones\server\ringtones 0.0.0.3\ringtones\Playlists.json";
            string schedulesPath = @"D:\Ringtones\server\ringtones 0.0.0.3\ringtones\Schedules.json";
            string ringtonesFolder = @"D:\Ringtones\server\ringtones 0.0.0.3\ringtones"; // איפה ה־mp3 בפועל

            // 2. טוענים את המידע
            var loader = new DailyRingtonesCharging(playlistsPath, schedulesPath);
            loader.LoadRingtone();

            Console.WriteLine($"Loaded {loader.DailyRingtones.Count} active ringtones.");

            // 3. HashSet כדי לא לנגן את אותו צלצול עוד פעם
            var playedToday = new HashSet<string>();

            Console.WriteLine("Bell system is running. Press Ctrl+C to stop.");

            while (true)
            {
                try
                {
                    var now = DateTime.Now;

                    // אם עבר יום – מאפסים רשימה
                    if (playedToday.Any())
                    {
                        var anyKey = playedToday.First();
                        DateTime.TryParse(anyKey.Split('|')[0], out var dtFirst);
                        if (dtFirst.Date != now.Date)
                        {
                            playedToday.Clear();
                        }
                    }

                    // מביא את הצלצולים של היום
                    var todaySchedules = loader.GetTodaySchedules();

                    foreach (var s in todaySchedules)
                    {
                        if (!DateTime.TryParse($"{s.Date} {s.Time}", out var scheduleTime))
                            continue;

                        // אם כבר נגַנּו את הצלצול הזה – מדלגים
                        string key = $"{scheduleTime:yyyy-MM-dd HH:mm}|{s.RingtoneFile}";
                        if (playedToday.Contains(key))
                            continue;

                        // אם עכשיו בתוך טווח של דקה מהשעה (אפשר לשחק עם זה)
                        var diff = now - scheduleTime;

                        if (diff.TotalSeconds >= 0 && diff.TotalSeconds <= 30)
                        {
                            // מנגנים
                            string filePath = Path.Combine(ringtonesFolder, s.RingtoneFile);
                            Console.WriteLine($"[{DateTime.Now}] Playing bell: {filePath}");
                            PlayRingtone(filePath);

                            playedToday.Add(key);
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error in loop: " + ex.Message);
                }

                // מחכים 10 שניות בין סיבוב לסיבוב
                Thread.Sleep(10_000);
            }
        }

        private static void PlayRingtone(string filePath)
        {
            // כאן את מחברת את הקוד שמנגן בפועל
            // אם יש לך כבר מחלקה Song / Ringtone עם Play – אפשר לקרוא משם.
            // לדוגמה, אם הקבצים בפורמט WAV:
            /*
            using (var player = new System.Media.SoundPlayer(filePath))
            {
                player.PlaySync();
            }
            */

            Console.Beep(); // רק לבדיקה – צליל קונסול קטנטן
        }
    }
}
