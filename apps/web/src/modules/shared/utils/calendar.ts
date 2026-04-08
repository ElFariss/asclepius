import type { CalendarEvent } from "@/types/domain";

export interface CalendarDayCell {
  date: Date;
  isoDate: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

const weekStartMonday = (date: Date) => {
  const value = new Date(date);
  const day = (value.getDay() + 6) % 7;
  value.setDate(value.getDate() - day);
  value.setHours(0, 0, 0, 0);
  return value;
};

export const buildMonthGrid = (year: number, monthIndex: number): CalendarDayCell[] => {
  const firstDay = new Date(year, monthIndex, 1);
  const gridStart = weekStartMonday(firstDay);
  const cells: CalendarDayCell[] = [];

  for (let index = 0; index < 42; index += 1) {
    const current = new Date(gridStart);
    current.setDate(gridStart.getDate() + index);

    cells.push({
      date: current,
      isoDate: current.toISOString().slice(0, 10),
      dayNumber: current.getDate(),
      isCurrentMonth: current.getMonth() === monthIndex,
      isToday: current.toDateString() === new Date().toDateString(),
    });
  }

  return cells;
};

export const groupEventsByDate = (events: CalendarEvent[]) =>
  events.reduce<Record<string, CalendarEvent[]>>((accumulator, event) => {
    accumulator[event.date] ??= [];
    accumulator[event.date].push(event);
    return accumulator;
  }, {});

export const truncatePreview = (value: string, maxLength = 18) =>
  value.length <= maxLength ? value : `${value.slice(0, maxLength).trim()}...`;

export const monthLabel = (year: number, monthIndex: number) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, monthIndex, 1));

export const yearMonths = (year: number) =>
  Array.from({ length: 12 }, (_, index) => ({
    monthIndex: index,
    label: monthLabel(year, index),
    cells: buildMonthGrid(year, index),
  }));

export const timeLabel = (value?: string) => {
  if (!value) {
    return "";
  }
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

export const describeEventTime = (event: CalendarEvent) => {
  if (event.allDay) {
    return "All day";
  }
  const start = timeLabel(event.startAt);
  const end = timeLabel(event.endAt);
  return end ? `${start} - ${end}` : start;
};

export const eventTypeLabel = (value: CalendarEvent["type"]) =>
  value === "appointment" ? "Appointment" : value === "medication" ? "Medicine" : value === "surgery" ? "Surgery" : "Task";
