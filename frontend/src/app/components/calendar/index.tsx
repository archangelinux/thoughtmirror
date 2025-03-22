"use client";
import './index.css';
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from "date-fns";
import { useRouter } from 'next/navigation';

interface Ratings {
  [key: string]: "string";
}

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const Calendar: React.FC = () => {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [ratings, setRatings] = useState<Ratings>({});
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  // Load and persist ratings in local storage
  useEffect(() => {
    const savedRatings = localStorage.getItem("calendarRatings");
    if (savedRatings) {
      setRatings(JSON.parse(savedRatings));
    }

    // Load journal entries from localStorage
    const savedEntries = localStorage.getItem("journalEntries");
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("calendarRatings", JSON.stringify(ratings));
  }, [ratings]);

  // Helper functions for chart data
  const getDaysInMonth = (): Date[] => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const getChartData = () => {
    return getDaysInMonth().map((date) => ({
      date: format(date, "dd"),
      rating: ratings[format(date, "yyyy-MM-dd")] || 0,
    }));
  };

  // Find entries for a specific date
  const findEntriesForDate = (date: Date): JournalEntry[] => {
    return entries.filter(entry => {
      const entryDate = parseISO(entry.createdAt);
      return isSameDay(entryDate, date);
    });
  };

  // Get the most recent entry for a date
  const getMostRecentEntryForDate = (date: Date): JournalEntry | null => {
    const dateEntries = findEntriesForDate(date);
    if (dateEntries.length === 0) return null;

    return dateEntries.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  };

  // Handle day click
  const handleDateClick = (info: any) => {
    const clickedDate = info.date;
    const entry = getMostRecentEntryForDate(clickedDate);

    if (entry) {
      localStorage.setItem("selectedEntryId", entry.id);
      router.push('/pages/journal');
    }
  };

  // Custom render for each day cell
  const renderDayCell = (info: any) => {
    const dayNumber = format(info.date, "d"); // Get the day of the month
    const hasEntries = findEntriesForDate(info.date).length > 0;

    return (
      <div className="relative h-full w-full">
        <div className="absolute top-1 right-2 text-sm text-gray-700">{dayNumber}</div>
        {hasEntries && (
          <>
            <button className="absolute top-11 right-0.5 w-15 h-1.5 bg-purple-200 rounded-full" title="moody"></button>
            <div className="absolute top-0.5 right-0.5 w-1 h-1 z-[-10] bg-blue-300 rounded-full" title="Has journal entries"></div>
          </>)}
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="custom-calendar">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev next",
            center: "title",
            right: "dayGridMonth timeGridWeek",
          }}
          events={[]}
          dayCellContent={renderDayCell}
          dateClick={handleDateClick}
        />
      </div>
    </div>
  );
};

export default Calendar;