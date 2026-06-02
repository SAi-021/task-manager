-- Task Manager — MySQL schema.
-- The backend also auto-creates these tables on startup via SQLAlchemy.
-- This file is provided for manual setup or reference.

CREATE DATABASE IF NOT EXISTS taskmanager
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE taskmanager;

CREATE TABLE IF NOT EXISTS users (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(120)  NOT NULL,
  email           VARCHAR(255)  NOT NULL UNIQUE,
  hashed_password VARCHAR(255)  NOT NULL,
  created_at      DATETIME      DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tasks (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  stage       ENUM('todo','in_progress','done') NOT NULL DEFAULT 'todo',
  owner_id    INT NOT NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tasks_owner (owner_id),
  INDEX idx_tasks_stage (stage),
  CONSTRAINT fk_tasks_owner FOREIGN KEY (owner_id)
    REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
