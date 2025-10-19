import { useState } from 'react';
import { Settings as SettingsIcon, X } from 'lucide-react';

interface SettingsProps {
  settings: {
    work_duration: number;
    short_break_duration: number;
    long_break_duration: number;
    sessions_until_long_break: number;
  };
  onUpdate: (settings: {
    work_duration: number;
    short_break_duration: number;
    long_break_duration: number;
    sessions_until_long_break: number;
  }) => void;
}

export function Settings({ settings, onUpdate }: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [workDuration, setWorkDuration] = useState(settings.work_duration);
  const [shortBreak, setShortBreak] = useState(settings.short_break_duration);
  const [longBreak, setLongBreak] = useState(settings.long_break_duration);
  const [sessionsUntilLongBreak, setSessionsUntilLongBreak] = useState(
    settings.sessions_until_long_break
  );

  const handleSave = () => {
    onUpdate({
      work_duration: workDuration,
      short_break_duration: shortBreak,
      long_break_duration: longBreak,
      sessions_until_long_break: sessionsUntilLongBreak,
    });
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 p-3 bg-white hover:bg-slate-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border border-slate-200"
      >
        <SettingsIcon className="w-6 h-6 text-slate-700" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>

            <h2 className="text-2xl font-bold text-slate-800 mb-6">Timer Settings</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Work Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={workDuration}
                  onChange={(e) => setWorkDuration(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Short Break (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={shortBreak}
                  onChange={(e) => setShortBreak(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Long Break (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={longBreak}
                  onChange={(e) => setLongBreak(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Sessions Until Long Break
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={sessionsUntilLongBreak}
                  onChange={(e) => setSessionsUntilLongBreak(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg"
                >
                  Save Settings
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
