-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 13, 2025 at 01:09 PM
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
(13, 'student', 'johndoe123', '$2b$10$OShZXEGGfgBuN7lXks/XfeuFvPemcypi5HE7rMbGffjHUTBmeAdWe', 0, '2025-06-13 06:24:33.463561'),
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
(36, 8, 'profile_updated', 'User profile was updated', NULL, NULL, NULL, '2025-06-12 04:38:20');

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
(1, 'USD', 3.2, 3, 0, 'Lower than expected', '2025-06-09 15:18:40', '2025-06-09 15:18:40'),
(2, 'USD', 3.2, 3, 0, 'Higher than expected', '2025-06-09 16:04:13', '2025-06-09 16:04:13'),
(3, 'EUR', 2.8, 2.9, 0, 'Lower than expected', '2025-06-09 16:04:13', '2025-06-09 16:04:13'),
(4, 'GBP', 3.5, 3.5, 0, 'As Expected', '2025-06-09 16:04:13', '2025-06-09 16:04:13'),
(5, 'JPY', 1.8, 2, 0, 'Lower than expected', '2025-06-09 16:04:13', '2025-06-09 16:04:13'),
(6, 'AUD', 4.1, 3.8, 0, 'Higher than expected', '2025-06-09 16:04:13', '2025-06-09 16:04:13'),
(7, 'CAD', 3.7, 3.6, 0, 'Higher than expected', '2025-06-09 16:04:13', '2025-06-09 16:04:13'),
(8, 'CHF', 2.1, 2.3, 0, 'Lower than expected', '2025-06-09 16:04:13', '2025-06-09 16:04:13'),
(9, 'NZD', 4.8, 4.5, 0, 'Higher than expected', '2025-06-09 16:04:13', '2025-06-09 16:04:13'),
(10, 'USD', 3.5, 3.3, 9.38, 'Higher than expected', '2025-06-09 16:04:23', '2025-06-09 16:04:23'),
(11, 'EUR', 3.1, 2.8, 10.71, 'Higher than expected', '2025-06-09 16:04:23', '2025-06-09 16:04:23'),
(12, 'GBP', 3.3, 3.4, -5.71, 'Lower than expected', '2025-06-09 16:04:23', '2025-06-09 16:04:23'),
(13, 'JPY', 2.2, 1.9, 22.22, 'Higher than expected', '2025-06-09 16:04:23', '2025-06-09 16:04:23'),
(14, 'AUD', 3.8, 4, -7.32, 'Lower than expected', '2025-06-09 16:04:23', '2025-06-09 16:04:23'),
(15, 'CAD', 4, 3.8, 8.11, 'Higher than expected', '2025-06-09 16:04:23', '2025-06-09 16:04:23'),
(16, 'CHF', 2.4, 2.2, 14.29, 'Higher than expected', '2025-06-09 16:04:23', '2025-06-09 16:04:23'),
(17, 'NZD', 4.5, 4.7, -6.25, 'Lower than expected', '2025-06-09 16:04:23', '2025-06-09 16:04:23'),
(18, 'USD', 2, 2, -42.86, 'As Expected', '2025-06-11 12:57:20', '2025-06-11 12:57:20'),
(1, 'USD', 3.2, 3, 0, 'Lower than expected', '2025-06-09 15:18:40', '2025-06-09 15:18:40'),
(2, 'USD', 3.2, 3, 0, 'Higher than expected', '2025-06-09 16:04:13', '2025-06-09 16:04:13'),
(3, 'EUR', 2.8, 2.9, 0, 'Lower than expected', '2025-06-09 16:04:13', '2025-06-09 16:04:13'),
(4, 'GBP', 3.5, 3.5, 0, 'As Expected', '2025-06-09 16:04:13', '2025-06-09 16:04:13'),
(5, 'JPY', 1.8, 2, 0, 'Lower than expected', '2025-06-09 16:04:13', '2025-06-09 16:04:13'),
(6, 'AUD', 4.1, 3.8, 0, 'Higher than expected', '2025-06-09 16:04:13', '2025-06-09 16:04:13'),
(7, 'CAD', 3.7, 3.6, 0, 'Higher than expected', '2025-06-09 16:04:13', '2025-06-09 16:04:13'),
(8, 'CHF', 2.1, 2.3, 0, 'Lower than expected', '2025-06-09 16:04:13', '2025-06-09 16:04:13'),
(9, 'NZD', 4.8, 4.5, 0, 'Higher than expected', '2025-06-09 16:04:13', '2025-06-09 16:04:13'),
(10, 'USD', 3.5, 3.3, 9.38, 'Higher than expected', '2025-06-09 16:04:23', '2025-06-09 16:04:23'),
(11, 'EUR', 3.1, 2.8, 10.71, 'Higher than expected', '2025-06-09 16:04:23', '2025-06-09 16:04:23'),
(12, 'GBP', 3.3, 3.4, -5.71, 'Lower than expected', '2025-06-09 16:04:23', '2025-06-09 16:04:23'),
(13, 'JPY', 2.2, 1.9, 22.22, 'Higher than expected', '2025-06-09 16:04:23', '2025-06-09 16:04:23'),
(14, 'AUD', 3.8, 4, -7.32, 'Lower than expected', '2025-06-09 16:04:23', '2025-06-09 16:04:23'),
(15, 'CAD', 4, 3.8, 8.11, 'Higher than expected', '2025-06-09 16:04:23', '2025-06-09 16:04:23'),
(16, 'CHF', 2.4, 2.2, 14.29, 'Higher than expected', '2025-06-09 16:04:23', '2025-06-09 16:04:23'),
(17, 'NZD', 4.5, 4.7, -6.25, 'Lower than expected', '2025-06-09 16:04:23', '2025-06-09 16:04:23'),
(18, 'USD', 2, 2, -42.86, 'As Expected', '2025-06-11 12:57:20', '2025-06-11 12:57:20'),
(1, 'USD', 3.2, 3, 0, 'Lower than expected', '2025-06-09 15:18:40', '2025-06-09 15:18:40'),
(2, 'USD', 3.2, 3, 0, 'Higher than expected', '2025-06-09 16:04:13', '2025-06-09 16:04:13'),
(3, 'EUR', 2.8, 2.9, 0, 'Lower than expected', '2025-06-09 16:04:13', '2025-06-09 16:04:13'),
(4, 'GBP', 3.5, 3.5, 0, 'As Expected', '2025-06-09 16:04:13', '2025-06-09 16:04:13'),
(5, 'JPY', 1.8, 2, 0, 'Lower than expected', '2025-06-09 16:04:13', '2025-06-09 16:04:13'),
(6, 'AUD', 4.1, 3.8, 0, 'Higher than expected', '2025-06-09 16:04:13', '2025-06-09 16:04:13'),
(7, 'CAD', 3.7, 3.6, 0, 'Higher than expected', '2025-06-09 16:04:13', '2025-06-09 16:04:13'),
(8, 'CHF', 2.1, 2.3, 0, 'Lower than expected', '2025-06-09 16:04:13', '2025-06-09 16:04:13'),
(9, 'NZD', 4.8, 4.5, 0, 'Higher than expected', '2025-06-09 16:04:13', '2025-06-09 16:04:13'),
(10, 'USD', 3.5, 3.3, 9.38, 'Higher than expected', '2025-06-09 16:04:23', '2025-06-09 16:04:23'),
(11, 'EUR', 3.1, 2.8, 10.71, 'Higher than expected', '2025-06-09 16:04:23', '2025-06-09 16:04:23'),
(12, 'GBP', 3.3, 3.4, -5.71, 'Lower than expected', '2025-06-09 16:04:23', '2025-06-09 16:04:23'),
(13, 'JPY', 2.2, 1.9, 22.22, 'Higher than expected', '2025-06-09 16:04:23', '2025-06-09 16:04:23'),
(14, 'AUD', 3.8, 4, -7.32, 'Lower than expected', '2025-06-09 16:04:23', '2025-06-09 16:04:23'),
(15, 'CAD', 4, 3.8, 8.11, 'Higher than expected', '2025-06-09 16:04:23', '2025-06-09 16:04:23'),
(16, 'CHF', 2.4, 2.2, 14.29, 'Higher than expected', '2025-06-09 16:04:23', '2025-06-09 16:04:23'),
(17, 'NZD', 4.5, 4.7, -6.25, 'Lower than expected', '2025-06-09 16:04:23', '2025-06-09 16:04:23'),
(18, 'USD', 2, 2, -42.86, 'As Expected', '2025-06-11 12:57:20', '2025-06-11 12:57:20');

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
(1, 'USD', 10000, 8000, 0, 0, 55.56, 44.44, 2000, 55.56, '2025-06-09 12:14:37', '2025-06-09 12:14:37'),
(2, 'USD', 125000, 95000, 0, 0, 56.82, 43.18, 30000, 0, '2025-06-09 16:01:30', '2025-06-09 16:01:30'),
(3, 'EUR', 89000, 67000, 0, 0, 57.05, 42.95, 22000, 0, '2025-06-09 16:01:30', '2025-06-09 16:01:30'),
(4, 'GBP', 78000, 62000, 0, 0, 55.71, 44.29, 16000, 0, '2025-06-09 16:01:30', '2025-06-09 16:01:30'),
(5, 'JPY', 112000, 88000, 0, 0, 56, 44, 24000, 0, '2025-06-09 16:01:30', '2025-06-09 16:01:30'),
(6, 'AUD', 65000, 45000, 0, 0, 59.09, 40.91, 20000, 0, '2025-06-09 16:01:30', '2025-06-09 16:01:30'),
(7, 'CAD', 54000, 46000, 0, 0, 54, 46, 8000, 0, '2025-06-09 16:01:30', '2025-06-09 16:01:30'),
(8, 'CHF', 43000, 37000, 0, 0, 53.75, 46.25, 6000, 0, '2025-06-09 16:01:30', '2025-06-09 16:01:30'),
(9, 'NZD', 28000, 22000, 0, 0, 56, 44, 6000, 0, '2025-06-09 16:01:30', '2025-06-09 16:01:30'),
(10, 'USD', 132000, 98000, 7000, 3000, 57.39, 42.61, 34000, 0.57, '2025-06-09 16:01:42', '2025-06-09 16:01:42'),
(11, 'EUR', 92000, 71000, 3000, 4000, 56.44, 43.56, 21000, -0.61, '2025-06-09 16:01:42', '2025-06-09 16:01:42'),
(12, 'GBP', 81000, 59000, 3000, -3000, 57.86, 42.14, 22000, 2.15, '2025-06-09 16:01:42', '2025-06-09 16:01:42'),
(13, 'JPY', 118000, 92000, 6000, 4000, 56.19, 43.81, 26000, 0.19, '2025-06-09 16:01:42', '2025-06-09 16:01:42'),
(14, 'AUD', 68000, 47000, 3000, 2000, 59.13, 40.87, 21000, 0.04, '2025-06-09 16:01:42', '2025-06-09 16:01:42'),
(15, 'CAD', 57000, 43000, 3000, -3000, 57, 43, 14000, 3, '2025-06-09 16:01:42', '2025-06-09 16:01:42'),
(16, 'CHF', 46000, 34000, 3000, -3000, 57.5, 42.5, 12000, 3.75, '2025-06-09 16:01:42', '2025-06-09 16:01:42'),
(17, 'NZD', 31000, 19000, 3000, -3000, 62, 38, 12000, 6, '2025-06-09 16:01:42', '2025-06-09 16:01:42'),
(18, 'USD', 2, 2, -131998, -97998, 50, 50, 0, -7.39, '2025-06-11 12:57:20', '2025-06-11 12:57:20'),
(1, 'USD', 10000, 8000, 0, 0, 55.56, 44.44, 2000, 55.56, '2025-06-09 12:14:37', '2025-06-09 12:14:37'),
(2, 'USD', 125000, 95000, 0, 0, 56.82, 43.18, 30000, 0, '2025-06-09 16:01:30', '2025-06-09 16:01:30'),
(3, 'EUR', 89000, 67000, 0, 0, 57.05, 42.95, 22000, 0, '2025-06-09 16:01:30', '2025-06-09 16:01:30'),
(4, 'GBP', 78000, 62000, 0, 0, 55.71, 44.29, 16000, 0, '2025-06-09 16:01:30', '2025-06-09 16:01:30'),
(5, 'JPY', 112000, 88000, 0, 0, 56, 44, 24000, 0, '2025-06-09 16:01:30', '2025-06-09 16:01:30'),
(6, 'AUD', 65000, 45000, 0, 0, 59.09, 40.91, 20000, 0, '2025-06-09 16:01:30', '2025-06-09 16:01:30'),
(7, 'CAD', 54000, 46000, 0, 0, 54, 46, 8000, 0, '2025-06-09 16:01:30', '2025-06-09 16:01:30'),
(8, 'CHF', 43000, 37000, 0, 0, 53.75, 46.25, 6000, 0, '2025-06-09 16:01:30', '2025-06-09 16:01:30'),
(9, 'NZD', 28000, 22000, 0, 0, 56, 44, 6000, 0, '2025-06-09 16:01:30', '2025-06-09 16:01:30'),
(10, 'USD', 132000, 98000, 7000, 3000, 57.39, 42.61, 34000, 0.57, '2025-06-09 16:01:42', '2025-06-09 16:01:42'),
(11, 'EUR', 92000, 71000, 3000, 4000, 56.44, 43.56, 21000, -0.61, '2025-06-09 16:01:42', '2025-06-09 16:01:42'),
(12, 'GBP', 81000, 59000, 3000, -3000, 57.86, 42.14, 22000, 2.15, '2025-06-09 16:01:42', '2025-06-09 16:01:42'),
(13, 'JPY', 118000, 92000, 6000, 4000, 56.19, 43.81, 26000, 0.19, '2025-06-09 16:01:42', '2025-06-09 16:01:42'),
(14, 'AUD', 68000, 47000, 3000, 2000, 59.13, 40.87, 21000, 0.04, '2025-06-09 16:01:42', '2025-06-09 16:01:42'),
(15, 'CAD', 57000, 43000, 3000, -3000, 57, 43, 14000, 3, '2025-06-09 16:01:42', '2025-06-09 16:01:42'),
(16, 'CHF', 46000, 34000, 3000, -3000, 57.5, 42.5, 12000, 3.75, '2025-06-09 16:01:42', '2025-06-09 16:01:42'),
(17, 'NZD', 31000, 19000, 3000, -3000, 62, 38, 12000, 6, '2025-06-09 16:01:42', '2025-06-09 16:01:42'),
(18, 'USD', 2, 2, -131998, -97998, 50, 50, 0, -7.39, '2025-06-11 12:57:20', '2025-06-11 12:57:20'),
(1, 'USD', 10000, 8000, 0, 0, 55.56, 44.44, 2000, 55.56, '2025-06-09 12:14:37', '2025-06-09 12:14:37'),
(2, 'USD', 125000, 95000, 0, 0, 56.82, 43.18, 30000, 0, '2025-06-09 16:01:30', '2025-06-09 16:01:30'),
(3, 'EUR', 89000, 67000, 0, 0, 57.05, 42.95, 22000, 0, '2025-06-09 16:01:30', '2025-06-09 16:01:30'),
(4, 'GBP', 78000, 62000, 0, 0, 55.71, 44.29, 16000, 0, '2025-06-09 16:01:30', '2025-06-09 16:01:30'),
(5, 'JPY', 112000, 88000, 0, 0, 56, 44, 24000, 0, '2025-06-09 16:01:30', '2025-06-09 16:01:30'),
(6, 'AUD', 65000, 45000, 0, 0, 59.09, 40.91, 20000, 0, '2025-06-09 16:01:30', '2025-06-09 16:01:30'),
(7, 'CAD', 54000, 46000, 0, 0, 54, 46, 8000, 0, '2025-06-09 16:01:30', '2025-06-09 16:01:30'),
(8, 'CHF', 43000, 37000, 0, 0, 53.75, 46.25, 6000, 0, '2025-06-09 16:01:30', '2025-06-09 16:01:30'),
(9, 'NZD', 28000, 22000, 0, 0, 56, 44, 6000, 0, '2025-06-09 16:01:30', '2025-06-09 16:01:30'),
(10, 'USD', 132000, 98000, 7000, 3000, 57.39, 42.61, 34000, 0.57, '2025-06-09 16:01:42', '2025-06-09 16:01:42'),
(11, 'EUR', 92000, 71000, 3000, 4000, 56.44, 43.56, 21000, -0.61, '2025-06-09 16:01:42', '2025-06-09 16:01:42'),
(12, 'GBP', 81000, 59000, 3000, -3000, 57.86, 42.14, 22000, 2.15, '2025-06-09 16:01:42', '2025-06-09 16:01:42'),
(13, 'JPY', 118000, 92000, 6000, 4000, 56.19, 43.81, 26000, 0.19, '2025-06-09 16:01:42', '2025-06-09 16:01:42'),
(14, 'AUD', 68000, 47000, 3000, 2000, 59.13, 40.87, 21000, 0.04, '2025-06-09 16:01:42', '2025-06-09 16:01:42'),
(15, 'CAD', 57000, 43000, 3000, -3000, 57, 43, 14000, 3, '2025-06-09 16:01:42', '2025-06-09 16:01:42'),
(16, 'CHF', 46000, 34000, 3000, -3000, 57.5, 42.5, 12000, 3.75, '2025-06-09 16:01:42', '2025-06-09 16:01:42'),
(17, 'NZD', 31000, 19000, 3000, -3000, 62, 38, 12000, 6, '2025-06-09 16:01:42', '2025-06-09 16:01:42'),
(18, 'USD', 2, 2, -131998, -97998, 50, 50, 0, -7.39, '2025-06-11 12:57:20', '2025-06-11 12:57:20');

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
(19, 'USD', 185000, 180000, 0, 'Beat', '2025-01-15 14:30:00', '2025-01-15 14:30:00'),
(20, 'EUR', 92000, 95000, 0, 'Missed', '2025-01-15 15:00:00', '2025-01-15 15:00:00'),
(21, 'GBP', 68000, 65000, 0, 'Beat', '2025-01-15 15:15:00', '2025-01-15 15:15:00'),
(22, 'JPY', 125000, 120000, 0, 'Beat', '2025-01-15 15:30:00', '2025-01-15 15:30:00'),
(23, 'AUD', 43000, 45000, 0, 'Missed', '2025-01-15 15:45:00', '2025-01-15 15:45:00'),
(24, 'NZD', 16000, 15000, 0, 'Beat', '2025-01-15 16:00:00', '2025-01-15 16:00:00'),
(25, 'CAD', 51000, 52000, 0, 'Missed', '2025-01-15 16:15:00', '2025-01-15 16:15:00'),
(26, 'CHF', 29000, 28000, 0, 'Beat', '2025-01-15 16:30:00', '2025-01-15 16:30:00'),
(27, 'USD', 195000, 190000, 5.41, 'Beat', '2025-02-15 14:30:00', '2025-02-15 14:30:00'),
(28, 'EUR', 98000, 95000, 6.52, 'Beat', '2025-02-15 15:00:00', '2025-02-15 15:00:00'),
(29, 'GBP', 65000, 68000, -4.41, 'Missed', '2025-02-15 15:15:00', '2025-02-15 15:15:00'),
(30, 'JPY', 135000, 130000, 8, 'Beat', '2025-02-15 15:30:00', '2025-02-15 15:30:00'),
(31, 'AUD', 47000, 45000, 9.3, 'Beat', '2025-02-15 15:45:00', '2025-02-15 15:45:00'),
(32, 'NZD', 18000, 17000, 12.5, 'Beat', '2025-02-15 16:00:00', '2025-02-15 16:00:00'),
(33, 'CAD', 48000, 51000, -5.88, 'Missed', '2025-02-15 16:15:00', '2025-02-15 16:15:00'),
(34, 'CHF', 32000, 30000, 10.34, 'Beat', '2025-02-15 16:30:00', '2025-02-15 16:30:00'),
(35, 'USD', 178000, 195000, -8.72, 'Missed', '2025-03-15 14:30:00', '2025-03-15 14:30:00'),
(36, 'EUR', 105000, 100000, 7.14, 'Beat', '2025-03-15 15:00:00', '2025-03-15 15:00:00'),
(37, 'GBP', 72000, 68000, 10.77, 'Beat', '2025-03-15 15:15:00', '2025-03-15 15:15:00'),
(38, 'JPY', 142000, 135000, 5.19, 'Beat', '2025-03-15 15:30:00', '2025-03-15 15:30:00'),
(39, 'AUD', 44000, 47000, -6.38, 'Missed', '2025-03-15 15:45:00', '2025-03-15 15:45:00'),
(40, 'NZD', 19000, 18000, 5.56, 'Beat', '2025-03-15 16:00:00', '2025-03-15 16:00:00'),
(41, 'CAD', 53000, 50000, 10.42, 'Beat', '2025-03-15 16:15:00', '2025-03-15 16:15:00'),
(42, 'CHF', 30000, 32000, -6.25, 'Missed', '2025-03-15 16:30:00', '2025-03-15 16:30:00'),
(43, 'USD', 210000, 185000, 17.98, 'Beat', '2025-04-15 14:30:00', '2025-04-15 14:30:00'),
(44, 'EUR', 102000, 105000, -2.86, 'Missed', '2025-04-15 15:00:00', '2025-04-15 15:00:00'),
(45, 'GBP', 69000, 72000, -4.17, 'Missed', '2025-04-15 15:15:00', '2025-04-15 15:15:00'),
(46, 'JPY', 148000, 145000, 4.23, 'Beat', '2025-04-15 15:30:00', '2025-04-15 15:30:00'),
(47, 'AUD', 49000, 46000, 11.36, 'Beat', '2025-04-15 15:45:00', '2025-04-15 15:45:00'),
(48, 'NZD', 17000, 19000, -10.53, 'Missed', '2025-04-15 16:00:00', '2025-04-15 16:00:00'),
(49, 'CAD', 55000, 53000, 3.77, 'Beat', '2025-04-15 16:15:00', '2025-04-15 16:15:00'),
(50, 'CHF', 34000, 32000, 13.33, 'Beat', '2025-04-15 16:30:00', '2025-04-15 16:30:00'),
(51, 'USD', 202000, 210000, -3.81, 'Missed', '2025-05-15 14:30:00', '2025-05-15 14:30:00'),
(52, 'EUR', 108000, 105000, 5.88, 'Beat', '2025-05-15 15:00:00', '2025-05-15 15:00:00'),
(53, 'GBP', 75000, 70000, 8.7, 'Beat', '2025-05-15 15:15:00', '2025-05-15 15:15:00'),
(54, 'JPY', 152000, 150000, 2.7, 'Beat', '2025-05-15 15:30:00', '2025-05-15 15:30:00'),
(55, 'AUD', 46000, 49000, -6.12, 'Missed', '2025-05-15 15:45:00', '2025-05-15 15:45:00'),
(56, 'NZD', 20000, 18000, 17.65, 'Beat', '2025-05-15 16:00:00', '2025-05-15 16:00:00'),
(57, 'CAD', 52000, 55000, -5.45, 'Missed', '2025-05-15 16:15:00', '2025-05-15 16:15:00'),
(58, 'CHF', 36000, 35000, 5.88, 'Beat', '2025-05-15 16:30:00', '2025-05-15 16:30:00'),
(59, 'USD', 215000, 205000, 6.44, 'Beat', '2025-06-15 14:30:00', '2025-06-15 14:30:00'),
(60, 'EUR', 110000, 108000, 1.85, 'Beat', '2025-06-15 15:00:00', '2025-06-15 15:00:00'),
(61, 'GBP', 73000, 75000, -2.67, 'Missed', '2025-06-15 15:15:00', '2025-06-15 15:15:00'),
(62, 'JPY', 155000, 152000, 1.97, 'Beat', '2025-06-15 15:30:00', '2025-06-15 15:30:00'),
(63, 'AUD', 51000, 48000, 10.87, 'Beat', '2025-06-15 15:45:00', '2025-06-15 15:45:00'),
(64, 'NZD', 18000, 20000, -10, 'Missed', '2025-06-15 16:00:00', '2025-06-15 16:00:00'),
(65, 'CAD', 57000, 54000, 9.62, 'Beat', '2025-06-15 16:15:00', '2025-06-15 16:15:00'),
(66, 'CHF', 37000, 36000, 2.78, 'Beat', '2025-06-15 16:30:00', '2025-06-15 16:30:00'),
(19, 'USD', 185000, 180000, 0, 'Beat', '2025-01-15 14:30:00', '2025-01-15 14:30:00'),
(20, 'EUR', 92000, 95000, 0, 'Missed', '2025-01-15 15:00:00', '2025-01-15 15:00:00'),
(21, 'GBP', 68000, 65000, 0, 'Beat', '2025-01-15 15:15:00', '2025-01-15 15:15:00'),
(22, 'JPY', 125000, 120000, 0, 'Beat', '2025-01-15 15:30:00', '2025-01-15 15:30:00'),
(23, 'AUD', 43000, 45000, 0, 'Missed', '2025-01-15 15:45:00', '2025-01-15 15:45:00'),
(24, 'NZD', 16000, 15000, 0, 'Beat', '2025-01-15 16:00:00', '2025-01-15 16:00:00'),
(25, 'CAD', 51000, 52000, 0, 'Missed', '2025-01-15 16:15:00', '2025-01-15 16:15:00'),
(26, 'CHF', 29000, 28000, 0, 'Beat', '2025-01-15 16:30:00', '2025-01-15 16:30:00'),
(27, 'USD', 195000, 190000, 5.41, 'Beat', '2025-02-15 14:30:00', '2025-02-15 14:30:00'),
(28, 'EUR', 98000, 95000, 6.52, 'Beat', '2025-02-15 15:00:00', '2025-02-15 15:00:00'),
(29, 'GBP', 65000, 68000, -4.41, 'Missed', '2025-02-15 15:15:00', '2025-02-15 15:15:00'),
(30, 'JPY', 135000, 130000, 8, 'Beat', '2025-02-15 15:30:00', '2025-02-15 15:30:00'),
(31, 'AUD', 47000, 45000, 9.3, 'Beat', '2025-02-15 15:45:00', '2025-02-15 15:45:00'),
(32, 'NZD', 18000, 17000, 12.5, 'Beat', '2025-02-15 16:00:00', '2025-02-15 16:00:00'),
(33, 'CAD', 48000, 51000, -5.88, 'Missed', '2025-02-15 16:15:00', '2025-02-15 16:15:00'),
(34, 'CHF', 32000, 30000, 10.34, 'Beat', '2025-02-15 16:30:00', '2025-02-15 16:30:00'),
(35, 'USD', 178000, 195000, -8.72, 'Missed', '2025-03-15 14:30:00', '2025-03-15 14:30:00'),
(36, 'EUR', 105000, 100000, 7.14, 'Beat', '2025-03-15 15:00:00', '2025-03-15 15:00:00'),
(37, 'GBP', 72000, 68000, 10.77, 'Beat', '2025-03-15 15:15:00', '2025-03-15 15:15:00'),
(38, 'JPY', 142000, 135000, 5.19, 'Beat', '2025-03-15 15:30:00', '2025-03-15 15:30:00'),
(39, 'AUD', 44000, 47000, -6.38, 'Missed', '2025-03-15 15:45:00', '2025-03-15 15:45:00'),
(40, 'NZD', 19000, 18000, 5.56, 'Beat', '2025-03-15 16:00:00', '2025-03-15 16:00:00'),
(41, 'CAD', 53000, 50000, 10.42, 'Beat', '2025-03-15 16:15:00', '2025-03-15 16:15:00'),
(42, 'CHF', 30000, 32000, -6.25, 'Missed', '2025-03-15 16:30:00', '2025-03-15 16:30:00'),
(43, 'USD', 210000, 185000, 17.98, 'Beat', '2025-04-15 14:30:00', '2025-04-15 14:30:00'),
(44, 'EUR', 102000, 105000, -2.86, 'Missed', '2025-04-15 15:00:00', '2025-04-15 15:00:00'),
(45, 'GBP', 69000, 72000, -4.17, 'Missed', '2025-04-15 15:15:00', '2025-04-15 15:15:00'),
(46, 'JPY', 148000, 145000, 4.23, 'Beat', '2025-04-15 15:30:00', '2025-04-15 15:30:00'),
(47, 'AUD', 49000, 46000, 11.36, 'Beat', '2025-04-15 15:45:00', '2025-04-15 15:45:00'),
(48, 'NZD', 17000, 19000, -10.53, 'Missed', '2025-04-15 16:00:00', '2025-04-15 16:00:00'),
(49, 'CAD', 55000, 53000, 3.77, 'Beat', '2025-04-15 16:15:00', '2025-04-15 16:15:00'),
(50, 'CHF', 34000, 32000, 13.33, 'Beat', '2025-04-15 16:30:00', '2025-04-15 16:30:00'),
(51, 'USD', 202000, 210000, -3.81, 'Missed', '2025-05-15 14:30:00', '2025-05-15 14:30:00'),
(52, 'EUR', 108000, 105000, 5.88, 'Beat', '2025-05-15 15:00:00', '2025-05-15 15:00:00'),
(53, 'GBP', 75000, 70000, 8.7, 'Beat', '2025-05-15 15:15:00', '2025-05-15 15:15:00'),
(54, 'JPY', 152000, 150000, 2.7, 'Beat', '2025-05-15 15:30:00', '2025-05-15 15:30:00'),
(55, 'AUD', 46000, 49000, -6.12, 'Missed', '2025-05-15 15:45:00', '2025-05-15 15:45:00'),
(56, 'NZD', 20000, 18000, 17.65, 'Beat', '2025-05-15 16:00:00', '2025-05-15 16:00:00'),
(57, 'CAD', 52000, 55000, -5.45, 'Missed', '2025-05-15 16:15:00', '2025-05-15 16:15:00'),
(58, 'CHF', 36000, 35000, 5.88, 'Beat', '2025-05-15 16:30:00', '2025-05-15 16:30:00'),
(59, 'USD', 215000, 205000, 6.44, 'Beat', '2025-06-15 14:30:00', '2025-06-15 14:30:00'),
(60, 'EUR', 110000, 108000, 1.85, 'Beat', '2025-06-15 15:00:00', '2025-06-15 15:00:00'),
(61, 'GBP', 73000, 75000, -2.67, 'Missed', '2025-06-15 15:15:00', '2025-06-15 15:15:00'),
(62, 'JPY', 155000, 152000, 1.97, 'Beat', '2025-06-15 15:30:00', '2025-06-15 15:30:00'),
(63, 'AUD', 51000, 48000, 10.87, 'Beat', '2025-06-15 15:45:00', '2025-06-15 15:45:00'),
(64, 'NZD', 18000, 20000, -10, 'Missed', '2025-06-15 16:00:00', '2025-06-15 16:00:00'),
(65, 'CAD', 57000, 54000, 9.62, 'Beat', '2025-06-15 16:15:00', '2025-06-15 16:15:00'),
(66, 'CHF', 37000, 36000, 2.78, 'Beat', '2025-06-15 16:30:00', '2025-06-15 16:30:00'),
(19, 'USD', 185000, 180000, 0, 'Beat', '2025-01-15 14:30:00', '2025-01-15 14:30:00'),
(20, 'EUR', 92000, 95000, 0, 'Missed', '2025-01-15 15:00:00', '2025-01-15 15:00:00'),
(21, 'GBP', 68000, 65000, 0, 'Beat', '2025-01-15 15:15:00', '2025-01-15 15:15:00'),
(22, 'JPY', 125000, 120000, 0, 'Beat', '2025-01-15 15:30:00', '2025-01-15 15:30:00'),
(23, 'AUD', 43000, 45000, 0, 'Missed', '2025-01-15 15:45:00', '2025-01-15 15:45:00'),
(24, 'NZD', 16000, 15000, 0, 'Beat', '2025-01-15 16:00:00', '2025-01-15 16:00:00'),
(25, 'CAD', 51000, 52000, 0, 'Missed', '2025-01-15 16:15:00', '2025-01-15 16:15:00'),
(26, 'CHF', 29000, 28000, 0, 'Beat', '2025-01-15 16:30:00', '2025-01-15 16:30:00'),
(27, 'USD', 195000, 190000, 5.41, 'Beat', '2025-02-15 14:30:00', '2025-02-15 14:30:00'),
(28, 'EUR', 98000, 95000, 6.52, 'Beat', '2025-02-15 15:00:00', '2025-02-15 15:00:00'),
(29, 'GBP', 65000, 68000, -4.41, 'Missed', '2025-02-15 15:15:00', '2025-02-15 15:15:00'),
(30, 'JPY', 135000, 130000, 8, 'Beat', '2025-02-15 15:30:00', '2025-02-15 15:30:00'),
(31, 'AUD', 47000, 45000, 9.3, 'Beat', '2025-02-15 15:45:00', '2025-02-15 15:45:00'),
(32, 'NZD', 18000, 17000, 12.5, 'Beat', '2025-02-15 16:00:00', '2025-02-15 16:00:00'),
(33, 'CAD', 48000, 51000, -5.88, 'Missed', '2025-02-15 16:15:00', '2025-02-15 16:15:00'),
(34, 'CHF', 32000, 30000, 10.34, 'Beat', '2025-02-15 16:30:00', '2025-02-15 16:30:00'),
(35, 'USD', 178000, 195000, -8.72, 'Missed', '2025-03-15 14:30:00', '2025-03-15 14:30:00'),
(36, 'EUR', 105000, 100000, 7.14, 'Beat', '2025-03-15 15:00:00', '2025-03-15 15:00:00'),
(37, 'GBP', 72000, 68000, 10.77, 'Beat', '2025-03-15 15:15:00', '2025-03-15 15:15:00'),
(38, 'JPY', 142000, 135000, 5.19, 'Beat', '2025-03-15 15:30:00', '2025-03-15 15:30:00'),
(39, 'AUD', 44000, 47000, -6.38, 'Missed', '2025-03-15 15:45:00', '2025-03-15 15:45:00'),
(40, 'NZD', 19000, 18000, 5.56, 'Beat', '2025-03-15 16:00:00', '2025-03-15 16:00:00'),
(41, 'CAD', 53000, 50000, 10.42, 'Beat', '2025-03-15 16:15:00', '2025-03-15 16:15:00'),
(42, 'CHF', 30000, 32000, -6.25, 'Missed', '2025-03-15 16:30:00', '2025-03-15 16:30:00'),
(43, 'USD', 210000, 185000, 17.98, 'Beat', '2025-04-15 14:30:00', '2025-04-15 14:30:00'),
(44, 'EUR', 102000, 105000, -2.86, 'Missed', '2025-04-15 15:00:00', '2025-04-15 15:00:00'),
(45, 'GBP', 69000, 72000, -4.17, 'Missed', '2025-04-15 15:15:00', '2025-04-15 15:15:00'),
(46, 'JPY', 148000, 145000, 4.23, 'Beat', '2025-04-15 15:30:00', '2025-04-15 15:30:00'),
(47, 'AUD', 49000, 46000, 11.36, 'Beat', '2025-04-15 15:45:00', '2025-04-15 15:45:00'),
(48, 'NZD', 17000, 19000, -10.53, 'Missed', '2025-04-15 16:00:00', '2025-04-15 16:00:00'),
(49, 'CAD', 55000, 53000, 3.77, 'Beat', '2025-04-15 16:15:00', '2025-04-15 16:15:00'),
(50, 'CHF', 34000, 32000, 13.33, 'Beat', '2025-04-15 16:30:00', '2025-04-15 16:30:00'),
(51, 'USD', 202000, 210000, -3.81, 'Missed', '2025-05-15 14:30:00', '2025-05-15 14:30:00'),
(52, 'EUR', 108000, 105000, 5.88, 'Beat', '2025-05-15 15:00:00', '2025-05-15 15:00:00'),
(53, 'GBP', 75000, 70000, 8.7, 'Beat', '2025-05-15 15:15:00', '2025-05-15 15:15:00'),
(54, 'JPY', 152000, 150000, 2.7, 'Beat', '2025-05-15 15:30:00', '2025-05-15 15:30:00'),
(55, 'AUD', 46000, 49000, -6.12, 'Missed', '2025-05-15 15:45:00', '2025-05-15 15:45:00'),
(56, 'NZD', 20000, 18000, 17.65, 'Beat', '2025-05-15 16:00:00', '2025-05-15 16:00:00'),
(57, 'CAD', 52000, 55000, -5.45, 'Missed', '2025-05-15 16:15:00', '2025-05-15 16:15:00'),
(58, 'CHF', 36000, 35000, 5.88, 'Beat', '2025-05-15 16:30:00', '2025-05-15 16:30:00'),
(59, 'USD', 215000, 205000, 6.44, 'Beat', '2025-06-15 14:30:00', '2025-06-15 14:30:00'),
(60, 'EUR', 110000, 108000, 1.85, 'Beat', '2025-06-15 15:00:00', '2025-06-15 15:00:00'),
(61, 'GBP', 73000, 75000, -2.67, 'Missed', '2025-06-15 15:15:00', '2025-06-15 15:15:00'),
(62, 'JPY', 155000, 152000, 1.97, 'Beat', '2025-06-15 15:30:00', '2025-06-15 15:30:00'),
(63, 'AUD', 51000, 48000, 10.87, 'Beat', '2025-06-15 15:45:00', '2025-06-15 15:45:00'),
(64, 'NZD', 18000, 20000, -10, 'Missed', '2025-06-15 16:00:00', '2025-06-15 16:00:00'),
(65, 'CAD', 57000, 54000, 9.62, 'Beat', '2025-06-15 16:15:00', '2025-06-15 16:15:00'),
(66, 'CHF', 37000, 36000, 2.78, 'Beat', '2025-06-15 16:30:00', '2025-06-15 16:30:00'),
(19, 'USD', 185000, 180000, 0, 'Beat', '2025-01-15 14:30:00', '2025-01-15 14:30:00'),
(20, 'EUR', 92000, 95000, 0, 'Missed', '2025-01-15 15:00:00', '2025-01-15 15:00:00'),
(21, 'GBP', 68000, 65000, 0, 'Beat', '2025-01-15 15:15:00', '2025-01-15 15:15:00'),
(22, 'JPY', 125000, 120000, 0, 'Beat', '2025-01-15 15:30:00', '2025-01-15 15:30:00'),
(23, 'AUD', 43000, 45000, 0, 'Missed', '2025-01-15 15:45:00', '2025-01-15 15:45:00'),
(24, 'NZD', 16000, 15000, 0, 'Beat', '2025-01-15 16:00:00', '2025-01-15 16:00:00'),
(25, 'CAD', 51000, 52000, 0, 'Missed', '2025-01-15 16:15:00', '2025-01-15 16:15:00'),
(26, 'CHF', 29000, 28000, 0, 'Beat', '2025-01-15 16:30:00', '2025-01-15 16:30:00'),
(27, 'USD', 195000, 190000, 5.41, 'Beat', '2025-02-15 14:30:00', '2025-02-15 14:30:00'),
(28, 'EUR', 98000, 95000, 6.52, 'Beat', '2025-02-15 15:00:00', '2025-02-15 15:00:00'),
(29, 'GBP', 65000, 68000, -4.41, 'Missed', '2025-02-15 15:15:00', '2025-02-15 15:15:00'),
(30, 'JPY', 135000, 130000, 8, 'Beat', '2025-02-15 15:30:00', '2025-02-15 15:30:00'),
(31, 'AUD', 47000, 45000, 9.3, 'Beat', '2025-02-15 15:45:00', '2025-02-15 15:45:00'),
(32, 'NZD', 18000, 17000, 12.5, 'Beat', '2025-02-15 16:00:00', '2025-02-15 16:00:00'),
(33, 'CAD', 48000, 51000, -5.88, 'Missed', '2025-02-15 16:15:00', '2025-02-15 16:15:00'),
(34, 'CHF', 32000, 30000, 10.34, 'Beat', '2025-02-15 16:30:00', '2025-02-15 16:30:00'),
(35, 'USD', 178000, 195000, -8.72, 'Missed', '2025-03-15 14:30:00', '2025-03-15 14:30:00'),
(36, 'EUR', 105000, 100000, 7.14, 'Beat', '2025-03-15 15:00:00', '2025-03-15 15:00:00'),
(37, 'GBP', 72000, 68000, 10.77, 'Beat', '2025-03-15 15:15:00', '2025-03-15 15:15:00'),
(38, 'JPY', 142000, 135000, 5.19, 'Beat', '2025-03-15 15:30:00', '2025-03-15 15:30:00'),
(39, 'AUD', 44000, 47000, -6.38, 'Missed', '2025-03-15 15:45:00', '2025-03-15 15:45:00'),
(40, 'NZD', 19000, 18000, 5.56, 'Beat', '2025-03-15 16:00:00', '2025-03-15 16:00:00'),
(41, 'CAD', 53000, 50000, 10.42, 'Beat', '2025-03-15 16:15:00', '2025-03-15 16:15:00'),
(42, 'CHF', 30000, 32000, -6.25, 'Missed', '2025-03-15 16:30:00', '2025-03-15 16:30:00'),
(43, 'USD', 210000, 185000, 17.98, 'Beat', '2025-04-15 14:30:00', '2025-04-15 14:30:00'),
(44, 'EUR', 102000, 105000, -2.86, 'Missed', '2025-04-15 15:00:00', '2025-04-15 15:00:00'),
(45, 'GBP', 69000, 72000, -4.17, 'Missed', '2025-04-15 15:15:00', '2025-04-15 15:15:00'),
(46, 'JPY', 148000, 145000, 4.23, 'Beat', '2025-04-15 15:30:00', '2025-04-15 15:30:00'),
(47, 'AUD', 49000, 46000, 11.36, 'Beat', '2025-04-15 15:45:00', '2025-04-15 15:45:00'),
(48, 'NZD', 17000, 19000, -10.53, 'Missed', '2025-04-15 16:00:00', '2025-04-15 16:00:00'),
(49, 'CAD', 55000, 53000, 3.77, 'Beat', '2025-04-15 16:15:00', '2025-04-15 16:15:00'),
(50, 'CHF', 34000, 32000, 13.33, 'Beat', '2025-04-15 16:30:00', '2025-04-15 16:30:00'),
(51, 'USD', 202000, 210000, -3.81, 'Missed', '2025-05-15 14:30:00', '2025-05-15 14:30:00'),
(52, 'EUR', 108000, 105000, 5.88, 'Beat', '2025-05-15 15:00:00', '2025-05-15 15:00:00'),
(53, 'GBP', 75000, 70000, 8.7, 'Beat', '2025-05-15 15:15:00', '2025-05-15 15:15:00'),
(54, 'JPY', 152000, 150000, 2.7, 'Beat', '2025-05-15 15:30:00', '2025-05-15 15:30:00'),
(55, 'AUD', 46000, 49000, -6.12, 'Missed', '2025-05-15 15:45:00', '2025-05-15 15:45:00'),
(56, 'NZD', 20000, 18000, 17.65, 'Beat', '2025-05-15 16:00:00', '2025-05-15 16:00:00'),
(57, 'CAD', 52000, 55000, -5.45, 'Missed', '2025-05-15 16:15:00', '2025-05-15 16:15:00'),
(58, 'CHF', 36000, 35000, 5.88, 'Beat', '2025-05-15 16:30:00', '2025-05-15 16:30:00'),
(59, 'USD', 215000, 205000, 6.44, 'Beat', '2025-06-15 14:30:00', '2025-06-15 14:30:00'),
(60, 'EUR', 110000, 108000, 1.85, 'Beat', '2025-06-15 15:00:00', '2025-06-15 15:00:00'),
(61, 'GBP', 73000, 75000, -2.67, 'Missed', '2025-06-15 15:15:00', '2025-06-15 15:15:00'),
(62, 'JPY', 155000, 152000, 1.97, 'Beat', '2025-06-15 15:30:00', '2025-06-15 15:30:00'),
(63, 'AUD', 51000, 48000, 10.87, 'Beat', '2025-06-15 15:45:00', '2025-06-15 15:45:00'),
(64, 'NZD', 18000, 20000, -10, 'Missed', '2025-06-15 16:00:00', '2025-06-15 16:00:00'),
(65, 'CAD', 57000, 54000, 9.62, 'Beat', '2025-06-15 16:15:00', '2025-06-15 16:15:00'),
(66, 'CHF', 37000, 36000, 2.78, 'Beat', '2025-06-15 16:30:00', '2025-06-15 16:30:00');

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
(1, 'USD', 2.1, 2, 0, 'Beat', '2025-06-09 13:49:10', '2025-06-09 13:49:10'),
(2, 'USD', 2.1, 2, 0, 'Beat', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(3, 'EUR', 1.3, 1.5, 0, 'Missed', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(4, 'GBP', 1.8, 1.8, 0, 'As Expected', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(5, 'JPY', 0.9, 1.1, 0, 'Missed', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(6, 'AUD', 2.3, 2.2, 0, 'Beat', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(7, 'CAD', 1.7, 1.6, 0, 'Beat', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(8, 'CHF', 1.2, 1, 0, 'Beat', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(9, 'NZD', 2.5, 2.4, 0, 'Beat', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(10, 'USD', 2.3, 2.2, 0.2, 'Beat', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(11, 'EUR', 1.6, 1.4, 0.3, 'Beat', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(12, 'GBP', 1.5, 1.7, -0.3, 'Missed', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(13, 'JPY', 1.2, 1, 0.3, 'Beat', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(14, 'AUD', 2, 2.1, -0.3, 'Missed', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(15, 'CAD', 1.9, 1.8, 0.2, 'Beat', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(16, 'CHF', 1.4, 1.3, 0.2, 'Beat', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(17, 'NZD', 2.2, 2.3, -0.3, 'Miss', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(18, 'USD', 2, 2, -0.3, 'As Expected', '2025-06-11 12:57:20', '2025-06-11 12:57:20'),
(1, 'USD', 2.1, 2, 0, 'Beat', '2025-06-09 13:49:10', '2025-06-09 13:49:10'),
(2, 'USD', 2.1, 2, 0, 'Beat', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(3, 'EUR', 1.3, 1.5, 0, 'Missed', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(4, 'GBP', 1.8, 1.8, 0, 'As Expected', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(5, 'JPY', 0.9, 1.1, 0, 'Missed', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(6, 'AUD', 2.3, 2.2, 0, 'Beat', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(7, 'CAD', 1.7, 1.6, 0, 'Beat', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(8, 'CHF', 1.2, 1, 0, 'Beat', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(9, 'NZD', 2.5, 2.4, 0, 'Beat', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(10, 'USD', 2.3, 2.2, 0.2, 'Beat', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(11, 'EUR', 1.6, 1.4, 0.3, 'Beat', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(12, 'GBP', 1.5, 1.7, -0.3, 'Missed', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(13, 'JPY', 1.2, 1, 0.3, 'Beat', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(14, 'AUD', 2, 2.1, -0.3, 'Missed', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(15, 'CAD', 1.9, 1.8, 0.2, 'Beat', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(16, 'CHF', 1.4, 1.3, 0.2, 'Beat', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(17, 'NZD', 2.2, 2.3, -0.3, 'Miss', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(18, 'USD', 2, 2, -0.3, 'As Expected', '2025-06-11 12:57:20', '2025-06-11 12:57:20'),
(1, 'USD', 2.1, 2, 0, 'Beat', '2025-06-09 13:49:10', '2025-06-09 13:49:10'),
(2, 'USD', 2.1, 2, 0, 'Beat', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(3, 'EUR', 1.3, 1.5, 0, 'Missed', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(4, 'GBP', 1.8, 1.8, 0, 'As Expected', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(5, 'JPY', 0.9, 1.1, 0, 'Missed', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(6, 'AUD', 2.3, 2.2, 0, 'Beat', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(7, 'CAD', 1.7, 1.6, 0, 'Beat', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(8, 'CHF', 1.2, 1, 0, 'Beat', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(9, 'NZD', 2.5, 2.4, 0, 'Beat', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(10, 'USD', 2.3, 2.2, 0.2, 'Beat', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(11, 'EUR', 1.6, 1.4, 0.3, 'Beat', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(12, 'GBP', 1.5, 1.7, -0.3, 'Missed', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(13, 'JPY', 1.2, 1, 0.3, 'Beat', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(14, 'AUD', 2, 2.1, -0.3, 'Missed', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(15, 'CAD', 1.9, 1.8, 0.2, 'Beat', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(16, 'CHF', 1.4, 1.3, 0.2, 'Beat', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(17, 'NZD', 2.2, 2.3, -0.3, 'Miss', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(18, 'USD', 2, 2, -0.3, 'As Expected', '2025-06-11 12:57:20', '2025-06-11 12:57:20'),
(1, 'USD', 2.1, 2, 0, 'Beat', '2025-06-09 13:49:10', '2025-06-09 13:49:10'),
(2, 'USD', 2.1, 2, 0, 'Beat', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(3, 'EUR', 1.3, 1.5, 0, 'Missed', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(4, 'GBP', 1.8, 1.8, 0, 'As Expected', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(5, 'JPY', 0.9, 1.1, 0, 'Missed', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(6, 'AUD', 2.3, 2.2, 0, 'Beat', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(7, 'CAD', 1.7, 1.6, 0, 'Beat', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(8, 'CHF', 1.2, 1, 0, 'Beat', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(9, 'NZD', 2.5, 2.4, 0, 'Beat', '2025-06-09 16:02:38', '2025-06-09 16:02:38'),
(10, 'USD', 2.3, 2.2, 0.2, 'Beat', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(11, 'EUR', 1.6, 1.4, 0.3, 'Beat', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(12, 'GBP', 1.5, 1.7, -0.3, 'Missed', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(13, 'JPY', 1.2, 1, 0.3, 'Beat', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(14, 'AUD', 2, 2.1, -0.3, 'Missed', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(15, 'CAD', 1.9, 1.8, 0.2, 'Beat', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(16, 'CHF', 1.4, 1.3, 0.2, 'Beat', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(17, 'NZD', 2.2, 2.3, -0.3, 'Miss', '2025-06-09 16:02:49', '2025-06-09 16:02:49'),
(18, 'USD', 2, 2, -0.3, 'As Expected', '2025-06-11 12:57:20', '2025-06-11 12:57:20');

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
(1, 'USD', 2.5, 0, '2025-06-09 15:56:00', '2025-06-09 15:56:00'),
(2, 'USD', 5.25, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(3, 'EUR', 3.75, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(4, 'GBP', 5, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(5, 'JPY', 0.5, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(6, 'AUD', 4.35, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(7, 'CAD', 4.75, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(8, 'CHF', 1.75, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(9, 'NZD', 5.5, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(10, 'USD', 5.5, 0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(11, 'EUR', 4, 0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(12, 'GBP', 5.25, 0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(13, 'JPY', 0.75, 0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(14, 'AUD', 4.1, -0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(15, 'CAD', 4.5, -0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(16, 'CHF', 2, 0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(17, 'NZD', 5.25, -0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(18, 'USD', 1.99, -3.51, '2025-06-11 12:57:20', '2025-06-11 12:57:20'),
(1, 'USD', 2.5, 0, '2025-06-09 15:56:00', '2025-06-09 15:56:00'),
(2, 'USD', 5.25, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(3, 'EUR', 3.75, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(4, 'GBP', 5, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(5, 'JPY', 0.5, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(6, 'AUD', 4.35, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(7, 'CAD', 4.75, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(8, 'CHF', 1.75, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(9, 'NZD', 5.5, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(10, 'USD', 5.5, 0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(11, 'EUR', 4, 0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(12, 'GBP', 5.25, 0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(13, 'JPY', 0.75, 0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(14, 'AUD', 4.1, -0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(15, 'CAD', 4.5, -0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(16, 'CHF', 2, 0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(17, 'NZD', 5.25, -0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(18, 'USD', 1.99, -3.51, '2025-06-11 12:57:20', '2025-06-11 12:57:20'),
(1, 'USD', 2.5, 0, '2025-06-09 15:56:00', '2025-06-09 15:56:00'),
(2, 'USD', 5.25, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(3, 'EUR', 3.75, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(4, 'GBP', 5, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(5, 'JPY', 0.5, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(6, 'AUD', 4.35, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(7, 'CAD', 4.75, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(8, 'CHF', 1.75, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(9, 'NZD', 5.5, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(10, 'USD', 5.5, 0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(11, 'EUR', 4, 0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(12, 'GBP', 5.25, 0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(13, 'JPY', 0.75, 0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(14, 'AUD', 4.1, -0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(15, 'CAD', 4.5, -0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(16, 'CHF', 2, 0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(17, 'NZD', 5.25, -0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(18, 'USD', 1.99, -3.51, '2025-06-11 12:57:20', '2025-06-11 12:57:20'),
(1, 'USD', 2.5, 0, '2025-06-09 15:56:00', '2025-06-09 15:56:00'),
(2, 'USD', 5.25, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(3, 'EUR', 3.75, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(4, 'GBP', 5, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(5, 'JPY', 0.5, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(6, 'AUD', 4.35, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(7, 'CAD', 4.75, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(8, 'CHF', 1.75, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(9, 'NZD', 5.5, 0, '2025-06-09 16:04:32', '2025-06-09 16:04:32'),
(10, 'USD', 5.5, 0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(11, 'EUR', 4, 0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(12, 'GBP', 5.25, 0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(13, 'JPY', 0.75, 0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(14, 'AUD', 4.1, -0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(15, 'CAD', 4.5, -0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(16, 'CHF', 2, 0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(17, 'NZD', 5.25, -0.25, '2025-06-09 16:04:40', '2025-06-09 16:04:40'),
(18, 'USD', 1.99, -3.51, '2025-06-11 12:57:20', '2025-06-11 12:57:20');

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
(1, 'USD', 52.5, 51, 'Beat', '2025-06-09 13:49:35', '2025-06-09 13:49:35'),
(2, 'USD', 52.3, 51.8, 'Beat', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(3, 'EUR', 48.7, 49.2, 'Miss', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(4, 'GBP', 51.1, 51.1, 'Met', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(5, 'JPY', 53.4, 52.9, 'Beat', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(6, 'AUD', 49.8, 50.5, 'Miss', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(7, 'CAD', 50.2, 49.8, 'Beat', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(8, 'CHF', 51.7, 51.3, 'Beat', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(9, 'NZD', 48.9, 49.7, 'Miss', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(10, 'USD', 53.1, 52.5, 'Beat', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(11, 'EUR', 49.9, 49, 'Beat', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(12, 'GBP', 50.8, 51.2, 'Miss', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(13, 'JPY', 54.2, 53.8, 'Beat', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(14, 'AUD', 51.3, 50.8, 'Beat', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(15, 'CAD', 49.7, 50.1, 'Miss', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(16, 'CHF', 52.4, 52, 'Beat', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(17, 'NZD', 50.1, 49.8, 'Beat', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(18, 'USD', 2, 2, 'Met', '2025-06-11 12:57:20', '2025-06-11 12:57:20'),
(1, 'USD', 52.5, 51, 'Beat', '2025-06-09 13:49:35', '2025-06-09 13:49:35'),
(2, 'USD', 52.3, 51.8, 'Beat', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(3, 'EUR', 48.7, 49.2, 'Miss', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(4, 'GBP', 51.1, 51.1, 'Met', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(5, 'JPY', 53.4, 52.9, 'Beat', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(6, 'AUD', 49.8, 50.5, 'Miss', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(7, 'CAD', 50.2, 49.8, 'Beat', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(8, 'CHF', 51.7, 51.3, 'Beat', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(9, 'NZD', 48.9, 49.7, 'Miss', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(10, 'USD', 53.1, 52.5, 'Beat', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(11, 'EUR', 49.9, 49, 'Beat', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(12, 'GBP', 50.8, 51.2, 'Miss', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(13, 'JPY', 54.2, 53.8, 'Beat', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(14, 'AUD', 51.3, 50.8, 'Beat', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(15, 'CAD', 49.7, 50.1, 'Miss', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(16, 'CHF', 52.4, 52, 'Beat', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(17, 'NZD', 50.1, 49.8, 'Beat', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(18, 'USD', 2, 2, 'Met', '2025-06-11 12:57:20', '2025-06-11 12:57:20'),
(1, 'USD', 52.5, 51, 'Beat', '2025-06-09 13:49:35', '2025-06-09 13:49:35'),
(2, 'USD', 52.3, 51.8, 'Beat', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(3, 'EUR', 48.7, 49.2, 'Miss', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(4, 'GBP', 51.1, 51.1, 'Met', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(5, 'JPY', 53.4, 52.9, 'Beat', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(6, 'AUD', 49.8, 50.5, 'Miss', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(7, 'CAD', 50.2, 49.8, 'Beat', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(8, 'CHF', 51.7, 51.3, 'Beat', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(9, 'NZD', 48.9, 49.7, 'Miss', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(10, 'USD', 53.1, 52.5, 'Beat', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(11, 'EUR', 49.9, 49, 'Beat', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(12, 'GBP', 50.8, 51.2, 'Miss', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(13, 'JPY', 54.2, 53.8, 'Beat', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(14, 'AUD', 51.3, 50.8, 'Beat', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(15, 'CAD', 49.7, 50.1, 'Miss', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(16, 'CHF', 52.4, 52, 'Beat', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(17, 'NZD', 50.1, 49.8, 'Beat', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(18, 'USD', 2, 2, 'Met', '2025-06-11 12:57:20', '2025-06-11 12:57:20'),
(1, 'USD', 52.5, 51, 'Beat', '2025-06-09 13:49:35', '2025-06-09 13:49:35'),
(2, 'USD', 52.3, 51.8, 'Beat', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(3, 'EUR', 48.7, 49.2, 'Miss', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(4, 'GBP', 51.1, 51.1, 'Met', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(5, 'JPY', 53.4, 52.9, 'Beat', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(6, 'AUD', 49.8, 50.5, 'Miss', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(7, 'CAD', 50.2, 49.8, 'Beat', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(8, 'CHF', 51.7, 51.3, 'Beat', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(9, 'NZD', 48.9, 49.7, 'Miss', '2025-06-09 16:02:57', '2025-06-09 16:02:57'),
(10, 'USD', 53.1, 52.5, 'Beat', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(11, 'EUR', 49.9, 49, 'Beat', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(12, 'GBP', 50.8, 51.2, 'Miss', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(13, 'JPY', 54.2, 53.8, 'Beat', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(14, 'AUD', 51.3, 50.8, 'Beat', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(15, 'CAD', 49.7, 50.1, 'Miss', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(16, 'CHF', 52.4, 52, 'Beat', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(17, 'NZD', 50.1, 49.8, 'Beat', '2025-06-09 16:03:05', '2025-06-09 16:03:05'),
(18, 'USD', 2, 2, 'Met', '2025-06-11 12:57:20', '2025-06-11 12:57:20');

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
(1, 'USD', 185000, 180000, 0, '2025-06-09 16:25:44', '2025-06-09 16:25:44'),
(2, 'USD', 2, 1.99, -100, '2025-06-11 12:57:20', '2025-06-11 12:57:20'),
(1, 'USD', 185000, 180000, 0, '2025-06-09 16:25:44', '2025-06-09 16:25:44'),
(2, 'USD', 2, 1.99, -100, '2025-06-11 12:57:20', '2025-06-11 12:57:20'),
(1, 'USD', 185000, 180000, 0, '2025-06-09 16:25:44', '2025-06-09 16:25:44'),
(2, 'USD', 2, 1.99, -100, '2025-06-11 12:57:20', '2025-06-11 12:57:20'),
(1, 'USD', 185000, 180000, 0, '2025-06-09 16:25:44', '2025-06-09 16:25:44'),
(2, 'USD', 2, 1.99, -100, '2025-06-11 12:57:20', '2025-06-11 12:57:20');

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
(1, 1, '1', 'test', 'test', 'crajeextremeyt@gmail.com', 'student', 'Valenzuela', 'Valenzuela', '2025-06-17', '09427184388', 'beginner', NULL, 'male', '/uploads/avatars/1749025966246-343866882.png', NULL, NULL, 1, '2025-06-04 08:31:08', '2025-06-11 17:57:37', 0, NULL, '2025-06-04 08:31:08', '2025-06-11 09:57:37'),
(2, 8, NULL, 'Jane Elizabeth Smith', 'janesmith85', 'jane.smith@example.com', '', '', 'San Francisco, CA', '1985-05-18', '', NULL, NULL, 'female', '/uploads/avatars/1749703097767-696713373.png', NULL, NULL, 1, '2025-06-12 12:37:32', NULL, 0, NULL, '2025-06-12 04:37:32', '2025-06-12 04:38:20'),
(3, 9, NULL, 'Jane Elizabeth Smith', 'janesmith20', 'janes.smith@example.com', '', '', 'San Francisco, CA', '1985-05-19', '', NULL, NULL, 'female', NULL, NULL, NULL, 1, '2025-06-12 12:41:50', NULL, 0, NULL, '2025-06-12 04:41:50', '2025-06-12 04:41:50'),
(7, 13, 'S1749790242780_13', 'John Michael Doe', 'johndoe123', 'johndoe@gmail.com', 'student', '123 Main Street, New York, NY', 'Marilao Bulacan', '1990-05-14', '09234567890', 'beginner', '', 'male', '', '', '{\"device_type\":\"Desktop,Mobile\",\"learning_style\":\"\"}', 1, '2025-06-13 06:24:33', '2025-06-13 06:24:33', 1, NULL, '2025-06-12 22:24:33', '2025-06-12 22:24:33');

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
(1, 'USD', 5.2, 5.2, 0, 'Met', '2025-06-09 13:50:09', '2025-06-09 13:50:09'),
(2, 'USD', 0.8, 0.6, 0, 'Beat', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(3, 'EUR', 0.3, 0.5, 0, 'Miss', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(4, 'GBP', 0.7, 0.7, 0, 'Met', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(5, 'JPY', 1.2, 1, 0, 'Beat', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(6, 'AUD', 0.5, 0.8, 0, 'Miss', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(7, 'CAD', 0.9, 0.7, 0, 'Beat', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(8, 'CHF', 0.4, 0.3, 0, 'Beat', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(9, 'NZD', 1.1, 1.3, 0, 'Miss', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(10, 'USD', 1.1, 0.9, 37.5, 'Beat', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(11, 'EUR', 0.6, 0.4, 100, 'Beat', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(12, 'GBP', 0.9, 0.8, 28.57, 'Beat', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(13, 'JPY', 1.5, 1.3, 25, 'Beat', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(14, 'AUD', 0.3, 0.6, -40, 'Miss', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(15, 'CAD', 1.2, 1, 33.33, 'Beat', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(16, 'CHF', 0.7, 0.5, 75, 'Beat', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(17, 'NZD', 0.8, 1, -27.27, 'Miss', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(18, 'USD', 2, 2, 81.82, 'Met', '2025-06-11 12:57:20', '2025-06-11 12:57:20'),
(1, 'USD', 5.2, 5.2, 0, 'Met', '2025-06-09 13:50:09', '2025-06-09 13:50:09'),
(2, 'USD', 0.8, 0.6, 0, 'Beat', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(3, 'EUR', 0.3, 0.5, 0, 'Miss', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(4, 'GBP', 0.7, 0.7, 0, 'Met', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(5, 'JPY', 1.2, 1, 0, 'Beat', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(6, 'AUD', 0.5, 0.8, 0, 'Miss', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(7, 'CAD', 0.9, 0.7, 0, 'Beat', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(8, 'CHF', 0.4, 0.3, 0, 'Beat', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(9, 'NZD', 1.1, 1.3, 0, 'Miss', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(10, 'USD', 1.1, 0.9, 37.5, 'Beat', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(11, 'EUR', 0.6, 0.4, 100, 'Beat', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(12, 'GBP', 0.9, 0.8, 28.57, 'Beat', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(13, 'JPY', 1.5, 1.3, 25, 'Beat', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(14, 'AUD', 0.3, 0.6, -40, 'Miss', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(15, 'CAD', 1.2, 1, 33.33, 'Beat', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(16, 'CHF', 0.7, 0.5, 75, 'Beat', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(17, 'NZD', 0.8, 1, -27.27, 'Miss', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(18, 'USD', 2, 2, 81.82, 'Met', '2025-06-11 12:57:20', '2025-06-11 12:57:20'),
(1, 'USD', 5.2, 5.2, 0, 'Met', '2025-06-09 13:50:09', '2025-06-09 13:50:09'),
(2, 'USD', 0.8, 0.6, 0, 'Beat', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(3, 'EUR', 0.3, 0.5, 0, 'Miss', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(4, 'GBP', 0.7, 0.7, 0, 'Met', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(5, 'JPY', 1.2, 1, 0, 'Beat', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(6, 'AUD', 0.5, 0.8, 0, 'Miss', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(7, 'CAD', 0.9, 0.7, 0, 'Beat', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(8, 'CHF', 0.4, 0.3, 0, 'Beat', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(9, 'NZD', 1.1, 1.3, 0, 'Miss', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(10, 'USD', 1.1, 0.9, 37.5, 'Beat', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(11, 'EUR', 0.6, 0.4, 100, 'Beat', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(12, 'GBP', 0.9, 0.8, 28.57, 'Beat', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(13, 'JPY', 1.5, 1.3, 25, 'Beat', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(14, 'AUD', 0.3, 0.6, -40, 'Miss', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(15, 'CAD', 1.2, 1, 33.33, 'Beat', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(16, 'CHF', 0.7, 0.5, 75, 'Beat', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(17, 'NZD', 0.8, 1, -27.27, 'Miss', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(18, 'USD', 2, 2, 81.82, 'Met', '2025-06-11 12:57:20', '2025-06-11 12:57:20'),
(1, 'USD', 5.2, 5.2, 0, 'Met', '2025-06-09 13:50:09', '2025-06-09 13:50:09'),
(2, 'USD', 0.8, 0.6, 0, 'Beat', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(3, 'EUR', 0.3, 0.5, 0, 'Miss', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(4, 'GBP', 0.7, 0.7, 0, 'Met', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(5, 'JPY', 1.2, 1, 0, 'Beat', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(6, 'AUD', 0.5, 0.8, 0, 'Miss', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(7, 'CAD', 0.9, 0.7, 0, 'Beat', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(8, 'CHF', 0.4, 0.3, 0, 'Beat', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(9, 'NZD', 1.1, 1.3, 0, 'Miss', '2025-06-09 16:03:31', '2025-06-09 16:03:31'),
(10, 'USD', 1.1, 0.9, 37.5, 'Beat', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(11, 'EUR', 0.6, 0.4, 100, 'Beat', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(12, 'GBP', 0.9, 0.8, 28.57, 'Beat', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(13, 'JPY', 1.5, 1.3, 25, 'Beat', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(14, 'AUD', 0.3, 0.6, -40, 'Miss', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(15, 'CAD', 1.2, 1, 33.33, 'Beat', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(16, 'CHF', 0.7, 0.5, 75, 'Beat', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(17, 'NZD', 0.8, 1, -27.27, 'Miss', '2025-06-09 16:03:43', '2025-06-09 16:03:43'),
(18, 'USD', 2, 2, 81.82, 'Met', '2025-06-11 12:57:20', '2025-06-11 12:57:20');

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
(1, 'EURUSD', 65.5, 34.5, '2025-06-09 16:42:13', '2025-06-09 16:42:13'),
(2, 'EURUSD', 15, 85, '2025-06-09 16:44:17', '2025-06-09 16:44:17'),
(3, 'AUDCAD', 2, 98, '2025-06-11 12:57:20', '2025-06-11 12:57:20'),
(1, 'EURUSD', 65.5, 34.5, '2025-06-09 16:42:13', '2025-06-09 16:42:13'),
(2, 'EURUSD', 15, 85, '2025-06-09 16:44:17', '2025-06-09 16:44:17'),
(3, 'AUDCAD', 2, 98, '2025-06-11 12:57:20', '2025-06-11 12:57:20'),
(1, 'EURUSD', 65.5, 34.5, '2025-06-09 16:42:13', '2025-06-09 16:42:13'),
(2, 'EURUSD', 15, 85, '2025-06-09 16:44:17', '2025-06-09 16:44:17'),
(3, 'AUDCAD', 2, 98, '2025-06-11 12:57:20', '2025-06-11 12:57:20'),
(1, 'EURUSD', 65.5, 34.5, '2025-06-09 16:42:13', '2025-06-09 16:42:13'),
(2, 'EURUSD', 15, 85, '2025-06-09 16:44:17', '2025-06-09 16:44:17'),
(3, 'AUDCAD', 2, 98, '2025-06-11 12:57:20', '2025-06-11 12:57:20');

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
(1, 'USD', 48, 50, 'Miss', '2025-06-09 13:49:53', '2025-06-09 13:49:53'),
(2, 'USD', 54.8, 54.2, 'Beat', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(3, 'EUR', 51.3, 52.1, 'Miss', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(4, 'GBP', 53.7, 53.7, 'Met', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(5, 'JPY', 55.1, 54.6, 'Beat', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(6, 'AUD', 52.4, 53, 'Miss', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(7, 'CAD', 53.9, 53.2, 'Beat', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(8, 'CHF', 54.3, 53.8, 'Beat', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(9, 'NZD', 51.8, 52.5, 'Miss', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(10, 'USD', 55.7, 55, 'Beat', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(11, 'EUR', 52.8, 51.8, 'Beat', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(12, 'GBP', 54.2, 54.5, 'Miss', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(13, 'JPY', 56.3, 55.8, 'Beat', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(14, 'AUD', 53.7, 52.9, 'Beat', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(15, 'CAD', 54.6, 54.1, 'Beat', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(16, 'CHF', 55.1, 54.7, 'Beat', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(17, 'NZD', 52.9, 52.3, 'Beat', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(18, 'USD', 2, 2, 'Met', '2025-06-11 12:57:20', '2025-06-11 12:57:20'),
(1, 'USD', 48, 50, 'Miss', '2025-06-09 13:49:53', '2025-06-09 13:49:53'),
(2, 'USD', 54.8, 54.2, 'Beat', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(3, 'EUR', 51.3, 52.1, 'Miss', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(4, 'GBP', 53.7, 53.7, 'Met', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(5, 'JPY', 55.1, 54.6, 'Beat', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(6, 'AUD', 52.4, 53, 'Miss', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(7, 'CAD', 53.9, 53.2, 'Beat', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(8, 'CHF', 54.3, 53.8, 'Beat', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(9, 'NZD', 51.8, 52.5, 'Miss', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(10, 'USD', 55.7, 55, 'Beat', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(11, 'EUR', 52.8, 51.8, 'Beat', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(12, 'GBP', 54.2, 54.5, 'Miss', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(13, 'JPY', 56.3, 55.8, 'Beat', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(14, 'AUD', 53.7, 52.9, 'Beat', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(15, 'CAD', 54.6, 54.1, 'Beat', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(16, 'CHF', 55.1, 54.7, 'Beat', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(17, 'NZD', 52.9, 52.3, 'Beat', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(18, 'USD', 2, 2, 'Met', '2025-06-11 12:57:20', '2025-06-11 12:57:20'),
(1, 'USD', 48, 50, 'Miss', '2025-06-09 13:49:53', '2025-06-09 13:49:53'),
(2, 'USD', 54.8, 54.2, 'Beat', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(3, 'EUR', 51.3, 52.1, 'Miss', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(4, 'GBP', 53.7, 53.7, 'Met', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(5, 'JPY', 55.1, 54.6, 'Beat', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(6, 'AUD', 52.4, 53, 'Miss', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(7, 'CAD', 53.9, 53.2, 'Beat', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(8, 'CHF', 54.3, 53.8, 'Beat', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(9, 'NZD', 51.8, 52.5, 'Miss', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(10, 'USD', 55.7, 55, 'Beat', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(11, 'EUR', 52.8, 51.8, 'Beat', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(12, 'GBP', 54.2, 54.5, 'Miss', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(13, 'JPY', 56.3, 55.8, 'Beat', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(14, 'AUD', 53.7, 52.9, 'Beat', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(15, 'CAD', 54.6, 54.1, 'Beat', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(16, 'CHF', 55.1, 54.7, 'Beat', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(17, 'NZD', 52.9, 52.3, 'Beat', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(18, 'USD', 2, 2, 'Met', '2025-06-11 12:57:20', '2025-06-11 12:57:20'),
(1, 'USD', 48, 50, 'Miss', '2025-06-09 13:49:53', '2025-06-09 13:49:53'),
(2, 'USD', 54.8, 54.2, 'Beat', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(3, 'EUR', 51.3, 52.1, 'Miss', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(4, 'GBP', 53.7, 53.7, 'Met', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(5, 'JPY', 55.1, 54.6, 'Beat', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(6, 'AUD', 52.4, 53, 'Miss', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(7, 'CAD', 53.9, 53.2, 'Beat', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(8, 'CHF', 54.3, 53.8, 'Beat', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(9, 'NZD', 51.8, 52.5, 'Miss', '2025-06-09 16:03:13', '2025-06-09 16:03:13'),
(10, 'USD', 55.7, 55, 'Beat', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(11, 'EUR', 52.8, 51.8, 'Beat', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(12, 'GBP', 54.2, 54.5, 'Miss', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(13, 'JPY', 56.3, 55.8, 'Beat', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(14, 'AUD', 53.7, 52.9, 'Beat', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(15, 'CAD', 54.6, 54.1, 'Beat', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(16, 'CHF', 55.1, 54.7, 'Beat', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(17, 'NZD', 52.9, 52.3, 'Beat', '2025-06-09 16:03:21', '2025-06-09 16:03:21'),
(18, 'USD', 2, 2, 'Met', '2025-06-11 12:57:20', '2025-06-11 12:57:20');

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
(19, 'USD', 3.8, 3.9, 0, 'Beat', '2025-01-15 10:30:00', '2025-01-15 10:30:00'),
(20, 'EUR', 6.4, 6.2, 0, 'Missed', '2025-01-15 11:00:00', '2025-01-15 11:00:00'),
(21, 'GBP', 4.2, 4.1, 0, 'Missed', '2025-01-15 11:15:00', '2025-01-15 11:15:00'),
(22, 'JPY', 2.9, 3, 0, 'Beat', '2025-01-15 11:30:00', '2025-01-15 11:30:00'),
(23, 'AUD', 5.1, 5.3, 0, 'Beat', '2025-01-15 11:45:00', '2025-01-15 11:45:00'),
(24, 'NZD', 4.6, 4.8, 0, 'Beat', '2025-01-15 12:00:00', '2025-01-15 12:00:00'),
(25, 'CAD', 5.9, 5.8, 0, 'Missed', '2025-01-15 12:15:00', '2025-01-15 12:15:00'),
(26, 'CHF', 3.1, 3.1, 0, 'As Expected', '2025-01-15 12:30:00', '2025-01-15 12:30:00'),
(27, 'USD', 3.6, 3.7, -5.26, 'Beat', '2025-02-15 10:30:00', '2025-02-15 10:30:00'),
(28, 'EUR', 6.6, 6.4, 3.13, 'Missed', '2025-02-15 11:00:00', '2025-02-15 11:00:00'),
(29, 'GBP', 4, 4.2, -4.76, 'Beat', '2025-02-15 11:15:00', '2025-02-15 11:15:00'),
(30, 'JPY', 2.7, 2.9, -6.9, 'Beat', '2025-02-15 11:30:00', '2025-02-15 11:30:00'),
(31, 'AUD', 5.3, 5.1, 3.92, 'Missed', '2025-02-15 11:45:00', '2025-02-15 11:45:00'),
(32, 'NZD', 4.4, 4.6, -4.35, 'Beat', '2025-02-15 12:00:00', '2025-02-15 12:00:00'),
(33, 'CAD', 5.7, 5.9, -3.39, 'Beat', '2025-02-15 12:15:00', '2025-02-15 12:15:00'),
(34, 'CHF', 3, 3.1, -3.23, 'Beat', '2025-02-15 12:30:00', '2025-02-15 12:30:00'),
(35, 'USD', 3.7, 3.6, 2.78, 'Missed', '2025-03-15 10:30:00', '2025-03-15 10:30:00'),
(36, 'EUR', 6.3, 6.6, -4.55, 'Beat', '2025-03-15 11:00:00', '2025-03-15 11:00:00'),
(37, 'GBP', 4.1, 4, 2.5, 'Missed', '2025-03-15 11:15:00', '2025-03-15 11:15:00'),
(38, 'JPY', 2.8, 2.7, 3.7, 'Missed', '2025-03-15 11:30:00', '2025-03-15 11:30:00'),
(39, 'AUD', 5, 5.3, -5.66, 'Beat', '2025-03-15 11:45:00', '2025-03-15 11:45:00'),
(40, 'NZD', 4.5, 4.4, 2.27, 'Missed', '2025-03-15 12:00:00', '2025-03-15 12:00:00'),
(41, 'CAD', 5.8, 5.7, 1.75, 'Missed', '2025-03-15 12:15:00', '2025-03-15 12:15:00'),
(42, 'CHF', 2.9, 2.9, -3.33, 'As Expected', '2025-03-15 12:30:00', '2025-03-15 12:30:00'),
(43, 'USD', 3.5, 3.7, -5.41, 'Beat', '2025-04-15 10:30:00', '2025-04-15 10:30:00'),
(44, 'EUR', 6.1, 6.3, -3.17, 'Beat', '2025-04-15 11:00:00', '2025-04-15 11:00:00'),
(45, 'GBP', 3.9, 4.1, -4.88, 'Beat', '2025-04-15 11:15:00', '2025-04-15 11:15:00'),
(46, 'JPY', 2.6, 2.8, -7.14, 'Beat', '2025-04-15 11:30:00', '2025-04-15 11:30:00'),
(47, 'AUD', 4.9, 5, -2, 'Beat', '2025-04-15 11:45:00', '2025-04-15 11:45:00'),
(48, 'NZD', 4.3, 4.5, -4.44, 'Beat', '2025-04-15 12:00:00', '2025-04-15 12:00:00'),
(49, 'CAD', 5.6, 5.8, -3.45, 'Beat', '2025-04-15 12:15:00', '2025-04-15 12:15:00'),
(50, 'CHF', 2.8, 2.9, -3.45, 'Beat', '2025-04-15 12:30:00', '2025-04-15 12:30:00'),
(51, 'USD', 3.4, 3.5, -2.86, 'Beat', '2025-05-15 10:30:00', '2025-05-15 10:30:00'),
(52, 'EUR', 6, 6.1, -1.64, 'Beat', '2025-05-15 11:00:00', '2025-05-15 11:00:00'),
(53, 'GBP', 3.8, 3.9, -2.56, 'Beat', '2025-05-15 11:15:00', '2025-05-15 11:15:00'),
(54, 'JPY', 2.5, 2.6, -3.85, 'Beat', '2025-05-15 11:30:00', '2025-05-15 11:30:00'),
(55, 'AUD', 4.8, 4.9, -2.04, 'Beat', '2025-05-15 11:45:00', '2025-05-15 11:45:00'),
(56, 'NZD', 4.2, 4.3, -2.33, 'Beat', '2025-05-15 12:00:00', '2025-05-15 12:00:00'),
(57, 'CAD', 5.5, 5.6, -1.79, 'Beat', '2025-05-15 12:15:00', '2025-05-15 12:15:00'),
(58, 'CHF', 2.7, 2.8, -3.57, 'Beat', '2025-05-15 12:30:00', '2025-05-15 12:30:00'),
(19, 'USD', 3.8, 3.9, 0, 'Beat', '2025-01-15 10:30:00', '2025-01-15 10:30:00'),
(20, 'EUR', 6.4, 6.2, 0, 'Missed', '2025-01-15 11:00:00', '2025-01-15 11:00:00'),
(21, 'GBP', 4.2, 4.1, 0, 'Missed', '2025-01-15 11:15:00', '2025-01-15 11:15:00'),
(22, 'JPY', 2.9, 3, 0, 'Beat', '2025-01-15 11:30:00', '2025-01-15 11:30:00'),
(23, 'AUD', 5.1, 5.3, 0, 'Beat', '2025-01-15 11:45:00', '2025-01-15 11:45:00'),
(24, 'NZD', 4.6, 4.8, 0, 'Beat', '2025-01-15 12:00:00', '2025-01-15 12:00:00'),
(25, 'CAD', 5.9, 5.8, 0, 'Missed', '2025-01-15 12:15:00', '2025-01-15 12:15:00'),
(26, 'CHF', 3.1, 3.1, 0, 'As Expected', '2025-01-15 12:30:00', '2025-01-15 12:30:00'),
(27, 'USD', 3.6, 3.7, -5.26, 'Beat', '2025-02-15 10:30:00', '2025-02-15 10:30:00'),
(28, 'EUR', 6.6, 6.4, 3.13, 'Missed', '2025-02-15 11:00:00', '2025-02-15 11:00:00'),
(29, 'GBP', 4, 4.2, -4.76, 'Beat', '2025-02-15 11:15:00', '2025-02-15 11:15:00'),
(30, 'JPY', 2.7, 2.9, -6.9, 'Beat', '2025-02-15 11:30:00', '2025-02-15 11:30:00'),
(31, 'AUD', 5.3, 5.1, 3.92, 'Missed', '2025-02-15 11:45:00', '2025-02-15 11:45:00'),
(32, 'NZD', 4.4, 4.6, -4.35, 'Beat', '2025-02-15 12:00:00', '2025-02-15 12:00:00'),
(33, 'CAD', 5.7, 5.9, -3.39, 'Beat', '2025-02-15 12:15:00', '2025-02-15 12:15:00'),
(34, 'CHF', 3, 3.1, -3.23, 'Beat', '2025-02-15 12:30:00', '2025-02-15 12:30:00'),
(35, 'USD', 3.7, 3.6, 2.78, 'Missed', '2025-03-15 10:30:00', '2025-03-15 10:30:00'),
(36, 'EUR', 6.3, 6.6, -4.55, 'Beat', '2025-03-15 11:00:00', '2025-03-15 11:00:00'),
(37, 'GBP', 4.1, 4, 2.5, 'Missed', '2025-03-15 11:15:00', '2025-03-15 11:15:00'),
(38, 'JPY', 2.8, 2.7, 3.7, 'Missed', '2025-03-15 11:30:00', '2025-03-15 11:30:00'),
(39, 'AUD', 5, 5.3, -5.66, 'Beat', '2025-03-15 11:45:00', '2025-03-15 11:45:00'),
(40, 'NZD', 4.5, 4.4, 2.27, 'Missed', '2025-03-15 12:00:00', '2025-03-15 12:00:00'),
(41, 'CAD', 5.8, 5.7, 1.75, 'Missed', '2025-03-15 12:15:00', '2025-03-15 12:15:00'),
(42, 'CHF', 2.9, 2.9, -3.33, 'As Expected', '2025-03-15 12:30:00', '2025-03-15 12:30:00'),
(43, 'USD', 3.5, 3.7, -5.41, 'Beat', '2025-04-15 10:30:00', '2025-04-15 10:30:00'),
(44, 'EUR', 6.1, 6.3, -3.17, 'Beat', '2025-04-15 11:00:00', '2025-04-15 11:00:00'),
(45, 'GBP', 3.9, 4.1, -4.88, 'Beat', '2025-04-15 11:15:00', '2025-04-15 11:15:00'),
(46, 'JPY', 2.6, 2.8, -7.14, 'Beat', '2025-04-15 11:30:00', '2025-04-15 11:30:00'),
(47, 'AUD', 4.9, 5, -2, 'Beat', '2025-04-15 11:45:00', '2025-04-15 11:45:00'),
(48, 'NZD', 4.3, 4.5, -4.44, 'Beat', '2025-04-15 12:00:00', '2025-04-15 12:00:00'),
(49, 'CAD', 5.6, 5.8, -3.45, 'Beat', '2025-04-15 12:15:00', '2025-04-15 12:15:00'),
(50, 'CHF', 2.8, 2.9, -3.45, 'Beat', '2025-04-15 12:30:00', '2025-04-15 12:30:00'),
(51, 'USD', 3.4, 3.5, -2.86, 'Beat', '2025-05-15 10:30:00', '2025-05-15 10:30:00'),
(52, 'EUR', 6, 6.1, -1.64, 'Beat', '2025-05-15 11:00:00', '2025-05-15 11:00:00'),
(53, 'GBP', 3.8, 3.9, -2.56, 'Beat', '2025-05-15 11:15:00', '2025-05-15 11:15:00'),
(54, 'JPY', 2.5, 2.6, -3.85, 'Beat', '2025-05-15 11:30:00', '2025-05-15 11:30:00'),
(55, 'AUD', 4.8, 4.9, -2.04, 'Beat', '2025-05-15 11:45:00', '2025-05-15 11:45:00'),
(56, 'NZD', 4.2, 4.3, -2.33, 'Beat', '2025-05-15 12:00:00', '2025-05-15 12:00:00'),
(57, 'CAD', 5.5, 5.6, -1.79, 'Beat', '2025-05-15 12:15:00', '2025-05-15 12:15:00'),
(58, 'CHF', 2.7, 2.8, -3.57, 'Beat', '2025-05-15 12:30:00', '2025-05-15 12:30:00'),
(19, 'USD', 3.8, 3.9, 0, 'Beat', '2025-01-15 10:30:00', '2025-01-15 10:30:00'),
(20, 'EUR', 6.4, 6.2, 0, 'Missed', '2025-01-15 11:00:00', '2025-01-15 11:00:00'),
(21, 'GBP', 4.2, 4.1, 0, 'Missed', '2025-01-15 11:15:00', '2025-01-15 11:15:00'),
(22, 'JPY', 2.9, 3, 0, 'Beat', '2025-01-15 11:30:00', '2025-01-15 11:30:00'),
(23, 'AUD', 5.1, 5.3, 0, 'Beat', '2025-01-15 11:45:00', '2025-01-15 11:45:00'),
(24, 'NZD', 4.6, 4.8, 0, 'Beat', '2025-01-15 12:00:00', '2025-01-15 12:00:00'),
(25, 'CAD', 5.9, 5.8, 0, 'Missed', '2025-01-15 12:15:00', '2025-01-15 12:15:00'),
(26, 'CHF', 3.1, 3.1, 0, 'As Expected', '2025-01-15 12:30:00', '2025-01-15 12:30:00'),
(27, 'USD', 3.6, 3.7, -5.26, 'Beat', '2025-02-15 10:30:00', '2025-02-15 10:30:00'),
(28, 'EUR', 6.6, 6.4, 3.13, 'Missed', '2025-02-15 11:00:00', '2025-02-15 11:00:00'),
(29, 'GBP', 4, 4.2, -4.76, 'Beat', '2025-02-15 11:15:00', '2025-02-15 11:15:00'),
(30, 'JPY', 2.7, 2.9, -6.9, 'Beat', '2025-02-15 11:30:00', '2025-02-15 11:30:00'),
(31, 'AUD', 5.3, 5.1, 3.92, 'Missed', '2025-02-15 11:45:00', '2025-02-15 11:45:00'),
(32, 'NZD', 4.4, 4.6, -4.35, 'Beat', '2025-02-15 12:00:00', '2025-02-15 12:00:00'),
(33, 'CAD', 5.7, 5.9, -3.39, 'Beat', '2025-02-15 12:15:00', '2025-02-15 12:15:00'),
(34, 'CHF', 3, 3.1, -3.23, 'Beat', '2025-02-15 12:30:00', '2025-02-15 12:30:00'),
(35, 'USD', 3.7, 3.6, 2.78, 'Missed', '2025-03-15 10:30:00', '2025-03-15 10:30:00'),
(36, 'EUR', 6.3, 6.6, -4.55, 'Beat', '2025-03-15 11:00:00', '2025-03-15 11:00:00'),
(37, 'GBP', 4.1, 4, 2.5, 'Missed', '2025-03-15 11:15:00', '2025-03-15 11:15:00'),
(38, 'JPY', 2.8, 2.7, 3.7, 'Missed', '2025-03-15 11:30:00', '2025-03-15 11:30:00'),
(39, 'AUD', 5, 5.3, -5.66, 'Beat', '2025-03-15 11:45:00', '2025-03-15 11:45:00'),
(40, 'NZD', 4.5, 4.4, 2.27, 'Missed', '2025-03-15 12:00:00', '2025-03-15 12:00:00'),
(41, 'CAD', 5.8, 5.7, 1.75, 'Missed', '2025-03-15 12:15:00', '2025-03-15 12:15:00'),
(42, 'CHF', 2.9, 2.9, -3.33, 'As Expected', '2025-03-15 12:30:00', '2025-03-15 12:30:00'),
(43, 'USD', 3.5, 3.7, -5.41, 'Beat', '2025-04-15 10:30:00', '2025-04-15 10:30:00'),
(44, 'EUR', 6.1, 6.3, -3.17, 'Beat', '2025-04-15 11:00:00', '2025-04-15 11:00:00'),
(45, 'GBP', 3.9, 4.1, -4.88, 'Beat', '2025-04-15 11:15:00', '2025-04-15 11:15:00'),
(46, 'JPY', 2.6, 2.8, -7.14, 'Beat', '2025-04-15 11:30:00', '2025-04-15 11:30:00'),
(47, 'AUD', 4.9, 5, -2, 'Beat', '2025-04-15 11:45:00', '2025-04-15 11:45:00'),
(48, 'NZD', 4.3, 4.5, -4.44, 'Beat', '2025-04-15 12:00:00', '2025-04-15 12:00:00'),
(49, 'CAD', 5.6, 5.8, -3.45, 'Beat', '2025-04-15 12:15:00', '2025-04-15 12:15:00'),
(50, 'CHF', 2.8, 2.9, -3.45, 'Beat', '2025-04-15 12:30:00', '2025-04-15 12:30:00'),
(51, 'USD', 3.4, 3.5, -2.86, 'Beat', '2025-05-15 10:30:00', '2025-05-15 10:30:00'),
(52, 'EUR', 6, 6.1, -1.64, 'Beat', '2025-05-15 11:00:00', '2025-05-15 11:00:00'),
(53, 'GBP', 3.8, 3.9, -2.56, 'Beat', '2025-05-15 11:15:00', '2025-05-15 11:15:00'),
(54, 'JPY', 2.5, 2.6, -3.85, 'Beat', '2025-05-15 11:30:00', '2025-05-15 11:30:00'),
(55, 'AUD', 4.8, 4.9, -2.04, 'Beat', '2025-05-15 11:45:00', '2025-05-15 11:45:00'),
(56, 'NZD', 4.2, 4.3, -2.33, 'Beat', '2025-05-15 12:00:00', '2025-05-15 12:00:00'),
(57, 'CAD', 5.5, 5.6, -1.79, 'Beat', '2025-05-15 12:15:00', '2025-05-15 12:15:00'),
(58, 'CHF', 2.7, 2.8, -3.57, 'Beat', '2025-05-15 12:30:00', '2025-05-15 12:30:00');

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
(1, 1, '1', 'test', 'test', 'crajeextremeyt@gmail.com', NULL, 'student', 'Valenzuela', 'Valenzuela', '2025-06-18', '09427184388', 'beginner', 'male', NULL, 1, '2025-06-04 16:31:22', NULL, '2025-06-04 08:31:22', '2025-06-04 08:31:22'),
(7, 8, NULL, 'Jane Elizabeth Smith', 'janesmith85', 'jane.smith@example.com', '$2b$10$OzSQH5gU30AIxgq2mnCOI.3xmxrHxJCuUk/HT6w2B6b.RtfkGz002', '', '', 'San Francisco, CA', '1985-05-18', '', NULL, 'female', '/uploads/avatars/1749703097767-696713373.png', 1, '2025-06-12 12:37:32', NULL, '2025-06-12 04:37:32', '2025-06-12 04:38:20'),
(8, 9, NULL, 'Jane Elizabeth Smith', 'janesmith20', 'janes.smith@example.com', '$2b$10$u84SVqHRRTQ7n.4PPmZZGu/Yn/r8MAExAr2Jdku.OO98vzpiEXG0m', '', '', 'San Francisco, CA', '1985-05-19', '', NULL, 'female', NULL, 1, '2025-06-12 12:41:50', NULL, '2025-06-12 04:41:50', '2025-06-12 04:41:50'),
(14, 13, 'S1749790242780_13', 'John Michael Doe', 'johndoe123', 'johndoe@gmail.com', '$2b$10$OShZXEGGfgBuN7lXks/XfeuFvPemcypi5HE7rMbGffjHUTBmeAdWe', 'student', '123 Main Street, New York, NY', 'Marilao Bulacan', '1990-05-14', '09234567890', 'beginner', 'male', NULL, 1, '2025-06-13 06:24:33', NULL, '2025-06-12 22:24:33', '2025-06-12 22:24:33');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

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
