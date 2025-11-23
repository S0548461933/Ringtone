import { Component, OnInit, inject } from '@angular/core';
import {
  NgbCalendar,
  NgbCalendarHebrew,
  NgbDate,
  NgbDatepickerI18n,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { JewishCalendarService, ScheduleEntry } from '../services/jewish-calendar.service';
import { switchMap } from 'rxjs';

interface RingtoneOption {
  id: number;
  label: string;
  fileName: string;
}


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
   defaultRingtones: { id: number; label: string; file: string }[] = [
    { id: 1, label: 'Backroad',            file: 'Backroad.mp3' },
    { id: 2, label: 'Big Easy',            file: 'Big_Easy.mp3' },
    { id: 3, label: 'Bollywood',           file: 'Bollywood.mp3' },
    { id: 4, label: 'Calypso Steel',       file: 'Calypso_Steel.mp3' },
    { id: 5, label: 'Champagne Edition',   file: 'Champagne_Edition.mp3' },
    { id: 6, label: 'Crayon Rock',         file: 'CrayonRock.mp3' },
    { id: 7, label: 'Ether Shake',         file: 'EtherShake.mp3' },
    { id: 8, label: 'Paradise Island',     file: 'Paradise_Island.mp3' },
    { id: 9, label: 'Pyxis',               file: 'Pyxis.mp3' },
    { id: 10, label: 'Romancing The Tone', file: 'RomancingTheTone.mp3' }
  ];
  private readonly ringtoneFileMap: Record<number, string> = {
    1: 'Backroad.mp3',
    2: 'Big_Easy.mp3',
    3: 'Bollywood.mp3',
    4: 'Calypso_Steel.mp3',
    5: 'Champagne_Edition.mp3',
    6: 'CrayonRock.mp3',
    7: 'EtherShake.mp3',
    8: 'Paradise_Island.mp3',
    9: 'Pyxis.mp3',
    10: 'RomancingTheTone.mp3'
  };
  selectedRingtone: number | null = this.defaultRingtones[0]?.id ?? null;

  ringtoneSource: 'default' | 'upload' = 'default';
  selectedRingtoneFile: File | null = null;

  uploadedRingtoneName = '';
  selectedTime: Date | null = null;
  rangeFromText = '';
  rangeToText = '';


  private readonly displayHolidayCategories = new Set(['holiday', 'fast', 'modern', 'roshchodesh']);
  private readonly blockingHolidayCategories = new Set(['holiday', 'modern']);
  private readonly ignoredBlockingTitles = [,'תשעה באב','יום השואה','תענית בכורות','יום העליה','שבועות ב׳','ט״ו בשבט',
    'עשרה בטבת','תענית אסתר','ערב פורים','ל״ג בעומר','יום הזכרון','פסח שני','ערב שבועות','יום ירושלים','יום העצמאות',
    'חג הסיגד','צום י״ז בתמוז', 'סיגד', 'צום גדליה','ראש השנה למעשר בהמה','חנוכה: א׳ נר','חנוכה: ב׳ נרות','חנוכה: ג׳ נרות',
    'חנוכה: ד׳ נרות','חנוכה: ה׳ נרות','חנוכה: ו׳ נרות' ,'חנוכה: ז׳ נרות','חנוכה: ח׳ נרות','שושן פורים קטן','פורים קטן'];
  private readonly hiddenHolidayTitles = ['חג הסיגד', 'סיגד','חג הבנות'];
  private readonly ignoredBlockingTitlesNormalized: Set<string>;
  private readonly hiddenHolidayTitlesNormalized: Set<string>;
  private readonly blockedHolidayDates = new Set<string>();
  private holidayLabels: Record<string, string[]> = {};
  private monthNameLookup: Map<string, number> = new Map();
  private rangeAnchor: NgbDate | null = null;

  readonly weekdayLabels = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  headerSubtitle = 'בחר תאריכים בלוח המשולב כדי לקבוע זמני תזכורות והודעות אוטומטיות';

  constructor(private jewishCalendarService: JewishCalendarService) {
    this.ignoredBlockingTitlesNormalized = new Set(
      this.ignoredBlockingTitles.map((title) => this.normalizeTitle(title))
    );
    this.hiddenHolidayTitlesNormalized = new Set(
      this.hiddenHolidayTitles.map((title) => this.normalizeTitle(title))
    );
  }

  ngOnInit(): void {
    this.buildMonthLookup();
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

          const normalizedTitle = this.normalizeTitle(item?.hebrew ?? item?.title ?? '');
          if (normalizedTitle && this.hiddenHolidayTitlesNormalized.has(normalizedTitle)) {
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
  private normalizeHebrewName(value: string | undefined): string {
    return (value ?? '').replace(/[\"'״׳]/g, '').replace(/\s+/g, '').toLowerCase();
  }

  private buildMonthLookup(): void {
    this.monthNameLookup.clear();
    for (let m = 1; m <= 13; m++) {
      const full = this.normalizeHebrewName(this.i18n.getMonthFullName(m));
      if (full) {
        this.monthNameLookup.set(full, m);
      }
      const shortName = (this.i18n as any)?.getMonthShortName?.(m);
      const short = this.normalizeHebrewName(shortName);
      if (short) {
        this.monthNameLookup.set(short, m);
      }
    }
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

  private compareDates(a: NgbDateStruct | NgbDate, b: NgbDateStruct | NgbDate): number {
    const dateA = a instanceof NgbDate ? a : NgbDate.from(a);
    const dateB = b instanceof NgbDate ? b : NgbDate.from(b);
    if (!dateA || !dateB) {
      return 0;
    }
    if (dateA.year !== dateB.year) {
      return dateA.year - dateB.year;
    }
    if (dateA.month !== dateB.month) {
      return dateA.month - dateB.month;
    }
    return dateA.day - dateB.day;
  }

  isSelected(date: NgbDate): boolean {
    return this.modelList.some((d) => d.year === date.year && d.month === date.month && d.day === date.day);
  }

  isSelectedDay(cell: CalendarCell): boolean {
    return this.isSelected(cell.date);
  }

  selectDay(cell: CalendarCell, event?: MouseEvent): void {
    if (cell.disabled || cell.outside) {
      return;
    }
    if (event?.shiftKey && this.rangeAnchor) {
      this.selectDateRange(this.rangeAnchor, cell.date);
    } else {
      this.selectDate(cell.date);
    }
    this.rangeAnchor = cell.date;
    this.buildMonthGrid();
  }

  private selectDateRange(start: NgbDate, end: NgbDate): void {
    let startDate = NgbDate.from(start);
    let endDate = NgbDate.from(end);
    if (!startDate || !endDate) {
      return;
    }
    if (this.compareDates(startDate, endDate) > 0) {
      [startDate, endDate] = [endDate, startDate];
    }

    let cursor: NgbDate | null = startDate;
    while (cursor && this.compareDates(cursor, endDate) <= 0) {
      this.addDateToSelection(cursor);
      cursor = this.calendar.getNext(cursor, 'd');
    }
  }

  applyTextRange(): void {
    const start = this.parseHebrewDateText(this.rangeFromText);
    const end = this.parseHebrewDateText(this.rangeToText);
    if (!start || !end) {
      return;
    }
    this.selectDateRange(start, end);
    this.rangeAnchor = end;
    this.buildMonthGrid();
  }

  private parseHebrewDateText(value: string | undefined): NgbDate | null {
    const trimmed = (value ?? '').trim();
    if (!trimmed) {
      return null;
    }

    if (!this.monthNameLookup.size) {
      this.buildMonthLookup();
    }

    const parts = trimmed.split(/\s+/);
    if (parts.length < 2) {
      return null;
    }
    const dayPart = parts[0];
    const monthPart = parts.slice(1).join(' ');

    const day = this.hebrewDayToNumber(dayPart);
    if (!day) {
      return null;
    }

    const monthKey = this.normalizeHebrewName(monthPart);
    const month = this.monthNameLookup.get(monthKey);
    if (!month) {
      return null;
    }

    const reference = this.model ?? this.calendar.getToday();
    const candidate = new NgbDate(reference.year, month, day);
    if (this.isDisabled(candidate)) {
      return null;
    }
    return candidate;
  }

  private hebrewDayToNumber(value: string | undefined): number | null {
    const clean = (value ?? '').replace(/[\"'״׳]/g, '').replace(/[^א-ת0-9]/gi, '').toLowerCase();
    if (!clean) {
      return null;
    }

    const dayMap: Record<string, number> = {
      'א': 1,
      'ב': 2,
      'ג': 3,
      'ד': 4,
      'ה': 5,
      'ו': 6,
      'ז': 7,
      'ח': 8,
      'ט': 9,
      'י': 10,
      'יא': 11,
      'יב': 12,
      'יג': 13,
      'יד': 14,
      'טו': 15,
      'טז': 16,
      'יז': 17,
      'יח': 18,
      'יט': 19,
      'כ': 20,
      'כא': 21,
      'כב': 22,
      'כג': 23,
      'כד': 24,
      'כה': 25,
      'כו': 26,
      'כז': 27,
      'כח': 28,
      'כט': 29,
      'ל': 30,
    };

    if (/^\\d+$/.test(clean)) {
      const num = Number(clean);
      return num >= 1 && num <= 30 ? num : null;
    }

    return dayMap[clean] ?? null;
  }

  private addDateToSelection(date: NgbDate): void {
    if (this.isDisabled(date)) {
      return;
    }
    const exists = this.modelList.some((d) => d.year === date.year && d.month === date.month && d.day === date.day);
    if (!exists) {
      this.modelList.push({ year: date.year, month: date.month, day: date.day });
    }
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

  removeDate(date: NgbDateStruct): void {
    this.modelList = this.modelList.filter(
      (d) => !(d.year === date.year && d.month === date.month && d.day === date.day)
    );
    this.buildMonthGrid();
  }

  showDialog() {
    this.visible = true;
  }

  addTime() {
    let h = this.hours ?? 0;
    let m = this.minutes ?? 0;

    if (this.selectedTime instanceof Date) {
      h = this.selectedTime.getHours();
      m = this.selectedTime.getMinutes();
    }

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

  setRingtoneSource(source: 'default' | 'upload'): void {
    this.ringtoneSource = source;
    if (source === 'default') {
      this.selectedRingtoneFile = null;
      this.uploadedRingtoneName = '';
    }
  }

  onRingtoneFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (file) {
      this.selectedRingtoneFile = file;
      this.uploadedRingtoneName = file.name;
      this.ringtoneSource = 'upload';
    } else {
      this.selectedRingtoneFile = null;
      this.uploadedRingtoneName = '';
    }
  }

  get isValid(): boolean {
    return this.modelList.length > 0;
  }

  get canSave(): boolean {
    const hasRingtone =
      this.ringtoneSource === 'default' ? this.selectedRingtone !== null : !!this.selectedRingtoneFile;
    return this.modelList.length > 0 && this.selectedTimes.length > 0 && hasRingtone;
  }
saveSchedules() {
  if (!this.canSave) return;

  // פונקציה שמכינה את ה־payload לפי שם קובץ הצלצול
  const runSave = (ringtoneFile: string) => {
 const hebrewCalendar = this.calendar as NgbCalendarHebrew;

const payload = this.modelList.flatMap(date =>
  this.selectedTimes.map(time => {

    // ממירים את התאריך העברי לגרגוריאני
    const hebrewDate = new NgbDate(date.year, date.month, date.day);
    const greg = hebrewCalendar.toGregorian(hebrewDate);

    const dateStr =
      `${greg.year.toString().padStart(4, '0')}-` +
      `${greg.month.toString().padStart(2, '0')}-` +
      `${greg.day.toString().padStart(2, '0')}`;

    return {
      date: dateStr,
      time,
      ringtoneFile,
    } as ScheduleEntry;
  })
);


    return this.jewishCalendarService.saveRingtones(payload);
  };

  // אם מעלים קובץ חדש
  if (this.ringtoneSource === 'upload' && this.selectedRingtoneFile) {
    this.jewishCalendarService.uploadRingtone(this.selectedRingtoneFile).pipe(
      switchMap(res => runSave(res.fileName)) // שם הקובץ מהשרת
    )
    .subscribe({
      next: () => {
        console.log('נשמר בהצלחה עם צלצול חדש');
        this.visible = false;
      },
      error: (err: any) => {
        console.error('שגיאה בשמירה', err);
      }
    });
  } else {
    // צלצול ברירת מחדל
    const id = this.selectedRingtone;
    if (!id || !this.ringtoneFileMap[id]) {
      console.error('לא נבחר צלצול ברירת מחדל תקין');
      return;
    }

    const fileName = this.ringtoneFileMap[id];

    runSave(fileName).subscribe({
      next: () => {
        console.log('נשמר בהצלחה עם צלצול קיים');
        this.visible = false;
      },
      error: (err: any) => {
        console.error('שגיאה בשמירה', err);
      }
    });
  }


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