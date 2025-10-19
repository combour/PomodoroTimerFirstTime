import { Timer } from './components/Timer';
import { Statistics } from './components/Statistics';
import { Settings } from './components/Settings';
import { usePomodoro } from './hooks/usePomodoro';
import { Timer as TimerIcon } from 'lucide-react';

function App() {
  const {
    sessionType,
    timeLeft,
    isRunning,
    settings,
    completedWorkSessions,
    start,
    pause,
    reset,
    skip,
    updateSettings,
  } = usePomodoro();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <Settings settings={settings} onUpdate={updateSettings} />

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-3 bg-white rounded-xl shadow-lg">
              <TimerIcon className="w-8 h-8 text-slate-700" />
            </div>
            <h1 className="text-5xl font-bold text-slate-800">Pomodoro Timer</h1>
          </div>
          <p className="text-slate-600 text-lg">
            Stay focused and productive with the Pomodoro Technique
          </p>
          <div className="mt-4 inline-block px-6 py-2 bg-white rounded-full shadow-md">
            <span className="text-sm font-semibold text-slate-600">
              Completed today: <span className="text-rose-600">{completedWorkSessions}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-12">
          <Timer
            timeLeft={timeLeft}
            isRunning={isRunning}
            sessionType={sessionType}
            onStart={start}
            onPause={pause}
            onReset={reset}
            onSkip={skip}
          />

          <Statistics />
        </div>
      </div>

      <footer className="text-center py-8 text-slate-500 text-sm">
        <p>Built with focus in mind</p>
      </footer>
    </div>
  );
}

export default App;
