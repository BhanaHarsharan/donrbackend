-- Run this in psql after logging in as postgres
CREATE DATABASE donr;

-- Then connect to the new database: \c donr;
-- Then run the remaining commands:

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  sa_id VARCHAR(13) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(15),
  date_of_birth DATE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE questionnaire_results (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  is_eligible BOOLEAN NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW()
);

-- Gamification columns
ALTER TABLE users ADD COLUMN total_donations INT DEFAULT 0;
ALTER TABLE users ADD COLUMN last_donation_date DATE;
ALTER TABLE users ADD COLUMN current_streak INT DEFAULT 0;
ALTER TABLE users ADD COLUMN level INT DEFAULT 1;
ALTER TABLE users ADD COLUMN lives_saved INT DEFAULT 0;

CREATE TABLE donations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  donation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);