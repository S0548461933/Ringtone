import { Component, inject } from '@angular/core';
import {
  NgbCalendar,
  NgbCalendarHebrew,
  NgbDate,
  NgbDatepickerI18n,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { JewishCalendarService } from '../services/jewish-calendar.service';

@Component({
  selector: 'app-hebrew-calendar',
  templateUrl: './hebrew-calendar.component.html',
  styleUrls: ['./hebrew-calendar.component.css']
})
export class HebrewCalendarComponent {
  i18n = inject(NgbDatepickerI18n);
  calendar = inject(NgbCalendar);

  // מודל של datepicker (אם תרצי Today בהתחלה אפשר להגדיר כאן)
  model: NgbDateStruct | undefined;

  // רשימת תאריכים שנבחרו
  modelList: NgbDateStruct[] = [];

  // דיאלוג
  visible: boolean = false;

  // שעות
  hours: number = 0;
  minutes: number = 0;
  selectedTimes: string[] = [];

  // צלצול שנבחר (אם יהיה לך דרופדאון של צלצולים)
  selectedRingtone: number | null = null;

  constructor(private jewishCalendarService: JewishCalendarService) {
    this.dayTemplateData = this.dayTemplateData.bind(this);
  }

  // --- תצוגת היום הגרגוריאני בטמפלט ---
  dayTemplateData(date: NgbDate) {
    return {
      gregorian: (this.calendar as NgbCalendarHebrew).toGregorian(date),
    };
  }

  // --- השבתה (דוגמה: שבת) ---
  isDisabled = (date: NgbDate): boolean => {
    // אם זה מה שאת רוצה - תשאירי ככה
    return this.calendar.getWeekday(date) === 6;
  }

  // --- האם היום מסומן ---
  isSelected(date: NgbDate): boolean {
    return this.modelList.some(d =>
      d.year === date.year && d.month === date.month && d.day === date.day
    );
  }

  // --- לחיצה על יום ---
  selectDate(date: NgbDate) {
    const index = this.modelList.findIndex(d =>
      d.year === date.year && d.month === date.month && d.day === date.day
    );

    if (index >= 0) {
      this.modelList.splice(index, 1);
    } else {
      this.modelList.push({ year: date.year, month: date.month, day: date.day });
    }

    console.log('modelList:', this.modelList);
  }

  // --- פתיחת דיאלוג ---
  showDialog() {
    this.visible = true;
  }

  // --- הוספת שעה לרשימה ---
  addTime() {
    const h = this.hours ?? 0;
    const m = this.minutes ?? 0;

    if (h < 0 || h > 23 || m < 0 || m > 59) {
      return;
    }

    const timeString = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

    if (!this.selectedTimes.includes(timeString)) {
      this.selectedTimes.push(timeString);
    }
  }

  removeTime(time: string) {
    const index = this.selectedTimes.indexOf(time);
    if (index > -1) {
      this.selectedTimes.splice(index, 1);
    }
  }

  // --- ולידציה לכפתורים ---
  // זה בשביל הכפתור "Select dates" – שיהיה פעיל כל עוד יש תאריכים מסומנים
  get isValid(): boolean {
    return this.modelList.length > 0;
  }

  // זה בשביל כפתור "שמור" בדיאלוג – צריך גם תאריכים וגם שעות
  get canSave(): boolean {
    return this.modelList.length > 0 && this.selectedTimes.length > 0;
  }

  // --- שמירת הצלצולים (החלק שמסיים את הסיפור) ---
  saveSchedules() {
    // אם אין תנאים – לא נשמור
    if (!this.canSave) {
      return;
    }

    // בונים Payload של כל צירוף תאריך+שעה
    const payload = this.modelList.flatMap(date =>
      this.selectedTimes.map(time => ({
        year: date.year,
        month: date.month,
        day: date.day,
        time: time,
        ringtoneId: this.selectedRingtone // יכול להיות null אם לא חובה
      }))
    );

    console.log('Payload to save:', payload);

    // קריאה ל-service שלך (תתאימי לשם הפונקציה שם)
 this.jewishCalendarService.saveRingtones(payload).subscribe({
  next: () => {
    console.log('נשמר בהצלחה');
    this.visible = false;
  },
  error: (err: any) => {
    console.error('שגיאה בשמירה', err);
  }
});

  }

  // --- ניגון צלצול לדוגמה ---
  playRingtone(ringtone: any) {
    const audio = new Audio(ringtone.url);
    audio.play();
  }
}
