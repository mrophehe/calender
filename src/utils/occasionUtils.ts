import { Occasion } from '../types';

export const getOccasionColorClasses = (color: Occasion['color']) => {
  const colorMap = {
    birthday: {
      bg: 'bg-gradient-to-r from-pink-500 to-rose-500',
      text: 'text-white',
      border: 'border-pink-300',
      hover: 'hover:from-pink-600 hover:to-rose-600'
    },
    holiday: {
      bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
      text: 'text-white',
      border: 'border-green-300',
      hover: 'hover:from-green-600 hover:to-emerald-600'
    },
    meeting: {
      bg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      text: 'text-white',
      border: 'border-blue-300',
      hover: 'hover:from-blue-600 hover:to-cyan-600'
    },
    deadline: {
      bg: 'bg-gradient-to-r from-red-500 to-orange-500',
      text: 'text-white',
      border: 'border-red-300',
      hover: 'hover:from-red-600 hover:to-orange-600'
    },
    celebration: {
      bg: 'bg-gradient-to-r from-purple-500 to-indigo-500',
      text: 'text-white',
      border: 'border-purple-300',
      hover: 'hover:from-purple-600 hover:to-indigo-600'
    },
    personal: {
      bg: 'bg-gradient-to-r from-gray-500 to-slate-500',
      text: 'text-white',
      border: 'border-gray-300',
      hover: 'hover:from-gray-600 hover:to-slate-600'
    }
  };

  return colorMap[color];
};

export const getOccasionTypeLabel = (color: Occasion['color']) => {
  const labelMap = {
    birthday: '🎂 Birthday',
    holiday: '🎄 Holiday',
    meeting: '📅 Meeting',
    deadline: '⏰ Deadline',
    celebration: '🎉 Celebration',
    personal: '📝 Personal'
  };

  return labelMap[color];
};