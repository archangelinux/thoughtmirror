"use client";
import './index.css';
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from "date-fns";
import { useRouter } from 'next/navigation';
import DistortionWidget from '@/app/components/distortionwidget';

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
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  // Add state for distortions data fetched from backend
  const [distortionData, setDistortionData] = useState<any[]>([]);

  // Fetch distortion data from backend on mount
  useEffect(() => {
    fetch("http://127.0.0.1:8000/get_calendar_distortions")
      .then(res => res.json())
      .then(data => setDistortionData(data))
      .catch(err => console.error("Failed to fetch distortions:", err));
  }, []);

  //local storage
  useEffect(() => {
    const savedEntries = localStorage.getItem("journalEntries");
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Find entries for a specific date
  const findEntriesForDate = (date: Date): JournalEntry[] => {
    return entries.filter(entry => {
      const entryDate = parseISO(entry.createdAt);
      return isSameDay(entryDate, date);
    });
  };

  const getMostRecentEntryForDate = (date: Date): JournalEntry | null => {
    const dateEntries = findEntriesForDate(date);
    if (dateEntries.length === 0) return null;

    return dateEntries.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  };

  const handleDateClick = (info: any) => {
    const clickedDate = info.date;
    const entry = getMostRecentEntryForDate(clickedDate);

    if (entry) {
      localStorage.setItem("selectedEntryId", entry.id);
      router.push('/pages/journal');
    }
  };

  //custome rendering of cells
  const renderDayCell = (info: any) => {
    const dayNumber = format(info.date, "d");
  
    // Find distortions for the specific date
    const dayDistortionEntry = distortionData.find((entry) =>
      isSameDay(parseISO(entry.createdAt), info.date)
    );
  
    return (
      <div className="relative h-full w-full flex flex-col justify-between">
        <div className="absolute top-1 right-2 text-sm text-gray-700">{dayNumber}</div>
  
        {/* If distortions exist for the day, render DistortionWidget */}
        {dayDistortionEntry && (
          <div className="absolute top-[-30px] right-2">
            <DistortionWidget
              distortionTraits={dayDistortionEntry.distortions.map((distortionName: string) => ({
                name: distortionName,
                active: true
              }))}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="custom-calendar">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={[]}
          dayCellContent={renderDayCell}
          dateClick={handleDateClick}
        />
      </div>
    </div>
  );
};

export default Calendar;