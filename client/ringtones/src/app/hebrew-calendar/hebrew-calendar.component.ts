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
import { JewishCalendarService } from '../jewish-calendar.service';

@Component({
  selector: 'app-hebrew-calendar',
  templateUrl: './hebrew-calendar.component.html',
  styleUrls: ['./hebrew-calendar.component.css']
})
export class HebrewCalendarComponent {
  i18n = inject(NgbDatepickerI18n);
	calendar = inject(NgbCalendar);
  isValid :boolean=false;
  model: NgbDateStruct | undefined ;
  modelList: NgbDateStruct[] = [];
  visible:boolean=false;

    constructor(JewishCalendarS:JewishCalendarService){this.dayTemplateData = this.dayTemplateData.bind(this);
  }

  isDisabled = (date: NgbDate): boolean => {
    return this.calendar.getWeekday(date) ===6 ; // יום 7 בלוח עברי = שבת
  }

  dayTemplateData(date: NgbDate) {
    return {
		gregorian: (this.calendar as NgbCalendarHebrew).toGregorian(date),
    };
  }

  isSelected(date: NgbDate): boolean {
    return this.modelList.some(d => d.year === date.year && d.month === date.month && d.day === date.day);
  }

  selectDate(date: NgbDate) {
    debugger
    const dateIndex = this.modelList.findIndex(d => d.year === date.year && d.month === date.month && d.day === date.day);

    if (dateIndex >= 0) {
      this.modelList.splice(dateIndex, 1);
    } else {
      this.modelList.push({ year: date.year, month: date.month, day: date.day });
    }
    if(this.modelList.length==0)
      this.isValid=false;
        else
      this.isValid=true;
    console.log(this.modelList);
   
  }


  showDialog() {
    this.visible = true;
} 
}
