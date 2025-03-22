"use client";
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
  [key: string]: number;
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

  const handleRating = (date: Date, rating: number) => {
    setRatings((prev) => ({
      ...prev,
      [format(date, "yyyy-MM-dd")]: rating,
    }));
  };

  const RatingInput: React.FC<{ date: Date }> = ({ date }) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const rating = ratings[dateStr] || "";
    return (
      <input
        type="number"
        value={rating}
        onChange={(e) => handleRating(date, Number(e.target.value))}
        className="w-full p-1 border rounded text-center"
        min="0"
        max="5"
      />
    );
  };

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

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="custom-calendar">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={[]} // No event data provided
        />
      </div>
      {/* Example: Render a chart based on the rating data */}
      <div className="mt-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={getChartData()}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="rating" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Calendar;
