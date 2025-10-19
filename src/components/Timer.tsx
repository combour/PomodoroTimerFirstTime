import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { SessionType } from '../lib/supabase';

interface TimerProps {
  timeLeft: number;
  isRunning: boolean;
  sessionType: SessionType;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export function Timer({
  timeLeft,
  isRunning,
  sessionType,
  onStart,
  onPause,
  onReset,
  onSkip,
}: TimerProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const sessionColors = {
    work: 'from-rose-500 to-orange-500',
    short_break: 'from-emerald-500 to-teal-500',
    long_break: 'from-blue-500 to-cyan-500',
  };

  const sessionLabels = {
    work: 'Focus Time',
    short_break: 'Short Break',
    long_break: 'Long Break',
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-slate-700 mb-2">
          {sessionLabels[sessionType]}
        </h2>
        <div
          className={`bg-gradient-to-br ${sessionColors[sessionType]} text-white rounded-3xl p-12 shadow-2xl transition-all duration-500`}
        >
          <div className="text-8xl font-bold tracking-tight tabular-nums">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        {!isRunning ? (
          <button
            onClick={onStart}
            className="flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Play className="w-5 h-5" />
            Start
          </button>
        ) : (
          <button
            onClick={onPause}
            className="flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Pause className="w-5 h-5" />
            Pause
          </button>
        )}

        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </button>

        <button
          onClick={onSkip}
          className="flex items-center gap-2 px-6 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
        >
          <SkipForward className="w-5 h-5" />
          Skip
        </button>
      </div>
    </div>
  );
}
