-- phpMyAdmin SQL Dump
-- version 4.9.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 30, 2021 at 05:20 PM
-- Server version: 5.7.35
-- PHP Version: 7.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sfgtys_shopinipos`
--

-- --------------------------------------------------------

--
-- Table structure for table `adjustments`
--

CREATE TABLE `adjustments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `Ref` varchar(192) NOT NULL,
  `warehouse_id` int(11) NOT NULL,
  `items` double DEFAULT '0',
  `notes` text,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `adjustment_details`
--

CREATE TABLE `adjustment_details` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `adjustment_id` int(11) NOT NULL,
  `product_variant_id` int(11) DEFAULT NULL,
  `quantity` double NOT NULL,
  `type` varchar(192) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `name` varchar(192) NOT NULL,
  `description` varchar(192) DEFAULT NULL,
  `image` varchar(192) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `description`, `image`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Samsung', 'South Korean largest company.', '99677682samsung-Logo (1).jpg', '2021-08-04 10:23:48.000000', '2021-08-27 07:41:08.000000', NULL),
(2, 'LG', 'LG', '61239528LG.jpg', '2021-08-27 07:17:55.000000', '2021-08-27 07:17:55.000000', NULL),
(17, 'Bahari', NULL, '97312117bahari.png', '2021-08-27 09:55:10.000000', '2021-08-27 09:55:10.000000', NULL),
(18, 'Jiber', NULL, '93403091jiber.png', '2021-08-27 09:57:28.000000', '2021-08-27 09:57:28.000000', NULL),
(19, 'Shopping Shop', 'null', '26910493shopping.jpeg', '2021-08-27 10:02:39.000000', '2021-08-27 12:27:28.000000', NULL),
(20, 'Bashaair Fashion', NULL, 'no-image.png', '2021-08-27 10:05:16.000000', '2021-08-27 10:05:16.000000', NULL),
(21, 'Dell', NULL, '80500288DELL.jpg', '2021-08-27 10:08:46.000000', '2021-08-27 10:08:46.000000', NULL),
(23, 'HP ', 'HP', '36293821hp.jpg', '2021-08-27 10:10:14.000000', '2021-08-27 10:10:29.000000', '2021-08-27 10:10:29'),
(24, 'Daniel Klein', 'Daniel Klein', '98411926daniel.jpg', '2021-08-27 10:19:59.000000', '2021-08-27 10:19:59.000000', NULL),
(27, 'Ice cream', 'Ice cream', '24393468icc.png', '2021-08-27 10:23:32.000000', '2021-08-27 10:23:32.000000', NULL),
(28, 'Palmolive', 'Palmolive', '53590376palmolive.jpg', '2021-08-27 10:24:41.000000', '2021-08-27 10:24:41.000000', NULL),
(29, 'SecretKey', 'SecretKey', '77538769sec.jpeg', '2021-08-27 10:26:34.000000', '2021-08-27 10:26:34.000000', NULL),
(30, 'S and B', 'S and B', '34716856sb.jpg', '2021-08-27 10:29:09.000000', '2021-08-27 10:29:09.000000', NULL),
(31, 'IVA NATURA', 'IVA NATURA', '27628209iva.jpg', '2021-08-27 10:32:39.000000', '2021-08-27 10:32:39.000000', NULL),
(32, 'Reebok', 'Reebok', '8537104816041475151200px-Reebok_2019_logo.svg.jpg', '2021-08-27 10:34:37.000000', '2021-08-27 10:34:37.000000', NULL),
(33, 'Bath Body Works', 'Bath Body Works', '32810136bath.jpg', '2021-08-27 10:37:36.000000', '2021-08-27 10:37:36.000000', NULL),
(34, 'Ice Watch', 'Ice Watch', '23256783ice.jpg', '2021-08-27 10:41:12.000000', '2021-08-27 10:41:12.000000', NULL),
(35, 'ZARA', 'ZARA', '48497740zara.jpg', '2021-08-27 10:43:45.000000', '2021-08-27 10:43:45.000000', NULL),
(36, 'SKOR', 'SKOR', '25460827SK.jpg', '2021-08-27 10:48:51.000000', '2021-08-27 10:48:51.000000', NULL),
(37, 'SKON', 'SKON', '92918142SKON.jpg', '2021-08-27 10:51:21.000000', '2021-08-27 10:51:21.000000', NULL),
(38, 'FOGG', 'FOGG', '41737782FOGG.jpg', '2021-08-27 10:59:48.000000', '2021-08-27 10:59:48.000000', NULL),
(39, 'Basrah Center', 'food product', '33050534download.jpg', '2021-08-27 14:11:18.000000', '2021-08-27 15:13:09.000000', NULL),
(40, 'Basrah Center', 'food product', '50231763food.jpg', '2021-08-27 14:11:19.000000', '2021-08-27 14:11:29.000000', '2021-08-27 14:11:29'),
(41, 'Basrah Centre', 'food product', '94658037CHICKEN.jpg', '2021-08-27 14:20:05.000000', '2021-08-27 15:11:13.000000', '2021-08-27 15:11:13'),
(42, 'Basrah Centre', 'food product', '42491548CHICKEN.jpg', '2021-08-27 14:20:13.000000', '2021-08-27 14:20:19.000000', '2021-08-27 14:20:19'),
(43, 'Basrah Centre', 'food product', '26154764CHICKEN.jpg', '2021-08-27 14:20:24.000000', '2021-08-27 14:22:19.000000', '2021-08-27 14:22:19'),
(44, 'Basrah Centre', 'food', '74088938VEGE.jpg', '2021-08-27 15:00:18.000000', '2021-08-27 15:11:21.000000', '2021-08-27 15:11:21'),
(45, 'Cetaphil', 'Cetaphil', '44373025CETAPHIL.jpg', '2021-08-27 15:17:02.000000', '2021-08-27 15:17:02.000000', NULL),
(46, 'Green Pharmacy', 'medicine', '96734856GREEN PHARMACY.jpg', '2021-08-27 15:23:42.000000', '2021-08-27 15:23:42.000000', NULL),
(47, 'Green Pharmacy', 'medicine', '83614313GREEN PHARMACY.jpg', '2021-08-27 15:23:45.000000', '2021-08-27 15:23:51.000000', '2021-08-27 15:23:51'),
(48, 'Pharmacy', 'medicine', '35878568PHAR.jpg', '2021-08-27 15:28:38.000000', '2021-08-27 15:29:07.000000', NULL),
(49, 'New Vision company', NULL, '49191524vision.jpg', '2021-08-27 15:38:22.000000', '2021-08-27 15:38:22.000000', NULL),
(50, 'Baby center', NULL, '68645875bbbb.jpg', '2021-08-27 15:54:49.000000', '2021-08-27 15:54:49.000000', NULL),
(51, 'Graco', 'toys', '19370238GRACO.jpg', '2021-08-27 16:00:18.000000', '2021-08-27 16:00:18.000000', NULL),
(52, 'Tooky Toy', 'toys', '16249857tt.jpg', '2021-08-27 16:22:08.000000', '2021-08-27 16:22:08.000000', NULL),
(53, 'HUGO BOSS', NULL, '58580168HUGO.png', '2021-08-27 16:37:46.000000', '2021-08-27 16:37:46.000000', NULL),
(54, 'Shopini', 'Sports', '79950859shopini.png', '2021-08-27 17:04:18.000000', '2021-08-27 17:04:18.000000', NULL),
(55, 'Maybelline', 'beauty', '90111509mb.jpg', '2021-08-27 17:12:15.000000', '2021-08-27 17:12:15.000000', NULL),
(56, 'Maybelline', 'beauty', '31191237mb.jpg', '2021-08-27 17:12:15.000000', '2021-08-27 17:12:21.000000', '2021-08-27 17:12:21'),
(57, 'Walp Disnep', 'toys', '20775624DISNIB.jpg', '2021-08-27 17:23:52.000000', '2021-08-27 17:23:52.000000', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `code` varchar(192) NOT NULL,
  `name` varchar(192) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `code`, `name`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Food', 'Food', '2021-08-04 10:24:06.000000', '2021-08-27 09:09:56.000000', NULL),
(2, 'Kitchen', 'Kitchen', '2021-08-27 07:09:38.000000', '2021-08-27 07:09:38.000000', NULL),
(3, 'Grocery', 'Grocery', '2021-08-27 07:09:56.000000', '2021-08-27 10:33:28.000000', '2021-08-27 10:33:28'),
(4, 'Electronics', 'Electronics', '2021-08-27 07:10:27.000000', '2021-08-27 07:10:27.000000', NULL),
(5, 'Clothes', 'Clothes', '2021-08-27 07:10:47.000000', '2021-08-27 07:44:55.000000', NULL),
(6, 'Sport', 'Sport', NULL, NULL, NULL),
(7, 'Watches and Glasses', 'Watches and Glasses', NULL, NULL, NULL),
(8, 'Perfumes', 'Perfumes', NULL, NULL, NULL),
(9, 'healthbeauty', 'Health Beauty', NULL, NULL, NULL),
(10, 'Shoes', 'Shoes', '2021-08-27 10:33:06.000000', '2021-08-27 10:34:02.000000', '2021-08-27 10:34:02'),
(11, 'Shoes', 'Shoes', '2021-08-27 10:33:53.000000', '2021-08-27 10:33:53.000000', NULL),
(12, 'Medical', 'Medical', '2021-08-27 14:01:06.000000', '2021-08-27 14:01:06.000000', NULL),
(13, 'Toys', 'Toys', '2021-08-27 15:46:33.000000', '2021-08-27 15:46:33.000000', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `city`
--

CREATE TABLE `city` (
  `id` int(11) NOT NULL,
  `city_name_english` varchar(15) CHARACTER SET utf8 DEFAULT NULL,
  `city_name_arabic` varchar(15) CHARACTER SET utf8 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `city`
--

INSERT INTO `city` (`id`, `city_name_english`, `city_name_arabic`) VALUES
(1, 'Baghdad', 'بغداد'),
(2, 'Basrah', 'البصرة'),
(3, 'Maysan', 'ميسان'),
(4, 'Anbar', 'الانبار'),
(5, 'Dhi Qar', 'ذي قار'),
(6, 'Salahaddin', 'صلاح الدين'),
(7, 'Muthanna', 'المثنى'),
(8, 'Karbala', 'كربلاء'),
(9, 'Babylon', 'بابل'),
(10, 'Mosul', 'الموصل'),
(11, 'Najaf', 'النجف'),
(12, 'Qadisiyah', 'القادسية'),
(13, 'Diyala', 'ديالى'),
(14, 'Arbil', 'أربيل'),
(15, 'Wasit', 'واسط'),
(16, 'Dohuk', 'دهوك'),
(17, 'Kirkuk', 'كركوك'),
(18, 'Sulaymaniyah', 'السليمانية'),
(21, 'Z-shopini', 'يخصص');

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `code` int(11) NOT NULL,
  `email` varchar(192) NOT NULL,
  `country` varchar(191) NOT NULL,
  `province_id` int(11) NOT NULL,
  `city` varchar(191) NOT NULL,
  `phone` varchar(191) NOT NULL,
  `adresse` varchar(191) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `city_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `name`, `code`, `email`, `country`, `province_id`, `city`, `phone`, `adresse`, `created_at`, `updated_at`, `deleted_at`, `city_id`) VALUES
(1, 'walk-in-customer', 1, 'walk-in-customer@example.com', '1', 7, '3', '0', 'BT 45286m, Zone Central ', NULL, NULL, NULL, 3),
(2, 'asadullah', 2, 'asad_2723@yahoo.com', '1', 37, '2', '00923325429497', 'BT 45286m, Zone Central ', '2021-08-23 03:05:29.000000', '2021-08-23 03:05:29.000000', NULL, 2),
(3, 'imran', 2, 'imran@shopini.com', '1', 38, '2', '0978123458796', 'ZT  A875, Central ', '2021-08-23 03:05:29.000000', '2021-08-23 03:05:29.000000', NULL, 3),
(4, 'yawar', 3, 'yawarr@shopini.com', '1', 34, '2', '778457971024', 'BT 45286m, Zone Central ', '2021-08-23 03:05:29.000000', '2021-08-23 03:05:29.000000', NULL, 2);

-- --------------------------------------------------------

--
-- Table structure for table `currencies`
--

CREATE TABLE `currencies` (
  `id` int(11) NOT NULL,
  `code` varchar(192) NOT NULL,
  `name` varchar(192) NOT NULL,
  `symbol` varchar(192) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `currencies`
--

INSERT INTO `currencies` (`id`, `code`, `name`, `symbol`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'USD', 'US Dollar', '$', NULL, NULL, NULL),
(2, 'IQD', 'Iraqi', 'IQD', '2021-08-11 09:55:13.000000', '2021-08-11 09:55:13.000000', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `Ref` varchar(192) NOT NULL,
  `user_id` int(11) NOT NULL,
  `expense_category_id` int(11) NOT NULL,
  `warehouse_id` int(11) NOT NULL,
  `details` varchar(192) NOT NULL,
  `amount` double NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `expense_categories`
--

CREATE TABLE `expense_categories` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(192) NOT NULL,
  `description` text,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(191) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2021_03_08_020247_create_adjustment_details_table', 1),
(2, '2021_03_08_020247_create_adjustments_table', 1),
(3, '2021_03_08_020247_create_brands_table', 1),
(4, '2021_03_08_020247_create_categories_table', 1),
(5, '2021_03_08_020247_create_clients_table', 1),
(6, '2021_03_08_020247_create_currencies_table', 1),
(7, '2021_03_08_020247_create_expense_categories_table', 1),
(8, '2021_03_08_020247_create_expenses_table', 1),
(9, '2021_03_08_020247_create_password_resets_table', 1),
(10, '2021_03_08_020247_create_payment_purchase_returns_table', 1),
(11, '2021_03_08_020247_create_payment_purchases_table', 1),
(12, '2021_03_08_020247_create_payment_sale_returns_table', 1),
(13, '2021_03_08_020247_create_payment_sales_table', 1),
(14, '2021_03_08_020247_create_payment_with_credit_card_table', 1),
(15, '2021_03_08_020247_create_permission_role_table', 1),
(16, '2021_03_08_020247_create_permissions_table', 1),
(17, '2021_03_08_020247_create_product_variants_table', 1),
(18, '2021_03_08_020247_create_product_warehouse_table', 1),
(19, '2021_03_08_020247_create_products_table', 1),
(20, '2021_03_08_020247_create_providers_table', 1),
(21, '2021_03_08_020247_create_purchase_details_table', 1),
(22, '2021_03_08_020247_create_purchase_return_details_table', 1),
(23, '2021_03_08_020247_create_purchase_returns_table', 1),
(24, '2021_03_08_020247_create_purchases_table', 1),
(25, '2021_03_08_020247_create_quotation_details_table', 1),
(26, '2021_03_08_020247_create_quotations_table', 1),
(27, '2021_03_08_020247_create_role_user_table', 1),
(28, '2021_03_08_020247_create_roles_table', 1),
(29, '2021_03_08_020247_create_sale_details_table', 1),
(30, '2021_03_08_020247_create_sale_return_details_table', 1),
(31, '2021_03_08_020247_create_sale_returns_table', 1),
(32, '2021_03_08_020247_create_sales_table', 1),
(33, '2021_03_08_020247_create_serveurs_table', 1),
(34, '2021_03_08_020247_create_settings_table', 1),
(35, '2021_03_08_020247_create_transfer_details_table', 1),
(36, '2021_03_08_020247_create_transfers_table', 1),
(37, '2021_03_08_020247_create_units_table', 1),
(38, '2021_03_08_020247_create_users_table', 1),
(39, '2021_03_08_020247_create_warehouses_table', 1),
(40, '2021_03_08_020248_add_status_to_roles_table', 1),
(41, '2021_03_08_020251_add_foreign_keys_to_adjustment_details_table', 1),
(42, '2021_03_08_020251_add_foreign_keys_to_adjustments_table', 1),
(43, '2021_03_08_020251_add_foreign_keys_to_expense_categories_table', 1),
(44, '2021_03_08_020251_add_foreign_keys_to_expenses_table', 1),
(45, '2021_03_08_020251_add_foreign_keys_to_payment_purchase_returns_table', 1),
(46, '2021_03_08_020251_add_foreign_keys_to_payment_purchases_table', 1),
(47, '2021_03_08_020251_add_foreign_keys_to_payment_sale_returns_table', 1),
(48, '2021_03_08_020251_add_foreign_keys_to_payment_sales_table', 1),
(49, '2021_03_08_020251_add_foreign_keys_to_permission_role_table', 1),
(50, '2021_03_08_020251_add_foreign_keys_to_product_variants_table', 1),
(51, '2021_03_08_020251_add_foreign_keys_to_product_warehouse_table', 1),
(52, '2021_03_08_020251_add_foreign_keys_to_products_table', 1),
(53, '2021_03_08_020251_add_foreign_keys_to_purchase_details_table', 1),
(54, '2021_03_08_020251_add_foreign_keys_to_purchase_return_details_table', 1),
(55, '2021_03_08_020251_add_foreign_keys_to_purchase_returns_table', 1),
(56, '2021_03_08_020251_add_foreign_keys_to_purchases_table', 1),
(57, '2021_03_08_020251_add_foreign_keys_to_quotation_details_table', 1),
(58, '2021_03_08_020251_add_foreign_keys_to_quotations_table', 1),
(59, '2021_03_08_020251_add_foreign_keys_to_role_user_table', 1),
(60, '2021_03_08_020251_add_foreign_keys_to_sale_details_table', 1),
(61, '2021_03_08_020251_add_foreign_keys_to_sale_return_details_table', 1),
(62, '2021_03_08_020251_add_foreign_keys_to_sale_returns_table', 1),
(63, '2021_03_08_020251_add_foreign_keys_to_sales_table', 1),
(64, '2021_03_08_020251_add_foreign_keys_to_settings_table', 1),
(65, '2021_03_08_020251_add_foreign_keys_to_transfer_details_table', 1),
(66, '2021_03_08_020251_add_foreign_keys_to_transfers_table', 1),
(67, '2021_03_08_020251_add_foreign_keys_to_units_table', 1),
(68, '2021_04_11_221536_add_footer_to_settings_table', 1),
(69, '2021_04_30_040505_add_devopped_by_to_settings', 1),
(70, '2021_05_07_140933_add_client_id_to_settings_table', 1),
(71, '2021_05_07_141034_add_warehouse_id_to_settings_table', 1),
(72, '2021_05_07_141303_add_foreign_keys_clients_to_settings', 1),
(73, '2016_06_01_000001_create_oauth_auth_codes_table', 2),
(74, '2016_06_01_000002_create_oauth_access_tokens_table', 2),
(75, '2016_06_01_000003_create_oauth_refresh_tokens_table', 2),
(76, '2016_06_01_000004_create_oauth_clients_table', 2),
(77, '2016_06_01_000005_create_oauth_personal_access_clients_table', 2);

-- --------------------------------------------------------

--
-- Table structure for table `oauth_access_tokens`
--

CREATE TABLE `oauth_access_tokens` (
  `id` varchar(100) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `client_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) DEFAULT NULL,
  `scopes` text,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `oauth_auth_codes`
--

CREATE TABLE `oauth_auth_codes` (
  `id` varchar(100) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `client_id` bigint(20) UNSIGNED NOT NULL,
  `scopes` text,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `oauth_clients`
--

CREATE TABLE `oauth_clients` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `secret` varchar(100) DEFAULT NULL,
  `provider` varchar(191) DEFAULT NULL,
  `redirect` text NOT NULL,
  `personal_access_client` tinyint(1) NOT NULL,
  `password_client` tinyint(1) NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `oauth_clients`
--

INSERT INTO `oauth_clients` (`id`, `user_id`, `name`, `secret`, `provider`, `redirect`, `personal_access_client`, `password_client`, `revoked`, `created_at`, `updated_at`) VALUES
(1, NULL, 'shopinipos Personal Access Client', 'vlKiwBaPXnZnY3G6BBFIJMSHdxr0TmoXqJzoM9eP', NULL, 'http://localhost', 1, 0, 0, '2021-08-04 10:12:12', '2021-08-04 10:12:12'),
(2, NULL, 'shopinipos Password Grant Client', 'TmIgWEfNnQSyhmahA1tCXUQMMpt0Y0IBZy9QAdHM', 'users', 'http://localhost', 0, 1, 0, '2021-08-04 10:12:12', '2021-08-04 10:12:12');

-- --------------------------------------------------------

--
-- Table structure for table `oauth_personal_access_clients`
--

CREATE TABLE `oauth_personal_access_clients` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `client_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `oauth_personal_access_clients`
--

INSERT INTO `oauth_personal_access_clients` (`id`, `client_id`, `created_at`, `updated_at`) VALUES
(1, 1, '2021-08-04 10:12:12', '2021-08-04 10:12:12');

-- --------------------------------------------------------

--
-- Table structure for table `oauth_refresh_tokens`
--

CREATE TABLE `oauth_refresh_tokens` (
  `id` varchar(100) NOT NULL,
  `access_token_id` varchar(100) NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `email` varchar(191) NOT NULL,
  `token` varchar(191) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `password_resets`
--

INSERT INTO `password_resets` (`id`, `email`, `token`, `created_at`, `updated_at`) VALUES
(4, 'asad_2723@yahoo.com', '9nkP5L7BR3Oe5bjFai2CZGHeIrwHiosjbwS5bxFIxQXaqfCFYo3qMutOXsMl', '2021-08-11 04:39:25.000000', '2021-08-27 12:58:51.000000');

-- --------------------------------------------------------

--
-- Table structure for table `payment_purchases`
--

CREATE TABLE `payment_purchases` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `Ref` varchar(192) NOT NULL,
  `purchase_id` int(11) NOT NULL,
  `montant` double NOT NULL,
  `Reglement` varchar(192) NOT NULL,
  `notes` text,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `payment_purchase_returns`
--

CREATE TABLE `payment_purchase_returns` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `Ref` varchar(192) NOT NULL,
  `purchase_return_id` int(11) NOT NULL,
  `montant` double NOT NULL,
  `Reglement` varchar(191) NOT NULL,
  `notes` text,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `payment_sales`
--

CREATE TABLE `payment_sales` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `Ref` varchar(192) NOT NULL,
  `sale_id` int(11) NOT NULL,
  `montant` double NOT NULL,
  `Reglement` varchar(192) NOT NULL,
  `notes` text,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `payment_sales`
--

INSERT INTO `payment_sales` (`id`, `user_id`, `date`, `Ref`, `sale_id`, `montant`, `Reglement`, `notes`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, '2021-08-28', 'INV/SL_1111', 14, 54500, 'Cash', NULL, '2021-08-28 01:38:26.000000', '2021-08-28 01:38:26.000000', NULL),
(2, 1, '2021-08-28', 'INV/SL_1112', 15, 46500, 'Cash', NULL, '2021-08-28 01:56:59.000000', '2021-08-28 01:56:59.000000', NULL),
(3, 1, '2021-08-29', 'INV/SL_1113', 16, 47500, 'Cash', NULL, '2021-08-29 05:00:22.000000', '2021-08-29 05:00:22.000000', NULL),
(4, 1, '2021-08-29', 'INV/SL_1114', 17, 27500, 'Cash', NULL, '2021-08-29 05:23:07.000000', '2021-08-29 05:23:07.000000', NULL),
(5, 1, '2021-08-29', 'INV/SL_1115', 18, 16000, 'Cash', NULL, '2021-08-29 05:23:31.000000', '2021-08-29 05:23:31.000000', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `payment_sale_returns`
--

CREATE TABLE `payment_sale_returns` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `Ref` varchar(192) NOT NULL,
  `sale_return_id` int(11) NOT NULL,
  `montant` double NOT NULL,
  `Reglement` varchar(191) NOT NULL,
  `notes` text,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `payment_with_credit_card`
--

CREATE TABLE `payment_with_credit_card` (
  `id` int(11) NOT NULL,
  `payment_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `customer_stripe_id` varchar(192) NOT NULL,
  `charge_id` varchar(192) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL,
  `name` varchar(192) NOT NULL,
  `label` varchar(192) DEFAULT NULL,
  `description` text,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `label`, `description`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'users_view', NULL, NULL, NULL, NULL, NULL),
(2, 'users_edit', NULL, NULL, NULL, NULL, NULL),
(3, 'record_view', NULL, NULL, NULL, NULL, NULL),
(4, 'users_delete', NULL, NULL, NULL, NULL, NULL),
(5, 'users_add', NULL, NULL, NULL, NULL, NULL),
(6, 'permissions_edit', NULL, NULL, NULL, NULL, NULL),
(7, 'permissions_view', NULL, NULL, NULL, NULL, NULL),
(8, 'permissions_delete', NULL, NULL, NULL, NULL, NULL),
(9, 'permissions_add', NULL, NULL, NULL, NULL, NULL),
(10, 'products_delete', NULL, NULL, NULL, NULL, NULL),
(11, 'products_view', NULL, NULL, NULL, NULL, NULL),
(12, 'barcode_view', NULL, NULL, NULL, NULL, NULL),
(13, 'products_edit', NULL, NULL, NULL, NULL, NULL),
(14, 'products_add', NULL, NULL, NULL, NULL, NULL),
(15, 'expense_add', NULL, NULL, NULL, NULL, NULL),
(16, 'expense_delete', NULL, NULL, NULL, NULL, NULL),
(17, 'expense_edit', NULL, NULL, NULL, NULL, NULL),
(18, 'expense_view', NULL, NULL, NULL, NULL, NULL),
(19, 'transfer_delete', NULL, NULL, NULL, NULL, NULL),
(20, 'transfer_add', NULL, NULL, NULL, NULL, NULL),
(21, 'transfer_view', NULL, NULL, NULL, NULL, NULL),
(22, 'transfer_edit', NULL, NULL, NULL, NULL, NULL),
(23, 'adjustment_delete', NULL, NULL, NULL, NULL, NULL),
(24, 'adjustment_add', NULL, NULL, NULL, NULL, NULL),
(25, 'adjustment_edit', NULL, NULL, NULL, NULL, NULL),
(26, 'adjustment_view', NULL, NULL, NULL, NULL, NULL),
(27, 'Sales_edit', NULL, NULL, NULL, NULL, NULL),
(28, 'Sales_view', NULL, NULL, NULL, NULL, NULL),
(29, 'Sales_delete', NULL, NULL, NULL, NULL, NULL),
(30, 'Sales_add', NULL, NULL, NULL, NULL, NULL),
(31, 'Purchases_edit', NULL, NULL, NULL, NULL, NULL),
(32, 'Purchases_view', NULL, NULL, NULL, NULL, NULL),
(33, 'Purchases_delete', NULL, NULL, NULL, NULL, NULL),
(34, 'Purchases_add', NULL, NULL, NULL, NULL, NULL),
(35, 'Quotations_edit', NULL, NULL, NULL, NULL, NULL),
(36, 'Quotations_delete', NULL, NULL, NULL, NULL, NULL),
(37, 'Quotations_add', NULL, NULL, NULL, NULL, NULL),
(38, 'Quotations_view', NULL, NULL, NULL, NULL, NULL),
(39, 'payment_sales_delete', NULL, NULL, NULL, NULL, NULL),
(40, 'payment_sales_add', NULL, NULL, NULL, NULL, NULL),
(41, 'payment_sales_edit', NULL, NULL, NULL, NULL, NULL),
(42, 'payment_sales_view', NULL, NULL, NULL, NULL, NULL),
(43, 'Purchase_Returns_delete', NULL, NULL, NULL, NULL, NULL),
(44, 'Purchase_Returns_add', NULL, NULL, NULL, NULL, NULL),
(45, 'Purchase_Returns_view', NULL, NULL, NULL, NULL, NULL),
(46, 'Purchase_Returns_edit', NULL, NULL, NULL, NULL, NULL),
(47, 'Sale_Returns_delete', NULL, NULL, NULL, NULL, NULL),
(48, 'Sale_Returns_add', NULL, NULL, NULL, NULL, NULL),
(49, 'Sale_Returns_edit', NULL, NULL, NULL, NULL, NULL),
(50, 'Sale_Returns_view', NULL, NULL, NULL, NULL, NULL),
(51, 'payment_purchases_edit', NULL, NULL, NULL, NULL, NULL),
(52, 'payment_purchases_view', NULL, NULL, NULL, NULL, NULL),
(53, 'payment_purchases_delete', NULL, NULL, NULL, NULL, NULL),
(54, 'payment_purchases_add', NULL, NULL, NULL, NULL, NULL),
(55, 'payment_returns_edit', NULL, NULL, NULL, NULL, NULL),
(56, 'payment_returns_view', NULL, NULL, NULL, NULL, NULL),
(57, 'payment_returns_delete', NULL, NULL, NULL, NULL, NULL),
(58, 'payment_returns_add', NULL, NULL, NULL, NULL, NULL),
(59, 'Customers_edit', NULL, NULL, NULL, NULL, NULL),
(60, 'Customers_view', NULL, NULL, NULL, NULL, NULL),
(61, 'Customers_delete', NULL, NULL, NULL, NULL, NULL),
(62, 'Customers_add', NULL, NULL, NULL, NULL, NULL),
(63, 'unit', NULL, NULL, NULL, NULL, NULL),
(64, 'currency', NULL, NULL, NULL, NULL, NULL),
(65, 'category', NULL, NULL, NULL, NULL, NULL),
(66, 'backup', NULL, NULL, NULL, NULL, NULL),
(67, 'warehouse', NULL, NULL, NULL, NULL, NULL),
(68, 'brand', NULL, NULL, NULL, NULL, NULL),
(69, 'setting_system', NULL, NULL, NULL, NULL, NULL),
(70, 'Warehouse_report', NULL, NULL, NULL, NULL, NULL),
(72, 'Reports_quantity_alerts', NULL, NULL, NULL, NULL, NULL),
(73, 'Reports_profit', NULL, NULL, NULL, NULL, NULL),
(74, 'Reports_suppliers', NULL, NULL, NULL, NULL, NULL),
(75, 'Reports_customers', NULL, NULL, NULL, NULL, NULL),
(76, 'Reports_purchase', NULL, NULL, NULL, NULL, NULL),
(77, 'Reports_sales', NULL, NULL, NULL, NULL, NULL),
(78, 'Reports_payments_purchase_Return', NULL, NULL, NULL, NULL, NULL),
(79, 'Reports_payments_Sale_Returns', NULL, NULL, NULL, NULL, NULL),
(80, 'Reports_payments_Purchases', NULL, NULL, NULL, NULL, NULL),
(81, 'Reports_payments_Sales', NULL, NULL, NULL, NULL, NULL),
(82, 'Suppliers_delete', NULL, NULL, NULL, NULL, NULL),
(83, 'Suppliers_add', NULL, NULL, NULL, NULL, NULL),
(84, 'Suppliers_edit', NULL, NULL, NULL, NULL, NULL),
(85, 'Suppliers_view', NULL, NULL, NULL, NULL, NULL),
(86, 'Pos_view', NULL, NULL, NULL, NULL, NULL),
(87, 'product_import', NULL, NULL, NULL, NULL, NULL),
(88, 'customers_import', NULL, NULL, NULL, NULL, NULL),
(89, 'Suppliers_import', NULL, NULL, NULL, NULL, NULL),
(90, 'Shipping_view', 'Shipping_view', 'Shipping_view', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `permission_role`
--

CREATE TABLE `permission_role` (
  `id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `permission_role`
--

INSERT INTO `permission_role` (`id`, `permission_id`, `role_id`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 1),
(4, 4, 1),
(5, 5, 1),
(6, 6, 1),
(7, 7, 1),
(8, 8, 1),
(9, 9, 1),
(10, 10, 1),
(11, 11, 1),
(12, 12, 1),
(13, 13, 1),
(14, 14, 1),
(15, 15, 1),
(16, 16, 1),
(17, 17, 1),
(18, 18, 1),
(19, 19, 1),
(20, 20, 1),
(21, 21, 1),
(22, 22, 1),
(23, 23, 1),
(24, 24, 1),
(25, 25, 1),
(26, 26, 1),
(27, 27, 1),
(28, 28, 1),
(29, 29, 1),
(30, 30, 1),
(31, 31, 1),
(32, 32, 1),
(33, 33, 1),
(34, 34, 1),
(35, 35, 1),
(36, 36, 1),
(37, 37, 1),
(38, 38, 1),
(39, 39, 1),
(40, 40, 1),
(41, 41, 1),
(42, 42, 1),
(43, 43, 1),
(44, 44, 1),
(45, 45, 1),
(46, 46, 1),
(47, 47, 1),
(48, 48, 1),
(49, 49, 1),
(50, 50, 1),
(51, 51, 1),
(52, 52, 1),
(53, 53, 1),
(54, 54, 1),
(55, 55, 1),
(56, 56, 1),
(57, 57, 1),
(58, 58, 1),
(59, 59, 1),
(60, 60, 1),
(61, 61, 1),
(62, 62, 1),
(63, 63, 1),
(64, 64, 1),
(65, 65, 1),
(66, 66, 1),
(67, 67, 1),
(68, 68, 1),
(69, 69, 1),
(70, 70, 1),
(72, 72, 1),
(73, 73, 1),
(74, 74, 1),
(75, 75, 1),
(76, 76, 1),
(77, 77, 1),
(78, 78, 1),
(79, 79, 1),
(80, 80, 1),
(81, 81, 1),
(82, 82, 1),
(83, 83, 1),
(84, 84, 1),
(85, 85, 1),
(86, 86, 1),
(87, 87, 1),
(88, 88, 1),
(89, 89, 1),
(94, 81, 2),
(95, 68, 2),
(96, 67, 2),
(97, 65, 2),
(98, 1, 2),
(99, 7, 2),
(100, 11, 2),
(101, 2, 2),
(102, 3, 2),
(103, 4, 2),
(104, 5, 2),
(105, 6, 2),
(106, 8, 2),
(107, 9, 2),
(108, 13, 2),
(109, 12, 2),
(110, 87, 2),
(111, 10, 2),
(112, 14, 2),
(113, 28, 2),
(114, 27, 2),
(115, 86, 2),
(116, 29, 2),
(117, 30, 2),
(118, 32, 2),
(119, 31, 2),
(120, 34, 2),
(121, 33, 2),
(122, 90, 1),
(123, 90, 2);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `code` varchar(192) NOT NULL,
  `Type_barcode` varchar(192) NOT NULL,
  `name` varchar(192) NOT NULL,
  `cost` double NOT NULL,
  `price` double NOT NULL,
  `category_id` int(11) NOT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `unit_id` int(11) DEFAULT NULL,
  `unit_sale_id` int(11) DEFAULT NULL,
  `unit_purchase_id` int(11) DEFAULT NULL,
  `TaxNet` double DEFAULT '0',
  `tax_method` varchar(192) DEFAULT '1',
  `image` text,
  `note` text,
  `stock_alert` double DEFAULT '0',
  `is_variant` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `code`, `Type_barcode`, `name`, `cost`, `price`, `category_id`, `brand_id`, `unit_id`, `unit_sale_id`, `unit_purchase_id`, `TaxNet`, `tax_method`, `image`, `note`, `stock_alert`, `is_variant`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES
(3, 'FOGG0001', 'CODE128', 'Master Agar body spray', 4500, 5000, 8, 38, 1, 1, 1, 0, '1', '57708539foog.png', NULL, 0, 0, 1, '2021-08-27 11:13:51.000000', '2021-08-27 11:14:30.000000', NULL),
(4, 'FG0002', 'CODE128', 'Intense Oriental for Men', 9500, 11000, 8, 38, 1, 1, 1, 0, '1', '15104576fogg2.png', NULL, 0, 0, 1, '2021-08-27 11:16:35.000000', '2021-08-27 11:16:35.000000', NULL),
(5, 'ba0001', 'CODE39', 'Girl Shirt', 1000, 1000, 5, 17, 1, 1, 1, 0, '1', '448147641.jpg', NULL, 0, 0, 1, '2021-08-27 12:15:16.000000', '2021-08-27 12:18:52.000000', NULL),
(6, 'JI0002', 'CODE39', 'UNDER Shirt For Men Half', 2500, 2500, 5, 18, 1, 1, 1, 0, '1', '1163293928910552UNDER.jpg', NULL, 0, 0, 1, '2021-08-27 12:24:34.000000', '2021-08-27 12:25:52.000000', NULL),
(7, 'mk0003', 'CODE39', 'Mens Knitting Short', 2500, 2500, 5, 19, 1, 1, 1, 0, '1', '45929489man knitting short.jpg', NULL, 0, 0, 1, '2021-08-27 12:31:22.000000', '2021-08-27 12:31:22.000000', NULL),
(8, 'dm0004', 'CODE39', 'Daniel  Man watch', 20000, 20000, 7, 24, 1, 1, 1, 0, '1', '519902372566542115516965daniel.jpg', NULL, 0, 0, 1, '2021-08-27 12:40:11.000000', '2021-08-27 12:41:56.000000', NULL),
(9, 'II0005', 'CODE39', 'Icecream inebrya Colored Hair', 10000, 10000, 9, 27, 1, 1, 1, 0, '1', '32318281ice.jpg', NULL, 0, 0, 1, '2021-08-27 12:47:01.000000', '2021-08-27 12:47:01.000000', NULL),
(10, 'ps0006', 'CODE39', 'Palmolive Shower Gel 350ML Fresh vol Citrus', 250, 250, 9, 28, 1, 1, 1, 0, '1', '11485852p shower.png', NULL, 0, 0, 1, '2021-08-27 12:52:43.000000', '2021-08-27 12:52:43.000000', NULL),
(11, 'dell0007', 'CODE39', 'Laptop Dell inspiron 13 5379 Ci7 8G 1T 13.3 FHD', 1020000, 1020000, 4, 21, 1, 1, 1, 0, '1', '69105406laptop dell.jpg', NULL, 0, 0, 1, '2021-08-27 12:57:44.000000', '2021-08-27 12:57:44.000000', NULL),
(12, 'dell0008', 'CODE39', 'DELL P SERIES 27-INCH SCREEN LED-LIT MONITOR', 50000, 50000, 4, 21, 1, 1, 1, 0, '1', '88932123dell p series 27 inch.jpeg', NULL, 0, 0, 1, '2021-08-27 13:00:10.000000', '2021-08-27 13:00:10.000000', NULL),
(13, 'SG0009', 'CODE39', 'SAMSUNG GALAXY S21 ULTRA/512GB', 90000, 90000, 4, 1, 1, 1, 1, 0, '1', '91218669s21.jpg', NULL, 0, 0, 1, '2021-08-27 13:05:11.000000', '2021-08-27 13:05:11.000000', NULL),
(14, 'Sd000010', 'CODE39', 'SAMSUNG DISHWASHER - 5', 60000, 60000, 2, 1, 1, 1, 1, 0, '1', '84887174dishwasher.jpg', NULL, 0, 0, 1, '2021-08-27 13:08:57.000000', '2021-08-27 13:08:57.000000', NULL),
(15, 'SM00011', 'CODE39', 'SAMSUNG SOLO MICROWAVE 40 L', 35000, 35000, 2, 1, 1, 1, 1, 0, '1', '23715076micro.jpg', NULL, 0, 0, 1, '2021-08-27 13:12:22.000000', '2021-08-27 13:12:22.000000', NULL),
(16, 'LG00013', 'CODE39', 'LG COOKER - 6 BURNERS + GIFT LG 20 LITER MICROWAVE', 45000, 45000, 2, 2, 1, 1, 1, 0, '1', '78780190LG.jpg', NULL, 0, 0, 1, '2021-08-27 13:16:16.000000', '2021-08-27 13:16:16.000000', NULL),
(17, 'RV00015', 'CODE39', 'Reebok VIBETECH ACTIVEVIBE', 8000, 8000, 11, 32, 1, 1, 1, 0, '1', '56195995REEBOK.jpg', NULL, 0, 0, 1, '2021-08-27 13:19:59.000000', '2021-08-27 13:19:59.000000', NULL),
(18, 'AE00016', 'CODE39', 'AMAZING EVENING DRESS', 55000, 55000, 5, 30, 1, 1, 1, 0, '1', '56678242SB.jpeg', NULL, 0, 0, 1, '2021-08-27 13:23:40.000000', '2021-08-27 13:23:40.000000', NULL),
(19, 'SM00019', 'CODE39', 'SKONE MEN MECHANICAL', 17000, 17000, 7, 37, 1, 1, 1, 0, '1', '15268981watchhh.jpg', NULL, 0, 0, 1, '2021-08-27 13:31:39.000000', '2021-08-27 13:31:39.000000', NULL),
(20, 'SS00020', 'CODE39', 'LIGHT SPORTS SHOES', 55000, 55000, 6, 36, 1, 1, 1, 0, '1', '22776886SPORT SH.jpg', NULL, 0, 0, 1, '2021-08-27 13:38:58.000000', '2021-08-27 13:38:58.000000', NULL),
(21, 'SS00022', 'CODE39', 'LIGHT SPORTS SHOES- MEDICAL', 7000, 7000, 6, 36, 1, 1, 1, 0, '1', '97657764SPORTS.jpg', NULL, 0, 0, 1, '2021-08-27 13:40:55.000000', '2021-08-27 13:40:55.000000', NULL),
(22, 'ZM00023', 'CODE39', 'ZARA MAN GOLD EDT 80 ML', 9000, 9000, 8, 35, 1, 1, 1, 0, '1', '82149649ZARA.png', NULL, 0, 0, 1, '2021-08-27 13:44:07.000000', '2021-08-27 13:44:07.000000', NULL),
(23, 'LSC00025', 'CODE39', 'LEMON SPARKILING CLEANSING OIL', 6000, 6000, 9, 29, 1, 1, 1, 0, '1', '17970737SECRET.jpg', NULL, 0, 0, 1, '2021-08-27 13:56:37.000000', '2021-08-27 13:56:37.000000', NULL),
(24, 'LPB00027', 'CODE39', 'LANSHON PIEDDAR BEEF 340 GR', 250, 250, 1, 39, 1, 1, 1, 0, '1', '97488177food.jpg', NULL, 0, 0, 1, '2021-08-27 14:17:02.000000', '2021-08-27 14:17:02.000000', NULL),
(25, 'HCL00029', 'CODE39', 'HANA CHICKEN LUNCHEON 850', 400, 400, 1, 39, 1, 1, 1, 0, '1', '60999430CHICKEN.jpg', NULL, 0, 0, 1, '2021-08-27 14:21:46.000000', '2021-08-27 14:21:46.000000', NULL),
(26, 'MFK00030', 'CODE39', 'MIXED FRUITS KOLLY  250 G', 250, 250, 1, 39, 1, 1, 1, 0, '1', '48329243fruit.jpg', NULL, 0, 0, 1, '2021-08-27 14:54:43.000000', '2021-08-27 14:54:43.000000', NULL),
(27, 'YPKFE00031', 'CODE39', 'YURT PATLICAN KIZARTMA FRIED EGGPLANT 400G', 250, 250, 1, 39, 1, 1, 1, 0, '1', '76049124VEGE.jpg', NULL, 0, 0, 1, '2021-08-27 15:10:21.000000', '2021-08-27 15:10:21.000000', NULL),
(28, 'CML00032', 'CODE39', 'CETAPHIL MEDICINAL LOTION', 1900, 1900, 12, 45, 1, 1, 1, 0, '1', '99265132CETAPHIL.jpg', NULL, 0, 0, 1, '2021-08-27 15:18:50.000000', '2021-08-27 15:18:50.000000', NULL),
(29, 'GPAC00033', 'CODE39', 'GREEN PHARMACY ANTI-AGING CREAM 150 ML', 1800, 1800, 12, 46, 1, 1, 1, 0, '1', '44796899ANTI.jpg', NULL, 0, 0, 1, '2021-08-27 15:25:27.000000', '2021-08-27 15:25:27.000000', NULL),
(30, 'PSE00035', 'CODE39', 'PHARMACY SUNSCREEN EMPTIES', 1500, 1500, 12, 48, 1, 1, 1, 0, '1', '76164861SUN.jpg', NULL, 0, 0, 1, '2021-08-27 15:31:03.000000', '2021-08-27 15:31:03.000000', NULL),
(31, 'WS00037', 'CODE39', 'WOMEN\'S SUNGLASSES', 1800, 1800, 7, 49, 1, 1, 1, 0, '1', '30884416GLASSESS.jpg', NULL, 0, 0, 1, '2021-08-27 15:41:49.000000', '2021-08-27 15:41:49.000000', NULL),
(32, 'MS00039', 'CODE39', 'MEN\'S SUNGLASSES', 2200, 2200, 7, 49, 1, 1, 1, 0, '1', '60820816MEN.jpg', NULL, 0, 0, 1, '2021-08-27 15:45:34.000000', '2021-08-27 15:45:34.000000', NULL),
(33, 'BBM00041', 'CODE39', 'BABY BED WITH MUSIC', 1500, 1500, 13, 50, 1, 1, 1, 0, '1', '23979310baby.jpg', NULL, 0, 0, 1, '2021-08-27 15:56:23.000000', '2021-08-27 15:56:23.000000', NULL),
(34, 'GSA00045', 'CODE39', 'GRACO DUET SWAY 2 IN 1 SWING ALPHABET BLOCK DESIGN', 20000, 20000, 13, 51, 1, 1, 1, 0, '1', '92835207SWING.jpg', NULL, 0, 0, 1, '2021-08-27 16:02:18.000000', '2021-08-27 16:02:18.000000', NULL),
(35, 'TTW00049', 'CODE39', 'TOOKY TOY WOODEN GAME - CLARISE', 1500, 1500, 13, 52, 1, 1, 1, 0, '1', '77161637tooky.jpg', NULL, 0, 0, 1, '2021-08-27 16:23:51.000000', '2021-08-27 16:23:51.000000', NULL),
(36, 'WPC00051', 'CODE39', 'Wooden Police Car', 1200, 1200, 13, 52, 1, 1, 1, 0, '1', '15185243toy.jpg', NULL, 0, 0, 1, '2021-08-27 16:25:33.000000', '2021-08-27 16:25:33.000000', NULL),
(37, 'HBFP00055', 'CODE39', 'HUGO BOSS FEMME 75ML PERFUME FOR WOMEN', 25000, 25000, 8, 53, 1, 1, 1, 0, '1', '45450506HMM.jpg', NULL, 0, 0, 1, '2021-08-27 16:40:29.000000', '2021-08-27 16:40:29.000000', NULL),
(38, 'LRSD00058', 'CODE39', 'LG REFRIGERATOR, SIDE DOORS WITH A TOTAL CAPACITY', 105000, 105000, 4, 2, 1, 1, 1, 0, '1', '38614840LG REF.jpg', NULL, 0, 0, 1, '2021-08-27 16:44:59.000000', '2021-08-27 16:44:59.000000', NULL),
(39, 'MS00080', 'CODE39', 'MEN\'S SPORTS SET TWO PIECES', 6000, 6000, 6, 54, 1, 1, 1, 0, '1', '74373389sport.jpg', NULL, 0, 0, 1, '2021-08-27 17:06:47.000000', '2021-08-27 17:06:47.000000', NULL),
(40, 'MDF00082', 'CODE39', 'MAYBELLINE DREAM FOUNDATION 30 SAND 30 ML', 2500, 2500, 9, 55, 1, 1, 1, 0, '1', '25638942MAYB.jpg', NULL, 0, 0, 1, '2021-08-27 17:13:48.000000', '2021-08-27 17:13:48.000000', NULL),
(41, 'ASG00084', 'CODE39', 'ANTIOXIDANT SHOWER GEL', 2000, 2000, 9, 31, 1, 1, 1, 0, '1', '64430484ANTI GEL.jpeg', NULL, 0, 0, 1, '2021-08-27 17:17:44.000000', '2021-08-27 17:17:44.000000', NULL),
(42, 'SMLFS00089', 'CODE39', 'SUPER MARIO LARGE FIGURE SPECIAL', 18000, 18000, 13, 57, 1, 1, 1, 0, '1', '19422725SUPER MARIO.jpg', NULL, 0, 0, 1, '2021-08-27 17:26:02.000000', '2021-08-27 17:26:02.000000', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `name` varchar(192) DEFAULT NULL,
  `qty` decimal(8,2) DEFAULT '0.00',
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product_variants`
--

INSERT INTO `product_variants` (`id`, `product_id`, `name`, `qty`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 8, 'Daniel Womwn Brown', 0.00, '2021-08-27 12:41:07.000000', '2021-08-27 12:41:56.000000', '2021-08-27 12:41:56');

-- --------------------------------------------------------

--
-- Table structure for table `product_warehouse`
--

CREATE TABLE `product_warehouse` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `warehouse_id` int(11) NOT NULL,
  `product_variant_id` int(11) DEFAULT NULL,
  `qte` double NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product_warehouse`
--

INSERT INTO `product_warehouse` (`id`, `product_id`, `warehouse_id`, `product_variant_id`, `qte`, `created_at`, `updated_at`, `deleted_at`) VALUES
(7, 3, 1, NULL, 11, NULL, '2021-08-28 01:27:40.000000', NULL),
(8, 3, 2, NULL, 100, NULL, '2021-08-28 01:14:34.000000', NULL),
(9, 3, 3, NULL, 0, NULL, NULL, NULL),
(10, 4, 1, NULL, 9, NULL, '2021-08-29 05:23:07.000000', NULL),
(11, 4, 2, NULL, 100, NULL, '2021-08-28 01:14:34.000000', NULL),
(12, 4, 3, NULL, 0, NULL, NULL, NULL),
(13, 5, 1, NULL, 0, NULL, NULL, NULL),
(14, 5, 2, NULL, 15, NULL, '2021-08-28 01:16:29.000000', NULL),
(15, 5, 3, NULL, 0, NULL, NULL, NULL),
(16, 6, 1, NULL, 2, NULL, '2021-08-29 05:23:07.000000', NULL),
(17, 6, 2, NULL, 105, NULL, '2021-08-29 05:00:22.000000', NULL),
(18, 6, 3, NULL, 0, NULL, NULL, NULL),
(19, 7, 1, NULL, 0, NULL, NULL, NULL),
(20, 7, 2, NULL, 7, NULL, '2021-08-29 05:00:22.000000', NULL),
(21, 7, 3, NULL, 0, NULL, NULL, NULL),
(22, 8, 1, NULL, -1, NULL, '2021-08-28 01:38:26.000000', '2021-08-27 12:41:07'),
(23, 8, 2, NULL, -2, NULL, '2021-08-29 05:00:22.000000', '2021-08-27 12:41:07'),
(24, 8, 3, NULL, 0, NULL, '2021-08-27 12:41:07.000000', '2021-08-27 12:41:07'),
(25, 8, 1, 1, 0, NULL, '2021-08-27 12:41:56.000000', '2021-08-27 12:41:56'),
(26, 8, 2, 1, 0, NULL, '2021-08-27 12:41:56.000000', '2021-08-27 12:41:56'),
(27, 8, 3, 1, 0, NULL, '2021-08-27 12:41:56.000000', '2021-08-27 12:41:56'),
(28, 8, 1, NULL, 6, NULL, '2021-08-28 01:27:40.000000', NULL),
(29, 8, 2, NULL, 4, NULL, '2021-08-28 01:16:29.000000', NULL),
(30, 8, 3, NULL, 0, NULL, NULL, NULL),
(31, 9, 1, NULL, 7, NULL, '2021-08-28 01:27:40.000000', NULL),
(32, 9, 2, NULL, 0, NULL, NULL, NULL),
(33, 9, 3, NULL, 0, NULL, NULL, NULL),
(34, 10, 1, NULL, 5, NULL, '2021-08-29 05:23:07.000000', NULL),
(35, 10, 2, NULL, 100, NULL, '2021-08-28 01:14:34.000000', NULL),
(36, 10, 3, NULL, 0, NULL, NULL, NULL),
(37, 11, 1, NULL, 6, NULL, '2021-08-28 01:27:40.000000', NULL),
(38, 11, 2, NULL, 10, NULL, '2021-08-28 01:14:34.000000', NULL),
(39, 11, 3, NULL, 0, NULL, NULL, NULL),
(40, 12, 1, NULL, 20, NULL, '2021-08-28 01:27:40.000000', NULL),
(41, 12, 2, NULL, 50, NULL, '2021-08-28 01:14:34.000000', NULL),
(42, 12, 3, NULL, 0, NULL, NULL, NULL),
(43, 13, 1, NULL, 0, NULL, NULL, NULL),
(44, 13, 2, NULL, 0, NULL, NULL, NULL),
(45, 13, 3, NULL, 0, NULL, NULL, NULL),
(46, 14, 1, NULL, 0, NULL, NULL, NULL),
(47, 14, 2, NULL, 0, NULL, NULL, NULL),
(48, 14, 3, NULL, 0, NULL, NULL, NULL),
(49, 15, 1, NULL, 0, NULL, NULL, NULL),
(50, 15, 2, NULL, 12, NULL, '2021-08-28 01:14:34.000000', NULL),
(51, 15, 3, NULL, 0, NULL, NULL, NULL),
(52, 16, 1, NULL, 0, NULL, NULL, NULL),
(53, 16, 2, NULL, 14, NULL, '2021-08-28 01:14:34.000000', NULL),
(54, 16, 3, NULL, 0, NULL, NULL, NULL),
(55, 16, 4, NULL, 0, NULL, NULL, NULL),
(56, 16, 5, NULL, 0, NULL, NULL, NULL),
(57, 16, 6, NULL, 5, NULL, '2021-08-28 01:30:34.000000', NULL),
(58, 16, 7, NULL, 0, NULL, NULL, NULL),
(59, 16, 8, NULL, 0, NULL, NULL, NULL),
(60, 16, 9, NULL, 0, NULL, NULL, NULL),
(61, 17, 1, NULL, 0, NULL, NULL, NULL),
(62, 17, 2, NULL, 0, NULL, NULL, NULL),
(63, 17, 3, NULL, 0, NULL, NULL, NULL),
(64, 17, 4, NULL, 0, NULL, NULL, NULL),
(65, 17, 5, NULL, 0, NULL, NULL, NULL),
(66, 17, 6, NULL, 0, NULL, NULL, NULL),
(67, 17, 7, NULL, 0, NULL, NULL, NULL),
(68, 17, 8, NULL, 0, NULL, NULL, NULL),
(69, 17, 9, NULL, 8, NULL, '2021-08-29 05:23:31.000000', NULL),
(70, 18, 1, NULL, 0, NULL, NULL, NULL),
(71, 18, 2, NULL, 0, NULL, NULL, NULL),
(72, 18, 3, NULL, 0, NULL, NULL, NULL),
(73, 18, 4, NULL, 0, NULL, NULL, NULL),
(74, 18, 5, NULL, 0, NULL, NULL, NULL),
(75, 18, 6, NULL, 0, NULL, NULL, NULL),
(76, 18, 7, NULL, 0, NULL, NULL, NULL),
(77, 18, 8, NULL, 0, NULL, NULL, NULL),
(78, 18, 9, NULL, 0, NULL, NULL, NULL),
(79, 19, 1, NULL, 0, NULL, NULL, NULL),
(80, 19, 2, NULL, 0, NULL, NULL, NULL),
(81, 19, 3, NULL, 0, NULL, NULL, NULL),
(82, 19, 4, NULL, 0, NULL, NULL, NULL),
(83, 19, 5, NULL, 0, NULL, NULL, NULL),
(84, 19, 6, NULL, 0, NULL, NULL, NULL),
(85, 19, 7, NULL, 0, NULL, NULL, NULL),
(86, 19, 8, NULL, 0, NULL, NULL, NULL),
(87, 19, 9, NULL, 7, NULL, '2021-08-28 01:31:13.000000', NULL),
(88, 20, 1, NULL, 10, NULL, '2021-08-28 01:27:40.000000', NULL),
(89, 20, 2, NULL, 0, NULL, NULL, NULL),
(90, 20, 3, NULL, 0, NULL, NULL, NULL),
(91, 20, 4, NULL, 0, NULL, NULL, NULL),
(92, 20, 5, NULL, 1, NULL, '2021-08-29 05:19:02.000000', NULL),
(93, 20, 6, NULL, 0, NULL, NULL, NULL),
(94, 20, 7, NULL, 0, NULL, NULL, NULL),
(95, 20, 8, NULL, 0, NULL, NULL, NULL),
(96, 20, 9, NULL, 0, NULL, NULL, NULL),
(97, 21, 1, NULL, 0, NULL, NULL, NULL),
(98, 21, 2, NULL, 0, NULL, NULL, NULL),
(99, 21, 3, NULL, 0, NULL, NULL, NULL),
(100, 21, 4, NULL, 0, NULL, NULL, NULL),
(101, 21, 5, NULL, 0, NULL, NULL, NULL),
(102, 21, 6, NULL, 0, NULL, NULL, NULL),
(103, 21, 7, NULL, 0, NULL, NULL, NULL),
(104, 21, 8, NULL, 0, NULL, NULL, NULL),
(105, 21, 9, NULL, 0, NULL, NULL, NULL),
(106, 22, 1, NULL, 0, NULL, NULL, NULL),
(107, 22, 2, NULL, 0, NULL, NULL, NULL),
(108, 22, 3, NULL, 0, NULL, NULL, NULL),
(109, 22, 4, NULL, 0, NULL, NULL, NULL),
(110, 22, 5, NULL, 0, NULL, NULL, NULL),
(111, 22, 6, NULL, 0, NULL, NULL, NULL),
(112, 22, 7, NULL, 0, NULL, NULL, NULL),
(113, 22, 8, NULL, 0, NULL, NULL, NULL),
(114, 22, 9, NULL, 0, NULL, NULL, NULL),
(115, 23, 1, NULL, 0, NULL, NULL, NULL),
(116, 23, 2, NULL, 0, NULL, NULL, NULL),
(117, 23, 3, NULL, 0, NULL, NULL, NULL),
(118, 23, 4, NULL, 0, NULL, NULL, NULL),
(119, 23, 5, NULL, 0, NULL, NULL, NULL),
(120, 23, 6, NULL, 12, NULL, '2021-08-28 01:30:34.000000', NULL),
(121, 23, 7, NULL, 0, NULL, NULL, NULL),
(122, 23, 8, NULL, 0, NULL, NULL, NULL),
(123, 23, 9, NULL, 0, NULL, NULL, NULL),
(124, 24, 1, NULL, 0, NULL, NULL, NULL),
(125, 24, 2, NULL, 0, NULL, NULL, NULL),
(126, 24, 3, NULL, 0, NULL, NULL, NULL),
(127, 24, 4, NULL, 0, NULL, NULL, NULL),
(128, 24, 5, NULL, 0, NULL, NULL, NULL),
(129, 24, 6, NULL, 10, NULL, '2021-08-28 01:30:34.000000', NULL),
(130, 24, 7, NULL, 0, NULL, NULL, NULL),
(131, 24, 8, NULL, 0, NULL, NULL, NULL),
(132, 24, 9, NULL, 0, NULL, NULL, NULL),
(133, 25, 1, NULL, 0, NULL, NULL, NULL),
(134, 25, 2, NULL, 0, NULL, NULL, NULL),
(135, 25, 3, NULL, 0, NULL, NULL, NULL),
(136, 25, 4, NULL, 0, NULL, NULL, NULL),
(137, 25, 5, NULL, 0, NULL, NULL, NULL),
(138, 25, 6, NULL, 0, NULL, NULL, NULL),
(139, 25, 7, NULL, 0, NULL, NULL, NULL),
(140, 25, 8, NULL, 0, NULL, NULL, NULL),
(141, 25, 9, NULL, 0, NULL, NULL, NULL),
(142, 26, 1, NULL, 0, NULL, NULL, NULL),
(143, 26, 2, NULL, 0, NULL, NULL, NULL),
(144, 26, 3, NULL, 0, NULL, NULL, NULL),
(145, 26, 4, NULL, 0, NULL, NULL, NULL),
(146, 26, 5, NULL, 0, NULL, NULL, NULL),
(147, 26, 6, NULL, 0, NULL, NULL, NULL),
(148, 26, 7, NULL, 0, NULL, NULL, NULL),
(149, 26, 8, NULL, 0, NULL, NULL, NULL),
(150, 26, 9, NULL, 0, NULL, NULL, NULL),
(151, 27, 1, NULL, 0, NULL, NULL, NULL),
(152, 27, 2, NULL, 0, NULL, NULL, NULL),
(153, 27, 3, NULL, 0, NULL, NULL, NULL),
(154, 27, 4, NULL, 0, NULL, NULL, NULL),
(155, 27, 5, NULL, 0, NULL, NULL, NULL),
(156, 27, 6, NULL, 0, NULL, NULL, NULL),
(157, 27, 7, NULL, 0, NULL, NULL, NULL),
(158, 27, 8, NULL, 0, NULL, NULL, NULL),
(159, 27, 9, NULL, 0, NULL, NULL, NULL),
(160, 28, 1, NULL, 0, NULL, NULL, NULL),
(161, 28, 2, NULL, 0, NULL, NULL, NULL),
(162, 28, 3, NULL, 0, NULL, NULL, NULL),
(163, 28, 4, NULL, 0, NULL, NULL, NULL),
(164, 28, 5, NULL, 1, NULL, '2021-08-29 05:19:02.000000', NULL),
(165, 28, 6, NULL, 0, NULL, NULL, NULL),
(166, 28, 7, NULL, 0, NULL, NULL, NULL),
(167, 28, 8, NULL, 0, NULL, NULL, NULL),
(168, 28, 9, NULL, 0, NULL, NULL, NULL),
(169, 29, 1, NULL, 6, NULL, '2021-08-28 01:27:40.000000', NULL),
(170, 29, 2, NULL, 0, NULL, NULL, NULL),
(171, 29, 3, NULL, 0, NULL, NULL, NULL),
(172, 29, 4, NULL, 0, NULL, NULL, NULL),
(173, 29, 5, NULL, 0, NULL, NULL, NULL),
(174, 29, 6, NULL, 0, NULL, NULL, NULL),
(175, 29, 7, NULL, 0, NULL, NULL, NULL),
(176, 29, 8, NULL, 0, NULL, NULL, NULL),
(177, 29, 9, NULL, 0, NULL, NULL, NULL),
(178, 30, 1, NULL, 0, NULL, NULL, NULL),
(179, 30, 2, NULL, 0, NULL, NULL, NULL),
(180, 30, 3, NULL, 0, NULL, NULL, NULL),
(181, 30, 4, NULL, 0, NULL, NULL, NULL),
(182, 30, 5, NULL, 0, NULL, NULL, NULL),
(183, 30, 6, NULL, 0, NULL, NULL, NULL),
(184, 30, 7, NULL, 0, NULL, NULL, NULL),
(185, 30, 8, NULL, 0, NULL, NULL, NULL),
(186, 30, 9, NULL, 0, NULL, NULL, NULL),
(187, 31, 1, NULL, 100, NULL, '2021-08-28 01:27:40.000000', NULL),
(188, 31, 2, NULL, 0, NULL, NULL, NULL),
(189, 31, 3, NULL, 0, NULL, NULL, NULL),
(190, 31, 4, NULL, 0, NULL, NULL, NULL),
(191, 31, 5, NULL, 0, NULL, NULL, NULL),
(192, 31, 6, NULL, 0, NULL, NULL, NULL),
(193, 31, 7, NULL, 0, NULL, NULL, NULL),
(194, 31, 8, NULL, 0, NULL, NULL, NULL),
(195, 31, 9, NULL, 0, NULL, NULL, NULL),
(196, 32, 1, NULL, 50, NULL, '2021-08-28 01:27:40.000000', NULL),
(197, 32, 2, NULL, 0, NULL, NULL, NULL),
(198, 32, 3, NULL, 0, NULL, NULL, NULL),
(199, 32, 4, NULL, 0, NULL, NULL, NULL),
(200, 32, 5, NULL, 0, NULL, NULL, NULL),
(201, 32, 6, NULL, 0, NULL, NULL, NULL),
(202, 32, 7, NULL, 0, NULL, NULL, NULL),
(203, 32, 8, NULL, 0, NULL, NULL, NULL),
(204, 32, 9, NULL, 0, NULL, NULL, NULL),
(205, 33, 1, NULL, 0, NULL, NULL, NULL),
(206, 33, 2, NULL, 0, NULL, NULL, NULL),
(207, 33, 3, NULL, 9, NULL, '2021-08-28 01:56:59.000000', NULL),
(208, 33, 4, NULL, 0, NULL, NULL, NULL),
(209, 33, 5, NULL, 0, NULL, NULL, NULL),
(210, 33, 6, NULL, 0, NULL, NULL, NULL),
(211, 33, 7, NULL, 0, NULL, NULL, NULL),
(212, 33, 8, NULL, 0, NULL, NULL, NULL),
(213, 33, 9, NULL, 0, NULL, NULL, NULL),
(214, 34, 1, NULL, 0, NULL, NULL, NULL),
(215, 34, 2, NULL, 0, NULL, NULL, NULL),
(216, 34, 3, NULL, 4, NULL, '2021-08-28 01:56:59.000000', NULL),
(217, 34, 4, NULL, 0, NULL, NULL, NULL),
(218, 34, 5, NULL, 0, NULL, NULL, NULL),
(219, 34, 6, NULL, 0, NULL, NULL, NULL),
(220, 34, 7, NULL, 0, NULL, NULL, NULL),
(221, 34, 8, NULL, 0, NULL, NULL, NULL),
(222, 34, 9, NULL, 0, NULL, NULL, NULL),
(223, 35, 1, NULL, 30, NULL, '2021-08-28 01:27:40.000000', NULL),
(224, 35, 2, NULL, 0, NULL, NULL, NULL),
(225, 35, 3, NULL, 0, NULL, NULL, NULL),
(226, 35, 4, NULL, 0, NULL, NULL, NULL),
(227, 35, 5, NULL, 0, NULL, NULL, NULL),
(228, 35, 6, NULL, 0, NULL, NULL, NULL),
(229, 35, 7, NULL, 0, NULL, NULL, NULL),
(230, 35, 8, NULL, 0, NULL, NULL, NULL),
(231, 35, 9, NULL, 0, NULL, NULL, NULL),
(232, 36, 1, NULL, 0, NULL, NULL, NULL),
(233, 36, 2, NULL, 0, NULL, NULL, NULL),
(234, 36, 3, NULL, 0, NULL, NULL, NULL),
(235, 36, 4, NULL, 0, NULL, NULL, NULL),
(236, 36, 5, NULL, 0, NULL, NULL, NULL),
(237, 36, 6, NULL, 0, NULL, NULL, NULL),
(238, 36, 7, NULL, 0, NULL, NULL, NULL),
(239, 36, 8, NULL, 0, NULL, NULL, NULL),
(240, 36, 9, NULL, 0, NULL, NULL, NULL),
(241, 37, 1, NULL, 0, NULL, NULL, NULL),
(242, 37, 2, NULL, 0, NULL, NULL, NULL),
(243, 37, 3, NULL, 0, NULL, NULL, NULL),
(244, 37, 4, NULL, 0, NULL, NULL, NULL),
(245, 37, 5, NULL, 0, NULL, NULL, NULL),
(246, 37, 6, NULL, 0, NULL, NULL, NULL),
(247, 37, 7, NULL, 0, NULL, NULL, NULL),
(248, 37, 8, NULL, 0, NULL, NULL, NULL),
(249, 37, 9, NULL, 0, NULL, NULL, NULL),
(250, 38, 1, NULL, 0, NULL, NULL, NULL),
(251, 38, 2, NULL, 8, NULL, '2021-08-28 01:14:34.000000', NULL),
(252, 38, 3, NULL, 0, NULL, NULL, NULL),
(253, 38, 4, NULL, 0, NULL, NULL, NULL),
(254, 38, 5, NULL, 0, NULL, NULL, NULL),
(255, 38, 6, NULL, 0, NULL, NULL, NULL),
(256, 38, 7, NULL, 0, NULL, NULL, NULL),
(257, 38, 8, NULL, 0, NULL, NULL, NULL),
(258, 38, 9, NULL, 0, NULL, NULL, NULL),
(259, 39, 1, NULL, 0, NULL, NULL, NULL),
(260, 39, 2, NULL, 0, NULL, NULL, NULL),
(261, 39, 3, NULL, 0, NULL, NULL, NULL),
(262, 39, 4, NULL, 0, NULL, NULL, NULL),
(263, 39, 5, NULL, 0, NULL, NULL, NULL),
(264, 39, 6, NULL, 0, NULL, NULL, NULL),
(265, 39, 7, NULL, 0, NULL, NULL, NULL),
(266, 39, 8, NULL, 0, NULL, NULL, NULL),
(267, 39, 9, NULL, 0, NULL, NULL, NULL),
(268, 40, 1, NULL, 0, NULL, NULL, NULL),
(269, 40, 2, NULL, 0, NULL, NULL, NULL),
(270, 40, 3, NULL, 11, NULL, '2021-08-28 01:56:59.000000', NULL),
(271, 40, 4, NULL, 0, NULL, NULL, NULL),
(272, 40, 5, NULL, 0, NULL, NULL, NULL),
(273, 40, 6, NULL, 0, NULL, NULL, NULL),
(274, 40, 7, NULL, 0, NULL, NULL, NULL),
(275, 40, 8, NULL, 0, NULL, NULL, NULL),
(276, 40, 9, NULL, 0, NULL, NULL, NULL),
(277, 41, 1, NULL, 0, NULL, NULL, NULL),
(278, 41, 2, NULL, 0, NULL, NULL, NULL),
(279, 41, 3, NULL, 0, NULL, NULL, NULL),
(280, 41, 4, NULL, 0, NULL, NULL, NULL),
(281, 41, 5, NULL, 0, NULL, NULL, NULL),
(282, 41, 6, NULL, 0, NULL, NULL, NULL),
(283, 41, 7, NULL, 0, NULL, NULL, NULL),
(284, 41, 8, NULL, 0, NULL, NULL, NULL),
(285, 41, 9, NULL, 0, NULL, NULL, NULL),
(286, 42, 1, NULL, 20, NULL, '2021-08-28 01:27:40.000000', NULL),
(287, 42, 2, NULL, 10, NULL, '2021-08-28 01:16:29.000000', NULL),
(288, 42, 3, NULL, 0, NULL, NULL, NULL),
(289, 42, 4, NULL, 0, NULL, NULL, NULL),
(290, 42, 5, NULL, 0, NULL, NULL, NULL),
(291, 42, 6, NULL, 0, NULL, NULL, NULL),
(292, 42, 7, NULL, 0, NULL, NULL, NULL),
(293, 42, 8, NULL, 0, NULL, NULL, NULL),
(294, 42, 9, NULL, 0, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `providers`
--

CREATE TABLE `providers` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `code` int(11) NOT NULL,
  `email` varchar(192) NOT NULL,
  `phone` varchar(192) NOT NULL,
  `country` varchar(191) NOT NULL,
  `city` varchar(191) NOT NULL,
  `adresse` varchar(191) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `providers`
--

INSERT INTO `providers` (`id`, `name`, `code`, `email`, `phone`, `country`, `city`, `adresse`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Shopini', 1, 'imran@shopini.com', '1234568789', 'IRAQ', 'Basra', 'Basra Central', '2021-08-10 04:01:56.000000', '2021-08-10 04:01:56.000000', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `province`
--

CREATE TABLE `province` (
  `city_id` int(11) DEFAULT NULL,
  `province_id` int(11) DEFAULT NULL,
  `province_name_eng` varchar(18) CHARACTER SET utf8 DEFAULT NULL,
  `province_ar` varchar(13) CHARACTER SET utf8 DEFAULT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `province`
--

INSERT INTO `province` (`city_id`, `province_id`, `province_name_eng`, `province_ar`, `id`) VALUES
(21, 52, 'Z-Shopini', 'شركة شوبيني', 1),
(18, 57, 'Other', 'اخرى', 2),
(18, 27, 'City center', 'مركز المدينة', 3),
(18, 79, 'Other area', 'مناطق اخرى', 4),
(17, 58, 'Other', 'اخرى', 5),
(17, 78, 'Other area', 'مناطق اخرى', 6),
(17, 28, 'City center', 'مركز المدينة', 7),
(16, 59, 'Other', 'اخرى', 8),
(16, 77, 'Other area', 'مناطق اخرى', 9),
(16, 29, 'City center', 'مركز المدينة', 10),
(15, 60, 'Other', 'اخرى', 11),
(15, 76, 'Other area', 'مناطق اخرى', 12),
(15, 18, 'City center', 'مركز المدينة', 13),
(14, 61, 'Other', 'اخرى', 14),
(14, 75, 'Other area', 'مناطق اخرى', 15),
(14, 17, 'City center', 'مركز المدينة', 16),
(13, 62, 'Other', 'اخرى', 17),
(13, 74, 'Other area', 'مناطق اخرى', 18),
(13, 16, 'City center', 'مركز المدينة', 19),
(12, 63, 'Other', 'اخرى', 20),
(12, 73, 'Other area', 'مناطق اخرى', 21),
(12, 15, 'City center', 'مركز المدينة', 22),
(11, 64, 'Other', 'اخرى', 23),
(11, 72, 'Other area', 'مناطق اخرى', 24),
(11, 6, 'City center', 'مركز المدينة', 25),
(10, 30, 'Mosul', 'الموصل', 26),
(10, 82, 'Other', 'اخرى', 27),
(9, 65, 'Other', 'اخرى', 28),
(9, 71, 'Other area', 'مناطق اخرى', 29),
(9, 14, 'City center', 'مركز المدينة', 30),
(8, 66, 'Other', 'اخرى', 31),
(8, 70, 'Other area', 'مناطق اخرى', 32),
(8, 13, 'City center', 'مركز المدينة', 33),
(7, 67, 'Other', 'اخرى', 34),
(7, 69, 'Other area', 'مناطق اخرى', 35),
(7, 12, 'City center', 'مركز المدينة', 36),
(6, 56, 'Other', 'اخرى', 37),
(6, 80, 'Other area', 'مناطق اخرى', 38),
(6, 11, 'City center', 'مركز المدينة', 39),
(5, 55, 'Other', 'اخرى', 40),
(5, 68, 'Other area', 'اخرى', 41),
(5, 9, 'City center', 'مركز المدينة', 42),
(4, 81, 'Other', 'اخرى', 43),
(4, 8, 'Anbar', 'الانبار', 44),
(3, 54, 'Other', 'اخرى', 45),
(3, 7, 'City center', 'مركز المدينة', 46),
(2, 31, 'City center Basrah', 'مركز البصرة', 47),
(2, 32, 'Safwan', 'سفوان', 48),
(2, 33, 'Um Qasr', 'ام قصر', 49),
(2, 34, 'Zubair', 'الزبير', 50),
(2, 35, 'Al-haritha', 'الهارثة', 51),
(2, 39, 'Other area', 'اقضية ونواحي', 52),
(2, 36, 'al-karma', 'الكرمة', 53),
(2, 37, 'Al-mudinuh', 'المدينه', 54),
(2, 38, 'abu alkhasib', 'ابو الخصيب', 55),
(1, 4, 'City Center Bag', 'مركز المدينة', 56),
(1, 53, 'Other area', 'اقضية النواحي', 57),
(1, 44, 'Hosseinieh', 'الحسينيه', 58),
(1, 43, 'Latifiyah', 'اللطيفية', 59),
(1, 42, 'Mahmudiyah', 'المحمودية', 60);

-- --------------------------------------------------------

--
-- Table structure for table `purchases`
--

CREATE TABLE `purchases` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `Ref` varchar(192) NOT NULL,
  `date` date NOT NULL,
  `provider_id` int(11) NOT NULL,
  `warehouse_id` int(11) NOT NULL,
  `tax_rate` double DEFAULT '0',
  `TaxNet` double DEFAULT '0',
  `discount` double DEFAULT '0',
  `shipping` double DEFAULT '0',
  `GrandTotal` double NOT NULL,
  `paid_amount` double NOT NULL DEFAULT '0',
  `statut` varchar(191) NOT NULL,
  `payment_statut` varchar(192) NOT NULL,
  `notes` text,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `purchases`
--

INSERT INTO `purchases` (`id`, `user_id`, `Ref`, `date`, `provider_id`, `warehouse_id`, `tax_rate`, `TaxNet`, `discount`, `shipping`, `GrandTotal`, `paid_amount`, `statut`, `payment_statut`, `notes`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'PR_1111', '2021-08-01', 1, 1, 0, 0, 0, 0, 2850000, 0, 'received', 'unpaid', NULL, '2021-08-11 07:51:21.000000', '2021-08-11 07:51:21.000000', NULL),
(2, 1, 'PR_1112', '2021-08-11', 1, 1, 0, 0, 0, 0, 2250000000, 0, 'received', 'unpaid', NULL, '2021-08-11 09:44:30.000000', '2021-08-11 09:44:30.000000', NULL),
(3, 1, 'PR_1113', '2021-08-11', 1, 1, 0, 0, 0, 0, 600000, 0, 'received', 'unpaid', NULL, '2021-08-11 09:49:18.000000', '2021-08-11 09:49:18.000000', NULL),
(4, 2, 'PR_1114', '2021-08-26', 1, 1, 0, 0, 0, 5, 8763055, 0, 'received', 'unpaid', NULL, '2021-08-26 07:03:00.000000', '2021-08-28 01:27:40.000000', NULL),
(5, 1, 'PR_1115', '2021-08-28', 1, 2, 0, 0, 0, 0, 16270000, 0, 'received', 'unpaid', NULL, '2021-08-28 01:14:34.000000', '2021-08-28 01:14:34.000000', NULL),
(6, 1, 'PR_1116', '2021-08-28', 1, 2, 0, 0, 0, 0, 307500, 0, 'received', 'unpaid', NULL, '2021-08-28 01:16:29.000000', '2021-08-28 01:16:29.000000', NULL),
(7, 1, 'PR_1117', '2021-08-28', 1, 3, 0, 0, 0, 0, 167500, 0, 'received', 'unpaid', NULL, '2021-08-28 01:28:51.000000', '2021-08-28 01:28:51.000000', NULL),
(8, 1, 'PR_1118', '2021-08-28', 1, 6, 0, 0, 0, 0, 299500, 0, 'received', 'unpaid', NULL, '2021-08-28 01:30:34.000000', '2021-08-28 01:30:34.000000', NULL),
(9, 1, 'PR_1119', '2021-08-28', 1, 9, 0, 0, 0, 0, 199000, 0, 'received', 'unpaid', NULL, '2021-08-28 01:31:13.000000', '2021-08-28 01:31:13.000000', NULL),
(10, 1, 'PR_1120', '2021-08-29', 1, 5, 0, 0, 0, 0, 56900, 0, 'received', 'unpaid', NULL, '2021-08-29 05:19:02.000000', '2021-08-29 05:19:02.000000', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `purchase_details`
--

CREATE TABLE `purchase_details` (
  `id` int(11) NOT NULL,
  `cost` double NOT NULL,
  `TaxNet` double DEFAULT '0',
  `tax_method` varchar(192) DEFAULT '1',
  `discount` double DEFAULT '0',
  `discount_method` varchar(192) DEFAULT '1',
  `purchase_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_variant_id` int(11) DEFAULT NULL,
  `total` double NOT NULL,
  `quantity` double NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `purchase_details`
--

INSERT INTO `purchase_details` (`id`, `cost`, `TaxNet`, `tax_method`, `discount`, `discount_method`, `purchase_id`, `product_id`, `product_variant_id`, `total`, `quantity`, `created_at`, `updated_at`) VALUES
(1, 4500, 0, '1', 0, '2', 5, 3, NULL, 450000, 100, NULL, NULL),
(2, 9500, 0, '1', 0, '2', 5, 4, NULL, 950000, 100, NULL, NULL),
(3, 2500, 0, '1', 0, '2', 5, 6, NULL, 250000, 100, NULL, NULL),
(4, 250, 0, '1', 0, '2', 5, 10, NULL, 25000, 100, NULL, NULL),
(5, 1020000, 0, '1', 0, '2', 5, 11, NULL, 10200000, 10, NULL, NULL),
(6, 50000, 0, '1', 0, '2', 5, 12, NULL, 2500000, 50, NULL, NULL),
(7, 1000, 0, '1', 0, '2', 5, 5, NULL, 5000, 5, NULL, NULL),
(8, 35000, 0, '1', 0, '2', 5, 15, NULL, 420000, 12, NULL, NULL),
(9, 45000, 0, '1', 0, '2', 5, 16, NULL, 630000, 14, NULL, NULL),
(10, 105000, 0, '1', 0, '2', 5, 38, NULL, 840000, 8, NULL, NULL),
(11, 1000, 0, '1', 0, '2', 6, 5, NULL, 10000, 10, NULL, NULL),
(12, 18000, 0, '1', 0, '2', 6, 42, NULL, 180000, 10, NULL, NULL),
(13, 2500, 0, '1', 0, '2', 6, 7, NULL, 20000, 8, NULL, NULL),
(14, 2500, 0, '1', 0, '2', 6, 6, NULL, 17500, 7, NULL, NULL),
(15, 20000, 0, '1', 0, '2', 6, 8, NULL, 80000, 4, NULL, NULL),
(16, 4500, 0, '1', 0, '2', 4, 3, NULL, 49500, 11, '2021-08-28 01:27:07.000000', '2021-08-28 01:27:40.000000'),
(17, 9500, 0, '1', 0, '2', 4, 4, NULL, 123500, 13, '2021-08-28 01:27:07.000000', '2021-08-28 01:27:40.000000'),
(18, 2500, 0, '1', 0, '2', 4, 6, NULL, 22500, 9, '2021-08-28 01:27:07.000000', '2021-08-28 01:27:40.000000'),
(19, 250, 0, '1', 0, '2', 4, 10, NULL, 1750, 7, '2021-08-28 01:27:07.000000', '2021-08-28 01:27:40.000000'),
(20, 20000, 0, '1', 0, '2', 4, 8, NULL, 120000, 6, '2021-08-28 01:27:07.000000', '2021-08-28 01:27:40.000000'),
(21, 10000, 0, '1', 0, '2', 4, 9, NULL, 70000, 7, '2021-08-28 01:27:07.000000', '2021-08-28 01:27:40.000000'),
(22, 1020000, 0, '1', 0, '2', 4, 11, NULL, 6120000, 6, '2021-08-28 01:27:07.000000', '2021-08-28 01:27:40.000000'),
(23, 50000, 0, '1', 0, '2', 4, 12, NULL, 1000000, 20, '2021-08-28 01:27:07.000000', '2021-08-28 01:27:40.000000'),
(24, 18000, 0, '1', 0, '2', 4, 42, NULL, 360000, 20, '2021-08-28 01:27:07.000000', '2021-08-28 01:27:40.000000'),
(25, 1800, 0, '1', 0, '2', 4, 29, NULL, 10800, 6, '2021-08-28 01:27:07.000000', '2021-08-28 01:27:40.000000'),
(26, 1800, 0, '1', 0, '2', 4, 31, NULL, 180000, 100, '2021-08-28 01:27:07.000000', '2021-08-28 01:27:40.000000'),
(27, 2200, 0, '1', 0, '2', 4, 32, NULL, 110000, 50, '2021-08-28 01:27:07.000000', '2021-08-28 01:27:40.000000'),
(28, 1500, 0, '1', 0, '2', 4, 35, NULL, 45000, 30, '2021-08-28 01:27:07.000000', '2021-08-28 01:27:40.000000'),
(29, 55000, 0, '1', 0, '2', 4, 20, NULL, 550000, 10, '2021-08-28 01:27:07.000000', '2021-08-28 01:27:40.000000'),
(30, 2500, 0, '1', 0, '2', 7, 40, NULL, 32500, 13, NULL, NULL),
(31, 1500, 0, '1', 0, '2', 7, 33, NULL, 15000, 10, NULL, NULL),
(32, 20000, 0, '1', 0, '2', 7, 34, NULL, 120000, 6, NULL, NULL),
(33, 6000, 0, '1', 0, '2', 8, 23, NULL, 72000, 12, NULL, NULL),
(34, 45000, 0, '1', 0, '2', 8, 16, NULL, 225000, 5, NULL, NULL),
(35, 250, 0, '1', 0, '2', 8, 24, NULL, 2500, 10, NULL, NULL),
(36, 8000, 0, '1', 0, '2', 9, 17, NULL, 80000, 10, NULL, NULL),
(37, 17000, 0, '1', 0, '2', 9, 19, NULL, 119000, 7, NULL, NULL),
(38, 1900, 0, '1', 0, '2', 10, 28, NULL, 1900, 1, NULL, NULL),
(39, 55000, 0, '1', 0, '2', 10, 20, NULL, 55000, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `purchase_returns`
--

CREATE TABLE `purchase_returns` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `Ref` varchar(192) NOT NULL,
  `provider_id` int(11) NOT NULL,
  `warehouse_id` int(11) NOT NULL,
  `tax_rate` double DEFAULT '0',
  `TaxNet` double DEFAULT '0',
  `discount` double DEFAULT '0',
  `shipping` double DEFAULT '0',
  `GrandTotal` double NOT NULL,
  `paid_amount` double NOT NULL DEFAULT '0',
  `payment_statut` varchar(192) NOT NULL,
  `statut` varchar(192) NOT NULL,
  `notes` text,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_return_details`
--

CREATE TABLE `purchase_return_details` (
  `id` int(11) NOT NULL,
  `cost` decimal(10,0) NOT NULL,
  `TaxNet` double DEFAULT '0',
  `tax_method` varchar(192) DEFAULT '1',
  `discount` double DEFAULT '0',
  `discount_method` varchar(192) DEFAULT '1',
  `total` double NOT NULL,
  `quantity` double NOT NULL,
  `purchase_return_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_variant_id` int(11) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `quotations`
--

CREATE TABLE `quotations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `Ref` varchar(192) NOT NULL,
  `client_id` int(11) NOT NULL,
  `warehouse_id` int(11) NOT NULL,
  `tax_rate` double DEFAULT '0',
  `TaxNet` double DEFAULT '0',
  `discount` double DEFAULT '0',
  `shipping` double DEFAULT '0',
  `GrandTotal` double NOT NULL,
  `statut` varchar(192) NOT NULL,
  `notes` text,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `quotation_details`
--

CREATE TABLE `quotation_details` (
  `id` int(11) NOT NULL,
  `price` double NOT NULL,
  `TaxNet` double DEFAULT '0',
  `tax_method` varchar(192) DEFAULT '1',
  `discount` double DEFAULT '0',
  `discount_method` varchar(192) DEFAULT '1',
  `total` double NOT NULL,
  `quantity` double NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_variant_id` int(11) DEFAULT NULL,
  `quotation_id` int(11) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(192) NOT NULL,
  `label` varchar(192) DEFAULT NULL,
  `description` text,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `label`, `description`, `created_at`, `updated_at`, `deleted_at`, `status`) VALUES
(1, 'Owner', 'Owner', 'Owner', NULL, NULL, NULL, 1),
(2, 'sales', 'sales', 'sales', '2021-08-11 04:49:02.000000', '2021-08-11 04:51:03.000000', NULL, 1),
(3, 'Owner', 'Owner', 'Owner', NULL, NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `role_user`
--

CREATE TABLE `role_user` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `role_user`
--

INSERT INTO `role_user` (`id`, `user_id`, `role_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, NULL, NULL),
(2, 2, 2, '2021-08-11 04:50:13.000000', '2021-08-11 04:50:13.000000'),
(3, 3, 3, '2021-08-11 04:50:13.000000', '2021-08-11 04:50:13.000000'),
(4, 5, 3, '2021-08-30 05:09:42.000000', '2021-08-30 05:09:42.000000');

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `Ref` varchar(192) NOT NULL,
  `is_pos` tinyint(1) DEFAULT '0',
  `client_id` int(11) NOT NULL,
  `warehouse_id` int(11) NOT NULL,
  `tax_rate` double DEFAULT '0',
  `TaxNet` double DEFAULT '0',
  `discount` double DEFAULT '0',
  `shipping` double DEFAULT '0',
  `GrandTotal` double NOT NULL DEFAULT '0',
  `paid_amount` double NOT NULL DEFAULT '0',
  `payment_statut` varchar(192) NOT NULL,
  `statut` varchar(191) NOT NULL,
  `notes` text,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`id`, `user_id`, `date`, `Ref`, `is_pos`, `client_id`, `warehouse_id`, `tax_rate`, `TaxNet`, `discount`, `shipping`, `GrandTotal`, `paid_amount`, `payment_statut`, `statut`, `notes`, `created_at`, `updated_at`, `deleted_at`) VALUES
(14, 1, '2021-08-28', 'SL_1111', 1, 2, 1, 0, 0, 0, 0, 54500, 54500, 'paid', 'completed', NULL, '2021-08-28 01:38:26.000000', '2021-08-28 01:38:26.000000', NULL),
(15, 1, '2021-08-28', 'SL_1112', 1, 3, 3, 0, 0, 0, 0, 46500, 46500, 'paid', 'completed', NULL, '2021-08-28 01:56:59.000000', '2021-08-28 01:56:59.000000', NULL),
(16, 1, '2021-08-29', 'SL_1113', 1, 2, 2, 0, 0, 0, 0, 47500, 47500, 'paid', 'completed', NULL, '2021-08-29 05:00:22.000000', '2021-08-29 05:00:22.000000', NULL),
(17, 1, '2021-08-29', 'SL_1114', 1, 4, 1, 0, 0, 0, 0, 27500, 27500, 'paid', 'completed', NULL, '2021-08-29 05:23:07.000000', '2021-08-29 05:23:07.000000', NULL),
(18, 1, '2021-08-29', 'SL_1115', 1, 3, 9, 0, 0, 0, 0, 16000, 16000, 'paid', 'completed', NULL, '2021-08-29 05:23:31.000000', '2021-08-29 05:23:31.000000', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sale_details`
--

CREATE TABLE `sale_details` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `sale_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_variant_id` int(11) DEFAULT NULL,
  `price` double NOT NULL,
  `TaxNet` double DEFAULT NULL,
  `tax_method` varchar(192) DEFAULT '1',
  `discount` double DEFAULT NULL,
  `discount_method` varchar(192) DEFAULT '1',
  `total` double NOT NULL,
  `quantity` double NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sale_details`
--

INSERT INTO `sale_details` (`id`, `date`, `sale_id`, `product_id`, `product_variant_id`, `price`, `TaxNet`, `tax_method`, `discount`, `discount_method`, `total`, `quantity`, `created_at`, `updated_at`) VALUES
(1, '2021-08-28', 14, 4, NULL, 11000, 0, '1', 0, '2', 22000, 2, NULL, NULL),
(2, '2021-08-28', 14, 6, NULL, 2500, 0, '1', 0, '2', 12500, 5, NULL, NULL),
(3, '2021-08-28', 14, 8, NULL, 20000, 0, '1', 0, '2', 20000, 1, NULL, NULL),
(4, '2021-08-28', 15, 33, NULL, 1500, 0, '1', 0, '2', 1500, 1, NULL, NULL),
(5, '2021-08-28', 15, 34, NULL, 20000, 0, '1', 0, '2', 40000, 2, NULL, NULL),
(6, '2021-08-28', 15, 40, NULL, 2500, 0, '1', 0, '2', 5000, 2, NULL, NULL),
(7, '2021-08-29', 16, 7, NULL, 2500, 0, '1', 0, '2', 2500, 1, NULL, NULL),
(8, '2021-08-29', 16, 6, NULL, 2500, 0, '1', 0, '2', 5000, 2, NULL, NULL),
(9, '2021-08-29', 16, 8, NULL, 20000, 0, '1', 0, '2', 40000, 2, NULL, NULL),
(10, '2021-08-29', 17, 4, NULL, 11000, 0, '1', 0, '2', 22000, 2, NULL, NULL),
(11, '2021-08-29', 17, 6, NULL, 2500, 0, '1', 0, '2', 5000, 2, NULL, NULL),
(12, '2021-08-29', 17, 10, NULL, 250, 0, '1', 0, '2', 500, 2, NULL, NULL),
(13, '2021-08-29', 18, 17, NULL, 8000, 0, '1', 0, '2', 16000, 2, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sale_returns`
--

CREATE TABLE `sale_returns` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `Ref` varchar(192) NOT NULL,
  `client_id` int(11) NOT NULL,
  `warehouse_id` int(11) NOT NULL,
  `tax_rate` double DEFAULT '0',
  `TaxNet` double DEFAULT '0',
  `discount` double DEFAULT '0',
  `shipping` double DEFAULT '0',
  `GrandTotal` double NOT NULL,
  `paid_amount` double NOT NULL DEFAULT '0',
  `payment_statut` varchar(192) NOT NULL,
  `statut` varchar(192) NOT NULL,
  `notes` text,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `sale_return_details`
--

CREATE TABLE `sale_return_details` (
  `id` int(11) NOT NULL,
  `sale_return_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `price` double NOT NULL,
  `TaxNet` double DEFAULT '0',
  `tax_method` varchar(192) DEFAULT '1',
  `discount` double DEFAULT '0',
  `discount_method` varchar(192) DEFAULT '1',
  `product_variant_id` int(11) DEFAULT NULL,
  `quantity` double NOT NULL,
  `total` double NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `servers`
--

CREATE TABLE `servers` (
  `id` int(11) NOT NULL,
  `host` varchar(191) NOT NULL,
  `port` int(11) NOT NULL,
  `username` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `encryption` varchar(191) NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `servers`
--

INSERT INTO `servers` (`id`, `host`, `port`, `username`, `password`, `encryption`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'mail.shopinitools.com', 587, 'info@shopinitools.com', '4@N&ew@,5(2-', 'tls', NULL, '2021-08-27 12:57:09.000000', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `email` varchar(191) NOT NULL,
  `currency_id` int(11) DEFAULT NULL,
  `CompanyName` varchar(191) NOT NULL,
  `CompanyPhone` varchar(191) NOT NULL,
  `CompanyAdress` varchar(191) NOT NULL,
  `city_id` int(11) NOT NULL,
  `country_id` int(11) NOT NULL,
  `province_id` int(11) NOT NULL,
  `logo` varchar(191) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `footer` varchar(192) NOT NULL DEFAULT 'Stocky - Ultimate Inventory With POS',
  `developed_by` varchar(192) NOT NULL DEFAULT 'Stocky',
  `client_id` int(11) DEFAULT NULL,
  `warehouse_id` int(11) DEFAULT NULL,
  `shopiniexpress` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `email`, `currency_id`, `CompanyName`, `CompanyPhone`, `CompanyAdress`, `city_id`, `country_id`, `province_id`, `logo`, `created_at`, `updated_at`, `deleted_at`, `footer`, `developed_by`, `client_id`, `warehouse_id`, `shopiniexpress`) VALUES
(1, 'imran@shopini.com', 2, 'ShopiniPOS', '6315996770', '3618 Abia Martin Drive', 2, 1, 34, '54122544cta1.jpg', NULL, '2021-08-21 06:00:07.000000', NULL, 'Shopini POS', 'ShopiniPOS', 1, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `shipping`
--

CREATE TABLE `shipping` (
  `id` int(11) NOT NULL,
  `sale_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `status` varchar(11) NOT NULL DEFAULT 'N',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `awb` text NOT NULL,
  `total_amount` int(11) NOT NULL,
  `track_id` bigint(20) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `shipping`
--

INSERT INTO `shipping` (`id`, `sale_id`, `user_id`, `client_id`, `date`, `status`, `updated_at`, `created_at`, `awb`, `total_amount`, `track_id`) VALUES
(1, 14, 1, 2, '2021-08-28', 'Y', '2021-08-28 04:39:53', '2021-08-28 01:38:37', '214312619', 54500, 7400801987410445046),
(2, 15, 1, 3, '2021-08-28', 'Y', '2021-08-28 04:57:52', '2021-08-28 01:57:08', '315725634', 46500, 7400881987471224201),
(3, 16, 1, 2, '2021-08-29', 'Y', '2021-08-29 08:21:53', '2021-08-29 05:21:29', '216716885', 47500, 7416311987452611801),
(4, 17, 1, 4, '2021-08-29', 'Y', '2021-08-29 08:23:56', '2021-08-29 05:23:53', '417447970', 27500, 7416351987441260671),
(5, 18, 1, 3, '2021-08-29', 'Y', '2021-08-29 08:23:56', '2021-08-29 05:23:53', '318261341', 16000, 7416361987469698444);

-- --------------------------------------------------------

--
-- Table structure for table `shipping_detail`
--

CREATE TABLE `shipping_detail` (
  `id` int(11) NOT NULL,
  `from_country_id` int(11) NOT NULL,
  `province_id` int(11) NOT NULL,
  `city_id` int(11) NOT NULL,
  `package_shipped_address` text NOT NULL,
  `receiver_country_id` int(11) NOT NULL,
  `receiver_province_id` int(11) NOT NULL,
  `package_shipped_address_form_city_id` int(11) NOT NULL,
  `supplier_name` varchar(250) NOT NULL,
  `supplier_phone` varchar(25) NOT NULL,
  `supplier_country` varchar(15) NOT NULL,
  `from_city_id` int(11) NOT NULL,
  `awb` int(11) NOT NULL,
  `package_description` text NOT NULL,
  `value_of_goods` varchar(25) NOT NULL,
  `total_quantity` int(11) NOT NULL,
  `weight` decimal(15,0) NOT NULL,
  `weight_unit` int(11) NOT NULL,
  `length` decimal(10,0) NOT NULL,
  `width` decimal(10,0) NOT NULL,
  `height` decimal(10,0) NOT NULL,
  `dimensions_unit` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `shopiniexpress`
--

CREATE TABLE `shopiniexpress` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `allow` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `transfers`
--

CREATE TABLE `transfers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `Ref` varchar(192) NOT NULL,
  `date` date NOT NULL,
  `from_warehouse_id` int(11) NOT NULL,
  `to_warehouse_id` int(11) NOT NULL,
  `items` double NOT NULL,
  `tax_rate` double DEFAULT '0',
  `TaxNet` double DEFAULT '0',
  `discount` double DEFAULT '0',
  `shipping` double DEFAULT '0',
  `GrandTotal` double NOT NULL DEFAULT '0',
  `statut` varchar(192) NOT NULL,
  `notes` text,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `transfer_details`
--

CREATE TABLE `transfer_details` (
  `id` int(11) NOT NULL,
  `transfer_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_variant_id` int(11) DEFAULT NULL,
  `cost` double NOT NULL,
  `TaxNet` double DEFAULT NULL,
  `tax_method` varchar(192) DEFAULT '1',
  `discount` double DEFAULT NULL,
  `discount_method` varchar(192) DEFAULT '1',
  `quantity` double NOT NULL,
  `total` double NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `units`
--

CREATE TABLE `units` (
  `id` int(11) NOT NULL,
  `name` varchar(192) NOT NULL,
  `ShortName` varchar(192) NOT NULL,
  `base_unit` int(11) DEFAULT NULL,
  `operator` char(192) DEFAULT '*',
  `operator_value` double DEFAULT '1',
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `units`
--

INSERT INTO `units` (`id`, `name`, `ShortName`, `base_unit`, `operator`, `operator_value`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Unit Product', 'Unit Product', NULL, '*', 1, '2021-08-04 10:25:03.000000', '2021-08-27 11:10:31.000000', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstname` varchar(191) NOT NULL,
  `lastname` varchar(191) NOT NULL,
  `username` varchar(192) NOT NULL,
  `email` varchar(192) NOT NULL,
  `password` varchar(191) NOT NULL,
  `avatar` varchar(191) DEFAULT NULL,
  `phone` varchar(192) NOT NULL,
  `role_id` int(11) NOT NULL,
  `statut` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `username`, `email`, `password`, `avatar`, `phone`, `role_id`, `statut`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'asad', 'Ullah', 'asad', 'asad_2723@yahoo.com', '$2y$10$Fnj5HscapXBX1QDtQIUdEuXqzkGiDJyAoLLHPXKbdf3f7UWNQNH9m', 'no_avatar.png', '0123456789', 1, 1, NULL, '2021-08-10 03:59:24.000000', NULL),
(2, 'imran', 'khan', 'imran', 'imran@shopini.com', '$2y$10$VP.xm5EvkbqqrpD7jN/2g.2jw2Nxb0YVniwUdJEeMI/IbaGUm0HH2', 'no_avatar.png', '123456789', 1, 1, '2021-08-11 04:50:13.000000', '2021-08-11 04:50:13.000000', NULL),
(3, 'Sales Acc', 'POS', 'asad', 'sales@shopini.com', '$2y$10$Fnj5HscapXBX1QDtQIUdEuXqzkGiDJyAoLLHPXKbdf3f7UWNQNH9m', 'no_avatar.png', '0123456789', 2, 1, NULL, '2021-08-10 03:59:24.000000', NULL),
(4, 'Shopini', 'POS', 'Shopini', 'shopinipos@gmail.com', '$2y$10$Fnj5HscapXBX1QDtQIUdEuXqzkGiDJyAoLLHPXKbdf3f7UWNQNH9m', 'no_avatar.png', '0123456789', 1, 1, NULL, '2021-08-10 03:59:24.000000', NULL),
(5, 'zahar', 'khan', 'zahraa', 'zahraa@shopini.com', '$2y$10$k1dug5HIqDlsX/jq86henOAspKS88QH25W08o.XP939Qcv6pkbW7y', 'no_avatar.png', '77841113525', 3, 1, '2021-08-30 05:09:42.000000', '2021-08-30 05:09:42.000000', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `warehouses`
--

CREATE TABLE `warehouses` (
  `id` int(11) NOT NULL,
  `name` varchar(192) NOT NULL,
  `city` varchar(192) DEFAULT NULL,
  `mobile` varchar(192) DEFAULT NULL,
  `zip` varchar(192) DEFAULT NULL,
  `email` varchar(192) DEFAULT NULL,
  `country` varchar(192) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT NULL,
  `updated_at` timestamp(6) NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `city_id` int(11) NOT NULL,
  `province_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `warehouses`
--

INSERT INTO `warehouses` (`id`, `name`, `city`, `mobile`, `zip`, `email`, `country`, `created_at`, `updated_at`, `deleted_at`, `city_id`, `province_id`) VALUES
(1, 'Maysan-Warehouse', 'Maysan\r\n', '0033254292', 'p51x2d2', 'asad_2723@yahoo.com', 'iraq', '2021-08-04 10:27:52.000000', '2021-08-04 10:27:52.000000', NULL, 3, 7),
(2, 'Basrah-Warehouse', 'Basrah\r\n', '1234567890', '44790', 'asad_2723@yahoo.com', 'Iraq', '2021-08-26 07:05:10.000000', '2021-08-26 07:06:01.000000', NULL, 2, 31),
(3, 'Baghdad-Warehouse', 'Baghdad\r\n', '1234567890', NULL, 'imran@shopini.com', 'Iraq', '2021-08-26 07:05:47.000000', '2021-08-26 07:06:20.000000', NULL, 1, 4),
(4, 'Anbar-Warehouse', 'Anbar\r\n', '0033254292', 'p51x2d2', 'imran@shopini.com', 'Iraq', '2021-08-04 10:27:52.000000', '2021-08-04 10:27:52.000000', NULL, 4, 8),
(5, 'Dhi Qar-Warehouse', 'Dhi Qar\r\n\r\n', '1234567890', '44790', 'asad_2723@yahoo.com', 'Iraq', '2021-08-26 07:05:10.000000', '2021-08-26 07:06:01.000000', NULL, 5, 9),
(6, 'Salahaddin-Warehouse', 'Salahaddin\r\n\r\n', '1234567890', NULL, 'imran@shopini.com', 'Iraq', '2021-08-26 07:05:47.000000', '2021-08-26 07:06:20.000000', NULL, 6, 11),
(7, 'Muthanna-Warehouse', 'Muthanna\r\n\r\n', '1234567890', NULL, 'imran@shopini.com', 'Iraq', '2021-08-26 07:05:47.000000', '2021-08-26 07:06:20.000000', NULL, 7, 12),
(8, 'Karbala-Warehouse', 'Karbala\r\n', '0033254292', 'p51x2d2', 'asad_2723@yahoo.com', 'iraq', '2021-08-04 10:27:52.000000', '2021-08-04 10:27:52.000000', NULL, 8, 13),
(9, 'Najaf-Warehouse', 'Najaf\r\n', '0033254292', 'p51x2d2', 'asad_2723@yahoo.com', 'iraq', '2021-08-04 10:27:52.000000', '2021-08-04 10:27:52.000000', NULL, 11, 6);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `adjustments`
--
ALTER TABLE `adjustments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id_adjustment` (`user_id`),
  ADD KEY `warehouse_id_adjustment` (`warehouse_id`);

--
-- Indexes for table `adjustment_details`
--
ALTER TABLE `adjustment_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `adjust_product_id` (`product_id`),
  ADD KEY `adjust_adjustment_id` (`adjustment_id`),
  ADD KEY `adjust_product_variant` (`product_variant_id`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `city`
--
ALTER TABLE `city`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `currencies`
--
ALTER TABLE `currencies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `expense_user_id` (`user_id`),
  ADD KEY `expense_category_id` (`expense_category_id`),
  ADD KEY `expense_warehouse_id` (`warehouse_id`);

--
-- Indexes for table `expense_categories`
--
ALTER TABLE `expense_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `expense_category_user_id` (`user_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `oauth_access_tokens`
--
ALTER TABLE `oauth_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oauth_access_tokens_user_id_index` (`user_id`);

--
-- Indexes for table `oauth_auth_codes`
--
ALTER TABLE `oauth_auth_codes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oauth_auth_codes_user_id_index` (`user_id`);

--
-- Indexes for table `oauth_clients`
--
ALTER TABLE `oauth_clients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oauth_clients_user_id_index` (`user_id`);

--
-- Indexes for table `oauth_personal_access_clients`
--
ALTER TABLE `oauth_personal_access_clients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `oauth_refresh_tokens`
--
ALTER TABLE `oauth_refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oauth_refresh_tokens_access_token_id_index` (`access_token_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email` (`email`),
  ADD KEY `token` (`token`);

--
-- Indexes for table `payment_purchases`
--
ALTER TABLE `payment_purchases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id_payment_purchases` (`user_id`),
  ADD KEY `payments_purchase_id` (`purchase_id`);

--
-- Indexes for table `payment_purchase_returns`
--
ALTER TABLE `payment_purchase_returns`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id_payment_return_purchase` (`user_id`),
  ADD KEY `supplier_id_payment_return_purchase` (`purchase_return_id`);

--
-- Indexes for table `payment_sales`
--
ALTER TABLE `payment_sales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id_payments_sale` (`user_id`),
  ADD KEY `payment_sale_id` (`sale_id`);

--
-- Indexes for table `payment_sale_returns`
--
ALTER TABLE `payment_sale_returns`
  ADD PRIMARY KEY (`id`),
  ADD KEY `factures_sale_return_user_id` (`user_id`),
  ADD KEY `factures_sale_return` (`sale_return_id`);

--
-- Indexes for table `payment_with_credit_card`
--
ALTER TABLE `payment_with_credit_card`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `permission_role`
--
ALTER TABLE `permission_role`
  ADD PRIMARY KEY (`id`),
  ADD KEY `permission_role_permission_id` (`permission_id`),
  ADD KEY `permission_role_role_id` (`role_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `brand_id_products` (`brand_id`),
  ADD KEY `unit_id_products` (`unit_id`),
  ADD KEY `unit_id_sales` (`unit_sale_id`),
  ADD KEY `unit_purchase_products` (`unit_purchase_id`);

--
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id_variant` (`product_id`);

--
-- Indexes for table `product_warehouse`
--
ALTER TABLE `product_warehouse`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_warehouse_id` (`product_id`),
  ADD KEY `warehouse_id` (`warehouse_id`),
  ADD KEY `product_variant_id` (`product_variant_id`);

--
-- Indexes for table `providers`
--
ALTER TABLE `providers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `province`
--
ALTER TABLE `province`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `purchases`
--
ALTER TABLE `purchases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id_purchases` (`user_id`),
  ADD KEY `provider_id` (`provider_id`),
  ADD KEY `warehouse_id_purchase` (`warehouse_id`);

--
-- Indexes for table `purchase_details`
--
ALTER TABLE `purchase_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_id` (`purchase_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `purchase_product_variant_id` (`product_variant_id`);

--
-- Indexes for table `purchase_returns`
--
ALTER TABLE `purchase_returns`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id_returns` (`user_id`),
  ADD KEY `provider_id_return` (`provider_id`),
  ADD KEY `purchase_return_warehouse_id` (`warehouse_id`);

--
-- Indexes for table `purchase_return_details`
--
ALTER TABLE `purchase_return_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_return_id_return` (`purchase_return_id`),
  ADD KEY `product_id_details_purchase_return` (`product_id`),
  ADD KEY `purchase_return_product_variant_id` (`product_variant_id`);

--
-- Indexes for table `quotations`
--
ALTER TABLE `quotations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id_quotation` (`user_id`),
  ADD KEY `client_id_quotation` (`client_id`),
  ADD KEY `warehouse_id_quotation` (`warehouse_id`);

--
-- Indexes for table `quotation_details`
--
ALTER TABLE `quotation_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id_quotation_details` (`product_id`),
  ADD KEY `quote_product_variant_id` (`product_variant_id`),
  ADD KEY `quotation_id` (`quotation_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role_user`
--
ALTER TABLE `role_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_user_user_id` (`user_id`),
  ADD KEY `role_user_role_id` (`role_id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id_sales` (`user_id`),
  ADD KEY `sale_client_id` (`client_id`),
  ADD KEY `warehouse_id_sale` (`warehouse_id`);

--
-- Indexes for table `sale_details`
--
ALTER TABLE `sale_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Details_Sale_id` (`sale_id`),
  ADD KEY `sale_product_id` (`product_id`),
  ADD KEY `sale_product_variant_id` (`product_variant_id`);

--
-- Indexes for table `sale_returns`
--
ALTER TABLE `sale_returns`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id_returns` (`user_id`),
  ADD KEY `client_id_returns` (`client_id`),
  ADD KEY `warehouse_id_sale_return_id` (`warehouse_id`);

--
-- Indexes for table `sale_return_details`
--
ALTER TABLE `sale_return_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `return_id` (`sale_return_id`),
  ADD KEY `product_id_details_returns` (`product_id`),
  ADD KEY `sale_return_id_product_variant_id` (`product_variant_id`);

--
-- Indexes for table `servers`
--
ALTER TABLE `servers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `currency_id` (`currency_id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `warehouse_id` (`warehouse_id`);

--
-- Indexes for table `shipping`
--
ALTER TABLE `shipping`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sale_id` (`sale_id`,`client_id`);

--
-- Indexes for table `shipping_detail`
--
ALTER TABLE `shipping_detail`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transfers`
--
ALTER TABLE `transfers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id_transfers` (`user_id`),
  ADD KEY `from_warehouse_id` (`from_warehouse_id`),
  ADD KEY `to_warehouse_id` (`to_warehouse_id`);

--
-- Indexes for table `transfer_details`
--
ALTER TABLE `transfer_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transfer_id` (`transfer_id`),
  ADD KEY `product_id_transfers` (`product_id`),
  ADD KEY `product_variant_id_transfer` (`product_variant_id`);

--
-- Indexes for table `units`
--
ALTER TABLE `units`
  ADD PRIMARY KEY (`id`),
  ADD KEY `base_unit` (`base_unit`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `warehouses`
--
ALTER TABLE `warehouses`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `adjustments`
--
ALTER TABLE `adjustments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `adjustment_details`
--
ALTER TABLE `adjustment_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `city`
--
ALTER TABLE `city`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `currencies`
--
ALTER TABLE `currencies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `expense_categories`
--
ALTER TABLE `expense_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT for table `oauth_clients`
--
ALTER TABLE `oauth_clients`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `oauth_personal_access_clients`
--
ALTER TABLE `oauth_personal_access_clients`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `payment_purchases`
--
ALTER TABLE `payment_purchases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_purchase_returns`
--
ALTER TABLE `payment_purchase_returns`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_sales`
--
ALTER TABLE `payment_sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `payment_sale_returns`
--
ALTER TABLE `payment_sale_returns`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_with_credit_card`
--
ALTER TABLE `payment_with_credit_card`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `permission_role`
--
ALTER TABLE `permission_role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=124;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `product_warehouse`
--
ALTER TABLE `product_warehouse`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=295;

--
-- AUTO_INCREMENT for table `providers`
--
ALTER TABLE `providers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `province`
--
ALTER TABLE `province`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `purchases`
--
ALTER TABLE `purchases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `purchase_details`
--
ALTER TABLE `purchase_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `purchase_returns`
--
ALTER TABLE `purchase_returns`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchase_return_details`
--
ALTER TABLE `purchase_return_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quotations`
--
ALTER TABLE `quotations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quotation_details`
--
ALTER TABLE `quotation_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `role_user`
--
ALTER TABLE `role_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `sale_details`
--
ALTER TABLE `sale_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `sale_returns`
--
ALTER TABLE `sale_returns`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sale_return_details`
--
ALTER TABLE `sale_return_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `servers`
--
ALTER TABLE `servers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `shipping`
--
ALTER TABLE `shipping`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `shipping_detail`
--
ALTER TABLE `shipping_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transfers`
--
ALTER TABLE `transfers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transfer_details`
--
ALTER TABLE `transfer_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `units`
--
ALTER TABLE `units`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `warehouses`
--
ALTER TABLE `warehouses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `adjustments`
--
ALTER TABLE `adjustments`
  ADD CONSTRAINT `user_id_adjustment` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `warehouse_id_adjustment` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`);

--
-- Constraints for table `adjustment_details`
--
ALTER TABLE `adjustment_details`
  ADD CONSTRAINT `adjust_adjustment_id` FOREIGN KEY (`adjustment_id`) REFERENCES `adjustments` (`id`),
  ADD CONSTRAINT `adjust_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `adjust_product_variant` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`);

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expense_category_id` FOREIGN KEY (`expense_category_id`) REFERENCES `expense_categories` (`id`),
  ADD CONSTRAINT `expense_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `expense_warehouse_id` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`);

--
-- Constraints for table `expense_categories`
--
ALTER TABLE `expense_categories`
  ADD CONSTRAINT `expense_category_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `payment_purchases`
--
ALTER TABLE `payment_purchases`
  ADD CONSTRAINT `factures_purchase_id` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`id`),
  ADD CONSTRAINT `user_id_factures_achat` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `payment_purchase_returns`
--
ALTER TABLE `payment_purchase_returns`
  ADD CONSTRAINT `supplier_id_payment_return_purchase` FOREIGN KEY (`purchase_return_id`) REFERENCES `purchase_returns` (`id`),
  ADD CONSTRAINT `user_id_payment_return_purchase` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `payment_sales`
--
ALTER TABLE `payment_sales`
  ADD CONSTRAINT `facture_sale_id` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`),
  ADD CONSTRAINT `user_id_factures_ventes` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `payment_sale_returns`
--
ALTER TABLE `payment_sale_returns`
  ADD CONSTRAINT `factures_sale_return` FOREIGN KEY (`sale_return_id`) REFERENCES `sale_returns` (`id`),
  ADD CONSTRAINT `factures_sale_return_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `permission_role`
--
ALTER TABLE `permission_role`
  ADD CONSTRAINT `permission_role_permission_id` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`),
  ADD CONSTRAINT `permission_role_role_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `brand_id_products` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`),
  ADD CONSTRAINT `category_id` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `unit_id_products` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`),
  ADD CONSTRAINT `unit_id_sales` FOREIGN KEY (`unit_sale_id`) REFERENCES `units` (`id`),
  ADD CONSTRAINT `unit_purchase_products` FOREIGN KEY (`unit_purchase_id`) REFERENCES `units` (`id`);

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_id_variant` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `product_warehouse`
--
ALTER TABLE `product_warehouse`
  ADD CONSTRAINT `art_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `mag_id` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`),
  ADD CONSTRAINT `product_variant_id` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`);

--
-- Constraints for table `purchases`
--
ALTER TABLE `purchases`
  ADD CONSTRAINT `provider_id` FOREIGN KEY (`provider_id`) REFERENCES `providers` (`id`),
  ADD CONSTRAINT `user_id_purchases` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `warehouse_id_purchase` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`);

--
-- Constraints for table `purchase_details`
--
ALTER TABLE `purchase_details`
  ADD CONSTRAINT `product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `purchase_id` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`id`),
  ADD CONSTRAINT `purchase_product_variant_id` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `purchase_returns`
--
ALTER TABLE `purchase_returns`
  ADD CONSTRAINT `provider_id_return` FOREIGN KEY (`provider_id`) REFERENCES `providers` (`id`),
  ADD CONSTRAINT `purchase_return_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `purchase_return_warehouse_id` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`);

--
-- Constraints for table `purchase_return_details`
--
ALTER TABLE `purchase_return_details`
  ADD CONSTRAINT `product_id_details_purchase_return` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `purchase_return_id_return` FOREIGN KEY (`purchase_return_id`) REFERENCES `purchase_returns` (`id`),
  ADD CONSTRAINT `purchase_return_product_variant_id` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`);

--
-- Constraints for table `quotations`
--
ALTER TABLE `quotations`
  ADD CONSTRAINT `client_id _quotation` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`),
  ADD CONSTRAINT `user_id_quotation` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `warehouse_id_quotation` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`);

--
-- Constraints for table `quotation_details`
--
ALTER TABLE `quotation_details`
  ADD CONSTRAINT `product_id_quotation_details` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `quotation_id` FOREIGN KEY (`quotation_id`) REFERENCES `quotations` (`id`),
  ADD CONSTRAINT `quote_product_variant_id` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`);

--
-- Constraints for table `role_user`
--
ALTER TABLE `role_user`
  ADD CONSTRAINT `role_user_role_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  ADD CONSTRAINT `role_user_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sale_client_id` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`),
  ADD CONSTRAINT `user_id_sales` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `warehouse_id_sale` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`);

--
-- Constraints for table `sale_details`
--
ALTER TABLE `sale_details`
  ADD CONSTRAINT `Details_Sale_id` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`),
  ADD CONSTRAINT `sale_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `sale_product_variant_id` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`);

--
-- Constraints for table `sale_returns`
--
ALTER TABLE `sale_returns`
  ADD CONSTRAINT `client_id_returns` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`),
  ADD CONSTRAINT `user_id_returns` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `warehouse_id_sale_return_id` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`);

