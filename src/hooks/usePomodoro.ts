import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase, SessionType } from '../lib/supabase';

interface PomodoroSettings {
  work_duration: number;
  short_break_duration: number;
  long_break_duration: number;
  sessions_until_long_break: number;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  work_duration: 25,
  short_break_duration: 5,
  long_break_duration: 15,
  sessions_until_long_break: 4,
};

export function usePomodoro() {
  const [sessionType, setSessionType] = useState<SessionType>('work');
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.work_duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);
  const [completedWorkSessions, setCompletedWorkSessions] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const loadSettings = useCallback(async () => {
    const stored = localStorage.getItem('pomodoroSettings');
    if (stored) {
      const parsed = JSON.parse(stored);
      setSettings(parsed);
      setTimeLeft(parsed.work_duration * 60);
    }
  }, []);

  useEffect(() => {
    loadSettings();
    const stored = localStorage.getItem('completedWorkSessions');
    if (stored) {
      setCompletedWorkSessions(parseInt(stored, 10));
    }
  }, [loadSettings]);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const handleSessionComplete = async () => {
    setIsRunning(false);

    const duration = sessionType === 'work'
      ? settings.work_duration
      : sessionType === 'short_break'
      ? settings.short_break_duration
      : settings.long_break_duration;

    await supabase.from('pomodoro_sessions').insert({
      session_type: sessionType,
      duration_minutes: duration,
      interrupted: false,
      completed_at: new Date().toISOString(),
    });

    if (sessionType === 'work') {
      const newCount = completedWorkSessions + 1;
      setCompletedWorkSessions(newCount);
      localStorage.setItem('completedWorkSessions', newCount.toString());
      setTotalSessions((prev) => prev + 1);

      if (newCount % settings.sessions_until_long_break === 0) {
        setSessionType('long_break');
        setTimeLeft(settings.long_break_duration * 60);
      } else {
        setSessionType('short_break');
        setTimeLeft(settings.short_break_duration * 60);
      }
    } else {
      setSessionType('work');
      setTimeLeft(settings.work_duration * 60);
    }
  };

  const start = () => {
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    const duration = sessionType === 'work'
      ? settings.work_duration
      : sessionType === 'short_break'
      ? settings.short_break_duration
      : settings.long_break_duration;
    setTimeLeft(duration * 60);
  };

  const skip = () => {
    setIsRunning(false);

    if (sessionType === 'work') {
      const newCount = completedWorkSessions + 1;

      if (newCount % settings.sessions_until_long_break === 0) {
        setSessionType('long_break');
        setTimeLeft(settings.long_break_duration * 60);
      } else {
        setSessionType('short_break');
        setTimeLeft(settings.short_break_duration * 60);
      }
    } else {
      setSessionType('work');
      setTimeLeft(settings.work_duration * 60);
    }
  };

  const updateSettings = (newSettings: PomodoroSettings) => {
    setSettings(newSettings);
    localStorage.setItem('pomodoroSettings', JSON.stringify(newSettings));

    if (!isRunning) {
      const duration = sessionType === 'work'
        ? newSettings.work_duration
        : sessionType === 'short_break'
        ? newSettings.short_break_duration
        : newSettings.long_break_duration;
      setTimeLeft(duration * 60);
    }
  };

  return {
    sessionType,
    timeLeft,
    isRunning,
    settings,
    completedWorkSessions,
    totalSessions,
    start,
    pause,
    reset,
    skip,
    updateSettings,
  };
}
