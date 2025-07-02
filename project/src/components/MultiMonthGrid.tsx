import React from 'react';
import { CalendarGrid } from './CalendarGrid';
import { Task, Occasion } from '../types';
import { ViewMode } from '../types';

interface MultiMonthGridProps {
  currentDate: Date;
  today: Date;
  viewMode: ViewMode;
  getTasksForDate: (date: Date) => Task[];
  getOccasionsForDate: (date: Date) => Occasion[];
  onDayClick: (date: Date) => void;
}

export const MultiMonthGrid: React.FC<MultiMonthGridProps> = ({
  currentDate,
  today,
  viewMode,
  getTasksForDate,
  getOccasionsForDate,
  onDayClick
}) => {
  const getMonthsToShow = () => {
    const months = [];
    const monthCount = viewMode === 'single' ? 1 : viewMode === 'double' ? 2 : 3;
    
    for (let i = 0; i < monthCount; i++) {
      months.push(new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1));
    }
    
    return months;
  };

  const months = getMonthsToShow();

  const getGridClasses = () => {
    if (viewMode === 'single') return 'grid grid-cols-1';
    if (viewMode === 'double') return 'grid grid-cols-1 lg:grid-cols-2 gap-8';
    return 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8';
  };

  return (
    <div className={getGridClasses()}>
      {months.map((monthDate, index) => (
        <div key={index} className="space-y-4">
          {viewMode !== 'single' && (
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
            </div>
          )}
          <CalendarGrid
            currentDate={monthDate}
            today={today}
            getTasksForDate={getTasksForDate}
            getOccasionsForDate={getOccasionsForDate}
            onDayClick={onDayClick}
          />
        </div>
      ))}
    </div>
  );
};