--
-- Constraints for table `sale_return_details`
--
ALTER TABLE `sale_return_details`
  ADD CONSTRAINT `product_id_details_returns` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `sale_return_id` FOREIGN KEY (`sale_return_id`) REFERENCES `sale_returns` (`id`),
  ADD CONSTRAINT `sale_return_id_product_variant_id` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`);

--
-- Constraints for table `settings`
--
ALTER TABLE `settings`
  ADD CONSTRAINT `currency_id` FOREIGN KEY (`currency_id`) REFERENCES `currencies` (`id`),
  ADD CONSTRAINT `settings_client_id` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`),
  ADD CONSTRAINT `settings_warehouse_id` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`);

--
-- Constraints for table `transfers`
--
ALTER TABLE `transfers`
  ADD CONSTRAINT `from_warehouse_id` FOREIGN KEY (`from_warehouse_id`) REFERENCES `warehouses` (`id`),
  ADD CONSTRAINT `to_warehouse_id` FOREIGN KEY (`to_warehouse_id`) REFERENCES `warehouses` (`id`),
  ADD CONSTRAINT `user_id_transfers` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `transfer_details`
--
ALTER TABLE `transfer_details`
  ADD CONSTRAINT `product_id_transfers` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `product_variant_id_transfer` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`),
  ADD CONSTRAINT `transfer_id` FOREIGN KEY (`transfer_id`) REFERENCES `transfers` (`id`);

--
-- Constraints for table `units`
--
ALTER TABLE `units`
  ADD CONSTRAINT `base_unit` FOREIGN KEY (`base_unit`) REFERENCES `units` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
