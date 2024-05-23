import { Component, OnInit } from '@angular/core';
import { SongService } from '../song.service';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})
export class SongListComponent implements OnInit {
  songs: any[] = [];

  constructor(private songService: SongService) { }

  ngOnInit(): void {
    this.songService.getSongs().subscribe(data => {
      this.songs = data;
    });
  }
}
