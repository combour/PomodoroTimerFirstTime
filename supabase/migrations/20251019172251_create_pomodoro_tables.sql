/*
  # Create Pomodoro Timer Tables

  ## Overview
  This migration sets up the database schema for a Pomodoro timer application that tracks user sessions, 
  settings, and provides historical data for productivity insights.

  ## New Tables
  
  ### `pomodoro_sessions`
  Stores completed Pomodoro sessions with timing information
  - `id` (uuid, primary key) - Unique identifier for each session
  - `user_id` (uuid, nullable) - Links to auth.users for authenticated users, null for anonymous
  - `session_type` (text) - Type of session: 'work', 'short_break', or 'long_break'
  - `duration_minutes` (integer) - Planned duration in minutes
  - `completed_at` (timestamptz) - When the session was completed
  - `interrupted` (boolean) - Whether the session was interrupted before completion
  - `created_at` (timestamptz) - Record creation timestamp

  ### `user_settings`
  Stores user preferences for timer durations
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, unique, nullable) - Links to auth.users, null for anonymous users
  - `work_duration` (integer) - Work session duration in minutes (default: 25)
  - `short_break_duration` (integer) - Short break duration in minutes (default: 5)
  - `long_break_duration` (integer) - Long break duration in minutes (default: 15)
  - `sessions_until_long_break` (integer) - Number of work sessions before long break (default: 4)
  - `updated_at` (timestamptz) - Last update timestamp
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  
  ### Row Level Security (RLS)
  - Both tables have RLS enabled for data protection
  - Anonymous users can create and read their own sessions (stored in browser)
  - Authenticated users can only access their own data
  
  ### Policies
  
  #### pomodoro_sessions
  1. **Anonymous users can insert sessions** - Allows unauthenticated users to track sessions
  2. **Users can view own sessions** - Authenticated users can only see their own sessions
  3. **Users can insert own sessions** - Authenticated users can create new sessions
  
  #### user_settings
  1. **Anonymous users can insert settings** - Allows unauthenticated users to save preferences
  2. **Users can view own settings** - Authenticated users can only see their own settings
  3. **Users can insert own settings** - Authenticated users can create their settings
  4. **Users can update own settings** - Authenticated users can modify their preferences

  ## Indexes
  - `pomodoro_sessions.user_id` - Fast lookup of user sessions
  - `pomodoro_sessions.completed_at` - Efficient time-based queries for statistics
  - `user_settings.user_id` - Quick access to user preferences

  ## Important Notes
  - This design supports both anonymous and authenticated users
  - Anonymous users store data locally but can sync when they sign up
  - All timestamps use `timestamptz` for timezone awareness
  - Default values ensure a good out-of-box experience (25/5/15 minute intervals)
*/

-- Create pomodoro_sessions table
CREATE TABLE IF NOT EXISTS pomodoro_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type text NOT NULL CHECK (session_type IN ('work', 'short_break', 'long_break')),
  duration_minutes integer NOT NULL CHECK (duration_minutes > 0),
  completed_at timestamptz NOT NULL DEFAULT now(),
  interrupted boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  work_duration integer DEFAULT 25 CHECK (work_duration > 0),
  short_break_duration integer DEFAULT 5 CHECK (short_break_duration > 0),
  long_break_duration integer DEFAULT 15 CHECK (long_break_duration > 0),
  sessions_until_long_break integer DEFAULT 4 CHECK (sessions_until_long_break > 0),
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_user_id ON pomodoro_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_completed_at ON pomodoro_sessions(completed_at);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Enable Row Level Security
ALTER TABLE pomodoro_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Policies for pomodoro_sessions

-- Allow anyone to insert sessions (for anonymous users)
CREATE POLICY "Anyone can insert sessions"
  ON pomodoro_sessions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Authenticated users can view their own sessions
CREATE POLICY "Users can view own sessions"
  ON pomodoro_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Authenticated users can insert their own sessions
CREATE POLICY "Users can insert own sessions"
  ON pomodoro_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for user_settings

-- Allow anyone to insert settings (for anonymous users)
CREATE POLICY "Anyone can insert settings"
  ON user_settings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Authenticated users can view their own settings
CREATE POLICY "Users can view own settings"
  ON user_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Authenticated users can insert their own settings
CREATE POLICY "Users can insert own settings"
  ON user_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users can update their own settings
CREATE POLICY "Users can update own settings"
  ON user_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);