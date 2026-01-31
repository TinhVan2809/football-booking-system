-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th1 31, 2026 lúc 06:54 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `football_system`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bookings`
--

CREATE TABLE `bookings` (
  `booking_id` int(11) NOT NULL,
  `field_field_type_id` int(11) NOT NULL,
  `booking_date` date NOT NULL COMMENT 'Ngày sử dụng sân',
  `start_time` time NOT NULL COMMENT 'Giờ bắt đầu chơi',
  `end_time` time NOT NULL,
  `user_id` int(11) NOT NULL COMMENT 'Người tạo booking\r\nVí dụ Nhân viên lễ tân',
  `duration_minutes` int(11) DEFAULT NULL,
  `price_per_hour` decimal(10,2) NOT NULL COMMENT 'snapshot giá tại thời điểm đặt',
  `total_price` decimal(10,2) NOT NULL COMMENT 'total_price = price_per_hour × (duration_minutes / 60).\r\n\r\n[Giá sân gốc (chưa dịch vụ, chưa giảm]',
  `final_price` decimal(10,2) DEFAULT NULL COMMENT 'tổng tiền cuối cùng. total_price + booking_services.\r\n(Giá cuối khách phải trả)',
  `booking_status` enum('pending','confirmed','completed','cancelled') DEFAULT 'pending',
  `created_at` datetime DEFAULT current_timestamp() COMMENT 'ngày đặt ngay tại thời điểm submit form'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `bookings`
--

INSERT INTO `bookings` (`booking_id`, `field_field_type_id`, `booking_date`, `start_time`, `end_time`, `user_id`, `duration_minutes`, `price_per_hour`, `total_price`, `final_price`, `booking_status`, `created_at`) VALUES
(7, 1, '2026-01-20', '18:00:00', '19:30:00', 20, 90, 300000.00, 450000.00, 450000.00, 'confirmed', '2026-01-17 21:23:41'),
(8, 2, '2026-01-21', '20:00:00', '21:00:00', 20, 60, 500000.00, 500000.00, 500000.00, 'pending', '2026-01-17 21:23:51');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `booking_services`
--

CREATE TABLE `booking_services` (
  `booking_service_id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `branch_service_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1 COMMENT 'Số lượng dùng service_id\r\n',
  `total_price` decimal(10,2) DEFAULT NULL COMMENT 'Tổng tiền của dịch vụ này',
  `unit_price` decimal(10,2) DEFAULT NULL COMMENT 'Giá tại thời điểm đặt, không ảnh hưởng khi thay đổi bảng giá'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='các dịch vụ cụ thể mà một lượt đặt sân đã sử dụng. 1 - N';

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `branches`
--

CREATE TABLE `branches` (
  `branch_id` int(11) NOT NULL,
  `branch_name` varchar(100) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `open_time` time DEFAULT NULL,
  `close_time` time DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Chi nhánh mỗi chi nhánh có thể có nhiều sân, mỗi sân 1 chi nhánh';

--
-- Đang đổ dữ liệu cho bảng `branches`
--

INSERT INTO `branches` (`branch_id`, `branch_name`, `address`, `phone`, `open_time`, `close_time`, `status`, `created_at`) VALUES
(1, 'Sân bóng Cái Răng Central', 'Đường Võ Nguyên Giáp, P. Phú Thứ, Q. Cái Răng, TP. Cần Thơ', '02923 888 111', '06:00:00', '22:00:00', 1, '2026-01-18 17:40:28'),
(2, 'Sân bóng Phú Thứ', 'KDC Phú An, P. Phú Thứ, Q. Cái Răng, TP. Cần Thơ', '02923 888 222', '05:30:00', '23:00:00', 1, '2026-01-18 17:40:28'),
(3, 'Sân bóng Hưng Phú', 'Đường Nguyễn Văn Linh, P. Hưng Phú, Q. Cái Răng, TP. Cần Thơ', '02923 888 333', '06:00:00', '22:30:00', 1, '2026-01-18 17:40:28'),
(4, 'Sân bóng Trần Hoàng Na', 'Đường Trần Hoàng Na, P. Hưng Thạnh, Q. Cái Răng, TP. Cần Thơ', '02923 888 444', '06:00:00', '21:30:00', 1, '2026-01-18 17:40:28');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `branch_services`
--

CREATE TABLE `branch_services` (
  `branch_service_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `status` enum('available','disabled') NOT NULL DEFAULT 'available',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng trung gian giữ branches và services. Một service có thể co nhiều branh khác cũng có.';

--
-- Đang đổ dữ liệu cho bảng `branch_services`
--

