import { Component, OnInit, inject } from '@angular/core';
import {
  NgbCalendar,
  NgbCalendarHebrew,
  NgbDate,
  NgbDatepickerI18n,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { JewishCalendarService, RingtoneScheduleDto } from '../services/jewish-calendar.service';

interface CalendarCell {
  hebrew: string;
  gregorian: string;
  event?: string;
  disabled: boolean;
  outside: boolean;
  date: NgbDate;
}

@Component({
  selector: 'app-hebrew-calendar',
  templateUrl: './hebrew-calendar.component.html',
  styleUrls: ['./hebrew-calendar.component.css'],
})
export class HebrewCalendarComponent implements OnInit {
  i18n = inject(NgbDatepickerI18n);
  calendar = inject(NgbCalendar);

  weeks: CalendarCell[][] = [];
  model: NgbDateStruct | undefined;
  modelList: NgbDateStruct[] = [];
  visible = false;
  hours = 0;
  minutes = 0;
  selectedTimes: string[] = [];
  selectedRingtone: number | null = null;

  private readonly displayHolidayCategories = new Set(['holiday', 'fast', 'modern', 'roshchodesh']);
  private readonly blockingHolidayCategories = new Set(['holiday', 'modern']);
  private readonly ignoredBlockingTitles = [,'תשעה באב','יום השואה','תענית בכורות','יום העליה','שבועות ב׳','ט״ו בשבט','עשרה בטבת',' תענית אסתר, ערב פורים ','ל״ג בעומר','יום הזכרון','פסח שני','ערב שבועות','יום ירושלים','יום העצמאות','חג הסיגד','צום י״ז בתמוז', 'סיגד', 'צום גדליה','ראש השנה למעשר בהמה','חנוכה: א׳ נר'];
  private readonly ignoredBlockingTitlesNormalized: Set<string>;
  private readonly blockedHolidayDates = new Set<string>();
  private holidayLabels: Record<string, string[]> = {};

  readonly weekdayLabels = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  headerSubtitle = 'בחר תאריכים בלוח המשולב כדי לקבוע זמני תזכורות והודעות אוטומטיות';

  constructor(private jewishCalendarService: JewishCalendarService) {
    this.ignoredBlockingTitlesNormalized = new Set(
      this.ignoredBlockingTitles.map((title) => this.normalizeTitle(title))
    );
  }

  ngOnInit(): void {
    this.loadJewishHolidays();
    this.buildMonthGrid();
  }

  private loadJewishHolidays(): void {
    this.jewishCalendarService.getJewishCalendar().subscribe({
      next: (response) => {
        this.holidayLabels = {};
        this.blockedHolidayDates.clear();

        response?.items?.forEach((item: any) => {
          const category = (item?.category ?? '').toLowerCase();
          if (!this.displayHolidayCategories.has(category)) {
            return;
          }

          const parsedDate = this.parseIsoDate(item?.date);
          if (parsedDate) {
            const key = this.dateKey(parsedDate);
            if (this.shouldBlockHoliday(item, category)) {
              this.blockedHolidayDates.add(key);
            }
            this.addHolidayLabel(key, this.getLocalizedTitle(item));
          }
        });

        this.buildMonthGrid();
      },
      error: (err) => {
        console.error('שגיאה בטעינת החגים מה-API', err);
        this.buildMonthGrid();
      },
    });
  }

  private getWeekStart(date: NgbDate): NgbDate {
    let cursor = NgbDate.from(date)!;
    while (this.calendar.getWeekday(cursor) !== 7) {
      cursor = this.calendar.getPrev(cursor, 'd')!;
    }
    return cursor;
  }

  private buildMonthGrid(): void {
    const currentMonth = this.model ?? this.calendar.getToday();
    const firstDay = new NgbDate(currentMonth.year, currentMonth.month, 1);
    const start = this.getWeekStart(firstDay);
    const cells: CalendarCell[][] = [];
    let cursor = start;

    for (let w = 0; w < 6; w++) {
      const row: CalendarCell[] = [];
      for (let d = 0; d < 7; d++) {
        const hebrew = this.i18n.getDayNumerals(cursor);
        const gregorian = this.dayTemplateData(cursor).gregorian;
        const label = this.getHolidayLabel(cursor);
        const disabled = this.isDisabled(cursor);
        row.push({
          hebrew,
          gregorian: `${gregorian.day}/${gregorian.month}`,
          event: label ?? undefined,
          disabled,
          outside:
            cursor.month !== currentMonth.month || cursor.year !== currentMonth.year,
          date: NgbDate.from(cursor)!,
        });
        cursor = this.calendar.getNext(cursor, 'd')!;
      }
      cells.push(row);
    }

    this.weeks = cells;
  }

  private parseIsoDate(isoDate?: string): NgbDateStruct | null {
    if (!isoDate) {
      return null;
    }
    const [year, month, day] = isoDate.split('T')[0]?.split('-').map(Number) ?? [];
    if ([year, month, day].some((num) => Number.isNaN(num))) {
      return null;
    }
    return { year, month, day };
  }

  private dateKey(date: NgbDateStruct): string {
    return `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day
      .toString()
      .padStart(2, '0')}`;
  }

  private addHolidayLabel(dateKey: string, title: string): void {
    const trimmed = title?.trim();
    if (!trimmed) {
      return;
    }
    if (!this.holidayLabels[dateKey]) {
      this.holidayLabels[dateKey] = [];
    }
    if (!this.holidayLabels[dateKey].includes(trimmed)) {
      this.holidayLabels[dateKey].push(trimmed);
    }
  }

  private getLocalizedTitle(item: any): string {
    const hebrew = (item?.hebrew ?? '').trim();
    if (hebrew) {
      return hebrew;
    }
    return (item?.title ?? '').trim();
  }

  private normalizeTitle(value: string | undefined): string {
    return (value ?? '').replace(/\s+/g, '').replace(/["'״׳]/g, '').toLowerCase();
  }

  private shouldBlockHoliday(item: any, category: string): boolean {
    if (!this.blockingHolidayCategories.has(category)) {
      return false;
    }
    const normalized = this.normalizeTitle(item?.hebrew ?? item?.title ?? '');
    if (!normalized) {
      return true;
    }
    return !this.ignoredBlockingTitlesNormalized.has(normalized);
  }

  dayTemplateData(date: NgbDate) {
    return {
      gregorian: (this.calendar as NgbCalendarHebrew).toGregorian(date),
    };
  }

  getHolidayLabel(date: NgbDateStruct | NgbDate): string | null {
    const key = this.getGregorianKey(date);
    const labels = this.holidayLabels[key];
    if (!labels?.length) {
      return null;
    }
    return labels.join(', ');
  }

  isDisabled = (date: NgbDate): boolean => {
    const isShabbat = this.calendar.getWeekday(date) === 6;
    const isHoliday = this.blockedHolidayDates.has(this.getGregorianKey(date));
    return isShabbat || isHoliday;
  };

  get currentMonthLabel(): string {
    const reference = this.model ?? this.calendar.getToday();
    return `${this.i18n.getMonthFullName(reference.month)} ${this.i18n.getYearNumerals(reference.year)}`;
  }

  navigateMonth(offset: number): void {
    const current = this.model ?? this.calendar.getToday();
    const reference =
      NgbDate.from({ year: current.year, month: current.month, day: current.day }) ?? this.calendar.getToday();

    const target = offset < 0 ? this.calendar.getPrev(reference, 'm') : this.calendar.getNext(reference, 'm');
    if (!target) {
      return;
    }

    this.model = { year: target.year, month: target.month, day: target.day };
    this.buildMonthGrid();
  }

  resetToCurrentMonth(): void {
    const today = this.calendar.getToday();
    this.model = { year: today.year, month: today.month, day: today.day };
    this.buildMonthGrid();
  }

  isSelected(date: NgbDate): boolean {
    return this.modelList.some((d) => d.year === date.year && d.month === date.month && d.day === date.day);
  }

  isSelectedDay(cell: CalendarCell): boolean {
    return this.isSelected(cell.date);
  }

  selectDay(cell: CalendarCell): void {
    if (cell.disabled || cell.outside) {
      return;
    }
    this.selectDate(cell.date);
    this.buildMonthGrid();
  }

  selectDate(date: NgbDate) {
    if (this.isDisabled(date)) {
      return;
    }

    const index = this.modelList.findIndex((d) => d.year === date.year && d.month === date.month && d.day === date.day);
    if (index >= 0) {
      this.modelList.splice(index, 1);
    } else {
      this.modelList.push({ year: date.year, month: date.month, day: date.day });
    }
  }

  showDialog() {
    this.visible = true;
  }

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

  get isValid(): boolean {
    return this.modelList.length > 0;
  }

  get canSave(): boolean {
    return this.modelList.length > 0 && this.selectedTimes.length > 0;
  }

  saveSchedules() {
    if (!this.canSave) {
      return;
    }

    const payload: RingtoneScheduleDto[] = this.modelList.flatMap((date) =>
      this.selectedTimes.map((time) => ({
        year: date.year,
        month: date.month,
        day: date.day,
        time,
        ringtoneId: this.selectedRingtone,
      }))
    );

    this.jewishCalendarService.saveRingtones(payload).subscribe({
      next: () => {
        console.log('הלו"ז נשמר בהצלחה');
        this.visible = false;
      },
      error: (err) => console.error('שגיאה בשמירת ההגדרות', err),
    });
  }

  playRingtone(ringtone: any) {
    const audio = new Audio(ringtone.url);
    audio.play();
  }

  private getGregorianKey(date: NgbDateStruct | NgbDate): string {
    const hebrewCalendar = this.calendar as NgbCalendarHebrew;
    const ngbDate = date instanceof NgbDate ? date : NgbDate.from(date);
    if (!ngbDate) {
      throw new Error('Invalid date used for Gregorian key');
    }
    const gregorian = hebrewCalendar.toGregorian(ngbDate);
    return this.dateKey(gregorian);
  }
}
