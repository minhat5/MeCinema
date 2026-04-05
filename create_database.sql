-- MySQL dump 10.13  Distrib 9.4.0, for Win64 (x86_64)
--
-- Host: localhost    Database: cinema_booking_db
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `booking_foods`
--

DROP TABLE IF EXISTS `booking_foods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_foods` (
  `booking_food_id` bigint NOT NULL AUTO_INCREMENT,
  `booking_id` bigint NOT NULL,
  `food_id` bigint NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`booking_food_id`),
  KEY `booking_id` (`booking_id`),
  KEY `food_id` (`food_id`),
  CONSTRAINT `booking_foods_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE,
  CONSTRAINT `booking_foods_ibfk_2` FOREIGN KEY (`food_id`) REFERENCES `foods` (`food_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_foods`
--

LOCK TABLES `booking_foods` WRITE;
/*!40000 ALTER TABLE `booking_foods` DISABLE KEYS */;
INSERT INTO `booking_foods` VALUES (1,4,17,1,39000.00,'2026-04-04 07:20:29','2026-04-04 07:20:29'),(2,10,22,1,20000.00,'2026-04-05 02:53:43','2026-04-05 02:53:43'),(3,11,22,1,20000.00,'2026-04-05 03:00:23','2026-04-05 03:00:23'),(4,14,22,1,20000.00,'2026-04-05 03:16:13','2026-04-05 03:16:13');
/*!40000 ALTER TABLE `booking_foods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `booking_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `showtime_id` bigint NOT NULL,
  `booking_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `total_price` decimal(12,2) NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `version` bigint DEFAULT '0',
  PRIMARY KEY (`booking_id`),
  KEY `user_id` (`user_id`),
  KEY `showtime_id` (`showtime_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`showtime_id`) REFERENCES `showtimes` (`showtime_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,4,1,'2026-04-04 10:11:40',85000.00,'FAILED','2026-04-04 03:11:40','2026-04-04 03:21:56',0),(2,4,1,'2026-04-04 10:13:10',85000.00,'FAILED','2026-04-04 03:13:10','2026-04-04 03:23:56',0),(3,4,1,'2026-04-04 10:18:24',85000.00,'FAILED','2026-04-04 03:18:24','2026-04-04 03:28:56',0),(4,4,4,'2026-04-04 14:20:29',119000.00,'FAILED','2026-04-04 07:20:29','2026-04-04 07:20:54',1),(5,4,4,'2026-04-04 14:21:16',80000.00,'SUCCESS','2026-04-04 07:21:16','2026-04-04 07:22:23',1),(6,8,5,'2026-04-04 14:37:14',90000.00,'FAILED','2026-04-04 07:37:14','2026-04-04 07:39:14',1),(7,7,4,'2026-04-04 15:10:42',80000.00,'FAILED','2026-04-04 08:10:42','2026-04-04 08:13:04',0),(8,7,4,'2026-04-04 19:59:35',80000.00,'FAILED','2026-04-04 12:59:35','2026-04-04 13:02:02',0),(9,9,7,'2026-04-05 09:35:24',85000.00,'FAILED','2026-04-05 02:35:24','2026-04-05 02:37:24',1),(10,11,8,'2026-04-05 09:53:43',115000.00,'FAILED','2026-04-05 02:53:43','2026-04-05 02:55:43',1),(11,11,8,'2026-04-05 10:00:23',115000.00,'FAILED','2026-04-05 03:00:23','2026-04-05 03:02:22',1),(12,11,1,'2026-04-05 10:05:26',85000.00,'FAILED','2026-04-05 03:05:26','2026-04-05 03:05:43',1),(13,11,1,'2026-04-05 10:09:43',85000.00,'SUCCESS','2026-04-05 03:09:43','2026-04-05 03:10:13',1),(14,12,1,'2026-04-05 10:16:13',105000.00,'SUCCESS','2026-04-05 03:16:13','2026-04-05 03:17:00',1);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cinemas`
--

DROP TABLE IF EXISTS `cinemas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cinemas` (
  `cinema_id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hotline` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`cinema_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cinemas`
--

LOCK TABLES `cinemas` WRITE;
/*!40000 ALTER TABLE `cinemas` DISABLE KEYS */;
INSERT INTO `cinemas` VALUES (1,'MeCinema Nguyễn Trãi','135 Nguyễn Trãi, Quận 1, Thành phố Hồ Chí Minh','19001008','2026-04-04 00:05:45','2026-04-04 08:11:22'),(2,'MeCinema GigaMall','240-242 Phạm Văn Đồng, Thủ Đức, Thành phố Hồ Chí Minh','19001002','2026-04-04 00:06:24','2026-04-04 00:06:24'),(4,'MeCinema Vincom Đà Nẵng','910A Ngô Quyền, Sơn Trà, Đà Nẵng','19001004','2026-04-04 00:07:40','2026-04-04 00:07:40'),(7,'MiCinema Man Thiện','236 Man Thiện, Phường Tăng Nhơn Phú, TPHCM','19001900','2026-04-05 03:19:27','2026-04-05 03:19:27');
/*!40000 ALTER TABLE `cinemas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `foods`
--

