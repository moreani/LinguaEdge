import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 - 100
  height?: string;
  colorClass?: string;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 'h-2',
  colorClass = 'bg-gradient-to-r from-brand-500 to-indigo-400',
  showLabel = false
}) => {
  const clamped = Math.max(0, Math.min(100, progress));

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs text-slate-400">
          <span>Progress</span>
          <span className="font-semibold text-slate-200">{Math.round(clamped)}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-800 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${height} ${colorClass} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
