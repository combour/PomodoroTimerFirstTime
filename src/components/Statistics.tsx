import { useEffect, useState } from 'react';
import { supabase, PomodoroSession } from '../lib/supabase';
import { BarChart3, Clock, Target, TrendingUp } from 'lucide-react';

interface Stats {
  todaySessions: number;
  todayMinutes: number;
  weekSessions: number;
  weekMinutes: number;
}

export function Statistics() {
  const [stats, setStats] = useState<Stats>({
    todaySessions: 0,
    todayMinutes: 0,
    weekSessions: 0,
    weekMinutes: 0,
  });
  const [recentSessions, setRecentSessions] = useState<PomodoroSession[]>([]);

  useEffect(() => {
    loadStatistics();
    const interval = setInterval(loadStatistics, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStatistics = async () => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const { data: allSessions } = await supabase
      .from('pomodoro_sessions')
      .select('*')
      .order('completed_at', { ascending: false })
      .limit(50);

    if (allSessions) {
      const todaySessions = allSessions.filter(
        (s) => new Date(s.completed_at) >= todayStart && s.session_type === 'work'
      );
      const weekSessions = allSessions.filter(
        (s) => new Date(s.completed_at) >= weekStart && s.session_type === 'work'
      );

      setStats({
        todaySessions: todaySessions.length,
        todayMinutes: todaySessions.reduce((sum, s) => sum + s.duration_minutes, 0),
        weekSessions: weekSessions.length,
        weekMinutes: weekSessions.reduce((sum, s) => sum + s.duration_minutes, 0),
      });

      setRecentSessions(allSessions.slice(0, 5));
    }
  };

  const formatSessionType = (type: string) => {
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-rose-100 rounded-lg">
              <Target className="w-5 h-5 text-rose-600" />
            </div>
            <h3 className="font-semibold text-slate-700">Today</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.todaySessions}</p>
          <p className="text-sm text-slate-500 mt-1">sessions</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-slate-700">Focus Time</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.todayMinutes}</p>
          <p className="text-sm text-slate-500 mt-1">minutes today</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-slate-700">This Week</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.weekSessions}</p>
          <p className="text-sm text-slate-500 mt-1">sessions</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-700">Weekly Focus</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.weekMinutes}</p>
          <p className="text-sm text-slate-500 mt-1">minutes total</p>
        </div>
      </div>

      {recentSessions.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <h3 className="font-semibold text-slate-700 mb-4 text-lg">Recent Sessions</h3>
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      session.session_type === 'work'
                        ? 'bg-rose-500'
                        : session.session_type === 'short_break'
                        ? 'bg-emerald-500'
                        : 'bg-blue-500'
                    }`}
                  />
                  <span className="font-medium text-slate-700">
                    {formatSessionType(session.session_type)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span>{session.duration_minutes} min</span>
                  <span>{formatTime(session.completed_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
