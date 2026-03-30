import React from 'react';

type TimeRange = 'today' | 'week' | 'month';

interface TimeRangeSwitcherProps {
  activeRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

const TimeRangeSwitcher: React.FC<TimeRangeSwitcherProps> = ({ activeRange, onRangeChange }) => {
  const ranges: { id: TimeRange; label: string }[] = [
    { id: 'today', label: 'TODAY' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
  ];

  return (
    <div className="inline-flex items-center p-1 bg-[#1A1A1A] border border-white/10 rounded-[1.25rem] shadow-2xl relative overflow-hidden group">
      {/* Metallic/Reflective Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
      
      {ranges.map((range, index) => {
        const isActive = activeRange === range.id;
        return (
          <React.Fragment key={range.id}>
            <button
              onClick={() => onRangeChange(range.id)}
              className={`
                relative flex items-center gap-2 px-5 py-2.5 rounded-2xl transition-all duration-300 ease-out
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] scale-[1.02]' 
                  : 'text-white/40 hover:text-white/60 hover:bg-white/[0.02]'
                }
              `}
            >
              {isActive && (
                <span className="w-2.5 h-2.5 rounded-full border-2 border-white/40 flex items-center justify-center">
                  <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
                </span>
              )}
              <span className={`text-[11px] font-bold tracking-wider uppercase italic ${isActive ? 'translate-x-0' : 'translate-x-0'}`}>
                {range.label}
              </span>
            </button>
            {index < ranges.length - 1 && !isActive && activeRange !== ranges[index + 1].id && (
              <div className="w-[1px] h-4 bg-white/10 mx-1" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default TimeRangeSwitcher;
