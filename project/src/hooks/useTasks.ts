import { useState, useEffect } from 'react';
import { Task, DayTasks } from '../types';
import { formatDateKey } from '../utils/dateUtils';

const TASKS_STORAGE_KEY = 'rajarshi-code-schedule-tasks';
const BACKUP_STORAGE_KEY = 'rajarshi-code-schedule-tasks-backup';

export const useTasks = () => {
  const [tasks, setTasks] = useState<DayTasks>({});

  // Load tasks from localStorage on mount
  useEffect(() => {
    const loadTasks = () => {
      try {
        // Try to load from primary storage
        const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
        if (savedTasks) {
          const parsedTasks = JSON.parse(savedTasks);
          const convertedTasks: DayTasks = {};
          
          Object.keys(parsedTasks).forEach(dateKey => {
            convertedTasks[dateKey] = parsedTasks[dateKey].map((task: any) => ({
              ...task,
              createdAt: new Date(task.createdAt)
            }));
          });
          
          setTasks(convertedTasks);
          // Create backup after successful load
          localStorage.setItem(BACKUP_STORAGE_KEY, savedTasks);
          return;
        }

        // If primary storage fails, try backup
        const backupTasks = localStorage.getItem(BACKUP_STORAGE_KEY);
        if (backupTasks) {
          const parsedTasks = JSON.parse(backupTasks);
          const convertedTasks: DayTasks = {};
          
          Object.keys(parsedTasks).forEach(dateKey => {
            convertedTasks[dateKey] = parsedTasks[dateKey].map((task: any) => ({
              ...task,
              createdAt: new Date(task.createdAt)
            }));
          });
          
          setTasks(convertedTasks);
          // Restore primary storage from backup
          localStorage.setItem(TASKS_STORAGE_KEY, backupTasks);
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
        // Try to load from backup if primary fails
        try {
          const backupTasks = localStorage.getItem(BACKUP_STORAGE_KEY);
          if (backupTasks) {
            const parsedTasks = JSON.parse(backupTasks);
            const convertedTasks: DayTasks = {};
            
            Object.keys(parsedTasks).forEach(dateKey => {
              convertedTasks[dateKey] = parsedTasks[dateKey].map((task: any) => ({
                ...task,
                createdAt: new Date(task.createdAt)
              }));
            });
            
            setTasks(convertedTasks);
          }
        } catch (backupError) {
          console.error('Error loading backup tasks:', backupError);
        }
      }
    };

    loadTasks();
  }, []);

  // Save tasks with backup strategy
  const saveTasks = (newTasks: DayTasks) => {
    try {
      const tasksToSave = JSON.stringify(newTasks);
      
      // Save to primary storage
      localStorage.setItem(TASKS_STORAGE_KEY, tasksToSave);
      
      // Create backup
      localStorage.setItem(BACKUP_STORAGE_KEY, tasksToSave);
      
      // Update state
      setTasks(newTasks);
    } catch (error) {
      console.error('Error saving tasks:', error);
      // Even if localStorage fails, update state so UI remains functional
      setTasks(newTasks);
    }
  };

  const addTask = (date: Date, text: string) => {
    const dateKey = formatDateKey(date);
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: new Date()
    };

    const newTasks = {
      ...tasks,
      [dateKey]: [...(tasks[dateKey] || []), newTask]
    };
    saveTasks(newTasks);
  };

  const updateTask = (date: Date, taskId: string, updates: Partial<Task>) => {
    const dateKey = formatDateKey(date);
    const dayTasks = tasks[dateKey] || [];
    
    const newTasks = {
      ...tasks,
      [dateKey]: dayTasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    };
    saveTasks(newTasks);
  };

  const deleteTask = (date: Date, taskId: string) => {
    const dateKey = formatDateKey(date);
    const dayTasks = tasks[dateKey] || [];
    
    const newTasks = {
      ...tasks,
      [dateKey]: dayTasks.filter(task => task.id !== taskId)
    };
    
    // Keep empty arrays instead of deleting them to maintain data structure
    saveTasks(newTasks);
  };

  const getTasksForDate = (date: Date): Task[] => {
    const dateKey = formatDateKey(date);
    return tasks[dateKey] || [];
  };

  return {
    addTask,
    updateTask,
    deleteTask,
    getTasksForDate
  };
};