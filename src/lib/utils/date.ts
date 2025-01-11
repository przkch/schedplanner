import { holiday } from "@lib/database/schema";

export const getShortDayFormat = (locale?: Intl.LocalesArgument) => {
  return new Intl.DateTimeFormat(locale || "en", { weekday: "short" });
};
export const getShortDay = (date: Date, locale?: Intl.LocalesArgument) => {
  return getShortDayFormat(locale).format(date);
};

export const getFullDate = (date: Date): string => {
  return `${date.toLocaleDateString("pl-PL", { year: "numeric" })}-${date.toLocaleDateString("pl-PL", { month: "2-digit" })}-${date.toLocaleDateString("pl-PL", { day: "2-digit" })}`;
};

export const getDaysCount = (year: number, month: number) => {
  return new Date(year, month, 0).getDate();
};

export interface Days {
  idx: number;
  day: Date;
  shortDay: string;
  isToday: boolean;
  isFree: boolean;
  customHolidayName?: string;
}

export const getDays = (year: number, month: number, holidays: (typeof holiday.$inferSelect)[], locale?: Intl.LocalesArgument): Days[] => {
  const now = new Date();
  const daysCount = getDaysCount(year, month);

  return Array.from(Array(daysCount), (_, i) => {
    i = i + 1;
    const day = new Date(year, month - 1, i);
    const isWeekend = [0, 6].includes(day.getDay());
    const isCustomHoliday = holidays.flatMap((h) => h.date).includes(getFullDate(day));

    return {
      idx: i,
      day: day,
      shortDay: getShortDay(day, locale ?? "en"),
      isToday: now.setHours(0, 0, 0, 0) == day.setHours(0, 0, 0, 0),
      isFree: isWeekend || isCustomHoliday,
      customHolidayName: holidays.find((h) => h.date == getFullDate(day))?.name ?? undefined,
    };
  });
};
