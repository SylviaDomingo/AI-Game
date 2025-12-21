
import React from 'react';

export const LoadingView: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full space-y-4">
    <div className="w-12 h-12 border-4 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
    <p className="font-calligraphy text-2xl animate-pulse text-gray-800">落笔生花，查阅卷宗...</p>
  </div>
);
