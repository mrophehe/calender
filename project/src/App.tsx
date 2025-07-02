import React, { useState } from 'react';
import { CalendarHeader } from './components/CalendarHeader';
import { MultiMonthGrid } from './components/MultiMonthGrid';
import { TaskModal } from './components/TaskModal';
import { useTasks } from './hooks/useTasks';
import { useOccasions } from './hooks/useOccasions';
import { useDarkMode } from './hooks/useDarkMode';
import { ViewMode } from './types';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const today = new Date();

  const { addTask, updateTask, deleteTask, getTasksForDate } = useTasks();
  const { addOccasion, updateOccasion, deleteOccasion, getOccasionsForDate } = useOccasions();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handlePrevMonth = () => {
    const monthsToMove = viewMode === 'single' ? 1 : viewMode === 'double' ? 2 : 3;
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - monthsToMove, 1));
  };

  const handleNextMonth = () => {
    const monthsToMove = viewMode === 'single' ? 1 : viewMode === 'double' ? 2 : 3;
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + monthsToMove, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    // Reset to current month when changing view modes
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  const selectedTasks = selectedDate ? getTasksForDate(selectedDate) : [];
  const selectedOccasions = selectedDate ? getOccasionsForDate(selectedDate) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <CalendarHeader
          currentDate={currentDate}
          viewMode={viewMode}
          isDarkMode={isDarkMode}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
          onViewModeChange={handleViewModeChange}
          onToggleDarkMode={toggleDarkMode}
        />
        
        <MultiMonthGrid
          currentDate={currentDate}
          today={today}
          viewMode={viewMode}
          getTasksForDate={getTasksForDate}
          getOccasionsForDate={getOccasionsForDate}
          onDayClick={handleDayClick}
        />

        {selectedDate && (
          <TaskModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            selectedDate={selectedDate}
            tasks={selectedTasks}
            occasions={selectedOccasions}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onAddOccasion={addOccasion}
            onUpdateOccasion={updateOccasion}
            onDeleteOccasion={deleteOccasion}
          />
        )}
      </div>
    </div>
  );
}

export default App;