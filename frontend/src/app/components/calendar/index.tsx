"use client";
import './index.css';
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Ratings {
  [key: string]: "string";
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [ratings, setRatings] = useState<Ratings>({});

  // Load and persist ratings in local storage
  useEffect(() => {
    const savedRatings = localStorage.getItem("calendarRatings");
    if (savedRatings) {
      setRatings(JSON.parse(savedRatings));
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

  // Custom render for each day cell
  const renderDayCell = (info: any) => {
    const dayNumber = format(info.date, "d"); // Get the day of the month (date number)
  return (
    <div className="relative h-full w-full">
      <div className="absolute top-1 right-2 text-sm text-gray-700">{dayNumber}</div>
      <button className="absolute top-11 right-1 w-15 h-1.5 bg-purple-200 rounded-full" title="moody"></button>
    </div>
  );
  };

  

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="custom-calendar ">
        <FullCalendar 
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev next",
            center: "title",
            right: "dayGridMonth timeGridWeek timeGridDay",
          }}
          events={[]} 
          dayCellContent={renderDayCell} 
        />
      </div>
  
    </div>
  );
};

export default Calendar;
