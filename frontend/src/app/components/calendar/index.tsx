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
  const [distortionsData, setDistortionsData] = useState<any[]>([]);

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
      return (
        entryDate.getUTCMonth() === date.getUTCMonth() &&
        entryDate.getUTCDate() === date.getUTCDate()
      );
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
    console.log(clickedDate)
    const entry = getMostRecentEntryForDate(clickedDate);

    if (entry) {
      localStorage.setItem("selectedEntryId", entry.id);
      router.push('/pages/journal');
    }
  };

  //custom rendering of cells
  const renderDayCell = (info: any) => {
    const dayNumber = format(info.date, "d");
    const numEntries = findEntriesForDate(info.date).length;
  
    return (
      <div className="relative h-full w-full flex flex-col">
        <div className="h-3 w-full flex flex-row justify-between items-center">
          <div className="absolute mt-4 right-10 text-[9px] text-gray-700">
            Entries: {numEntries}
          </div>
          <div className="text-sm mt-1 mr-1 text-gray-700">
            {dayNumber}
          </div>
        </div>
  
        <div>
          {numEntries > 0 && (
            <div className="absolute top-[-30px] right-2">
              <DistortionWidget
                distortionTraits={[
                  { name: "Personalization", active: true },
                  { name: "Labeling", active: true },
                  { name: "Fortune-Telling", active: true },
                  { name: "Magnification", active: true },
                  { name: "Mind Reading", active: true },
                  { name: "All-Or-Nothing", active: true },
                  { name: "Overgeneralization", active: true },
                  { name: "Mental Filter", active: true },
                  { name: "Emotional Reasoning", active: true },
                  { name: "Should Statements", active: true }
                ]}
              />
            </div>
          )}
        </div>
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