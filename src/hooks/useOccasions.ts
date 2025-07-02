import { useState, useEffect } from 'react';
import { Occasion, DayOccasions } from '../types';
import { formatDateKey } from '../utils/dateUtils';

const OCCASIONS_STORAGE_KEY = 'rajarshi-code-schedule-occasions';
const OCCASIONS_BACKUP_STORAGE_KEY = 'rajarshi-code-schedule-occasions-backup';

export const useOccasions = () => {
  const [occasions, setOccasions] = useState<DayOccasions>({});

  // Load occasions from localStorage on mount
  useEffect(() => {
    const loadOccasions = () => {
      try {
        // Try to load from primary storage
        const savedOccasions = localStorage.getItem(OCCASIONS_STORAGE_KEY);
        if (savedOccasions) {
          const parsedOccasions = JSON.parse(savedOccasions);
          const convertedOccasions: DayOccasions = {};
          
          Object.keys(parsedOccasions).forEach(dateKey => {
            convertedOccasions[dateKey] = parsedOccasions[dateKey].map((occasion: any) => ({
              ...occasion,
              createdAt: new Date(occasion.createdAt)
            }));
          });
          
          setOccasions(convertedOccasions);
          // Create backup after successful load
          localStorage.setItem(OCCASIONS_BACKUP_STORAGE_KEY, savedOccasions);
          return;
        }

        // If primary storage fails, try backup
        const backupOccasions = localStorage.getItem(OCCASIONS_BACKUP_STORAGE_KEY);
        if (backupOccasions) {
          const parsedOccasions = JSON.parse(backupOccasions);
          const convertedOccasions: DayOccasions = {};
          
          Object.keys(parsedOccasions).forEach(dateKey => {
            convertedOccasions[dateKey] = parsedOccasions[dateKey].map((occasion: any) => ({
              ...occasion,
              createdAt: new Date(occasion.createdAt)
            }));
          });
          
          setOccasions(convertedOccasions);
          // Restore primary storage from backup
          localStorage.setItem(OCCASIONS_STORAGE_KEY, backupOccasions);
        }
      } catch (error) {
        console.error('Error loading occasions:', error);
        // Try to load from backup if primary fails
        try {
          const backupOccasions = localStorage.getItem(OCCASIONS_BACKUP_STORAGE_KEY);
          if (backupOccasions) {
            const parsedOccasions = JSON.parse(backupOccasions);
            const convertedOccasions: DayOccasions = {};
            
            Object.keys(parsedOccasions).forEach(dateKey => {
              convertedOccasions[dateKey] = parsedOccasions[dateKey].map((occasion: any) => ({
                ...occasion,
                createdAt: new Date(occasion.createdAt)
              }));
            });
            
            setOccasions(convertedOccasions);
          }
        } catch (backupError) {
          console.error('Error loading backup occasions:', backupError);
        }
      }
    };

    loadOccasions();
  }, []);

  // Save occasions with backup strategy
  const saveOccasions = (newOccasions: DayOccasions) => {
    try {
      const occasionsToSave = JSON.stringify(newOccasions);
      
      // Save to primary storage
      localStorage.setItem(OCCASIONS_STORAGE_KEY, occasionsToSave);
      
      // Create backup
      localStorage.setItem(OCCASIONS_BACKUP_STORAGE_KEY, occasionsToSave);
      
      // Update state
      setOccasions(newOccasions);
    } catch (error) {
      console.error('Error saving occasions:', error);
      // Even if localStorage fails, update state so UI remains functional
      setOccasions(newOccasions);
    }
  };

  const addOccasion = (date: Date, text: string, color: Occasion['color']) => {
    const dateKey = formatDateKey(date);
    const newOccasion: Occasion = {
      id: crypto.randomUUID(),
      text: text.trim(),
      color,
      createdAt: new Date()
    };

    const newOccasions = {
      ...occasions,
      [dateKey]: [...(occasions[dateKey] || []), newOccasion]
    };
    saveOccasions(newOccasions);
  };

  const updateOccasion = (date: Date, occasionId: string, updates: Partial<Occasion>) => {
    const dateKey = formatDateKey(date);
    const dayOccasions = occasions[dateKey] || [];
    
    const newOccasions = {
      ...occasions,
      [dateKey]: dayOccasions.map(occasion => 
        occasion.id === occasionId ? { ...occasion, ...updates } : occasion
      )
    };
    saveOccasions(newOccasions);
  };

  const deleteOccasion = (date: Date, occasionId: string) => {
    const dateKey = formatDateKey(date);
    const dayOccasions = occasions[dateKey] || [];
    
    const newOccasions = {
      ...occasions,
      [dateKey]: dayOccasions.filter(occasion => occasion.id !== occasionId)
    };
    
    saveOccasions(newOccasions);
  };

  const getOccasionsForDate = (date: Date): Occasion[] => {
    const dateKey = formatDateKey(date);
    return occasions[dateKey] || [];
  };

  return {
    addOccasion,
    updateOccasion,
    deleteOccasion,
    getOccasionsForDate
  };
};