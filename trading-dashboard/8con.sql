-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 05, 2025 at 10:12 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `8con`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `CleanupExpiredResetTokens` ()   BEGIN
    DECLARE deleted_count INT;
    
    DELETE FROM `password_resets` 
    WHERE `expires_at` < NOW() OR `is_used` = 1;
    
    SET deleted_count = ROW_COUNT();
    
    INSERT INTO `activity_logs` (`action`, `description`, `created_at`)
    VALUES ('system_cleanup', CONCAT('Cleaned up ', deleted_count, ' expired reset tokens'), NOW());
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `CleanupExpiredSessions` ()   BEGIN
    DECLARE deleted_count INT;
    
    DELETE FROM `user_sessions` 
    WHERE `expires_at` < NOW() OR `is_active` = 0;
    
    SET deleted_count = ROW_COUNT();
    
    INSERT INTO `activity_logs` (`action`, `description`, `created_at`)
    VALUES ('system_cleanup', CONCAT('Cleaned up ', deleted_count, ' expired sessions'), NOW());
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `account_id` int(11) NOT NULL,
  `roles` enum('student','admin','staff') NOT NULL,
  `username` varchar(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  `reset_otp` int(11) NOT NULL,
  `reset_expr` timestamp(6) NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`account_id`, `roles`, `username`, `password`, `reset_otp`, `reset_expr`) VALUES
(1, 'student', 'test', 'test', 0, '2025-05-21 00:30:02.014214'),
(2, 'admin', 'admin', 'admin', 0, '2025-05-21 00:30:02.014214'),
(7, 'admin', 'Gimp', '5e1f0e062781b4bba659ddf21ca488509bd4d3b8110e4c5032986287015af6fa', 0, '2025-05-21 00:30:02.014214'),
(9, 'student', 'dias', 'd38cc354527fa0431a79862ae30f3f67a19d63d6037e25c591b2f3a1f7c01d26', 0, '2025-05-21 00:30:02.014214'),
(11, 'admin', 'Gimpy', 'ae135ad952a48300d66a514a2398c54b6e588c65f259dcb762b436fa5227e8ef', 0, '2025-05-21 00:30:02.014214'),
(12, 'student', 'diass', 'b3da6c475b259fe6e394263eff01e9f8c2c9ca86c4d2431eba76edac03da5a0c', 0, '2025-05-21 00:30:02.014214'),
(14, 'admin', 'Gimppy', '11ab273931c78ff884fed06896784f51c744247b0960ae1b2471046f5ea744c0', 0, '2025-05-21 00:30:02.014214'),
(16, 'admin', 'Gimpppy', '1934e21e63ad9968f3ec03f05072e0a108952c74366af65a9949296f5ffce311', 0, '2025-05-21 00:30:02.014214'),
(17, 'student', 'paul', '0cf5f61f9fc2247f39d5429b05e3e32ba7d9ac57427856a19f96f19321809c34', 0, '2025-05-21 00:30:02.014214'),
(18, 'admin', 'pop', '5574f4c951b6a843908f048f381e2dd49e0a0deb7c54ad74b5c13a72163f8c26', 0, '2025-05-21 00:30:02.014214'),
(19, 'student', 'heart', '6997853aaf0b5aba0373a52d2317ab141daa155d6f7ab6f354298e743247b216', 0, '2025-05-21 00:30:02.014214'),
(20, 'student', 'hearty', '076f87eb12de3c2e0639ad5227a0b4e66149b9915ac583e16d183c084d208e5e', 0, '2025-05-21 00:30:02.014214'),
(21, 'student', 'chinooo', '184a695874ffd3294b468b10edb1efc1c8aadfe01c8aae0af862d5c33990090a', 0, '2025-05-28 23:01:39.110632'),
(23, 'student', 'shit', '7f5b4e341b60aa12371f900a5f42bfc188dca32a910b8b32cf8d304442a219ab', 0, '2025-05-28 23:08:41.385883'),
(25, 'student', 'shity', '7f5b4e341b60aa12371f900a5f42bfc188dca32a910b8b32cf8d304442a219ab', 0, '2025-05-28 23:09:15.273822'),
(27, 'student', 'shitcy', '7f5b4e341b60aa12371f900a5f42bfc188dca32a910b8b32cf8d304442a219ab', 0, '2025-05-28 23:18:29.851031'),
(28, 'student', 'shitdcy', 'ea296c8c45df77e62d554d8ead53b80f682376aed03cd7b98687ce3147d964cc', 0, '2025-05-28 23:19:23.421288'),
(29, 'student', 'shivtdcy', 'ea296c8c45df77e62d554d8ead53b80f682376aed03cd7b98687ce3147d964cc', 0, '2025-05-28 23:20:18.435993'),
(30, 'student', 'shivgtdcy', 'f6cd106bb5ce0397c1293b845cc93b50c4870a6dd4a27978d668dd22537acc6d', 0, '2025-05-28 23:21:06.053310'),
(31, 'student', 'lappy', '5f2f5d619745d025069f93c61b5ce17e8850aeaea37ea91b467476aed37db688', 0, '2025-05-28 23:23:08.550558'),
(32, 'student', 'lappyy', 'bebe6395a30c1c283624d3a45e056ce4ba5e2c00c843961c88c43d8992404ca1', 0, '2025-05-28 23:25:25.697365'),
(33, 'student', 'popo', '93705e9727703ebd13390fba7949b4a4ef5dceed8b17e5480a914a21e5741976', 0, '2025-05-28 23:31:39.649782'),
(34, 'student', 'popop', 'a4b40f8675f8218a17a72a6f22a48536a57e5da5042bd9b040f5732030048a26', 527644, '2025-05-28 23:40:17.652000');

