CREATE DATABASE IF NOT EXISTS prosettings
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE prosettings;

-- ============================================================
-- GAMES
-- ============================================================
CREATE TABLE IF NOT EXISTS games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- TEAMS
-- ============================================================
CREATE TABLE IF NOT EXISTS teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  logo VARCHAR(500) DEFAULT NULL,
  country VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- PLAYERS
-- ============================================================
CREATE TABLE IF NOT EXISTS players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nickname VARCHAR(150) NOT NULL,
  real_name VARCHAR(200) DEFAULT NULL,
  team_id INT DEFAULT NULL,
  game_id INT DEFAULT NULL,
  country VARCHAR(100) DEFAULT NULL,
  role VARCHAR(100) DEFAULT NULL,
  photo VARCHAR(500) DEFAULT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  description TEXT DEFAULT NULL,
  active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE SET NULL,
  INDEX idx_nickname (nickname),
  INDEX idx_slug (slug),
  INDEX idx_game (game_id),
  INDEX idx_team (team_id)
) ENGINE=InnoDB;

-- ============================================================
-- PERIPHERALS
-- ============================================================
CREATE TABLE IF NOT EXISTS peripherals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('mouse','keyboard','mousepad','headset','monitor') NOT NULL,
  brand VARCHAR(150) DEFAULT NULL,
  model VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_slug (slug)
) ENGINE=InnoDB;

-- ============================================================
-- PLAYER SETTINGS (1:1 com player)
-- ============================================================
CREATE TABLE IF NOT EXISTS player_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_id INT NOT NULL UNIQUE,
  mouse_id INT DEFAULT NULL,
  keyboard_id INT DEFAULT NULL,
  mousepad_id INT DEFAULT NULL,
  headset_id INT DEFAULT NULL,
  monitor_id INT DEFAULT NULL,
  dpi INT DEFAULT NULL,
  sensitivity DECIMAL(10,4) DEFAULT NULL,
  edpi INT DEFAULT NULL,
  polling_rate INT DEFAULT NULL,
  resolution VARCHAR(50) DEFAULT NULL,
  aspect_ratio VARCHAR(20) DEFAULT NULL,
  crosshair TEXT DEFAULT NULL,
  crosshair_image VARCHAR(500) DEFAULT NULL,
  raw_input TINYINT(1) DEFAULT NULL,
  scoped_sensitivity DECIMAL(10,4) DEFAULT NULL,
  zoom_sensitivity DECIMAL(10,4) DEFAULT NULL,
  agents VARCHAR(255) DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  product_image_mouse VARCHAR(500) DEFAULT NULL,
  product_image_keyboard VARCHAR(500) DEFAULT NULL,
  product_image_mousepad VARCHAR(500) DEFAULT NULL,
  product_image_monitor VARCHAR(500) DEFAULT NULL,
  product_image_headset VARCHAR(500) DEFAULT NULL,
  product_link_mouse VARCHAR(500) DEFAULT NULL,
  product_link_keyboard VARCHAR(500) DEFAULT NULL,
  product_link_mousepad VARCHAR(500) DEFAULT NULL,
  product_link_monitor VARCHAR(500) DEFAULT NULL,
  product_link_headset VARCHAR(500) DEFAULT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
  FOREIGN KEY (mouse_id) REFERENCES peripherals(id) ON DELETE SET NULL,
  FOREIGN KEY (keyboard_id) REFERENCES peripherals(id) ON DELETE SET NULL,
  FOREIGN KEY (mousepad_id) REFERENCES peripherals(id) ON DELETE SET NULL,
  FOREIGN KEY (headset_id) REFERENCES peripherals(id) ON DELETE SET NULL,
  FOREIGN KEY (monitor_id) REFERENCES peripherals(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- PLAYER SOCIAL
-- ============================================================
CREATE TABLE IF NOT EXISTS player_social (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_id INT NOT NULL,
  platform VARCHAR(50) NOT NULL,
  url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
  INDEX idx_player (player_id)
) ENGINE=InnoDB;

-- ============================================================
-- PLAYER VIDEO SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS player_video_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_id INT NOT NULL,
  setting_key VARCHAR(150) NOT NULL,
  setting_value VARCHAR(255) NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
  INDEX idx_player (player_id)
) ENGINE=InnoDB;

-- ============================================================
-- PLAYER PC SPECS
-- ============================================================
CREATE TABLE IF NOT EXISTS player_pc_specs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_id INT NOT NULL,
  spec_type VARCHAR(100) NOT NULL,
  label VARCHAR(255) NOT NULL,
  link VARCHAR(500) DEFAULT NULL,
  image VARCHAR(500) DEFAULT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
  INDEX idx_player (player_id)
) ENGINE=InnoDB;
