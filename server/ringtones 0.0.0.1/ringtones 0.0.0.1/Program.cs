// See https://aka.ms/new-console-template for more information
Console.WriteLine("Hello, World!");
using System;
using System.IO;
using Newtonsoft.Json;
using System.Collections.Generic;

public class Ringtone
{
    public string Name { get; set; }
    public string FromDate { get; set; }
    public string ToDate { get; set; }
    public string FromHour { get; set; }
    public string ToHour { get; set; }
    public string Duration { get; set; }
    public int DurationSeconds { get; set; }
}

class Program
{
    static void Main()
    {
        List<Ringtone> ringtones = LoadRingtones("ringtones.json");
        Ringtone currentRingtone = GetCurrentRingtone(ringtones);

        if (currentRingtone != null)
        {
            Console.WriteLine($"The current ringtone is: {currentRingtone.Name}");
        }
        else
        {
            Console.WriteLine("No ringtone available at the current time.");
        }
    }

    static List<Ringtone> LoadRingtones(string filePath)
    {
        string json = File.ReadAllText(filePath);
        return JsonConvert.DeserializeObject<List<Ringtone>>(json);
    }

    static Ringtone GetCurrentRingtone(List<Ringtone> ringtones)
    {
        DateTime currentTime = DateTime.Now;
        string currentDay = currentTime.ToString("yyyy-MM-dd");
        string currentHour = currentTime.ToString("HH:mm");

        foreach (Ringtone ringtone in ringtones)
        {
            if (DateTime.Parse(ringtone.FromDate) <= currentTime && DateTime.Parse(ringtone.ToDate) >= currentTime &&
                TimeSpan.Parse(ringtone.FromHour) <= currentTime.TimeOfDay && TimeSpan.Parse(ringtone.ToHour) >= currentTime.TimeOfDay)
            {
                return ringtone;
            }
        }

        return null;
    }
}
