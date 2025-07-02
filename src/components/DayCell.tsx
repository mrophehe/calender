import React from 'react';
import { isSameDay } from '../utils/dateUtils';
import { getOccasionColorClasses } from '../utils/occasionUtils';
import { Task, Occasion } from '../types';

interface DayCellProps {
  date: Date;
  currentMonth: number;
  today: Date;
  tasks: Task[];
  occasions: Occasion[];
  onClick: (date: Date) => void;
}

export const DayCell: React.FC<DayCellProps> = ({
  date,
  currentMonth,
  today,
  tasks,
  occasions,
  onClick
}) => {
  const isCurrentMonth = date.getMonth() === currentMonth;
  const isToday = isSameDay(date, today);
  const dayNumber = date.getDate();
  
  const hasTasks = tasks.length > 0;
  const hasCompletedTasks = tasks.some(task => task.completed);
  const hasPendingTasks = tasks.some(task => !task.completed);
  const hasOccasions = occasions.length > 0;
  
  // Determine the background color based on task status and occasions
  const getBackgroundColor = () => {
    if (!isCurrentMonth) return 'bg-gray-50 dark:bg-gray-800/50';
    if (isToday) return 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30';
    if (hasOccasions) return 'bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/30 dark:to-amber-800/30';
    if (hasPendingTasks) return 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30';
    if (hasCompletedTasks && !hasPendingTasks) return 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30';
    return 'bg-white dark:bg-gray-800';
  };

  const getBorderColor = () => {
    if (!isCurrentMonth) return 'border-gray-200 dark:border-gray-700';
    if (isToday) return 'border-blue-300 dark:border-blue-600';
    if (hasOccasions) return 'border-yellow-300 dark:border-yellow-600';
    if (hasPendingTasks) return 'border-red-300 dark:border-red-600';
    if (hasCompletedTasks && !hasPendingTasks) return 'border-green-300 dark:border-green-600';
    return 'border-gray-200 dark:border-gray-700';
  };

  const cellClasses = [
    'min-h-[120px] p-3 border cursor-pointer transition-all duration-200',
    'hover:shadow-lg hover:scale-[1.02] hover:z-10 relative',
    'flex flex-col rounded-lg',
    getBackgroundColor(),
    getBorderColor()
  ];

  if (!isCurrentMonth) {
    cellClasses.push('text-gray-400 dark:text-gray-600');
  }

  return (
    <div
      className={cellClasses.join(' ')}
      onClick={() => onClick(date)}
    >
      {/* Day number and status indicators */}
      <div className="flex justify-between items-start mb-2">
        <span className={`text-sm font-semibold ${
          isToday && isCurrentMonth ? 'text-blue-700 dark:text-blue-300 font-bold' : 
          !isCurrentMonth ? 'text-gray-400 dark:text-gray-600' : 'text-gray-900 dark:text-gray-100'
        }`}>
          {dayNumber}
        </span>
        
        {/* Status indicators */}
        <div className="flex space-x-1">
          {hasOccasions && isCurrentMonth && (
            <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full shadow-sm animate-pulse" title="Special occasion"></div>
          )}
          {hasPendingTasks && isCurrentMonth && (
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-sm" title="Pending tasks"></div>
          )}
          {hasCompletedTasks && !hasPendingTasks && isCurrentMonth && (
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-sm" title="All tasks completed"></div>
          )}
        </div>
      </div>
      
      {/* Today label */}
      {isToday && isCurrentMonth && (
        <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/50 rounded-full text-center">
          Today
        </div>
      )}
      
      {/* Occasions */}
      {isCurrentMonth && occasions.length > 0 && (
        <div className="mb-2 space-y-1">
          {occasions.slice(0, 1).map((occasion) => {
            const colorClasses = getOccasionColorClasses(occasion.color);
            return (
              <div
                key={occasion.id}
                className={`text-xs px-2 py-1 rounded-md truncate shadow-sm ${colorClasses.bg} ${colorClasses.text}`}
                title={occasion.text}
              >
                ✨ {occasion.text}
              </div>
            );
          })}
          {occasions.length > 1 && (
            <div className="text-xs text-yellow-600 dark:text-yellow-400 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/50 rounded-md text-center font-medium">
              +{occasions.length - 1} more
            </div>
          )}
        </div>
      )}
      
      {/* Tasks list */}
      {isCurrentMonth && tasks.length > 0 && (
        <div className="flex-1 space-y-1.5 overflow-hidden">
          {tasks.slice(0, hasOccasions ? 1 : 2).map((task) => (
            <div
              key={task.id}
              className={`text-xs px-2 py-1 rounded-md truncate transition-all duration-200 ${
                task.completed 
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 line-through' 
                  : 'bg-white/90 dark:bg-gray-700/90 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 shadow-sm'
              }`}
              title={task.text}
            >
              {task.text}
            </div>
          ))}
          {tasks.length > (hasOccasions ? 1 : 2) && (
            <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-center font-medium">
              +{tasks.length - (hasOccasions ? 1 : 2)} more
            </div>
          )}
        </div>
      )}
    </div>
  );
};