
import React from 'react';
import { TimeOfDay } from '../types';

interface TimeIndicatorProps {
  time: TimeOfDay;
  day: number;
}

export const TimeIndicator: React.FC<TimeIndicatorProps> = ({ time, day }) => {
  const timeColors: Record<TimeOfDay, string> = {
    [TimeOfDay.Morning]: 'bg-amber-100 text-amber-900 border-amber-300',
    [TimeOfDay.Noon]: 'bg-blue-100 text-blue-900 border-blue-300',
    [TimeOfDay.Dusk]: 'bg-orange-200 text-orange-900 border-orange-400',
    [TimeOfDay.Night]: 'bg-indigo-900 text-indigo-100 border-indigo-700',
  };

  return (
    <div className={`px-3 py-1 rounded-full border text-xs font-bold shadow-sm transition-all duration-1000 ${timeColors[time]}`}>
      第 {day} 天 · {time}
    </div>
  );
};
