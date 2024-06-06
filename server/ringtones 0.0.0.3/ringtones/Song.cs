using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using static ringtones.Song;
using WMPLib;

namespace ringtones
{
    public class Song
    {        
        public int Id { get; set; }
        public string FilePath { get; set; }
        public int DurationSeconds { get; set; }

        public Song(string filePath, int durationSeconds)
        {
            FilePath = filePath;
            DurationSeconds = durationSeconds;
            
        }

        public Song()
        {
        }

        public void Play()
        {
            WindowsMediaPlayer player = new WindowsMediaPlayer();
            player.URL = FilePath;
            player.controls.play();

            Thread.Sleep(DurationSeconds);
        }
    }
}
