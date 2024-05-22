import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RingtoneSchedule {
  title: string;
  fileName: string;
  startDate: Date;
  endDate: Date;
  recurring: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RingtonesService {
  private apiUrl = 'https://localhost:5001/api/ringtones';

  constructor(private http: HttpClient) { }

  getSchedules(): Observable<RingtoneSchedule[]> {
    return this.http.get<RingtoneSchedule[]>(this.apiUrl);
  }

  saveSchedule(schedule: RingtoneSchedule): Observable<RingtoneSchedule> {
    return this.http.post<RingtoneSchedule>(this.apiUrl, schedule);
  }
}
