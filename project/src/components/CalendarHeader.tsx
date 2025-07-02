import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, Grid3X3, Grid2X2, Square, Moon, Sun } from 'lucide-react';
import { getMonthName } from '../utils/dateUtils';
import { ViewMode } from '../types';

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: ViewMode;
  isDarkMode: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onViewModeChange: (mode: ViewMode) => void;
  onToggleDarkMode: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  viewMode,
  isDarkMode,
  onPrevMonth,
  onNextMonth,
  onToday,
  onViewModeChange,
  onToggleDarkMode
}) => {
  const month = getMonthName(currentDate.getMonth());
  const year = currentDate.getFullYear();

  const getDisplayTitle = () => {
    if (viewMode === 'single') {
      return `${month} ${year}`;
    } else if (viewMode === 'double') {
      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
      return `${month} - ${getMonthName(nextMonth.getMonth())} ${nextMonth.getFullYear()}`;
    } else {
      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
      const thirdMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 1);
      return `${month} - ${getMonthName(thirdMonth.getMonth())} ${thirdMonth.getFullYear()}`;
    }
  };

  const viewModeButtons = [
    { mode: 'single' as ViewMode, icon: Square, label: '1 Month' },
    { mode: 'double' as ViewMode, icon: Grid2X2, label: '2 Months' },
    { mode: 'triple' as ViewMode, icon: Grid3X3, label: '3 Months' },
  ];

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Rajarshi's Code Schedule
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your personal task calendar</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          <button
            onClick={onToday}
            className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 border border-blue-200 dark:border-blue-800"
          >
            Today
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onPrevMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 text-gray-600 dark:text-gray-400"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="min-w-[200px] text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {getDisplayTitle()}
              </h2>
            </div>
            
            <button
              onClick={onNextMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 text-gray-600 dark:text-gray-400"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* View Mode Controls */}
      <div className="flex justify-center">
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 shadow-sm">
          {viewModeButtons.map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                viewMode === mode
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};