import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HebrewCalendarComponent } from './hebrew-calendar/hebrew-calendar.component';
import { NgbCalendar, NgbCalendarHebrew, NgbDatepickerI18n, NgbDatepickerI18nHebrew, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentComponent } from './appointment/appointment.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HebrewCalendarComponent,
    AppointmentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
   
  ],
  providers:   [
		{ provide: NgbCalendar, useClass: NgbCalendarHebrew },
		{ provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nHebrew },
	],
  bootstrap: [AppComponent]
})
export class AppModule { }
