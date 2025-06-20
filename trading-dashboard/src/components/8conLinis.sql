-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 20, 2025 at 07:17 AM
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
(8, 'staff', 'janesmith85', '$2b$10$OzSQH5gU30AIxgq2mnCOI.3xmxrHxJCuUk/HT6w2B6b.RtfkGz002', 0, '2025-06-12 04:37:32.926879'),
(9, 'staff', 'janesmith20', '$2b$10$u84SVqHRRTQ7n.4PPmZZGu/Yn/r8MAExAr2Jdku.OO98vzpiEXG0m', 0, '2025-06-12 04:41:50.755652'),
(11, 'admin', 'Gimpy', 'ae135ad952a48300d66a514a2398c54b6e588c65f259dcb762b436fa5227e8ef', 0, '2025-05-21 00:30:02.014214'),
(12, 'student', 'diass', 'b3da6c475b259fe6e394263eff01e9f8c2c9ca86c4d2431eba76edac03da5a0c', 0, '2025-05-21 00:30:02.014214'),
(13, 'student', 'johndoe123', '$2b$10$13ICgI5IHOt9r/Yg7Jkj7uvI6F5ffSZcCOwGd4PafjeSEeKXd7Fxa', 0, '2025-06-13 06:24:33.463561'),
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
(11, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-05 07:51:29'),
(12, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 06:58:17'),
(13, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 08:46:54'),
(14, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 08:48:04'),
(15, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 08:48:36'),
(16, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 08:49:31'),
(17, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 08:52:21'),
(18, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 08:52:34'),
(19, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 08:55:24'),
(20, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 08:55:36'),
(21, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 08:55:47'),
(22, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 08:58:37'),
(23, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 08:58:45'),
(24, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 09:01:05'),
(25, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 09:04:26'),
(26, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 09:05:40'),
(27, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 09:08:28'),
(31, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 09:13:42'),
(32, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 09:15:25'),
(33, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 09:15:36'),
(34, 1, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-06 09:15:43'),
(35, 8, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-12 04:38:17'),
(36, 8, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-12 04:38:20'),
(37, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 04:03:37'),
(38, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 04:58:27'),
(39, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 05:00:15'),
(40, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 06:10:43'),
(41, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 06:33:53'),
(42, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 06:40:29'),
(43, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 06:40:44'),
(44, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 06:49:36'),
(45, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 07:18:29'),
(46, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 07:43:41'),
(47, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 07:53:34'),
(48, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 08:09:46'),
(49, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 08:24:44'),
(50, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 08:39:28'),
(51, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 09:01:41'),
(52, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 09:02:04'),
(53, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 09:04:45'),
(54, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-16 09:05:25'),
(55, 13, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-17 03:53:59');

-- --------------------------------------------------------

--
-- Table structure for table `assets`
--

CREATE TABLE `assets` (
  `code` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` enum('Currency','Commodity') NOT NULL,
  `description` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assets`
--

INSERT INTO `assets` (`code`, `name`, `type`, `description`, `created_at`, `updated_at`) VALUES
('AUD', 'Australian Dollar', 'Currency', 'Australian Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('CAD', 'Canadian Dollar', 'Currency', 'Canadian Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('CHF', 'Swiss Franc', 'Currency', 'Swiss Currency', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('EUR', 'Euro', 'Currency', 'European Union Euro', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('GBP', 'British Pound', 'Currency', 'United Kingdom Pound', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('JPY', 'Japanese Yen', 'Currency', 'Japanese Yen', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('NZD', 'New Zealand Dollar', 'Currency', 'New Zealand Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('USD', 'US Dollar', 'Currency', 'United States Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('XAG', 'Silver', 'Commodity', 'Silver Spot Price', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('XAU', 'Gold', 'Commodity', 'Gold Spot Price', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('AUD', 'Australian Dollar', 'Currency', 'Australian Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('CAD', 'Canadian Dollar', 'Currency', 'Canadian Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('CHF', 'Swiss Franc', 'Currency', 'Swiss Currency', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('EUR', 'Euro', 'Currency', 'European Union Euro', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('GBP', 'British Pound', 'Currency', 'United Kingdom Pound', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('JPY', 'Japanese Yen', 'Currency', 'Japanese Yen', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('NZD', 'New Zealand Dollar', 'Currency', 'New Zealand Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('USD', 'US Dollar', 'Currency', 'United States Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('XAG', 'Silver', 'Commodity', 'Silver Spot Price', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('XAU', 'Gold', 'Commodity', 'Gold Spot Price', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('AUD', 'Australian Dollar', 'Currency', 'Australian Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('CAD', 'Canadian Dollar', 'Currency', 'Canadian Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('CHF', 'Swiss Franc', 'Currency', 'Swiss Currency', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('EUR', 'Euro', 'Currency', 'European Union Euro', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('GBP', 'British Pound', 'Currency', 'United Kingdom Pound', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('JPY', 'Japanese Yen', 'Currency', 'Japanese Yen', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('NZD', 'New Zealand Dollar', 'Currency', 'New Zealand Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('USD', 'US Dollar', 'Currency', 'United States Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('XAG', 'Silver', 'Commodity', 'Silver Spot Price', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('XAU', 'Gold', 'Commodity', 'Gold Spot Price', '2025-06-05 16:21:25', '2025-06-05 16:21:25');

-- --------------------------------------------------------

--
-- Table structure for table `asset_pairs`
--

CREATE TABLE `asset_pairs` (
  `asset_pair_code` varchar(20) NOT NULL,
  `base_asset` varchar(10) NOT NULL,
  `quote_asset` varchar(10) NOT NULL,
  `description` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `asset_pairs`
--

INSERT INTO `asset_pairs` (`asset_pair_code`, `base_asset`, `quote_asset`, `description`, `created_at`, `updated_at`) VALUES
('AUDCAD', 'AUD', 'CAD', 'Australian Dollar / Canadian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('AUDCHF', 'AUD', 'CHF', 'Australian Dollar / Swiss Franc', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('AUDJPY', 'AUD', 'JPY', 'Australian Dollar / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('AUDNZD', 'AUD', 'NZD', 'Australian Dollar / New Zealand Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('AUDUSD', 'AUD', 'USD', 'Australian Dollar / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('CADJPY', 'CAD', 'JPY', 'Canadian Dollar / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('CHFJPY', 'CHF', 'JPY', 'Swiss Franc / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURAUD', 'EUR', 'AUD', 'Euro / Australian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURCAD', 'EUR', 'CAD', 'Euro / Canadian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURCHF', 'EUR', 'CHF', 'Euro / Swiss Franc', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURGBP', 'EUR', 'GBP', 'Euro / British Pound', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURJPY', 'EUR', 'JPY', 'Euro / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURNZD', 'EUR', 'NZD', 'Euro / New Zealand Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURUSD', 'EUR', 'USD', 'Euro / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('GBPAUD', 'GBP', 'AUD', 'British Pound / Australian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('GBPCAD', 'GBP', 'CAD', 'British Pound / Canadian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('GBPCHF', 'GBP', 'CHF', 'British Pound / Swiss Franc', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('GBPJPY', 'GBP', 'JPY', 'British Pound / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('GBPNZD', 'GBP', 'NZD', 'British Pound / New Zealand Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('GBPUSD', 'GBP', 'USD', 'British Pound / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('NZDCAD', 'NZD', 'CAD', 'New Zealand Dollar / Canadian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('NZDCHF', 'NZD', 'CHF', 'New Zealand Dollar / Swiss Franc', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('NZDJPY', 'NZD', 'JPY', 'New Zealand Dollar / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('NZDUSD', 'NZD', 'USD', 'New Zealand Dollar / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('USDCAD', 'USD', 'CAD', 'US Dollar / Canadian Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('USDCHF', 'USD', 'CHF', 'US Dollar / Swiss Franc', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('USDJPY', 'USD', 'JPY', 'US Dollar / Japanese Yen', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('XAGUSD', 'XAG', 'USD', 'Silver / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('XAUUSD', 'XAU', 'USD', 'Gold / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('AUDCAD', 'AUD', 'CAD', 'Australian Dollar / Canadian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('AUDCHF', 'AUD', 'CHF', 'Australian Dollar / Swiss Franc', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('AUDJPY', 'AUD', 'JPY', 'Australian Dollar / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('AUDNZD', 'AUD', 'NZD', 'Australian Dollar / New Zealand Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('AUDUSD', 'AUD', 'USD', 'Australian Dollar / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('CADJPY', 'CAD', 'JPY', 'Canadian Dollar / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('CHFJPY', 'CHF', 'JPY', 'Swiss Franc / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURAUD', 'EUR', 'AUD', 'Euro / Australian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURCAD', 'EUR', 'CAD', 'Euro / Canadian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURCHF', 'EUR', 'CHF', 'Euro / Swiss Franc', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURGBP', 'EUR', 'GBP', 'Euro / British Pound', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURJPY', 'EUR', 'JPY', 'Euro / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURNZD', 'EUR', 'NZD', 'Euro / New Zealand Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURUSD', 'EUR', 'USD', 'Euro / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('GBPAUD', 'GBP', 'AUD', 'British Pound / Australian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('GBPCAD', 'GBP', 'CAD', 'British Pound / Canadian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('GBPCHF', 'GBP', 'CHF', 'British Pound / Swiss Franc', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('GBPJPY', 'GBP', 'JPY', 'British Pound / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('GBPNZD', 'GBP', 'NZD', 'British Pound / New Zealand Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('GBPUSD', 'GBP', 'USD', 'British Pound / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('NZDCAD', 'NZD', 'CAD', 'New Zealand Dollar / Canadian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('NZDCHF', 'NZD', 'CHF', 'New Zealand Dollar / Swiss Franc', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('NZDJPY', 'NZD', 'JPY', 'New Zealand Dollar / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('NZDUSD', 'NZD', 'USD', 'New Zealand Dollar / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('USDCAD', 'USD', 'CAD', 'US Dollar / Canadian Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('USDCHF', 'USD', 'CHF', 'US Dollar / Swiss Franc', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('USDJPY', 'USD', 'JPY', 'US Dollar / Japanese Yen', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('XAGUSD', 'XAG', 'USD', 'Silver / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('XAUUSD', 'XAU', 'USD', 'Gold / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('AUDCAD', 'AUD', 'CAD', 'Australian Dollar / Canadian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('AUDCHF', 'AUD', 'CHF', 'Australian Dollar / Swiss Franc', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('AUDJPY', 'AUD', 'JPY', 'Australian Dollar / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('AUDNZD', 'AUD', 'NZD', 'Australian Dollar / New Zealand Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('AUDUSD', 'AUD', 'USD', 'Australian Dollar / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('CADJPY', 'CAD', 'JPY', 'Canadian Dollar / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('CHFJPY', 'CHF', 'JPY', 'Swiss Franc / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURAUD', 'EUR', 'AUD', 'Euro / Australian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURCAD', 'EUR', 'CAD', 'Euro / Canadian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURCHF', 'EUR', 'CHF', 'Euro / Swiss Franc', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURGBP', 'EUR', 'GBP', 'Euro / British Pound', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURJPY', 'EUR', 'JPY', 'Euro / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURNZD', 'EUR', 'NZD', 'Euro / New Zealand Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('EURUSD', 'EUR', 'USD', 'Euro / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('GBPAUD', 'GBP', 'AUD', 'British Pound / Australian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('GBPCAD', 'GBP', 'CAD', 'British Pound / Canadian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('GBPCHF', 'GBP', 'CHF', 'British Pound / Swiss Franc', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('GBPJPY', 'GBP', 'JPY', 'British Pound / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('GBPNZD', 'GBP', 'NZD', 'British Pound / New Zealand Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('GBPUSD', 'GBP', 'USD', 'British Pound / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('NZDCAD', 'NZD', 'CAD', 'New Zealand Dollar / Canadian Dollar', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('NZDCHF', 'NZD', 'CHF', 'New Zealand Dollar / Swiss Franc', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('NZDJPY', 'NZD', 'JPY', 'New Zealand Dollar / Japanese Yen', '2025-06-05 16:26:10', '2025-06-05 16:26:10'),
('NZDUSD', 'NZD', 'USD', 'New Zealand Dollar / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('USDCAD', 'USD', 'CAD', 'US Dollar / Canadian Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('USDCHF', 'USD', 'CHF', 'US Dollar / Swiss Franc', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('USDJPY', 'USD', 'JPY', 'US Dollar / Japanese Yen', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('XAGUSD', 'XAG', 'USD', 'Silver / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25'),
('XAUUSD', 'XAU', 'USD', 'Gold / US Dollar', '2025-06-05 16:21:25', '2025-06-05 16:21:25');

-- --------------------------------------------------------

--
-- Table structure for table `core_inflation`
--

CREATE TABLE `core_inflation` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(10) NOT NULL,
  `core_inflation` double NOT NULL,
  `forecast` double NOT NULL,
  `net_change_percent` double NOT NULL,
  `result` varchar(30) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_inflation`
--

INSERT INTO `core_inflation` (`id`, `asset_code`, `core_inflation`, `forecast`, `net_change_percent`, `result`, `created_at`, `updated_at`) VALUES
(0, 'USD', 0.1, 0.3, 0, 'Higher than expected', '2025-06-19 12:19:16', '2025-06-19 12:19:16'),
(0, 'EUR', 0, 0, 0, 'As Expected', '2025-06-19 12:34:17', '2025-06-19 12:34:17');

-- --------------------------------------------------------

--
-- Table structure for table `cot_data`
--

CREATE TABLE `cot_data` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(10) NOT NULL,
  `long_contracts` int(11) NOT NULL,
  `short_contracts` int(11) NOT NULL,
  `change_in_long` int(11) NOT NULL,
  `change_in_short` int(11) NOT NULL,
  `long_percent` double NOT NULL,
  `short_percent` double NOT NULL,
  `net_position` double NOT NULL,
  `net_change_percent` double NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cot_data`
--

INSERT INTO `cot_data` (`id`, `asset_code`, `long_contracts`, `short_contracts`, `change_in_long`, `change_in_short`, `long_percent`, `short_percent`, `net_position`, `net_change_percent`, `created_at`, `updated_at`) VALUES
(0, 'USD', 52, 48, 0, 0, 52.15, 47.85, 4.299999999999997, 52.15, '2025-06-19 13:57:04', '2025-06-19 13:57:04'),
(0, 'EUR', 64, 36, 0, 0, 64.33, 35.67, 28.659999999999997, 64.33, '2025-06-19 13:57:24', '2025-06-19 13:57:24');

-- --------------------------------------------------------

--
-- Table structure for table `employment_change`
--

CREATE TABLE `employment_change` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(10) NOT NULL,
  `employment_change` double NOT NULL,
  `forecast` double NOT NULL,
  `net_change_percent` double NOT NULL,
  `result` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employment_change`
--

INSERT INTO `employment_change` (`id`, `asset_code`, `employment_change`, `forecast`, `net_change_percent`, `result`, `created_at`, `updated_at`) VALUES
(0, 'USD', 0.9, 0.9, 0, 'As Expected', '2025-06-19 12:19:16', '2025-06-19 12:19:16'),
(0, 'EUR', 0.7, 0.8, 0, 'Missed', '2025-06-19 12:34:17', '2025-06-19 12:34:17');

-- --------------------------------------------------------

--
-- Table structure for table `gdp_growth`
--

CREATE TABLE `gdp_growth` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(10) NOT NULL,
  `gdp_growth` double NOT NULL,
  `forecast` double NOT NULL,
  `change_in_gdp` double NOT NULL,
  `result` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gdp_growth`
--

INSERT INTO `gdp_growth` (`id`, `asset_code`, `gdp_growth`, `forecast`, `change_in_gdp`, `result`, `created_at`, `updated_at`) VALUES
(0, 'USD', -0.2, -0.3, 0, 'Beat', '2025-06-19 12:19:16', '2025-06-19 12:19:16'),
(0, 'EUR', 0.6, 0.4, 0, 'Beat', '2025-06-19 12:34:17', '2025-06-19 12:34:17');

-- --------------------------------------------------------

--
-- Table structure for table `interest_rate`
--

CREATE TABLE `interest_rate` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(10) NOT NULL,
  `interest_rate` double NOT NULL,
  `change_in_interest` double NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `interest_rate`
--

INSERT INTO `interest_rate` (`id`, `asset_code`, `interest_rate`, `change_in_interest`, `created_at`, `updated_at`) VALUES
(0, 'USD', 4.5, 0, '2025-06-19 12:19:16', '2025-06-19 12:19:16'),
(0, 'USD', 4.5, 0, '2025-06-19 12:21:35', '2025-06-19 12:21:35'),
(0, 'EUR', 2.4, 0, '2025-06-19 12:34:17', '2025-06-19 12:34:17'),
(0, 'EUR', 2.15, -0.25, '2025-06-19 12:34:27', '2025-06-19 12:34:27');

-- --------------------------------------------------------

--
-- Table structure for table `mpmi`
--

CREATE TABLE `mpmi` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(10) NOT NULL,
  `service_pmi` double NOT NULL,
  `forecast` double NOT NULL,
  `result` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mpmi`
--

INSERT INTO `mpmi` (`id`, `asset_code`, `service_pmi`, `forecast`, `result`, `created_at`, `updated_at`) VALUES
(0, 'USD', 48.5, 49.5, 'Miss', '2025-06-19 12:19:16', '2025-06-19 12:19:16'),
(0, 'EUR', 49.4, 48.4, 'Beat', '2025-06-19 12:34:17', '2025-06-19 12:34:17');

-- --------------------------------------------------------

--
-- Table structure for table `nfp`
--

CREATE TABLE `nfp` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(10) NOT NULL,
  `actual_nfp` double DEFAULT NULL,
  `forecast` double DEFAULT NULL,
  `net_change_percent` double DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nfp`
--

INSERT INTO `nfp` (`id`, `asset_code`, `actual_nfp`, `forecast`, `net_change_percent`, `created_at`, `updated_at`) VALUES
(0, 'USD', 177000, 138000, 0, '2025-06-19 13:03:59', '2025-06-19 13:03:59'),
(0, 'USD', 139000, 126000, -21.47, '2025-06-19 13:04:14', '2025-06-19 13:04:14');

-- --------------------------------------------------------

--
-- Table structure for table `pair_score`
--

CREATE TABLE `pair_score` (
  `asset_pair_code` varchar(20) NOT NULL,
  `cot_score` int(11) NOT NULL,
  `retail_sentiment_score` int(11) NOT NULL,
  `gdp_growth_score` int(11) NOT NULL,
  `core_inflation_score` int(11) NOT NULL,
  `retail_sales_score` int(11) NOT NULL,
  `spmi_score` int(11) NOT NULL,
  `mpmi_score` int(11) NOT NULL,
  `unemployment_rate_score` int(11) NOT NULL,
  `employment_change_score` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pair_score`
--

INSERT INTO `pair_score` (`asset_pair_code`, `cot_score`, `retail_sentiment_score`, `gdp_growth_score`, `core_inflation_score`, `retail_sales_score`, `spmi_score`, `mpmi_score`, `unemployment_rate_score`, `employment_change_score`, `created_at`, `updated_at`) VALUES
('AUDCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDNZD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('CADJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('CHFJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURAUD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURGBP', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURNZD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPAUD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPNZD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('USDCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('USDCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('USDJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('XAGUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('XAUUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDNZD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('CADJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('CHFJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURAUD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURGBP', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURNZD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPAUD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPNZD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('USDCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('USDCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('USDJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('XAGUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('XAUUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDNZD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('CADJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('CHFJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURAUD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURGBP', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURNZD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPAUD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPNZD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('USDCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('USDCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('USDJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('XAGUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('XAUUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDNZD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('AUDUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('CADJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('CHFJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURAUD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURGBP', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURNZD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('EURUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPAUD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPNZD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('GBPUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('NZDUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('USDCAD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('USDCHF', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('USDJPY', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('XAGUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11'),
('XAUUSD', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-06-09 11:22:11', '2025-06-09 11:22:11');

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
(1, 1, '1', 'test', 'test', 'crajeextremeyt@gmail.com', 'student', 'Valenzuela', 'Valenzuela', '2025-06-17', '09427184388', 'beginner', NULL, 'male', '/uploads/avatars/1749025966246-343866882.png', NULL, NULL, 1, '2025-06-04 08:31:08', '2025-06-11 17:57:37', 0, NULL, '2025-06-04 08:31:08', '2025-06-11 09:57:37'),
(2, 8, NULL, 'Jane Elizabeth Smith', 'janesmith85', 'jane.smith@example.com', '', '', 'San Francisco, CA', '1985-05-18', '', NULL, NULL, 'female', '/uploads/avatars/1749703097767-696713373.png', NULL, NULL, 1, '2025-06-12 12:37:32', NULL, 0, NULL, '2025-06-12 04:37:32', '2025-06-12 04:38:20'),
(3, 9, NULL, 'Jane Elizabeth Smith', 'janesmith20', 'janes.smith@example.com', '', '', 'San Francisco, CA', '1985-05-19', '', NULL, NULL, 'female', NULL, NULL, NULL, 1, '2025-06-12 12:41:50', NULL, 0, NULL, '2025-06-12 04:41:50', '2025-06-12 04:41:50'),
(7, 13, 'S1749790242780_13', 'John Michael Doja Catering', 'johndoe123', 'johndoe@gmail.com', 'student', '123 Main Street, New York, NY', 'Marilao Bulacan', '1990-05-03', '09234567890', 'beginner', '', 'male', '', '', '{\"device_type\":\"Desktop,Mobile\",\"learning_style\":\"\"}', 1, '2025-06-17 03:53:59', '2025-06-17 03:53:58', 1, NULL, '2025-06-12 22:24:33', '2025-06-16 19:53:59');

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
-- Table structure for table `retail_sales`
--

CREATE TABLE `retail_sales` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(10) NOT NULL,
  `retail_sales` double NOT NULL,
  `forecast` double NOT NULL,
  `net_change_percent` double NOT NULL,
  `result` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `retail_sales`
--

INSERT INTO `retail_sales` (`id`, `asset_code`, `retail_sales`, `forecast`, `net_change_percent`, `result`, `created_at`, `updated_at`) VALUES
(0, 'USD', -0.9, -0.7, 0, 'Miss', '2025-06-19 12:19:16', '2025-06-19 12:19:16'),
(0, 'EUR', 0.1, 0.1, 0, 'Met', '2025-06-19 12:34:17', '2025-06-19 12:34:17');

-- --------------------------------------------------------

--
-- Table structure for table `retail_sentiment`
--

CREATE TABLE `retail_sentiment` (
  `id` int(11) NOT NULL,
  `asset_pair_code` varchar(20) NOT NULL,
  `retail_long` double NOT NULL,
  `retail_short` double NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `retail_sentiment`
--

INSERT INTO `retail_sentiment` (`id`, `asset_pair_code`, `retail_long`, `retail_short`, `created_at`, `updated_at`) VALUES
(0, 'EURUSD', 40, 60, '2025-06-19 13:56:31', '2025-06-19 13:56:31');

-- --------------------------------------------------------

--
-- Table structure for table `spmi`
--

CREATE TABLE `spmi` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(10) NOT NULL,
  `service_pmi` double NOT NULL,
  `forecast` double NOT NULL,
  `result` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `spmi`
--

INSERT INTO `spmi` (`id`, `asset_code`, `service_pmi`, `forecast`, `result`, `created_at`, `updated_at`) VALUES
(0, 'USD', 49.9, 52, 'Miss', '2025-06-19 12:19:16', '2025-06-19 12:19:16');

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
-- Table structure for table `unemployment_rate`
--

CREATE TABLE `unemployment_rate` (
  `id` int(11) NOT NULL,
  `asset_code` varchar(10) NOT NULL,
  `unemployment_rate` double NOT NULL,
  `forecast` double NOT NULL,
  `net_change_percent` double NOT NULL,
  `result` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `unemployment_rate`
--

INSERT INTO `unemployment_rate` (`id`, `asset_code`, `unemployment_rate`, `forecast`, `net_change_percent`, `result`, `created_at`, `updated_at`) VALUES
(0, 'USD', 4.2, 4.2, 0, 'As Expected', '2025-06-19 12:19:16', '2025-06-19 12:19:16'),
(0, 'EUR', 6.2, 6.2, 0, 'As Expected', '2025-06-19 12:34:17', '2025-06-19 12:34:17');

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
(21, 'Cfo4o04cPo0CgnKRc-BHZCd5UVig1WFQ', 1, 'crajeextremeyt@gmail.com', '{\"account_id\":1,\"student_id\":\"1\",\"name\":\"Chalex Napoles\",\"username\":\"test\",\"email\":\"crajeextremeyt@gmail.com\",\"roles\":\"student\",\"address\":\"Valenzuela\",\"birth_place\":\"Valenzuela\",\"phone_no\":\"09427184388\",\"trading_level\":\"Beginner\",\"gender\":\"male\",\"birth_date\":\"2025-06-17T16:00:00.000Z\",\"authenticated\":true,\"loginTime\":\"2025-06-06T09:15:42.996Z\"}', 1, '2025-06-07 17:15:42', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 OPR/119.0.0.0', '::1', NULL, '2025-06-06 09:15:43', '2025-06-06 09:15:43', '2025-06-06 09:15:43');

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
-- Structure for view `active_user_sessions`
--
DROP TABLE IF EXISTS `active_user_sessions`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `active_user_sessions`  AS SELECT `us`.`id` AS `id`, `us`.`session_id` AS `session_id`, `us`.`account_id` AS `account_id`, `p`.`name` AS `name`, `p`.`username` AS `username`, `p`.`email` AS `email`, `us`.`ip_address` AS `ip_address`, `us`.`user_agent` AS `user_agent`, `us`.`last_activity` AS `last_activity`, `us`.`expires_at` AS `expires_at`, `us`.`created_at` AS `created_at` FROM (`user_sessions` `us` join `profiles` `p` on(`us`.`account_id` = `p`.`account_id`)) WHERE `us`.`is_active` = 1 AND `us`.`expires_at` > current_timestamp() ;

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
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`student_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `student_fk_name` (`account_id`),
  ADD KEY `idx_name_student_id` (`name`,`student_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `profiles`
--
ALTER TABLE `profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `referrals`
--
ALTER TABLE `referrals`
  MODIFY `referral_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `fk_logs_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE SET NULL ON UPDATE CASCADE;

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
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `student_fk_name` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `fk_sessions_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
