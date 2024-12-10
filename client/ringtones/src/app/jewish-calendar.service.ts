import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JewishCalendarService {

  constructor() { }

  UrlJewishCalendar:string="https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&year=now&month=x&ss=on&mf=on&c=on&geo=geoname&geonameid=3448439&M=on&s=on";


}