DROP TABLE IF EXISTS `foods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `foods` (
  `food_id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` enum('FOOD','DRINK','COMBO') COLLATE utf8mb4_unicode_ci DEFAULT 'COMBO',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`food_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `foods`
--

LOCK TABLES `foods` WRITE;
/*!40000 ALTER TABLE `foods` DISABLE KEYS */;
INSERT INTO `foods` VALUES (1,'Coca Cola','Nước ngọt Coca Cola lạnh',20000.00,'https://cdn.tgdd.vn/Files/2017/11/14/1041443/moi-ngay-uong-1-lon-coca-cola-co-sao-khong-nen-uong-bao-nhieu-la-tot-202112300854488863.jpg','DRINK',0,'2026-03-31 11:49:30','2026-04-04 00:12:44'),(2,'Bắp Rang Bơ','Bắp giòn rụm, ngon thơm lừng',25000.00,'http://thietbimayg8.com/wp-content/uploads/2017/01/huong-dan-lam-bap-rang-bo-de-kinh-doanh.jpg',NULL,0,'2026-03-31 11:53:03','2026-04-04 00:12:45'),(3,'Combo bắp rang bơ + cocacola','Bắp giòn rụm, ngon thơm lừng, thêm nước ngọt ngon',40000.00,'https://cellphones.com.vn/sforum/gia-bap-nuoc-cgv','COMBO',0,'2026-03-31 11:54:01','2026-04-04 00:12:49'),(7,'Fanta','Nước ngọt Fanta cam lạnh',25000.00,'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2443/193332/bhx/z-2_202411041516031783.jpg','DRINK',0,'2026-04-01 13:05:58','2026-04-04 00:12:47'),(8,'Bắp ngọt S','Bắp ngọt size nhỏ',39000.00,'https://insieunhanh24h.com/wp-content/uploads/2024/03/combo-t%C3%BAi-gi%E1%BA%A5y-scaled-600x613.jpg','FOOD',1,'2026-04-04 00:14:41','2026-04-04 00:14:41'),(9,'Bắp ngọt M','Bắp ngọt size vừa',49000.00,'https://insieunhanh24h.com/wp-content/uploads/2024/03/combo-t%C3%BAi-gi%E1%BA%A5y-scaled-600x613.jpg','FOOD',1,'2026-04-04 00:15:04','2026-04-04 00:15:04'),(10,'Bắp Caramel S','Bắp caramel size nhỏ',45000.00,'https://insieunhanh24h.com/wp-content/uploads/2024/03/combo-t%C3%BAi-gi%E1%BA%A5y-scaled-600x613.jpg','FOOD',1,'2026-04-04 00:15:38','2026-04-04 00:15:38'),(11,'Bắp Caramel L','Bắp Caramel size lớn',69000.00,'https://insieunhanh24h.com/wp-content/uploads/2024/03/combo-t%C3%BAi-gi%E1%BA%A5y-scaled-600x613.jpg','FOOD',1,'2026-04-04 00:17:35','2026-04-04 00:17:35'),(12,'Snack Khoai tây','Snack khoai tây giòn',30000.00,'https://cdn.tgdd.vn/Products/Images/3364/193330/bhx/snack-khoai-tay-vi-tu-nhien-classic-lays-goi-95g-202304130909059443.jpg','FOOD',1,'2026-04-04 00:18:33','2026-04-04 00:18:33'),(13,'Hotdog Xúc xích','Hotdog xúc xích phô mai',45000.00,'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2023_10_23_638336952302336771_hot-dog-pho-mai-0.jpeg','FOOD',1,'2026-04-04 00:19:36','2026-04-04 00:19:36'),(14,'Gà rán 2 Miếng','Gà rán giòn',55000.00,'https://product.hstatic.net/200000357317/product/upload_01c05ac5c90a4d33a78ce29e184670fb_grande.jpg','FOOD',1,'2026-04-04 00:20:27','2026-04-04 00:20:27'),(15,'Gà rán 4 miếng','Gà rán phần lớn',99000.00,'https://www.lottemart.vn/media/catalog/product/cache/0x0/0/4/0400278470008-1.jpg.webp','FOOD',1,'2026-04-04 00:21:49','2026-04-04 00:21:49'),(16,'Coca M','Coca Cola size vừa',29000.00,'https://i0.wp.com/tiemmihaomi.vn/wp-content/uploads/2023/05/Coca-ly.jpg?fit=900%2C900&ssl=1','DRINK',1,'2026-04-04 00:22:40','2026-04-04 00:23:01'),(17,'Coca L','Coca cola size lớn',39000.00,'https://i0.wp.com/tiemmihaomi.vn/wp-content/uploads/2023/05/Coca-ly.jpg?fit=900%2C900&ssl=1','DRINK',1,'2026-04-04 00:23:40','2026-04-04 00:23:40'),(18,'Pepsi M','Pepsi size vừa',29000.00,'https://product.hstatic.net/200000848723/product/pepi_afe7962d238e4789b3a0830b7ea74bb9_1024x1024.jpg','DRINK',1,'2026-04-04 00:24:32','2026-04-04 00:24:32'),(19,'7Up M','7Up size vừa',29000.00,'https://product.hstatic.net/200000848723/product/___6e33eddb08154e2c948da8c9c16fa2eb_1024x1024.png','DRINK',1,'2026-04-04 00:25:19','2026-04-04 00:25:19'),(20,'Trà đào','Trà đào mát lạnh',35000.00,'https://phovietnam.vn/upload/sanpham/tra-dao-8450.jpg','DRINK',1,'2026-04-04 00:26:19','2026-04-04 00:26:19'),(21,'Trà tắc','Trà tắc thơm',32000.00,'https://cdn.tgdd.vn/Files/2019/02/19/1150790/lam-tra-tac-tu-pha-danh-bay-con-nong-mua-he-202103061546325264.jpg','DRINK',1,'2026-04-04 00:26:45','2026-04-04 00:26:45'),(22,'Nước suối','Nước suối chai',20000.00,'https://dailynuoc.com/img_data/images/nuoc-tinh-khiet-satori-350ml114939638040.jpg','DRINK',1,'2026-04-04 00:27:32','2026-04-04 00:27:32'),(23,'Combo Solo 1','1 Bắp M + 1 nước M',79000.00,'https://api-website.cinestar.com.vn/media/.thumbswysiwyg/pictures/PICCONNEW/CNS035_COMBO_GAU.png?rand=1723084117','COMBO',1,'2026-04-04 00:33:34','2026-04-04 00:33:34'),(24,'Combo Solo 2','1 bắp caramel + 1 nước M',89000.00,'https://api-website.cinestar.com.vn/media/.thumbswysiwyg/pictures/PICCONNEW/CNS035_COMBO_GAU.png?rand=1723084117','COMBO',1,'2026-04-04 00:34:08','2026-04-04 00:34:08'),(25,'Combo Couple 1','1 bắp L + 2 nước L',139000.00,'https://cellphones.com.vn/sforum/wp-content/uploads/2023/07/gia-bap-nuoc-cgv-1.jpg','COMBO',1,'2026-04-04 00:34:59','2026-04-04 00:34:59'),(26,'Combo Couple 2','1 bắp caramel L + 2 nước M',149000.00,'https://cellphones.com.vn/sforum/wp-content/uploads/2023/07/gia-bap-nuoc-cgv-1.jpg','COMBO',1,'2026-04-04 00:36:24','2026-04-04 00:36:24'),(27,'7Up L','Nước 7up size lớn',35000.00,'https://product.hstatic.net/1000288770/product/nuoc_ngot_7_up_vi_chanh_lon_235ml_04dd0bd25acd41a2b267c7e5fee240fe_master.jpg','FOOD',1,'2026-04-05 03:24:02','2026-04-05 03:24:02');
/*!40000 ALTER TABLE `foods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genres`
--

DROP TABLE IF EXISTS `genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genres` (
  `genre_id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`genre_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genres`
--

LOCK TABLES `genres` WRITE;
/*!40000 ALTER TABLE `genres` DISABLE KEYS */;
INSERT INTO `genres` VALUES (4,'Hành động','2026-04-04 00:01:31','2026-04-04 00:01:31'),(6,'Hoạt hình','2026-04-04 00:01:55','2026-04-04 00:01:55'),(7,'Tự sự','2026-04-04 00:02:11','2026-04-04 00:02:24'),(8,'Hài','2026-04-04 00:02:17','2026-04-05 03:19:42'),(9,'Tội phạm','2026-04-04 00:02:32','2026-04-04 00:02:32'),(10,'Tài liệu','2026-04-04 00:02:49','2026-04-04 00:02:49'),(11,'Drama','2026-04-04 00:02:58','2026-04-04 00:02:58'),(12,'Gia đình','2026-04-04 00:03:06','2026-04-04 00:03:06'),(13,'Kỳ ảo','2026-04-04 00:03:14','2026-04-04 00:03:14'),(14,'Kinh dị','2026-04-04 00:03:24','2026-04-04 00:03:24'),(15,'Bí ẩn','2026-04-04 00:03:37','2026-04-04 00:03:37'),(16,'Khoa học viễn tưởng','2026-04-04 00:03:57','2026-04-04 00:03:57'),(17,'Thể thao','2026-04-04 00:04:04','2026-04-04 00:04:04'),(18,'Giật gân','2026-04-04 00:04:21','2026-04-04 00:04:21'),(19,'Chiến tranh','2026-04-04 00:04:37','2026-04-04 00:04:37'),(20,'Ca nhạc','2026-04-04 00:04:53','2026-04-04 00:04:53'),(21,'Tình cảm','2026-04-05 02:24:55','2026-04-05 02:24:55'),(22,'Phiêu lưu','2026-04-05 03:19:52','2026-04-05 03:19:52');
/*!40000 ALTER TABLE `genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movie_genres`
--

DROP TABLE IF EXISTS `movie_genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movie_genres` (
  `movie_id` bigint NOT NULL,
  `genre_id` bigint NOT NULL,
  PRIMARY KEY (`movie_id`,`genre_id`),
  KEY `genre_id` (`genre_id`),
  CONSTRAINT `movie_genres_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`) ON DELETE CASCADE,
  CONSTRAINT `movie_genres_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `genres` (`genre_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movie_genres`
--

LOCK TABLES `movie_genres` WRITE;
/*!40000 ALTER TABLE `movie_genres` DISABLE KEYS */;
INSERT INTO `movie_genres` VALUES (14,4),(13,6),(16,6),(12,8),(16,8),(15,11),(17,14),(18,14);
/*!40000 ALTER TABLE `movie_genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movies`
--

DROP TABLE IF EXISTS `movies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movies` (
  `movie_id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `duration_minutes` int NOT NULL,
  `release_date` date NOT NULL,
  `poster_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trailer_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('UPCOMING','RELEASED','ENDED') COLLATE utf8mb4_unicode_ci DEFAULT 'UPCOMING',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`movie_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movies`
--

LOCK TABLES `movies` WRITE;
/*!40000 ALTER TABLE `movies` DISABLE KEYS */;
INSERT INTO `movies` VALUES (11,'HẸN EM NGÀY NHẬT THỰC','Năm 1995, khi đang đứng trước một quyết định quan trọng của cuộc đời, Ân bất ngờ bị kéo trở lại quá khứ bởi những bức thư tình chưa từng trao tay. Hành trình tìm gặp Thiên - mối tình đầu từng khắc sâu trong tim - đưa cô về lại thôn xóm Trà Mây năm xưa, nơi những ký ức ngọt ngào xen lẫn tổn thương vẫn chưa hề nguôi ngoai. Trong khoảnh khắc định mệnh khi hai người bất ngờ chạm mặt, những bí mật bị che giấu suốt nhiều năm dần hé lộ, buộc Ân phải đối diện với sự thật và lựa chọn con đường cho riêng mình.',118,'2026-03-29','https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F04-2026%2Fhen-em.jpg&w=1920&q=75','https://www.youtube.com/watch?v=8fRszUyt_YQ','RELEASED','2026-04-02 08:04:29','2026-04-02 08:16:03'),(12,'SONG HỶ LÂM NGUY','Hai lễ cưới, một sang trọng sa hoa, một đạm bạc dân dã, đáng lý sẽ được tổ chức đối diện nhau. Rắc rối bắt đầu khi đội ngũ tổ chức của hai lễ cưới phát hiện ra danh sách khách mời của hai bên là giống nhau.',113,'2026-04-02','https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F04-2026%2Fsong-huy-lam-nguy.jpg&w=1920&q=75','https://www.youtube.com/watch?v=5SnwtriZBbk','RELEASED','2026-04-04 00:45:15','2026-04-04 00:46:30'),(13,'PHIM SUPER MARIO THIÊN HÀ','Anh em Mario và Luigi đã ở lại để giúp Công chúa Peach trông nom Vương Quốc Nấm, còn rùa phản diện Bowser thì bị thu nhỏ và nhốt trong tòa lâu đài đồ chơi. Khi con trai của Bowser xuất hiện và bắt cóc công chúa Rosalina ở hành tinh khác để phục vụ cho âm giải cứu cha và xâm chiếm vũ trụ, hội bạn Mario lại một lần nữa trở thành vị cứu tinh. Cuối cùng, cha con nhà Bowser bị nhốt vào tù và Vương Quốc Nấm chào đón công chúa Rosalina làm thành viên mới.',99,'2026-03-31','https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F04-2026%2Fmario_1.jpg&w=1920&q=75','https://www.youtube.com/watch?v=pY0u714WV3M','RELEASED','2026-04-04 00:46:16','2026-04-04 00:46:45'),(14,'PHI VỤ CUỐI CÙNG','Petch là một tay súng đánh thuê, người đã dành phần lớn cuộc đời sống giữa thế giới bạo lực, nơi những phi vụ đẫm máu diễn ra như một phần công việc thường nhật. Sau nhiều năm lún sâu vào tội lỗi, Petch bắt đầu khao khát rời bỏ con đường cũ để tìm lại tự do và một cuộc sống bình thường. Thế nhưng quá khứ không dễ dàng buông tha anh. Khi những người thân cận bị cuốn vào cuộc thanh trừng giữa các băng nhóm, Petch buộc phải quay lại thế giới mà anh từng cố gắng trốn chạy. Anh chấp nhận thực hiện một nhiệm vụ cuối cùng đầy nguy hiểm, với hy vọng có thể xóa bỏ mọi ân oán trong quá khứ. Nhưng cũng từ đây, Petch bị đẩy vào cuộc đối đầu nghẹt thở với những thế lực từng tạo nên anh. Trong trận chiến sinh tử ấy, mỗi viên đạn đều mang theo cái giá phải trả, và chỉ một sai lầm cũng có thể khiến anh đánh đổi bằng chính mạng sống của mình.',113,'2026-04-02','https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F04-2026%2Fphi-vu-cuoi-cung.jpg&w=1920&q=75','https://www.youtube.com/watch?v=WA3Z0edDBmA','RELEASED','2026-04-04 00:47:44','2026-04-04 00:47:44'),(15,'ÁNH DƯƠNG CỦA MẸ','Trong không gian ngột ngạt của một nhà tù nữ, một mầm sống mới đã nảy mầm: một bé gái chào đời giữa tiếng hát mừng sinh nhật và vòng tay của bốn nữ tù nhân. Mỗi người phụ nữ ấy đều mang một bản án và một quá khứ đầy vết sẹo, nhưng sự xuất hiện của đứa trẻ đã trở thành tia sáng duy nhất sưởi ấm tâm hồn họ. Mọi chuyện trở nên xáo trộn khi một tù nhân mới đầy nổi loạn gia nhập nhóm. Từ những va chạm, mâu thuẫn nảy lửa ban đầu, sự hiện diện ngây thơ của bé gái đã dần xóa tan khoảng cách, biến những con người xa lạ thành một gia đình đặc biệt. Hạnh phúc ngắn chẳng được bao lâu khi đứa trẻ được chẩn đoán mắc một căn bệnh hiểm nghèo về mắt, đe dọa sẽ lấy đi ánh sáng vĩnh viễn. Để dành tặng em một kỷ niệm cuối cùng thật trọn vẹn, những người mẹ \"không cùng huyết thống\" đã quyết định thành lập một dàn đồng ca ngay sau song sắt.',135,'2026-04-02','https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F04-2026%2Fsunshine.jpg&w=1920&q=75','https://www.youtube.com/watch?v=CT_CETdvEKQ','RELEASED','2026-04-04 00:48:51','2026-04-04 00:48:51'),(16,'CÚ NHẢY KỲ DIỆU','Hoppers xoay quanh Mabel, một cô gái yêu động vật, vô tình tiếp cận công nghệ cho phép chuyển ý thức con người vào cơ thể robot động vật. Nhờ đó, Mabel “nhảy” vào thế giới tự nhiên dưới hình dạng một con hải ly và có thể giao tiếp trực tiếp với các loài khác. Trong hành trình này, cô dần khám phá cách động vật nhìn nhận con người, đồng thời phát hiện những mối nguy đang đe dọa môi trường sống của chúng. Tận dụng công nghệ Nhảy, Mabel đã trở thành cầu nối, mang lại cuộc sống cân bằng cho cả con người và động vật.',105,'2026-03-12','https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F03-2026%2Fhoppers.jpg&w=1920&q=75','https://www.youtube.com/watch?v=ojERe5eLefY','RELEASED','2026-04-04 00:50:09','2026-04-04 00:50:09'),(17,'QUỶ NHẬP TRÀNG 2','Quỷ Nhập Tràng 2 thuộc thể loại kinh dị - tâm lý, kể về hành trình đầy ám ảnh của Minh Như khi cô trở lại xưởng nhuộm cũ của gia đình sau nhiều năm bị bỏ rơi. Bộ phim đi sâu vào những tổn thương bị vùi lấp, các bí mật ghê rợn từ quá khứ và sự ràng buộc định mệnh giữa con người với thế lực tà ác. Không chỉ dừng lại ở câu chuyện về quỷ dữ, Quỷ Nhập Tràng 2 còn là hành trình đối mặt với tội lỗi, sự thật và cái giá phải trả cho những quyết định sai lầm trong quá khứ. Tại đây, mỗi nhân vật đều bị cuốn vào vòng xoáy nghiệt ngã của “ác giả ác báo” nơi không có lối thoát.',126,'2026-03-12','https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F03-2026%2Fquy-nhap-trang.jpg&w=1920&q=75','https://www.youtube.com/watch?v=aYpMpnc2HqA','RELEASED','2026-04-04 00:51:10','2026-04-04 00:51:10'),(18,'MẶT NẠ DA NGƯỜI','Ki Mangun Suroto là một nghệ nhân múa rối Wayang nổi tiếng và đầy tham vọng, ông khao khát nắm giữ tà thuật cổ xưa để đạt được sự giàu có và bất tử. Năm 2021, ông mời Citra làm nghệ sĩ hát Sinden trong một buổi lễ, nhưng thực chất là muốn cô trở thành vật tế cuối cùng. Trong khi cố gắng kiếm tiền chữa bệnh cho em gái, Citra dần bị cuốn vào những nghi lễ kinh hoàng và phải tìm cách thoát khỏi số phận đáng sợ của mình.',86,'2026-03-26','https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F03-2026%2Fskin-eater.jpg&w=1920&q=75','https://www.youtube.com/watch?v=v_wbEzcfjfk','RELEASED','2026-04-04 01:04:28','2026-04-04 01:04:28');
/*!40000 ALTER TABLE `movies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` bigint NOT NULL AUTO_INCREMENT,
  `booking_id` bigint NOT NULL,
  `payment_method` enum('SEPAY','MOMO') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_no` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_time` datetime DEFAULT NULL,
  `status` enum('PENDING','SUCCESS','FAILED') COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `version` bigint DEFAULT '0',
  PRIMARY KEY (`payment_id`),
  KEY `booking_id` (`booking_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,3,'SEPAY','BKG36C50EE',NULL,'PENDING','2026-04-04 03:18:24','2026-04-04 03:18:24',0),(2,3,'SEPAY','BKG3531D96',NULL,'PENDING','2026-04-04 03:18:24','2026-04-04 03:18:24',0),(3,3,'SEPAY','BKG375FC5B',NULL,'PENDING','2026-04-04 03:24:03','2026-04-04 03:24:03',0),(4,3,'SEPAY','BKG32E277B',NULL,'PENDING','2026-04-04 03:24:03','2026-04-04 03:24:03',0),(5,3,'SEPAY','BKG3205BDF',NULL,'PENDING','2026-04-04 03:24:04','2026-04-04 03:24:04',0),(6,3,'SEPAY','BKG3462FE6',NULL,'PENDING','2026-04-04 03:24:04','2026-04-04 03:24:04',0),(7,3,'SEPAY','BKG3D6E054',NULL,'PENDING','2026-04-04 03:24:11','2026-04-04 03:24:11',0),(8,3,'SEPAY','BKG36022B7',NULL,'PENDING','2026-04-04 03:24:11','2026-04-04 03:24:11',0),(9,4,'SEPAY','BKG417F85E',NULL,'PENDING','2026-04-04 07:20:30','2026-04-04 07:20:30',0),(10,4,'SEPAY','BKG401EF6B',NULL,'PENDING','2026-04-04 07:20:30','2026-04-04 07:20:30',0),(11,5,'SEPAY','BKG5411A7B',NULL,'SUCCESS','2026-04-04 07:21:16','2026-04-04 07:22:23',1),(12,5,'SEPAY','BKG5B8A7D2',NULL,'PENDING','2026-04-04 07:21:16','2026-04-04 07:21:16',0),(13,6,'SEPAY','BKG636634A',NULL,'PENDING','2026-04-04 07:37:15','2026-04-04 07:37:15',0),(14,6,'SEPAY','BKG67BA1B4',NULL,'PENDING','2026-04-04 07:37:15','2026-04-04 07:37:15',0),(15,7,'SEPAY','BKG76C3F3A',NULL,'PENDING','2026-04-04 08:10:43','2026-04-04 08:10:43',0),(16,7,'SEPAY','BKG7B12BF0',NULL,'PENDING','2026-04-04 08:10:43','2026-04-04 08:10:43',0),(17,8,'SEPAY','BKG891D75C',NULL,'PENDING','2026-04-04 12:59:36','2026-04-04 12:59:36',0),(18,8,'SEPAY','BKG8797DAE',NULL,'PENDING','2026-04-04 12:59:36','2026-04-04 12:59:36',0),(19,9,'SEPAY','BKG96EC220',NULL,'PENDING','2026-04-05 02:35:26','2026-04-05 02:35:26',0),(20,9,'SEPAY','BKG93C377F',NULL,'PENDING','2026-04-05 02:35:26','2026-04-05 02:35:26',0),(21,9,'SEPAY','BKG9C07296',NULL,'PENDING','2026-04-05 02:36:45','2026-04-05 02:36:45',0),(22,9,'SEPAY','BKG9C402AB',NULL,'PENDING','2026-04-05 02:36:45','2026-04-05 02:36:45',0),(23,9,'SEPAY','BKG960F64A',NULL,'PENDING','2026-04-05 02:37:22','2026-04-05 02:37:22',0),(24,10,'SEPAY','BKG10AD9C07',NULL,'PENDING','2026-04-05 02:53:45','2026-04-05 02:53:45',0),(25,10,'SEPAY','BKG10EE74B9',NULL,'PENDING','2026-04-05 02:53:45','2026-04-05 02:53:45',0),(26,11,'SEPAY','BKG112FA919',NULL,'PENDING','2026-04-05 03:00:25','2026-04-05 03:00:25',0),(27,11,'SEPAY','BKG11C7ADFD',NULL,'PENDING','2026-04-05 03:00:25','2026-04-05 03:00:25',0),(28,11,'SEPAY','BKG115B689C',NULL,'PENDING','2026-04-05 03:02:07','2026-04-05 03:02:07',0),(29,11,'SEPAY','BKG11DADC67',NULL,'PENDING','2026-04-05 03:02:07','2026-04-05 03:02:07',0),(30,12,'SEPAY','BKG12631E46',NULL,'PENDING','2026-04-05 03:05:26','2026-04-05 03:05:26',0),(31,12,'SEPAY','BKG1241D9A7',NULL,'PENDING','2026-04-05 03:05:26','2026-04-05 03:05:26',0),(32,13,'SEPAY','BKG13DBC4B2',NULL,'PENDING','2026-04-05 03:09:44','2026-04-05 03:09:44',0),(33,13,'SEPAY','BKG13F781E9',NULL,'PENDING','2026-04-05 03:09:44','2026-04-05 03:09:44',0),(34,13,'SEPAY','BKG13C9B000',NULL,'SUCCESS','2026-04-05 03:09:55','2026-04-05 03:10:13',1),(35,14,'SEPAY','BKG14455382',NULL,'PENDING','2026-04-05 03:16:14','2026-04-05 03:16:14',0),(36,14,'SEPAY','BKG147ADAD2',NULL,'PENDING','2026-04-05 03:16:14','2026-04-05 03:16:14',0),(37,14,'SEPAY','BKG141B426F',NULL,'SUCCESS','2026-04-05 03:16:33','2026-04-05 03:17:00',1);
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` bigint NOT NULL AUTO_INCREMENT,
  `name` enum('CUSTOMER','ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'CUSTOMER','2026-03-30 13:30:24','2026-03-30 13:30:24'),(2,'ADMIN','2026-03-30 13:30:29','2026-03-30 13:30:29');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `room_id` bigint NOT NULL AUTO_INCREMENT,
  `cinema_id` bigint NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`room_id`),
  KEY `cinema_id` (`cinema_id`),
  CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`cinema_id`) REFERENCES `cinemas` (`cinema_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,1,'Phòng A1','2026-04-04 00:09:29','2026-04-04 00:09:29'),(2,1,'Phòng A2','2026-04-04 00:09:35','2026-04-04 00:09:35'),(3,1,'Phòng A3','2026-04-04 00:09:42','2026-04-04 00:09:42'),(4,1,'Phòng A4','2026-04-04 00:09:47','2026-04-04 00:09:47'),(5,2,'Phòng B1','2026-04-04 00:09:53','2026-04-04 00:09:53'),(6,2,'Phòng B2','2026-04-04 00:09:58','2026-04-04 00:09:58'),(7,2,'Phòng B3','2026-04-04 00:10:05','2026-04-04 00:10:05'),(8,2,'Phòng B4','2026-04-04 00:10:12','2026-04-04 00:10:12'),(13,4,'Phòng D1','2026-04-04 00:10:48','2026-04-04 00:10:48'),(14,4,'Phòng D2','2026-04-04 00:10:55','2026-04-04 00:10:55'),(16,4,'Phòng D3','2026-04-04 00:11:25','2026-04-04 00:11:25'),(17,4,'Phòng D4','2026-04-04 00:11:30','2026-04-04 00:11:30');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seats`
--

DROP TABLE IF EXISTS `seats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seats` (
  `seat_id` bigint NOT NULL AUTO_INCREMENT,
  `room_id` bigint NOT NULL,
  `row_symbol` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `seat_number` int NOT NULL,
  `type` enum('NORMAL','VIP','SWEETBOX') COLLATE utf8mb4_unicode_ci DEFAULT 'NORMAL',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`seat_id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `seats_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seats`
--

LOCK TABLES `seats` WRITE;
/*!40000 ALTER TABLE `seats` DISABLE KEYS */;
INSERT INTO `seats` VALUES (1,1,'A',1,'NORMAL','2026-04-04 03:03:48','2026-04-04 03:03:48'),(2,1,'A',2,'NORMAL','2026-04-04 03:03:48','2026-04-04 03:03:48'),(3,1,'A',3,'NORMAL','2026-04-04 03:03:48','2026-04-04 03:03:48'),(4,1,'A',4,'NORMAL','2026-04-04 03:03:48','2026-04-04 03:03:48'),(5,1,'B',1,'VIP','2026-04-04 03:03:48','2026-04-04 03:03:48'),(6,1,'B',2,'VIP','2026-04-04 03:03:48','2026-04-04 03:03:48'),(7,1,'B',3,'VIP','2026-04-04 03:03:48','2026-04-04 03:03:48'),(8,1,'B',4,'VIP','2026-04-04 03:03:48','2026-04-04 03:03:48'),(9,1,'C',1,'SWEETBOX','2026-04-04 03:03:48','2026-04-04 03:03:48'),(10,1,'C',2,'SWEETBOX','2026-04-04 03:03:48','2026-04-04 03:03:48');
/*!40000 ALTER TABLE `seats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `showtimes`
--

DROP TABLE IF EXISTS `showtimes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `showtimes` (
  `showtime_id` bigint NOT NULL AUTO_INCREMENT,
  `movie_id` bigint NOT NULL,
  `room_id` bigint NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`showtime_id`),
  KEY `movie_id` (`movie_id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `showtimes_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`) ON DELETE CASCADE,
  CONSTRAINT `showtimes_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `showtimes`
--

LOCK TABLES `showtimes` WRITE;
/*!40000 ALTER TABLE `showtimes` DISABLE KEYS */;
INSERT INTO `showtimes` VALUES (1,11,1,'2026-04-10 09:00:00','2026-04-10 11:05:00',85000.00,'2026-04-04 01:11:39','2026-04-04 01:11:39'),(2,12,2,'2026-04-10 09:00:00','2026-04-10 11:00:00',75000.00,'2026-04-04 01:21:28','2026-04-04 01:21:28'),(3,13,5,'2026-04-05 09:00:00','2026-04-05 10:45:00',75000.00,'2026-04-04 01:22:14','2026-04-04 01:22:14'),(4,11,1,'2026-04-04 10:00:00','2026-04-04 12:46:00',80000.00,'2026-04-04 03:01:06','2026-04-04 03:01:06'),(5,12,1,'2026-04-04 14:00:00','2026-04-04 16:46:00',90000.00,'2026-04-04 03:01:06','2026-04-04 03:01:06'),(6,13,1,'2026-04-04 18:30:00','2026-04-04 21:16:00',120000.00,'2026-04-04 03:01:06','2026-04-04 03:01:06'),(7,14,1,'2026-04-05 10:00:00','2026-04-05 12:46:00',85000.00,'2026-04-04 03:01:06','2026-04-04 03:01:06'),(8,15,1,'2026-04-05 14:00:00','2026-04-05 16:46:00',95000.00,'2026-04-04 03:01:06','2026-04-04 03:01:06'),(9,16,1,'2026-04-05 18:30:00','2026-04-05 21:16:00',125000.00,'2026-04-04 03:01:06','2026-04-04 03:01:06'),(10,17,2,'2026-04-04 17:00:00','2026-04-04 19:11:00',85000.00,'2026-04-04 03:01:06','2026-04-04 03:01:06'),(11,18,2,'2026-04-04 20:00:00','2026-04-04 22:11:00',95000.00,'2026-04-04 03:01:06','2026-04-04 03:01:06'),(12,11,2,'2026-04-05 17:00:00','2026-04-05 19:11:00',90000.00,'2026-04-04 03:01:06','2026-04-04 03:01:06'),(13,12,2,'2026-04-05 20:00:00','2026-04-05 22:11:00',100000.00,'2026-04-04 03:01:06','2026-04-04 03:01:06');
/*!40000 ALTER TABLE `showtimes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `ticket_id` bigint NOT NULL AUTO_INCREMENT,
  `booking_id` bigint NOT NULL,
  `seat_id` bigint NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ticket_id`),
  KEY `booking_id` (`booking_id`),
  KEY `seat_id` (`seat_id`),
  CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE,
  CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`seat_id`) REFERENCES `seats` (`seat_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES (1,1,1,85000.00,'2026-04-04 03:11:40','2026-04-04 03:11:40'),(2,2,2,85000.00,'2026-04-04 03:13:10','2026-04-04 03:13:10'),(3,3,3,85000.00,'2026-04-04 03:18:24','2026-04-04 03:18:24'),(4,4,1,80000.00,'2026-04-04 07:20:29','2026-04-04 07:20:29'),(5,5,1,80000.00,'2026-04-04 07:21:16','2026-04-04 07:21:16'),(6,6,1,90000.00,'2026-04-04 07:37:14','2026-04-04 07:37:14'),(7,7,2,80000.00,'2026-04-04 08:10:42','2026-04-04 08:10:42'),(8,8,2,80000.00,'2026-04-04 12:59:35','2026-04-04 12:59:35'),(9,9,1,85000.00,'2026-04-05 02:35:24','2026-04-05 02:35:24'),(10,10,1,95000.00,'2026-04-05 02:53:43','2026-04-05 02:53:43'),(11,11,1,95000.00,'2026-04-05 03:00:23','2026-04-05 03:00:23'),(12,12,1,85000.00,'2026-04-05 03:05:26','2026-04-05 03:05:26'),(13,13,1,85000.00,'2026-04-05 03:09:43','2026-04-05 03:09:43'),(14,14,2,85000.00,'2026-04-05 03:16:13','2026-04-05 03:16:13');
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `role_id` bigint NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (4,2,'admin@mecinema.com','$2a$10$adxfxDiCvWh.zyHLHQ52muo.xnMQWb8fsDpi0016c.sskB1hkNku6','Admin','19003636','2026-03-30 14:00:58','2026-03-30 14:00:58'),(5,1,'tranvanc@gmail.com','$2a$10$AZXtVNBdWDF2sIb4Fne0BuZ.AMan3nFSHqodMUK9g1tE.1agCuaI6','Tran Van C','0936363681','2026-03-31 06:51:52','2026-04-05 03:18:55'),(6,1,'nnm14052005@gmail.com','$2a$10$/fWqgYOfi1FhBKLbd.ZXR./xK3Oj7TaI6UcZMyyLOTtbYWiEDkhwq','Nguyễn Nhật Minh','0944363636','2026-04-02 07:42:19','2026-04-02 07:50:22'),(7,1,'nguyennhatminh0514@gmail.com','$2a$10$nPPO2xXRZ0SAubRDvmUm.OxvWbyJ7rJxLfYZsFYnVH5hX7LNXfTiS','Nguyễn Nhật Minh','0334128493','2026-04-02 08:24:20','2026-04-02 08:24:20'),(8,1,'abc@gmail.com','$2a$10$5MaHYpK72RDHH87ARjviHu9DXVMlPeqVzrWDgHe1M7Xgl1IhcnQA6','Minh Nguyễn','0936361818','2026-04-04 07:32:05','2026-04-04 07:32:33'),(9,1,'xemphim@gmail.com','$2a$10$.4aN.nV/z7ApIPhfm02gxekFOFnOS2.usba/kIjg139SWb1mG5iUG','Nguyễn Văn A','0918181818','2026-04-05 02:34:04','2026-04-05 02:34:04'),(11,1,'nnm@gmail.com','$2a$10$Nj2vBq6vepqTNMfQXLP1X.iYysDtPNS0b3f4fXpIol5b6EHiezlDi','Nguyễn Nhật Minh','0936363618','2026-04-05 02:52:51','2026-04-05 02:52:51'),(12,1,'nnminh@gmail.com','$2a$10$g9lXBpNZ7pEZN/dP.xI50.a0FIEMynFElYYbsEbGTt/7NLB1ys7ay','Nguyễn Nhật Minh','0936183636','2026-04-05 03:14:47','2026-04-05 03:17:40'),(13,1,'nguyennhatminh@gmail.com','$2a$10$sG3iSo4HMsz179n1pQP9dOfS7dOwqdFVELATQGECJAgDS53Shp6Fq','Nguyễn Văn A','0912345762','2026-04-05 03:18:45','2026-04-05 03:18:45');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-05 10:55:26