INSERT INTO `branch_services` (`branch_service_id`, `branch_id`, `service_id`, `price`, `status`, `created_at`) VALUES
(1, 1, 2, 10000.00, 'available', '2026-01-26 15:18:10'),
(2, 3, 3, 50000.00, 'available', '2026-01-26 15:18:10'),
(3, 1, 4, 40000.00, 'available', '2026-01-26 15:18:10'),
(4, 1, 2, 25000.00, 'available', '2026-01-26 15:18:10');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `favorites`
--

CREATE TABLE `favorites` (
  `favority_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `field_id` int(11) NOT NULL,
  `add_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fields`
--

CREATE TABLE `fields` (
  `field_id` int(11) NOT NULL,
  `branch_id` int(11) DEFAULT NULL COMMENT 'sân này thuộc chinh nhánh nào',
  `field_name` varchar(50) DEFAULT NULL COMMENT 'Sân 1A, 2A, 3B, VIP1, VIP2 ...',
  `thumbnail` varchar(255) DEFAULT NULL,
  `status` enum('available','maintenance') DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Sân bóng';

--
-- Đang đổ dữ liệu cho bảng `fields`
--

INSERT INTO `fields` (`field_id`, `branch_id`, `field_name`, `thumbnail`, `status`, `description`, `created_at`) VALUES
(1, 3, 'Sân 1A', 'pexels-140938577-10347868.jpg', 'available', 'Sân 5 người cỏ nhân tạo', '2026-01-19 04:57:41'),
(2, 1, 'Sân 1B', 'pexels-anastasia-shuraeva-9519543.jpg', 'available', 'Sân 5 người cỏ nhân tạo', '2026-01-19 04:57:41'),
(3, 2, 'Sân 2A', 'pexels-ben-khatry-430197437-20254635.jpg', 'available', 'Sân 7 người cỏ mới', '2026-01-19 04:57:41'),
(4, 2, 'Sân 2B', 'pexels-pixabay-47730.jpg', 'maintenance', 'Sân 7 người đang bảo trì', '2026-01-19 04:57:41'),
(5, 4, 'VIP1', 'pexels-pixabay-47730.jpg', 'available', 'Sân 11 người VIP, cỏ cao cấp', '2026-01-19 04:57:41'),
(6, 1, 'VIP2', 'pexels-pixabay-47730.jpg', 'available', 'Sân 11 người VIP, có đèn ban đêm', '2026-01-19 04:57:41');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `field_field_types`
--

CREATE TABLE `field_field_types` (
  `field_field_type_id` int(11) NOT NULL,
  `field_id` int(11) NOT NULL COMMENT 'bảng fields',
  `field_type_id` int(11) NOT NULL COMMENT 'bảng field_types',
  `price_per_hour` decimal(10,2) NOT NULL COMMENT 'giá gốc, giá thường',
  `max_players` varchar(255) DEFAULT NULL,
  `status` enum('available','maintenance','locked') DEFAULT 'available',
  `creared_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng trung gian giữa fields và field_types. Một field có nhiều field_types và một field_type lại có nhiều field cũng có filed_type đó. N-N';

--
-- Đang đổ dữ liệu cho bảng `field_field_types`
--

INSERT INTO `field_field_types` (`field_field_type_id`, `field_id`, `field_type_id`, `price_per_hour`, `max_players`, `status`, `creared_at`) VALUES
(1, 1, 1, 300000.00, '5', 'available', '2026-01-24 13:23:18'),
(2, 1, 2, 450000.00, '7', 'available', '2026-01-24 13:23:18'),
(3, 1, 3, 700000.00, '11', 'available', '2026-01-24 13:23:18'),
(4, 2, 1, 300000.00, '5', 'available', '2026-01-24 13:23:18'),
(5, 2, 2, 200000.00, '2', 'available', '2026-01-24 13:23:18'),
(6, 3, 3, 300000.00, '0', 'available', '2026-01-24 13:23:18'),
(7, 4, 1, 300000.00, '5', 'available', '2026-01-24 13:23:18'),
(8, 4, 2, 300000.00, '5', 'available', '2026-01-24 13:23:18'),
(9, 5, 2, 300000.00, '5', 'available', '2026-01-24 13:23:18'),
(10, 6, 2, 200000.00, '0', 'available', '2026-01-24 13:23:18'),
(11, 6, 3, 300000.00, '0', 'available', '2026-01-24 13:23:18');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `field_pricing_rules`
--

CREATE TABLE `field_pricing_rules` (
  `pricing_rule_id` int(11) NOT NULL,
  `field_field_type_id` int(11) NOT NULL,
  `day_of_week` tinyint(4) NOT NULL COMMENT 'thứ mấy 2-cn',
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `price_per_hour` decimal(10,2) NOT NULL,
  `rule_type` enum('peak','off_peak','special') DEFAULT 'peak',
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `field_pricing_rules`
--

INSERT INTO `field_pricing_rules` (`pricing_rule_id`, `field_field_type_id`, `day_of_week`, `start_time`, `end_time`, `price_per_hour`, `rule_type`, `status`, `created_at`) VALUES
(1, 1, 2, '06:00:00', '16:00:00', 180000.00, 'off_peak', 'active', '2026-01-27 14:58:38'),
(2, 1, 3, '06:00:00', '16:00:00', 180000.00, 'off_peak', 'active', '2026-01-27 14:58:38'),
(3, 1, 4, '06:00:00', '16:00:00', 180000.00, 'off_peak', 'active', '2026-01-27 14:58:38'),
(4, 1, 5, '06:00:00', '16:00:00', 180000.00, 'off_peak', 'active', '2026-01-27 14:58:38'),
(5, 1, 6, '06:00:00', '16:00:00', 200000.00, 'off_peak', 'active', '2026-01-27 14:58:38'),
(6, 1, 7, '18:00:00', '21:00:00', 500000.00, 'peak', 'active', '2026-01-29 15:09:16'),
(16, 1, 2, '16:00:00', '22:00:00', 250000.00, 'peak', 'active', '2026-01-27 14:59:04'),
(17, 1, 3, '16:00:00', '22:00:00', 250000.00, 'peak', 'active', '2026-01-27 14:59:04'),
(18, 1, 4, '16:00:00', '22:00:00', 250000.00, 'peak', 'active', '2026-01-27 14:59:04'),
(19, 1, 5, '16:00:00', '22:00:00', 270000.00, 'peak', 'active', '2026-01-27 14:59:04'),
(20, 1, 6, '16:00:00', '22:00:00', 300000.00, 'peak', 'active', '2026-01-27 14:59:04'),
(21, 1, 7, '06:00:00', '22:00:00', 320000.00, 'peak', 'active', '2026-01-27 14:59:13'),
(22, 1, 8, '06:00:00', '22:00:00', 350000.00, 'special', 'active', '2026-01-27 14:59:23');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `field_types`
--

CREATE TABLE `field_types` (
  `field_type_id` int(11) NOT NULL,
  `type_name` varchar(20) DEFAULT NULL COMMENT 'sân 5 người, sân 7 người,sân 11 người \r\n(Hiển thị cho người dùng)',
  `players` int(11) DEFAULT NULL COMMENT 'Dùng cho logic, tính toán\r\n\r\n',
  `type_code` varchar(10) DEFAULT NULL COMMENT 'f5, f7, f11',
  `thumbnail` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='1 chi nhánh có nhiều loại sân';

--
-- Đang đổ dữ liệu cho bảng `field_types`
--

INSERT INTO `field_types` (`field_type_id`, `type_name`, `players`, `type_code`, `thumbnail`, `description`, `created_at`) VALUES
(1, 'Sân 5 người', 5, 'f5', 'pexels-jakobjin-7086430.jpg', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure ducimus tempore quam minima ', '2026-01-23 16:04:10'),
(2, 'Sân 7 người', 7, 'f7', 'pexels-shan-huang-560952599-32022245.jpg', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure ducimus tempore quam minima ', '2026-01-23 16:04:10'),
(3, 'Sân 11 người', 11, 'f11', 'pexels-ibnulharezmi-17082186.jpg', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure ducimus tempore quam minima ', '2026-01-23 16:04:10');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL COMMENT 'SỐ TIỀN ĐÃ TRẢ TRONG MỘT LẦN THANH TOÁN (Tổng 700 nhưng có thể trả trước 500)\r\n',
  `payment_method` enum('cash','transfer','momo') DEFAULT NULL COMMENT 'phương thức thanh toán. tiền mặt, chuyển khoản banking, momo ',
  `payment_status` enum('unpaid','partial','paid') DEFAULT NULL COMMENT 'chưa thanh toán, thanh toán một phần, đã thanh toán hết',
  `payment_time` datetime DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL COMMENT 'Ai là người thu tiền, branch_owner_id '
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='1 booking có N payments. Cũng có thể xem là tiền cọc trước';

--
-- Đang đổ dữ liệu cho bảng `payments`
--

INSERT INTO `payments` (`payment_id`, `booking_id`, `amount`, `payment_method`, `payment_status`, `payment_time`, `note`, `user_id`) VALUES
(4, 7, 300000.00, 'momo', 'partial', '2026-01-18 10:00:00', 'Khách đặt cọc trước', 15),
(5, 8, 150000.00, 'cash', 'paid', '2026-01-20 19:40:00', 'Thanh toán phần còn lại sau khi đá xong', 15),
(6, 8, 150000.00, 'cash', 'paid', '2026-01-20 19:40:00', 'Thanh toán phần còn lại sau khi đá xong', 15);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int(11) NOT NULL,
  `rating` tinyint(4) NOT NULL,
  `user_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `reviews`
--

INSERT INTO `reviews` (`review_id`, `rating`, `user_id`, `branch_id`, `comment`, `created_at`) VALUES
(1, 5, 20, 3, 'OK', '2026-01-31 07:28:21');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `services`
--

CREATE TABLE `services` (
  `service_id` int(11) NOT NULL,
  `service_name` varchar(100) DEFAULT NULL COMMENT 'tên dịch vụ',
  `service_type` enum('rent','sell') DEFAULT 'rent'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='danh sách các dịch vụ đi kèm khi thuê sân';

--
-- Đang đổ dữ liệu cho bảng `services`
--

INSERT INTO `services` (`service_id`, `service_name`, `service_type`) VALUES
(1, 'Giày', 'rent'),
(2, 'Găng tay', 'rent'),
(3, 'Quần áo', 'rent'),
(4, 'Áo', 'rent'),
(5, 'Nước suối', 'sell');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `avata` varchar(255) DEFAULT NULL,
  `role` enum('admin','staff','branch_owner','branch_staff','customer') NOT NULL DEFAULT 'customer' COMMENT 'admin, nhân viên, chủ chi nhánh, nhân viên chi nhánh, khách hàng',
  `status` tinyint(4) DEFAULT 1 COMMENT '1 là đang hoạt động, 0 là gì block',
  `created_at` datetime DEFAULT current_timestamp(),
  `branch_id` int(11) DEFAULT NULL COMMENT 'User này là chủ/nhân viên của chi nhánh nào. Nếu không có hoặc role != branch_owner => null'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `full_name`, `phone`, `avata`, `role`, `status`, `created_at`, `branch_id`) VALUES
(15, 'admin1', '$2b$10$ZLJd3EiPZ1pjINpmSFVILOXxo4R6MuguMDlVNL89vj6NgBQc5y8Zy', 'Lữ Văn Tính', '0818177533', NULL, 'admin', 1, '2026-01-18 19:37:52', NULL),
(16, 'Tính Văn', '$2b$10$0kmys1ZlRkPp2rHHWGKy6.O3e1ERQoYzAiKX3B27Fvd1AeE69bkBW', 'Lữ Văn Tính', '0818177533', NULL, 'customer', 1, '2026-01-18 20:15:18', NULL),
(17, 'tinh@gmail.com', '$2b$10$YmL9GOMpJRRKH/wU8Ipbwe92790N.0fG3cBoLtsZfTcaWYTv0aY6S', 'Lữ Văn Tính', '0818177533', NULL, 'branch_owner', 1, '2026-01-19 10:50:23', NULL),
(18, 'Hasekimagru', '$2b$10$0VOpSkDgZUI.EFMafg/DRODntwxtVg2DAw2UVJyqhDew6hUhOQsie', 'tinh van', '0818177533', NULL, 'customer', 1, '2026-01-20 12:08:09', NULL),
(19, 'Admin', '$2b$10$BDppk9El5d5ejJb1D.RP3.IHaebU2MFs5fo3SOsFuP0OQ/UqSRjH2', 'tinh van', '0818177533', NULL, 'customer', 1, '2026-01-20 15:02:06', NULL),
(20, 'tinhvan', '$2b$10$ZeK2WulmDmzvHYLndT9za.VxX2P8UAcU6Ph/TQ69nBVAO5jzW3lPK', 'hase', '0813502953', NULL, 'customer', 1, '2026-01-20 15:25:35', NULL),
(21, 'vantinh', '$2b$10$GPPR8TtQVDGCN/YtOXR5GOi0diZCY4YrIYakDozf54n/gZkiTngf2', 'tinh van', '0818177533', NULL, 'customer', 1, '2026-01-21 11:21:26', NULL);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_booking_time` (`booking_date`,`start_time`,`end_time`),
  ADD KEY `FK_Booking_FieldFieldType` (`field_field_type_id`);

--
-- Chỉ mục cho bảng `booking_services`
--
ALTER TABLE `booking_services`
  ADD PRIMARY KEY (`booking_service_id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `branch_service_id` (`branch_service_id`);

--
-- Chỉ mục cho bảng `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`branch_id`);

--
-- Chỉ mục cho bảng `branch_services`
--
ALTER TABLE `branch_services`
  ADD PRIMARY KEY (`branch_service_id`),
  ADD KEY `branch_id` (`branch_id`),
  ADD KEY `service_id` (`service_id`);

--
-- Chỉ mục cho bảng `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`favority_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `field_id` (`field_id`);

--
-- Chỉ mục cho bảng `fields`
--
ALTER TABLE `fields`
  ADD PRIMARY KEY (`field_id`),
  ADD KEY `idx_fields_branch` (`branch_id`);

--
-- Chỉ mục cho bảng `field_field_types`
--
ALTER TABLE `field_field_types`
  ADD PRIMARY KEY (`field_field_type_id`),
  ADD UNIQUE KEY `uk_field_type` (`field_id`,`field_type_id`),
  ADD KEY `field_type_id` (`field_type_id`),
  ADD KEY `idx_fft_field` (`field_id`);

--
-- Chỉ mục cho bảng `field_pricing_rules`
--
ALTER TABLE `field_pricing_rules`
  ADD PRIMARY KEY (`pricing_rule_id`),
  ADD KEY `idx_pricing_rule_lookup` (`field_field_type_id`,`day_of_week`,`start_time`,`end_time`,`status`);

--
-- Chỉ mục cho bảng `field_types`
--
ALTER TABLE `field_types`
  ADD PRIMARY KEY (`field_type_id`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `branch_id` (`branch_id`);

--
-- Chỉ mục cho bảng `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`service_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `username_2` (`username`),
  ADD KEY `FK_User_Branch` (`branch_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `bookings`
--
ALTER TABLE `bookings`
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `booking_services`
--
ALTER TABLE `booking_services`
  MODIFY `booking_service_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `branches`
--
ALTER TABLE `branches`
  MODIFY `branch_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `branch_services`
--
ALTER TABLE `branch_services`
  MODIFY `branch_service_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `favorites`
--
ALTER TABLE `favorites`
  MODIFY `favority_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fields`
--
ALTER TABLE `fields`
  MODIFY `field_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `field_field_types`
--
ALTER TABLE `field_field_types`
  MODIFY `field_field_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `field_pricing_rules`
--
ALTER TABLE `field_pricing_rules`
  MODIFY `pricing_rule_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT cho bảng `field_types`
--
ALTER TABLE `field_types`
  MODIFY `field_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `services`
--
ALTER TABLE `services`
  MODIFY `service_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `FK_Booking_FieldFieldType` FOREIGN KEY (`field_field_type_id`) REFERENCES `field_field_types` (`field_field_type_id`);

--
-- Các ràng buộc cho bảng `booking_services`
--
ALTER TABLE `booking_services`
  ADD CONSTRAINT `booking_services_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`),
  ADD CONSTRAINT `booking_services_ibfk_2` FOREIGN KEY (`branch_service_id`) REFERENCES `branch_services` (`branch_service_id`);

--
-- Các ràng buộc cho bảng `branch_services`
--
ALTER TABLE `branch_services`
  ADD CONSTRAINT `branch_services_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`),
  ADD CONSTRAINT `branch_services_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`);

--
-- Các ràng buộc cho bảng `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`field_id`) REFERENCES `fields` (`field_id`);

--
-- Các ràng buộc cho bảng `fields`
--
ALTER TABLE `fields`
  ADD CONSTRAINT `fields_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`);

--
-- Các ràng buộc cho bảng `field_field_types`
--
ALTER TABLE `field_field_types`
  ADD CONSTRAINT `field_field_types_ibfk_1` FOREIGN KEY (`field_id`) REFERENCES `fields` (`field_id`),
  ADD CONSTRAINT `field_field_types_ibfk_2` FOREIGN KEY (`field_type_id`) REFERENCES `field_types` (`field_type_id`);

--
-- Các ràng buộc cho bảng `field_pricing_rules`
--
ALTER TABLE `field_pricing_rules`
  ADD CONSTRAINT `field_pricing_rules_ibfk_1` FOREIGN KEY (`field_field_type_id`) REFERENCES `field_field_types` (`field_field_type_id`);

--
-- Các ràng buộc cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Các ràng buộc cho bảng `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`),
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Các ràng buộc cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`);

--
-- Các ràng buộc cho bảng `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `FK_User_Branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
