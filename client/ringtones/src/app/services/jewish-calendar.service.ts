import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// אפשר לשים את ה־DTO פה, או בקובץ נפרד
export interface RingtoneScheduleDto {
  year: number;
  month: number;
  day: number;
  time: string;           // "HH:MM"
  ringtoneId?: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class JewishCalendarService {

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


  // 🔹 זו הפונקציה שהקומפוננטה שלך מחפשת
  private baseUrlRingtones = '/api/ringtones'; // תעדכני בהתאם לשרת שלך

  saveRingtones(schedules: RingtoneScheduleDto[]): Observable<void> {
    // אם יש לך API בצד השרת:
    return this.http.post<void>(this.baseUrlRingtones, schedules);

    // אם כרגע אין API מוכן ואת רק רוצה שלא יהיו שגיאות קומפילציה,
    // אפשר זמנית לעשות:
    // console.log('Mock saveRingtones', schedules);
    // return of(void 0);
  }
}
