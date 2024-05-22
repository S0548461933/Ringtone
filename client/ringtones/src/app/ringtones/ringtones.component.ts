import { Component, OnInit } from '@angular/core';
import { RingtonesService, RingtoneSchedule } from '../ringtones.service';

@Component({
  selector: 'app-ringtones',
  templateUrl: './ringtones.component.html',
  styleUrls: ['./ringtones.component.css']
})
export class RingtonesComponent implements OnInit {
  schedules: RingtoneSchedule[] = [];

  constructor(private ringtonesService: RingtonesService) { }

  ngOnInit(): void {
    this.ringtonesService.getSchedules().subscribe(schedules => {
      this.schedules = schedules;
    });
  }

  saveSchedule(schedule: RingtoneSchedule): void {
    this.ringtonesService.saveSchedule(schedule).subscribe(newSchedule => {
      this.schedules.push(newSchedule);
    });
  }
}
