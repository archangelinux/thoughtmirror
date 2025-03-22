'use client';

import React, { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from "date-fns";
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

const RatingCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [ratings, setRatings] = useState<Ratings>({});
  const [showChart, setShowChart] = useState<boolean>(false);

  useEffect(() => {
    const savedRatings = localStorage.getItem("calendarRatings");
    if (savedRatings) {
      setRatings(JSON.parse(savedRatings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("calendarRatings", JSON.stringify(ratings));
  }, [ratings]);

  const getDaysInMonth = (): Date[] => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

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

  const getChartData = () => {
    return getDaysInMonth().map((date) => ({
      date: format(date, "dd"),
      rating: ratings[format(date, "yyyy-MM-dd")] || 0,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => setCurrentDate((date) => subMonths(date, 1))}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Previous
        </button>
        <h2 className="text-2xl font-bold">{format(currentDate, "MMMM yyyy")}</h2>
        <button
          onClick={() => setCurrentDate((date) => addMonths(date, 1))}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Next
        </button>
      </div>

      <button
        onClick={() => setShowChart(!showChart)}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        {showChart ? "Show Calendar" : "Show Chart"}
      </button>

      {showChart ? (
        <div className="h-96 w-full">
          <ResponsiveContainer>
            <BarChart data={getChartData()}>
              <XAxis dataKey="date" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="rating" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-bold">
              {day}
            </div>
          ))}
          {getDaysInMonth().map((date) => (
            <div
              key={date.toString()}
              className="p-2 border rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="text-right mb-2">{format(date, "d")}</div>
              <RatingInput date={date} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RatingCalendar;
