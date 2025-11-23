import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// אפשר לשים את ה־DTO פה, או בקובץ נפרד
export interface ScheduleEntry {
  date: string;        // "YYYY-MM-DD"
  time: string;        // "HH:mm"
  ringtoneFile: string;
}

export interface UploadRingtoneResponse {
  fileName: string;
  relativePath: string;
}


@Injectable({
  providedIn: 'root'
})
export class JewishCalendarService {
  private baseUrlRingtones = 'https://localhost:7240/api/ringtones'; 
  constructor(private http: HttpClient) { }

  // כתובת ה־API של הלוח
getJewishCalendar(): Observable<any> {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 50;
  const endYear = currentYear + 50;

  const start = `${startYear}-01-01`;
  const end = `${endYear}-12-31`;
  const url =
    `https://www.hebcal.com/hebcal?v=1&cfg=json&start=${start}&end=${end}` +
    `&maj=on&min=on&mod=on&nx=on&ss=on&mf=on&c=on&geo=geoname&geonameid=3448439&M=on&s=on`;

  return this.http.get<any>(url);
}



  saveRingtones(schedules: ScheduleEntry[]): Observable<any> {
  return this.http.post<any>(`${this.baseUrlRingtones}/schedules`, schedules);
}


  uploadRingtone(file: File): Observable<UploadRingtoneResponse> {
  const formData  = new FormData();
  formData .append('file', file);
  return this.http.post<UploadRingtoneResponse>(`${this.baseUrlRingtones}/upload`, formData);
}

}