-- --------------------------------------------------------

--
-- Stand-in structure for view `active_user_sessions`
-- (See below for the actual view)
--
CREATE TABLE `active_user_sessions` (
`id` int(11)
,`session_id` varchar(128)
,`account_id` int(11)
,`name` varchar(100)
,`username` varchar(50)
,`email` varchar(100)
,`ip_address` varchar(45)
,`user_agent` text
,`last_activity` timestamp
,`expires_at` datetime
,`created_at` timestamp
);

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `account_id`, `action`, `description`, `ip_address`, `user_agent`, `metadata`, `created_at`) VALUES
(1, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-04 08:31:22'),
(2, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-04 08:32:46'),
(3, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-04 08:32:48'),
(4, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-05 02:39:28'),
(5, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-05 02:45:47'),
(6, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-05 02:57:29'),
(7, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-05 02:58:04'),
(8, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-05 07:21:51'),
(9, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-05 07:26:25'),
(10, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-05 07:27:42'),
(11, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-05 07:51:29');

-- --------------------------------------------------------

--
-- Table structure for table `competency_progress`
--

CREATE TABLE `competency_progress` (
  `progress_id` int(11) NOT NULL,
  `student_id` varchar(20) DEFAULT NULL,
  `competency_type` enum('Basic','Common','Core') DEFAULT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `passed` tinyint(1) DEFAULT NULL,
  `exam_status` enum('Not taken','Pass','Retake') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `document_id` int(11) NOT NULL,
  `student_id` varchar(20) DEFAULT NULL,
  `document_type` enum('resume','form137') NOT NULL,
  `resume_submitted` tinyint(1) DEFAULT NULL,
  `form137_submitted` tinyint(1) DEFAULT NULL,
  `additional_notes` text DEFAULT NULL,
  `image_path` text DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `draft`
--

CREATE TABLE `draft` (
  `student_id` varchar(20) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `birth_place` varchar(100) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `background` text DEFAULT NULL,
  `batch` varchar(255) NOT NULL,
  `rating` decimal(10,2) DEFAULT NULL,
  `goals` text DEFAULT NULL,
  `trading_level` enum('Beginner','Intermediate','Advanced') DEFAULT 'Beginner',
  `device_availability` varchar(20) DEFAULT NULL,
  `learning_style` enum('In-person','Online') DEFAULT NULL,
  `date_registered` date DEFAULT NULL,
  `account_id` int(11) DEFAULT NULL,
  `phone_no` varchar(15) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE `images` (
  `account_id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `location` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `is_used` tinyint(1) DEFAULT 0,
  `used_at` datetime DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `student_id` varchar(20) DEFAULT NULL,
  `fullname` varchar(100) DEFAULT NULL,
  `scheme_type` enum('Full','4 Gives','Special') DEFAULT NULL,
  `payment_method` varchar(10) DEFAULT NULL,
  `total_due` decimal(10,2) DEFAULT NULL,
  `amount_paid` decimal(10,2) DEFAULT NULL,
  `balance` decimal(10,2) DEFAULT NULL,
  `receipt_image` varchar(200) DEFAULT NULL,
  `reference_no` varchar(20) DEFAULT NULL,
  `payment_date` date DEFAULT NULL,
  `is_graduation_fee_paid` tinyint(1) DEFAULT 0,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `profiles`
--

CREATE TABLE `profiles` (
  `id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `student_id` varchar(20) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `roles` enum('student','admin','instructor','moderator') DEFAULT 'student',
  `address` text DEFAULT NULL,
  `birth_place` varchar(100) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `phone_no` varchar(20) DEFAULT NULL,
  `trading_level` enum('beginner','intermediate','advanced','expert') DEFAULT 'beginner',
  `learning_style` enum('visual','auditory','kinesthetic','reading') DEFAULT NULL,
  `gender` enum('male','female','other','prefer_not_to_say') DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `preferences` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`preferences`)),
  `authenticated` tinyint(1) DEFAULT 0,
  `login_time` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `verification_token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `profiles`
--

INSERT INTO `profiles` (`id`, `account_id`, `student_id`, `name`, `username`, `email`, `roles`, `address`, `birth_place`, `birth_date`, `phone_no`, `trading_level`, `learning_style`, `gender`, `avatar`, `bio`, `preferences`, `authenticated`, `login_time`, `last_login`, `is_verified`, `verification_token`, `created_at`, `updated_at`) VALUES
(1, 1, '1', 'test', 'test', 'crajeextremeyt@gmail.com', 'student', 'Valenzuela', 'Valenzuela', '2025-06-17', '09427184388', 'beginner', NULL, 'male', '/uploads/avatars/1749025966246-343866882.png', NULL, NULL, 1, '2025-06-04 08:31:08', '2025-06-05 15:51:29', 0, NULL, '2025-06-04 08:31:08', '2025-06-05 07:51:29');

--
-- Triggers `profiles`
--
DELIMITER $$
CREATE TRIGGER `log_profile_updates` AFTER UPDATE ON `profiles` FOR EACH ROW BEGIN
    INSERT INTO `activity_logs` (`account_id`, `action`, `description`, `created_at`)
    VALUES (NEW.account_id, 'profile_updated', 'User profile was updated', NOW());
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `referrals`
--

CREATE TABLE `referrals` (
  `referral_id` int(11) NOT NULL,
  `student_id` varchar(20) DEFAULT NULL,
  `referred_by` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `ib_code` varchar(20) DEFAULT NULL,
  `referral_type` enum('Individual','Facebook','Workshop','Ad') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `scholarships`
--

CREATE TABLE `scholarships` (
  `scholarship_id` int(11) NOT NULL,
  `student_id` varchar(20) DEFAULT NULL,
  `sponsor_type` enum('Individual','Corporate','Coop','OJT') DEFAULT NULL,
  `sponsor_name` varchar(50) DEFAULT NULL,
  `sponsor_contact` varchar(11) DEFAULT NULL,
  `approved_by` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staffs`
--

CREATE TABLE `staffs` (
  `staff_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `student_id` varchar(20) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `birth_place` varchar(100) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `background` text DEFAULT NULL,
  `batch` varchar(255) NOT NULL,
  `rating` decimal(10,2) DEFAULT NULL,
  `goals` text DEFAULT NULL,
  `trading_level` enum('Beginner','Intermediate','Advanced') DEFAULT 'Beginner',
  `device_availability` varchar(20) DEFAULT NULL,
  `learning_style` enum('In-person','Online') DEFAULT NULL,
  `date_registered` date DEFAULT NULL,
  `account_id` int(11) DEFAULT NULL,
  `phone_no` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`student_id`, `name`, `age`, `gender`, `birth_date`, `birth_place`, `email`, `address`, `background`, `batch`, `rating`, `goals`, `trading_level`, `device_availability`, `learning_style`, `date_registered`, `account_id`, `phone_no`) VALUES
('1', 'test', 12, 'male', '2025-06-18', 'Valenzuela', 'crajeextremeyt@gmail.com', 'Valenzuela', 'SVG', '2', 2.00, 'Money', 'Beginner', 'None', 'In-person', '2025-06-04', 1, '09427184388');

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `id` int(11) NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `setting_type` enum('string','number','boolean','json') DEFAULT 'string',
  `description` text DEFAULT NULL,
  `is_public` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `system_settings`
--

INSERT INTO `system_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `description`, `is_public`, `created_at`, `updated_at`) VALUES
(1, 'app_name', '8Con Trading Platform', 'string', 'Application name', 1, '2025-06-04 08:22:08', '2025-06-04 08:22:08'),
(2, 'session_timeout', '86400', 'number', 'Session timeout in seconds (24 hours)', 0, '2025-06-04 08:22:08', '2025-06-04 08:22:08'),
(3, 'max_login_attempts', '5', 'number', 'Maximum login attempts before lockout', 0, '2025-06-04 08:22:08', '2025-06-04 08:22:08'),
(4, 'password_reset_timeout', '3600', 'number', 'Password reset token timeout in seconds (1 hour)', 0, '2025-06-04 08:22:08', '2025-06-04 08:22:08'),
(5, 'registration_enabled', '1', 'boolean', 'Whether new user registration is enabled', 1, '2025-06-04 08:22:08', '2025-06-04 08:22:08'),
(6, 'maintenance_mode', '0', 'boolean', 'Whether the application is in maintenance mode', 1, '2025-06-04 08:22:08', '2025-06-04 08:22:08');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `student_id` varchar(20) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `roles` enum('student','admin','instructor','moderator') DEFAULT 'student',
  `address` text DEFAULT NULL,
  `birth_place` varchar(100) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `phone_no` varchar(20) DEFAULT NULL,
  `trading_level` enum('beginner','intermediate','advanced','expert') DEFAULT 'beginner',
  `gender` enum('male','female','other','prefer_not_to_say') DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `authenticated` tinyint(1) DEFAULT 0,
  `login_time` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `account_id`, `student_id`, `name`, `username`, `email`, `password`, `roles`, `address`, `birth_place`, `birth_date`, `phone_no`, `trading_level`, `gender`, `avatar`, `authenticated`, `login_time`, `last_login`, `created_at`, `updated_at`) VALUES
(1, 1, '1', 'test', 'test', 'crajeextremeyt@gmail.com', NULL, 'student', 'Valenzuela', 'Valenzuela', '2025-06-18', '09427184388', 'beginner', 'male', NULL, 1, '2025-06-04 16:31:22', NULL, '2025-06-04 08:31:22', '2025-06-04 08:31:22');

-- --------------------------------------------------------

--
-- Table structure for table `user_sessions`
--

CREATE TABLE `user_sessions` (
  `id` int(11) NOT NULL,
  `session_id` varchar(128) NOT NULL,
  `account_id` int(11) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`user_data`)),
  `is_active` tinyint(1) DEFAULT 1,
  `expires_at` datetime NOT NULL,
  `user_agent` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `device_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`device_info`)),
  `last_activity` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_sessions`
--

INSERT INTO `user_sessions` (`id`, `session_id`, `account_id`, `user_email`, `user_data`, `is_active`, `expires_at`, `user_agent`, `ip_address`, `device_info`, `last_activity`, `created_at`, `updated_at`) VALUES
(9, 'xojxCVMTL0lTwnoQUkQO00xQ7Bc2pd5Y', 1, 'crajeextremeyt@gmail.com', '{\"account_id\":1,\"student_id\":\"1\",\"name\":\"test\",\"username\":\"test\",\"email\":\"crajeextremeyt@gmail.com\",\"roles\":\"student\",\"address\":\"Valenzuela\",\"birth_place\":\"Valenzuela\",\"phone_no\":\"09427184388\",\"trading_level\":\"Beginner\",\"gender\":\"male\",\"birth_date\":\"2025-06-17T16:00:00.000Z\",\"authenticated\":true,\"loginTime\":\"2025-06-05T07:51:29.529Z\"}', 1, '2025-06-06 15:51:29', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '::1', NULL, '2025-06-05 07:51:29', '2025-06-05 07:51:29', '2025-06-05 07:51:29');

--
-- Triggers `user_sessions`
--
DELIMITER $$
CREATE TRIGGER `update_last_login_on_session` AFTER INSERT ON `user_sessions` FOR EACH ROW BEGIN
    UPDATE `profiles` 
    SET `last_login` = NOW(), `updated_at` = NOW()
    WHERE `account_id` = NEW.account_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Stand-in structure for view `user_statistics`
-- (See below for the actual view)
--
CREATE TABLE `user_statistics` (
`total_users` bigint(21)
,`active_users` bigint(21)
,`students` bigint(21)
,`admins` bigint(21)
,`instructors` bigint(21)
,`new_users_30d` bigint(21)
,`active_24h` bigint(21)
);

-- --------------------------------------------------------

--
-- Structure for view `active_user_sessions`
--
DROP TABLE IF EXISTS `active_user_sessions`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `active_user_sessions`  AS SELECT `us`.`id` AS `id`, `us`.`session_id` AS `session_id`, `us`.`account_id` AS `account_id`, `p`.`name` AS `name`, `p`.`username` AS `username`, `p`.`email` AS `email`, `us`.`ip_address` AS `ip_address`, `us`.`user_agent` AS `user_agent`, `us`.`last_activity` AS `last_activity`, `us`.`expires_at` AS `expires_at`, `us`.`created_at` AS `created_at` FROM (`user_sessions` `us` join `profiles` `p` on(`us`.`account_id` = `p`.`account_id`)) WHERE `us`.`is_active` = 1 AND `us`.`expires_at` > current_timestamp() ;

-- --------------------------------------------------------

--
-- Structure for view `user_statistics`
--
DROP TABLE IF EXISTS `user_statistics`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `user_statistics`  AS SELECT count(0) AS `total_users`, count(case when `profiles`.`authenticated` = 1 then 1 end) AS `active_users`, count(case when `profiles`.`roles` = 'student' then 1 end) AS `students`, count(case when `profiles`.`roles` = 'admin' then 1 end) AS `admins`, count(case when `profiles`.`roles` = 'instructor' then 1 end) AS `instructors`, count(case when `profiles`.`created_at` >= current_timestamp() - interval 30 day then 1 end) AS `new_users_30d`, count(case when `profiles`.`last_login` >= current_timestamp() - interval 24 hour then 1 end) AS `active_24h` FROM `profiles` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`account_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_logs_account` (`account_id`),
  ADD KEY `idx_action` (`action`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_account_action` (`account_id`,`action`);

--
-- Indexes for table `competency_progress`
--
ALTER TABLE `competency_progress`
  ADD PRIMARY KEY (`progress_id`),
  ADD KEY `competency_progress_ibfk_1` (`student_id`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`document_id`),
  ADD KEY `documents_ibfk_1` (`student_id`);

--
-- Indexes for table `draft`
--
ALTER TABLE `draft`
  ADD PRIMARY KEY (`student_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `student_fk_name` (`account_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_token_unique` (`email`,`token`),
  ADD KEY `idx_email_token` (`email`,`token`),
  ADD KEY `idx_expires_at` (`expires_at`),
  ADD KEY `idx_is_used` (`is_used`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `payments_ibfk_1` (`student_id`);

--
-- Indexes for table `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `account_id` (`account_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `account_id_unique` (`account_id`),
  ADD UNIQUE KEY `email_unique` (`email`),
  ADD UNIQUE KEY `username_unique` (`username`),
  ADD KEY `fk_profiles_account` (`account_id`),
  ADD KEY `idx_roles` (`roles`),
  ADD KEY `idx_trading_level` (`trading_level`),
  ADD KEY `idx_authenticated` (`authenticated`),
  ADD KEY `idx_email_verified` (`is_verified`),
  ADD KEY `idx_name_email` (`name`,`email`);

--
-- Indexes for table `referrals`
--
ALTER TABLE `referrals`
  ADD PRIMARY KEY (`referral_id`),
  ADD KEY `referrals_ibfk_1` (`student_id`);

--
-- Indexes for table `scholarships`
--
ALTER TABLE `scholarships`
  ADD PRIMARY KEY (`scholarship_id`),
  ADD KEY `scholarships_ibfk_1` (`student_id`);

--
-- Indexes for table `staffs`
--
ALTER TABLE `staffs`
  ADD PRIMARY KEY (`staff_id`),
  ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`student_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `student_fk_name` (`account_id`),
  ADD KEY `idx_name_student_id` (`name`,`student_id`);

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`),
  ADD UNIQUE KEY `setting_key_unique` (`setting_key`),
  ADD KEY `idx_public_settings` (`is_public`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username_unique` (`username`),
  ADD UNIQUE KEY `email_unique` (`email`),
  ADD KEY `fk_users_account` (`account_id`),
  ADD KEY `idx_roles` (`roles`),
  ADD KEY `idx_authenticated` (`authenticated`);

--
-- Indexes for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `session_id_unique` (`session_id`),
  ADD KEY `fk_sessions_account` (`account_id`),
  ADD KEY `idx_active_sessions` (`account_id`,`is_active`,`expires_at`),
  ADD KEY `idx_expires_at` (`expires_at`),
  ADD KEY `idx_ip_address` (`ip_address`),
  ADD KEY `idx_account_active_expires` (`account_id`,`is_active`,`expires_at`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `competency_progress`
--
ALTER TABLE `competency_progress`
  MODIFY `progress_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `document_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `profiles`
--
ALTER TABLE `profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `referrals`
--
ALTER TABLE `referrals`
  MODIFY `referral_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `scholarships`
--
ALTER TABLE `scholarships`
  MODIFY `scholarship_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `staffs`
--
ALTER TABLE `staffs`
  MODIFY `staff_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `system_settings`
--
ALTER TABLE `system_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `fk_logs_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `competency_progress`
--
ALTER TABLE `competency_progress`
  ADD CONSTRAINT `competency_progress_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `profiles`
--
ALTER TABLE `profiles`
  ADD CONSTRAINT `fk_profiles_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `referrals`
--
ALTER TABLE `referrals`
  ADD CONSTRAINT `referrals_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `scholarships`
--
ALTER TABLE `scholarships`
  ADD CONSTRAINT `scholarships_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `staffs`
--
ALTER TABLE `staffs`
  ADD CONSTRAINT `staffs_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `student_fk_name` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `fk_sessions_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
