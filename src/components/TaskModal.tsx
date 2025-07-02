import React, { useState, useEffect } from 'react';
import { X, Plus, Check, Trash2, Edit3, Star, Calendar } from 'lucide-react';
import { Task, Occasion } from '../types';
import { getOccasionColorClasses, getOccasionTypeLabel } from '../utils/occasionUtils';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  tasks: Task[];
  occasions: Occasion[];
  onAddTask: (date: Date, text: string) => void;
  onUpdateTask: (date: Date, taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (date: Date, taskId: string) => void;
  onAddOccasion: (date: Date, text: string, color: Occasion['color']) => void;
  onUpdateOccasion: (date: Date, occasionId: string, updates: Partial<Occasion>) => void;
  onDeleteOccasion: (date: Date, occasionId: string) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  tasks,
  occasions,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onAddOccasion,
  onUpdateOccasion,
  onDeleteOccasion
}) => {
  const [newTask, setNewTask] = useState('');
  const [newOccasion, setNewOccasion] = useState('');
  const [occasionColor, setOccasionColor] = useState<Occasion['color']>('personal');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingOccasionId, setEditingOccasionId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [editingColor, setEditingColor] = useState<Occasion['color']>('personal');
  const [activeTab, setActiveTab] = useState<'tasks' | 'occasions'>('tasks');

  useEffect(() => {
    if (isOpen) {
      setNewTask('');
      setNewOccasion('');
      setOccasionColor('personal');
      setEditingTaskId(null);
      setEditingOccasionId(null);
      setEditingText('');
      setEditingColor('personal');
      // Switch to occasions tab if there are occasions but no tasks
      if (occasions.length > 0 && tasks.length === 0) {
        setActiveTab('occasions');
      } else {
        setActiveTab('tasks');
      }
    }
  }, [isOpen, occasions.length, tasks.length]);

  if (!isOpen) return null;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAddTask(selectedDate, newTask);
      setNewTask('');
    }
  };

  const handleAddOccasion = (e: React.FormEvent) => {
    e.preventDefault();
    if (newOccasion.trim()) {
      onAddOccasion(selectedDate, newOccasion, occasionColor);
      setNewOccasion('');
      setOccasionColor('personal');
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingText(task.text);
  };

  const handleEditOccasion = (occasion: Occasion) => {
    setEditingOccasionId(occasion.id);
    setEditingText(occasion.text);
    setEditingColor(occasion.color);
  };

  const handleSaveTaskEdit = () => {
    if (editingTaskId && editingText.trim()) {
      onUpdateTask(selectedDate, editingTaskId, { text: editingText.trim() });
      setEditingTaskId(null);
      setEditingText('');
    }
  };

  const handleSaveOccasionEdit = () => {
    if (editingOccasionId && editingText.trim()) {
      onUpdateOccasion(selectedDate, editingOccasionId, { 
        text: editingText.trim(),
        color: editingColor
      });
      setEditingOccasionId(null);
      setEditingText('');
      setEditingColor('personal');
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingOccasionId(null);
    setEditingText('');
    setEditingColor('personal');
  };

  const toggleTaskComplete = (task: Task) => {
    onUpdateTask(selectedDate, task.id, { completed: !task.completed });
  };

  const formatDisplayDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const occasionColors: Occasion['color'][] = ['birthday', 'holiday', 'meeting', 'deadline', 'celebration', 'personal'];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Day Details</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {formatDisplayDate(selectedDate)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 text-gray-500 dark:text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
              activeTab === 'tasks'
                ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Tasks ({tasks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('occasions')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
              activeTab === 'occasions'
                ? 'text-purple-600 dark:text-purple-400 bg-white dark:bg-gray-800 border-b-2 border-purple-600 dark:border-purple-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Occasions ({occasions.length})</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'tasks' ? (
            // Tasks Tab
            <>
              {tasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-600 mb-4">
                    <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Check className="w-8 h-8" />
                    </div>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No tasks for this day</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add your first task below</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl group hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                      <button
                        onClick={() => toggleTaskComplete(task)}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          task.completed
                            ? 'bg-green-500 border-green-500 text-white shadow-lg'
                            : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500'
                        }`}
                      >
                        {task.completed && <Check className="w-4 h-4" />}
                      </button>

                      {editingTaskId === task.id ? (
                        <div className="flex-1 flex items-center space-x-2">
                          <input
                            type="text"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveTaskEdit();
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                          />
                          <button
                            onClick={handleSaveTaskEdit}
                            className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 p-1"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span
                            className={`flex-1 font-medium ${
                              task.completed
                                ? 'text-gray-500 dark:text-gray-400 line-through'
                                : 'text-gray-900 dark:text-gray-100'
                            }`}
                          >
                            {task.text}
                          </span>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                            <button
                              onClick={() => handleEditTask(task)}
                              className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteTask(selectedDate, task.id)}
                              className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            // Occasions Tab
            <>
              {occasions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-600 mb-4">
                    <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Star className="w-8 h-8" />
                    </div>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No special occasions</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Mark this day as special below</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {occasions.map((occasion) => {
                    const colorClasses = getOccasionColorClasses(occasion.color);
                    return (
                      <div
                        key={occasion.id}
                        className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl group hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                      >
                        {editingOccasionId === occasion.id ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveOccasionEdit();
                                if (e.key === 'Escape') handleCancelEdit();
                              }}
                            />
                            <div className="flex items-center justify-between">
                              <select
                                value={editingColor}
                                onChange={(e) => setEditingColor(e.target.value as Occasion['color'])}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                              >
                                {occasionColors.map((color) => (
                                  <option key={color} value={color}>
                                    {getOccasionTypeLabel(color)}
                                  </option>
                                ))}
                              </select>
                              <div className="flex space-x-2">
                                <button
                                  onClick={handleSaveOccasionEdit}
                                  className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 p-1"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`px-3 py-1 rounded-full text-xs font-medium ${colorClasses.bg} ${colorClasses.text}`}>
                                {getOccasionTypeLabel(occasion.color)}
                              </div>
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                {occasion.text}
                              </span>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                              <button
                                onClick={() => handleEditOccasion(occasion)}
                                className="p-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onDeleteOccasion(selectedDate, occasion.id)}
                                className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Add forms */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
          {activeTab === 'tasks' ? (
            <form onSubmit={handleAddTask} className="flex space-x-3">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={!newTask.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleAddOccasion} className="space-y-3">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newOccasion}
                  onChange={(e) => setNewOccasion(e.target.value)}
                  placeholder="Add a special occasion..."
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <button
                  type="submit"
                  disabled={!newOccasion.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Star className="w-5 h-5" />
                </button>
              </div>
              <select
                value={occasionColor}
                onChange={(e) => setOccasionColor(e.target.value as Occasion['color'])}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                {occasionColors.map((color) => (
                  <option key={color} value={color}>
                    {getOccasionTypeLabel(color)}
                  </option>
                ))}
              </select>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};