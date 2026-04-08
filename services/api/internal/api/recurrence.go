package api

import (
	"strings"
	"time"
)

func expandCalendarEvent(base CalendarEvent, startAt time.Time, endAt *time.Time, recurrence *RecurrenceRule, rangeStart time.Time, rangeEnd time.Time) []CalendarEvent {
	duration := time.Duration(0)
	if endAt != nil {
		duration = endAt.Sub(startAt)
	}

	if recurrence == nil || recurrence.Mode == "" || recurrence.Mode == "does-not-repeat" {
		if !startAt.Before(rangeStart) && !startAt.After(rangeEnd) {
			clone := base
			clone.Date = startAt.Format("2006-01-02")
			clone.StartAt = startAt.Format(time.RFC3339)
			if endAt != nil {
				clone.EndAt = endAt.Format(time.RFC3339)
			}
			return []CalendarEvent{clone}
		}
		return nil
	}

	var results []CalendarEvent
	count := 0
	cursor := startAt
	interval := recurrence.Interval
	if interval < 1 {
		interval = 1
	}

	appendOccurrence := func(current time.Time) bool {
		count += 1
		if isRecurrenceFinished(recurrence, current, count) {
			return false
		}
		if current.Before(rangeStart) || current.After(rangeEnd) {
			return true
		}
		clone := base
		clone.Date = current.Format("2006-01-02")
		clone.StartAt = current.Format(time.RFC3339)
		if duration > 0 {
			clone.EndAt = current.Add(duration).Format(time.RFC3339)
		}
		results = append(results, clone)
		return true
	}

	switch recurrence.Unit {
	case "day":
		for !cursor.After(rangeEnd) {
			if !appendOccurrence(cursor) {
				break
			}
			cursor = cursor.AddDate(0, 0, interval)
		}
	case "week":
		weekdays := recurrence.Weekdays
		if len(weekdays) == 0 {
			weekdays = []string{strings.ToLower(cursor.Weekday().String())}
		}
		firstWeekStart := startOfWeek(cursor)
		for day := startAt; !day.After(rangeEnd); day = day.AddDate(0, 0, 1) {
			if day.Before(startAt) {
				continue
			}
			if !containsWeekday(weekdays, day.Weekday()) {
				continue
			}
			weekDelta := int(startOfWeek(day).Sub(firstWeekStart).Hours() / (24 * 7))
			if weekDelta < 0 || weekDelta%interval != 0 {
				continue
			}
			current := time.Date(day.Year(), day.Month(), day.Day(), startAt.Hour(), startAt.Minute(), startAt.Second(), startAt.Nanosecond(), startAt.Location())
			if !appendOccurrence(current) {
				break
			}
		}
	case "month":
		for !cursor.After(rangeEnd) {
			current := monthlyOccurrence(startAt, cursor, recurrence.MonthlyPattern)
			if current.Before(startAt) {
				cursor = cursor.AddDate(0, interval, 0)
				continue
			}
			if !appendOccurrence(current) {
				break
			}
			cursor = cursor.AddDate(0, interval, 0)
		}
	default:
		for !cursor.After(rangeEnd) {
			if !appendOccurrence(cursor) {
				break
			}
			cursor = cursor.AddDate(0, 0, interval)
		}
	}

	return results
}

func isRecurrenceFinished(rule *RecurrenceRule, occurrence time.Time, count int) bool {
	switch rule.End.Type {
	case "on-date":
		if rule.End.EndDate == "" {
			return false
		}
		endDate, err := time.Parse("2006-01-02", rule.End.EndDate)
		if err != nil {
			return false
		}
		if occurrence.After(endDate.Add(23*time.Hour + 59*time.Minute + 59*time.Second)) {
			return true
		}
	case "after-occurrences":
		if rule.End.Occurrences > 0 && count > rule.End.Occurrences {
			return true
		}
	}
	return false
}

func startOfWeek(value time.Time) time.Time {
	offset := (int(value.Weekday()) + 6) % 7
	trimmed := time.Date(value.Year(), value.Month(), value.Day(), 0, 0, 0, 0, value.Location())
	return trimmed.AddDate(0, 0, -offset)
}

func containsWeekday(values []string, weekday time.Weekday) bool {
	target := strings.ToLower(weekday.String())
	for _, value := range values {
		if strings.ToLower(value) == target {
			return true
		}
	}
	return false
}

func monthlyOccurrence(reference time.Time, cursor time.Time, pattern string) time.Time {
	monthStart := time.Date(cursor.Year(), cursor.Month(), 1, reference.Hour(), reference.Minute(), reference.Second(), reference.Nanosecond(), reference.Location())
	if pattern == "first-weekday" {
		for day := monthStart; day.Month() == monthStart.Month(); day = day.AddDate(0, 0, 1) {
			if day.Weekday() == reference.Weekday() {
				return day
			}
		}
	}
	day := reference.Day()
	lastDay := time.Date(cursor.Year(), cursor.Month()+1, 0, reference.Hour(), reference.Minute(), reference.Second(), reference.Nanosecond(), reference.Location()).Day()
	if day > lastDay {
		day = lastDay
	}
	return time.Date(cursor.Year(), cursor.Month(), day, reference.Hour(), reference.Minute(), reference.Second(), reference.Nanosecond(), reference.Location())
}
