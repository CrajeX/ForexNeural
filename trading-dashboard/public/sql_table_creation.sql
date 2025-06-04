-- =====================================================
-- SQL TABLE CREATION COMMANDS FOR EXPRESS.JS SERVER
-- =====================================================

-- Create database (if needed)
CREATE DATABASE IF NOT EXISTS `8con` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `8con`;

-- =====================================================
-- 1. ACCOUNTS TABLE (Authentication data)
-- =====================================================
CREATE TABLE `accounts` (
  `account_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `roles` enum('student', 'admin', 'instructor', 'moderator') DEFAULT 'student',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`account_id`),
  UNIQUE KEY `username_unique` (`username`),
  INDEX `idx_roles` (`roles`),
  INDEX `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. STUDENTS TABLE (Student-specific data)
-- =====================================================
CREATE TABLE `students` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account_id` int(11) NOT NULL,
  `student_id` varchar(20) NOT NULL UNIQUE,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL UNIQUE,
  `birth_place` varchar(100) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `address` text DEFAULT NULL,
  `phone_no` varchar(20) DEFAULT NULL,
  `learning_style` enum('visual', 'auditory', 'kinesthetic', 'reading') DEFAULT NULL,
  `trading_level` enum('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'beginner',
  `age` int(3) DEFAULT NULL,
  `gender` enum('male', 'female', 'other', 'prefer_not_to_say') DEFAULT NULL,
  `enrollment_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('active', 'inactive', 'suspended', 'graduated') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_id_unique` (`student_id`),
  UNIQUE KEY `email_unique` (`email`),
  KEY `fk_students_account` (`account_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_trading_level` (`trading_level`),
  CONSTRAINT `fk_students_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. PROFILES TABLE (User profile data - consolidated view)
-- =====================================================
CREATE TABLE `profiles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account_id` int(11) NOT NULL UNIQUE,
  `student_id` varchar(20) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL UNIQUE,
  `roles` enum('student', 'admin', 'instructor', 'moderator') DEFAULT 'student',
  `address` text DEFAULT NULL,
  `birth_place` varchar(100) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `phone_no` varchar(20) DEFAULT NULL,
  `trading_level` enum('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'beginner',
  `learning_style` enum('visual', 'auditory', 'kinesthetic', 'reading') DEFAULT NULL,
  `gender` enum('male', 'female', 'other', 'prefer_not_to_say') DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `preferences` json DEFAULT NULL,
  `authenticated` tinyint(1) DEFAULT 0,
  `login_time` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `verification_token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_id_unique` (`account_id`),
  UNIQUE KEY `email_unique` (`email`),
  UNIQUE KEY `username_unique` (`username`),
  KEY `fk_profiles_account` (`account_id`),
  INDEX `idx_roles` (`roles`),
  INDEX `idx_trading_level` (`trading_level`),
  INDEX `idx_authenticated` (`authenticated`),
  INDEX `idx_email_verified` (`is_verified`),
  CONSTRAINT `fk_profiles_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. USER_SESSIONS TABLE (Session management)
-- =====================================================
CREATE TABLE `user_sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `session_id` varchar(128) NOT NULL,
  `account_id` int(11) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_data` json NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `expires_at` datetime NOT NULL,
  `user_agent` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `device_info` json DEFAULT NULL,
  `last_activity` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_id_unique` (`session_id`),
  KEY `fk_sessions_account` (`account_id`),
  INDEX `idx_active_sessions` (`account_id`, `is_active`, `expires_at`),
  INDEX `idx_expires_at` (`expires_at`),
  INDEX `idx_ip_address` (`ip_address`),
  CONSTRAINT `fk_sessions_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. USERS TABLE (Alternative/Legacy user storage)
-- =====================================================
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account_id` int(11) DEFAULT NULL,
  `student_id` varchar(20) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL UNIQUE,
  `email` varchar(100) NOT NULL UNIQUE,
  `password` varchar(255) DEFAULT NULL,
  `roles` enum('student', 'admin', 'instructor', 'moderator') DEFAULT 'student',
  `address` text DEFAULT NULL,
  `birth_place` varchar(100) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `phone_no` varchar(20) DEFAULT NULL,
  `trading_level` enum('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'beginner',
  `gender` enum('male', 'female', 'other', 'prefer_not_to_say') DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `authenticated` tinyint(1) DEFAULT 0,
  `login_time` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_unique` (`username`),
  UNIQUE KEY `email_unique` (`email`),
  KEY `fk_users_account` (`account_id`),
  INDEX `idx_roles` (`roles`),
  INDEX `idx_authenticated` (`authenticated`),
  CONSTRAINT `fk_users_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. PASSWORD_RESETS TABLE (Password reset tokens)
-- =====================================================
CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `is_used` tinyint(1) DEFAULT 0,
  `used_at` datetime DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_token_unique` (`email`, `token`),
  INDEX `idx_email_token` (`email`, `token`),
  INDEX `idx_expires_at` (`expires_at`),
  INDEX `idx_is_used` (`is_used`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 7. ACTIVITY_LOGS TABLE (User activity tracking)
-- =====================================================
CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account_id` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_logs_account` (`account_id`),
  INDEX `idx_action` (`action`),
  INDEX `idx_created_at` (`created_at`),
  INDEX `idx_account_action` (`account_id`, `action`),
  CONSTRAINT `fk_logs_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 8. SYSTEM_SETTINGS TABLE (Application configuration)
-- =====================================================
CREATE TABLE `system_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL UNIQUE,
  `setting_value` text DEFAULT NULL,
  `setting_type` enum('string', 'number', 'boolean', 'json') DEFAULT 'string',
  `description` text DEFAULT NULL,
  `is_public` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key_unique` (`setting_key`),
  INDEX `idx_public_settings` (`is_public`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- =====================================================

-- Additional composite indexes for common queries
ALTER TABLE `user_sessions` ADD INDEX `idx_account_active_expires` (`account_id`, `is_active`, `expires_at`);
ALTER TABLE `profiles` ADD INDEX `idx_name_email` (`name`, `email`);
ALTER TABLE `students` ADD INDEX `idx_name_student_id` (`name`, `student_id`);

-- =====================================================
-- TRIGGERS FOR DATA CONSISTENCY
-- =====================================================

-- Trigger to auto-update last_login in profiles when session is created
DELIMITER $$
CREATE TRIGGER `update_last_login_on_session` 
AFTER INSERT ON `user_sessions`
FOR EACH ROW
BEGIN
    UPDATE `profiles` 
    SET `last_login` = NOW(), `updated_at` = NOW()
    WHERE `account_id` = NEW.account_id;
END$$
DELIMITER ;

-- Trigger to log user activities
DELIMITER $$
CREATE TRIGGER `log_profile_updates` 
AFTER UPDATE ON `profiles`
FOR EACH ROW
BEGIN
    INSERT INTO `activity_logs` (`account_id`, `action`, `description`, `created_at`)
    VALUES (NEW.account_id, 'profile_updated', 'User profile was updated', NOW());
END$$
DELIMITER ;

-- =====================================================
-- INITIAL DATA SETUP
-- =====================================================

-- Insert default system settings
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `setting_type`, `description`, `is_public`) VALUES
('app_name', '8Con Trading Platform', 'string', 'Application name', 1),
('session_timeout', '86400', 'number', 'Session timeout in seconds (24 hours)', 0),
('max_login_attempts', '5', 'number', 'Maximum login attempts before lockout', 0),
('password_reset_timeout', '3600', 'number', 'Password reset token timeout in seconds (1 hour)', 0),
('registration_enabled', '1', 'boolean', 'Whether new user registration is enabled', 1),
('maintenance_mode', '0', 'boolean', 'Whether the application is in maintenance mode', 1);

-- =====================================================
-- CLEANUP PROCEDURES
-- =====================================================

-- Stored procedure to cleanup expired sessions
DELIMITER $$
CREATE PROCEDURE `CleanupExpiredSessions`()
BEGIN
    DECLARE deleted_count INT;
    
    DELETE FROM `user_sessions` 
    WHERE `expires_at` < NOW() OR `is_active` = 0;
    
    SET deleted_count = ROW_COUNT();
    
    INSERT INTO `activity_logs` (`action`, `description`, `created_at`)
    VALUES ('system_cleanup', CONCAT('Cleaned up ', deleted_count, ' expired sessions'), NOW());
END$$
DELIMITER ;

-- Stored procedure to cleanup expired password reset tokens
DELIMITER $$
CREATE PROCEDURE `CleanupExpiredResetTokens`()
BEGIN
    DECLARE deleted_count INT;
    
    DELETE FROM `password_resets` 
    WHERE `expires_at` < NOW() OR `is_used` = 1;
    
    SET deleted_count = ROW_COUNT();
    
    INSERT INTO `activity_logs` (`action`, `description`, `created_at`)
    VALUES ('system_cleanup', CONCAT('Cleaned up ', deleted_count, ' expired reset tokens'), NOW());
END$$
DELIMITER ;

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for active user sessions
CREATE VIEW `active_user_sessions` AS
SELECT 
    us.id,
    us.session_id,
    us.account_id,
    p.name,
    p.username,
    p.email,
    us.ip_address,
    us.user_agent,
    us.last_activity,
    us.expires_at,
    us.created_at
FROM `user_sessions` us
JOIN `profiles` p ON us.account_id = p.account_id
WHERE us.is_active = 1 AND us.expires_at > NOW();

-- View for user statistics
CREATE VIEW `user_statistics` AS
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN authenticated = 1 THEN 1 END) as active_users,
    COUNT(CASE WHEN roles = 'student' THEN 1 END) as students,
    COUNT(CASE WHEN roles = 'admin' THEN 1 END) as admins,
    COUNT(CASE WHEN roles = 'instructor' THEN 1 END) as instructors,
    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_users_30d,
    COUNT(CASE WHEN last_login >= DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 END) as active_24h
FROM `profiles`;

-- =====================================================
-- PERFORMANCE OPTIMIZATION NOTES
-- =====================================================

/*
PERFORMANCE TIPS:
1. Regularly run OPTIMIZE TABLE on frequently updated tables
2. Monitor slow query log for optimization opportunities
3. Consider partitioning activity_logs table by date if it grows large
4. Set up automated cleanup jobs for expired sessions and tokens
5. Use EXPLAIN to analyze query performance

MAINTENANCE COMMANDS:
- OPTIMIZE TABLE user_sessions, profiles, activity_logs;
- CALL CleanupExpiredSessions();
- CALL CleanupExpiredResetTokens();
- ANALYZE TABLE profiles, user_sessions;
*/