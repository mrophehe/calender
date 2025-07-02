import React from 'react';
import { DayCell } from './DayCell';
import { getDaysInMonth, getDayName } from '../utils/dateUtils';
import { Task, Occasion } from '../types';

interface CalendarGridProps {
  currentDate: Date;
  today: Date;
  getTasksForDate: (date: Date) => Task[];
  getOccasionsForDate: (date: Date) => Occasion[];
  onDayClick: (date: Date) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  today,
  getTasksForDate,
  getOccasionsForDate,
  onDayClick
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = getDaysInMonth(year, month);
  
  const weekdays = Array.from({ length: 7 }, (_, i) => getDayName(i));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        {weekdays.map((day) => (
          <div
            key={day}
            className="p-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.slice(0, 3)}</span>
          </div>
        ))}
      </div>
      
      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-600">
        {days.map((date, index) => (
          <DayCell
            key={index}
            date={date}
            currentMonth={month}
            today={today}
            tasks={getTasksForDate(date)}
            occasions={getOccasionsForDate(date)}
            onClick={onDayClick}
          />
        ))}
      </div>
    </div>
  );
};