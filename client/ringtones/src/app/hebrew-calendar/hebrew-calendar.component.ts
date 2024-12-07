import { Component, inject } from '@angular/core';
import {
	NgbCalendar,
	NgbCalendarHebrew,
	NgbDate,
	NgbDatepickerI18n,
	NgbDatepickerI18nHebrew,
	NgbDatepickerModule,
	NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-hebrew-calendar',
  templateUrl: './hebrew-calendar.component.html',
  styleUrls: ['./hebrew-calendar.component.css']
})
export class HebrewCalendarComponent {
  i18n = inject(NgbDatepickerI18n);
	calendar = inject(NgbCalendar);

	model: NgbDateStruct | undefined ;
constructor(){this.dayTemplateData = this.dayTemplateData.bind(this);
}
dayTemplateData(date: NgbDate) {
  return {
    gregorian: (this.calendar as NgbCalendarHebrew).toGregorian(date),
  };
}

}