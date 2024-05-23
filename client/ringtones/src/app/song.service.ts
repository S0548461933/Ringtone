import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private apiUrl = 'https://localhost:5001/Ringtones';

  constructor(private http: HttpClient) { }

  getSongs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/songs`);
  }
}
