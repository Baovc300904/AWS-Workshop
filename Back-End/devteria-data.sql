-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: identity_service
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK9emlp6m95v5er2bcqkjsw48he` (`user_id`),
  CONSTRAINT `FKl70asp4l4w0jmbm1tqyofho4o` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES ('0b7928ce-17e3-484b-a848-c4ea62ca9542','cca77703-af11-4131-987a-862db7f06869'),('f97ac08a-9fba-4411-807b-3b4aacd1aa30','dadc8a62-24ab-4996-bcbd-2ab01ee507d5'),('9789b791-9e19-491c-9f8e-c7ce5e5d95c1','ee0d73bc-aca7-49ef-8d76-b067f42332f9');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_item`
--

DROP TABLE IF EXISTS `cart_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_item` (
  `id` varchar(255) NOT NULL,
  `quantity` int DEFAULT NULL,
  `cart_id` varchar(255) DEFAULT NULL,
  `game_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1uobyhgl1wvgt1jpccia8xxs3` (`cart_id`),
  KEY `FKjoxxdj669ic1o89lbub5fy29v` (`game_id`),
  CONSTRAINT `FK1uobyhgl1wvgt1jpccia8xxs3` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`),
  CONSTRAINT `FKjoxxdj669ic1o89lbub5fy29v` FOREIGN KEY (`game_id`) REFERENCES `game` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_item`
--

LOCK TABLES `cart_item` WRITE;
/*!40000 ALTER TABLE `cart_item` DISABLE KEYS */;
INSERT INTO `cart_item` VALUES ('8a7b7bbc-53ba-43bd-9cb0-7c2fec4200d8',1,'0b7928ce-17e3-484b-a848-c4ea62ca9542','07e8b0c5-95ba-414c-b898-592fc5072aed'),('a2e4a1bc-e195-4f35-b4c3-fa4ee52ac50f',1,'0b7928ce-17e3-484b-a848-c4ea62ca9542','f8eefc13-78d2-4867-88e1-2e71e445c2fb'),('b3f70206-2a28-453e-bcf9-5a0cccb9c10b',6,'f97ac08a-9fba-4411-807b-3b4aacd1aa30','27ba31c7-1226-435a-bc81-4f0970efab7c'),('c20cd43f-e40d-42c1-8bb2-41285e1688b6',1,'9789b791-9e19-491c-9f8e-c7ce5e5d95c1','f838954a-3886-4efb-80d8-08fae1ad110c'),('eca5525b-a179-40e1-88cc-77f7979bcf68',7,'0b7928ce-17e3-484b-a848-c4ea62ca9542','f838954a-3886-4efb-80d8-08fae1ad110c');
/*!40000 ALTER TABLE `cart_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES ('3D','Step into a fully immersive 3D world where every detail comes to life. From realistic environments to dynamic animations, experience next-level visuals that make every battle, race, or adventure feel real.'),('Abilities','Players acquire weapons, spells, and abilities through a progression system tied to defeating specific enemies.'),('Action','This is a general genre, including action elements and intense gunfights in the game.'),('Action-Adventure','Players perform actions such as fighting, exploring the world, and solving quests within a storyline.'),('Adventure',NULL),('Battle Royale','Some Call of Duty titles, most notably Warzone, fall into this genre, where multiple players join together in a large map, fighting to be the last one standing. '),('Blood Types','Players can consume blood from enemies to gain specific blood types, which act as buffs and are a core gameplay category.'),('Boss Rushes','A significant portion of the gameplay involves fighting large, elaborate boss encounters.'),('Casual',NULL),('Co-op',NULL),('Crafting','Players can collect materials and use them to craft tools, weapons, and other items.'),('Creature',NULL),('FPS','This is the main genre of Call of Duty, the player experiences the world through the perspective of the main character, focusing on shooting and combat.'),('Funny','You can die with a smile'),('Game Modes','It supports Singleplayer, Multiplayer, and Online Co-Op modes'),('Genre','V Rising is categorized as an Action, Adventure, Massively Multiplayer, Open-World, Survival game.'),('Horror','If you have weakness heart, please don\'t play'),('Multiplayer',NULL),('Multiplayers','The Multiplayer category features games that let players connect and interact in real time — fight together, build worlds, or compete to prove your skills and teamwork.'),('Open World','The game takes place in a large environment, allowing players to explore freely.'),('Platformer Elements','The 2D side-scrolling nature and movement through various environments also place it within the platformer category. '),('Puzzle','Game giải đố'),('PvP','Test your skills against real players in intense PvP battles. Every match is a showdown of strategy, reflex, and skill — where only the best come out on top.'),('Racing','Game đua xe'),('Role-Playing Game','Players control a character and perform quests, develop skills, and interact with the world around them.'),('RPG','Game nhập vai'),('Run and Gun','Players control characters (Cuphead and Mugman) who shoot their way through levels to defeat enemies and collect souls.'),('Shooter',NULL),('Simulation','Game mô phỏng'),('Sports','Feel the adrenaline of real competition! Step into the arena, court, or field and challenge yourself in exciting sports experiences that test your skill, timing, and strategy.'),('Strategy','Game chiến thuật'),('Survival','Players must collect resources, build bases and defend themselves in an open world.'),('Unique Art Style','The game\'s visual and audio design is a defining characteristic, meticulously recreating the aesthetic of early cartoons.'),('Zombie Mode','Some Call of Duty games also feature a side game mode that focuses on fending off zombie attacks. ');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_otp`
--

DROP TABLE IF EXISTS `email_otp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_otp` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `expires_at` datetime(6) DEFAULT NULL,
  `used` bit(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_otp`
--

LOCK TABLES `email_otp` WRITE;
/*!40000 ALTER TABLE `email_otp` DISABLE KEYS */;
INSERT INTO `email_otp` VALUES ('05457ddf-f72e-4df7-81b5-b4198759e161','596664','khoaphanconghon62@gmail.com','2025-10-20 16:25:20.435396',_binary ''),('14b0cc86-a763-49df-893b-4b431ccb3114','127747','huynhvuminhkhoi04082004@gmail.com','2025-10-15 12:33:23.313132',_binary '\0'),('16821cbb-7962-4448-9da2-3b54acc272ca','009850','khoaphanconghon62@gmail.com','2025-10-28 07:45:33.005945',_binary '\0'),('1cb3837d-3b5a-4b3c-a2d3-9a1b578821ec','519328','khoaphanconghon62@gmail.com','2025-10-28 08:05:57.142051',_binary '\0'),('1d433b3b-2537-4e01-9140-e23ba89e576e','103241','minkoi0408@gmail.com','2025-10-15 13:07:16.951166',_binary '\0'),('1e0878ab-4841-44b6-99f4-915185d8ee80','095123','khoaphanconghon62@gmail.com','2025-10-28 08:20:02.524067',_binary '\0'),('1f0ddd8f-c476-416e-b4bd-5beb0e8f351d','525913','huynhvuminhkhoi04082004@gmail.com','2025-10-15 12:19:18.849255',_binary '\0'),('2c7c946a-eea3-41bd-a1e7-b2c5a60e4792','172819','khoaphanconghon62@gmail.com','2025-10-28 08:30:19.939157',_binary '\0'),('2cf3a394-93be-4c13-b386-8946c4e6bd2e','962757','huynhvuminhkhoi04082004@gmail.com','2025-10-15 12:12:57.052342',_binary '\0'),('2f26b82a-65af-47b7-b6d8-245a5848cf8d','196080','khoaphanconghon62@gmail.com','2025-10-28 07:44:11.615232',_binary '\0'),('36e16c4d-8cb5-4353-b475-84ea7ce30c99','096812','khoaphanconghon62@gmail.com','2025-10-28 08:11:13.031410',_binary '\0'),('37e5c6b9-01be-4b7b-9e9d-9c83a370f5c8','311200','khoaphanconghon62@gmail.com','2025-10-20 16:14:04.572548',_binary ''),('3ed2e716-7b8f-4f1c-8f4c-fbe340242f43','596687','khoaphanconghon62@gmail.com','2025-10-28 08:17:20.286753',_binary '\0'),('416a92ba-5ee8-4755-bf47-3021b664430e','207991','khoaphanconghon62@gmail.com','2025-10-28 08:24:55.632044',_binary '\0'),('42277348-b038-4490-9b64-76751ece5dd8','011318','minkoi0408@gmail.com','2025-10-15 12:50:40.027885',_binary '\0'),('44649d99-ac56-4bb0-a6fc-8f62919662f4','884029','khoaphanconghon62@gmail.com','2025-10-28 08:16:44.904534',_binary '\0'),('4cafc830-b982-4bb9-88fb-de141d829899','143514','khoaphanconghon62@gmail.com','2025-10-28 08:10:19.081952',_binary '\0'),('4f47b461-3b43-48b0-aac8-3de96e2e2d00','772254','khoaphanconghon62@gmail.com','2025-10-28 07:11:33.137166',_binary '\0'),('5573fcb1-0643-41ef-8ed9-1c517ceaf71b','522978','huynhvuminhkhoi04082004@gmail.com','2025-10-15 12:21:03.079692',_binary '\0'),('5b8b714f-2500-4b70-9b58-102b6b079bf1','253741','khoaphanconghon62@gmail.com','2025-10-28 08:18:24.932742',_binary '\0'),('5e9670b0-d6d8-4c94-ba68-d207e8741125','477727','huynhvuminhkhoi04082004@gmail.com','2025-10-15 12:14:16.564621',_binary '\0'),('5febf068-50dd-4dad-ad51-ec6de8e26ca2','138048','khoaphanconghon62@gmail.com','2025-10-28 08:04:56.323256',_binary '\0'),('657d413b-2f58-466b-bb7c-4bf6fa059f26','269307','khoaphanconghon62@gmail.com','2025-10-28 08:27:45.726821',_binary '\0'),('68a33e3e-f3d5-4dd7-8582-01bd19e7d3a9','507086','minkoi0408@gmail.com','2025-10-15 12:44:43.511923',_binary '\0'),('6eb3b5de-2669-48d5-9cf6-5313dd0fd668','598701','khoaphanconghon62@gmail.com','2025-10-28 08:28:00.998931',_binary '\0'),('77d5d6d7-ff2c-4774-8bbf-700afbee37a3','556083','khoaphanconghon62@gmail.com','2025-10-28 07:03:56.653798',_binary ''),('786a06c5-a2e5-4def-83ec-9de573bf3295','778216','minkoi04082004@gmail.com','2025-10-15 13:11:23.003261',_binary '\0'),('80b01dae-b1eb-448a-ae4c-2c0be88ca50b','706444','minkoi0408@gmail.com','2025-10-15 12:39:53.068776',_binary '\0'),('80e336b4-835d-4174-bf0c-f8f959b8a0ed','021040','khoaphanconghon62@gmail.com','2025-10-28 08:33:29.399339',_binary '\0'),('9007f857-76f9-478e-a46a-be057a01253c','411576','khoaphanconghon62@gmail.com','2025-10-28 08:16:00.662942',_binary '\0'),('9a899843-90f2-4180-83ef-0b7ca682f60d','449882','minkoi@gmail.com','2025-10-15 13:07:02.553504',_binary '\0'),('9f4bda9a-aacc-4709-ac31-4285d0f4de52','313246','minkoi0408@gmail.com','2025-10-15 12:57:29.879202',_binary '\0'),('9fcb8283-b314-4f05-be81-c082626a78bb','823620','khoaphanconghon62@gmail.com','2025-10-28 07:39:42.652267',_binary '\0'),('a562cbb4-9dd1-46b0-a7ac-04595103b5ac','468343','khoaphanconghon62@gmail.com','2025-11-11 07:40:07.025808',_binary ''),('b0dd605f-6e75-4eea-91ca-1799e7e33184','229402','khoaphanconghon62@gmail.com','2025-10-28 07:48:50.748691',_binary '\0'),('ba0d8c48-085a-40d5-ba3d-025d9d5a11db','830842','minkoi0408@gmail.com','2025-10-15 12:52:27.528017',_binary '\0'),('be1a12a7-d5cc-4a27-bb6e-e10a83e638fe','231196','khoaphanconghon62@gmail.com','2025-10-28 08:08:51.827418',_binary '\0'),('c8415b5b-5541-4530-871a-a0ec1bb055ea','794131','khoaphanconghon62@gmail.com','2025-10-28 08:18:02.645745',_binary '\0'),('d3cf9699-647d-42bb-a19a-319e335fd8aa','964243','se182703lenguyendiephuy@gmail.com','2025-12-08 08:12:06.027436',_binary ''),('d7df325a-70ae-40eb-ae41-1abfb0d8c5f7','074150','huynhvuminhkhoi04082004@gmail.com','2025-10-15 12:13:20.169199',_binary '\0'),('dcdf7eb4-d2c3-4147-9614-9d19c95a0c54','404971','khoaphanconghon62@gmail.com','2025-11-02 15:35:24.784301',_binary '\0'),('e1beddd7-282f-4ec6-bef3-fb35a1eea923','560973','minkoi0408@gmail.com','2025-10-15 12:53:31.776581',_binary '\0'),('e55b82ff-8d9f-42d7-973e-06d895c0b70c','328943','huynhvuminhkhoi04082004@gmail.com','2025-10-15 12:22:53.226028',_binary '\0'),('e738b0cd-8837-4343-b737-eef7d4e2f41b','814540','huynhvuminhkhoi04082004@gmail.com','2025-10-15 12:19:00.928456',_binary '\0'),('e9279176-deee-4a6f-84da-352962a3b430','942778','khoaphanconghon62@gmail.com','2025-10-28 08:08:04.597065',_binary '\0'),('ea06d83a-b7ba-496f-8218-0f64ae315166','777574','minkoi0408@gmail.com','2025-10-15 13:11:32.639769',_binary ''),('ecedc5a6-006f-4f71-a645-b2fa9e47e71f','648400','khoaphanconghon62@gmail.com','2025-11-11 06:55:02.609119',_binary ''),('f63e683d-bd39-4409-9f29-6087e1279aa3','043516','minkoi0408@gmail.com','2025-10-15 12:49:16.700739',_binary '\0'),('fe49fb0d-8b00-43f8-acf6-17d7ee3447e8','169657','minkoi0408@gmail.com','2025-10-15 13:02:25.419707',_binary '\0');
/*!40000 ALTER TABLE `email_otp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game`
--

DROP TABLE IF EXISTS `game`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `sale_percent` double DEFAULT NULL,
  `cover` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `rating` double DEFAULT NULL,
  `release_date` date DEFAULT NULL,
  `video` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `system_requirements` text,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game`
--

LOCK TABLES `game` WRITE;
/*!40000 ALTER TABLE `game` DISABLE KEYS */;
INSERT INTO `game` VALUES ('07e8b0c5-95ba-414c-b898-592fc5072aed','Rematch',500000,1,30,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfH7I1Um-tl2dzd370WKP2dlP4Fgl6sDNQnQ&s','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfH7I1Um-tl2dzd370WKP2dlP4Fgl6sDNQnQ&s',NULL,'2023-01-15','https://www.youtube-nocookie.com/embed/mo_RL_K891U?autoplay=1&mute=1&loop=1&playlist=mo_RL_K891U&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&disablekb=1&showinfo=0&fs=0&title=0',NULL,NULL,NULL),('27ba31c7-1226-435a-bc81-4f0970efab7c','Phasmophobia',344000,10,0,'https://cdn2.fptshop.com.vn/unsafe/960x0/filters:format(webp):quality(75)/2023_12_22_638388544972449475_phasmophobia-thum.jpg','https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2023_12_22_638388544972449475_phasmophobia-thum.jpg',NULL,'2020-09-18','https://www.youtube-nocookie.com/embed/sRa9oeo5KiY?autoplay=1&mute=1&loop=1&playlist=sRa9oeo5KiY&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&disablekb=1&showinfo=0&fs=0&title=0',NULL,NULL,NULL),('8ab800a7-4bc3-4bf8-9f65-30788055bd43','REPO',450000,2,NULL,'https://cdn.dlcompare.com/game_tetiere/upload/gameimage/file/r-e-p-o-file-207303896c.jpg.webp','https://cdn.dlcompare.com/game_tetiere/upload/gameimage/file/r-e-p-o-file-207303896c.jpg.webp',NULL,'2023-03-20','https://www.youtube-nocookie.com/embed/oSfoK8eSeD8?autoplay=1&mute=1&loop=1&playlist=oSfoK8eSeD8&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&disablekb=1&showinfo=0&fs=0&title=0',NULL,NULL,NULL),('d877cbc6-ec3c-42e4-ab29-fdf8da3474af','Cuphead',500000,1,NULL,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyVQ8pbT1GsxKiONB0nw0zpbHlTuDuiLi7tQ&s','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyVQ8pbT1GsxKiONB0nw0zpbHlTuDuiLi7tQ&s',NULL,'2017-09-29','https://www.youtube-nocookie.com/embed/NN-9SQXoi50?autoplay=1&mute=1&loop=1&playlist=NN-9SQXoi50&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&disablekb=1&showinfo=0&fs=0&title=0',NULL,NULL,NULL),('f171e1bc-5048-4d56-aeb2-914d301c1d14','Call of Duty',1900000,10,0,'https://tamhongame.net/storage/games/call-of-duty-black-ops-6/call-of-duty-black-ops-6-horizontal_photo-vw2Mptr6ftK6otZbrzka.jpeg','https://tamhongame.net/storage/games/call-of-duty-black-ops-6/call-of-duty-black-ops-6-horizontal_photo-vw2Mptr6ftK6otZbrzka.jpeg',NULL,'2022-10-28','https://www.youtube-nocookie.com/embed/9txkGBj_trg?autoplay=1&mute=1&loop=1&playlist=9txkGBj_trg&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&disablekb=1&showinfo=0&fs=0&title=0',NULL,NULL,NULL),('f838954a-3886-4efb-80d8-08fae1ad110c','PEAK',250000,7,0,'https://tamhongame.net/storage/games/peak-online-multiplayer/peak-online-multiplayer-vertical_photo-6QMXdTk37H4F0uqXhKQ2.jpeg','https://tamhongame.net/storage/games/peak-online-multiplayer/peak-online-multiplayer-vertical_photo-6QMXdTk37H4F0uqXhKQ2.jpeg',NULL,'2023-06-15','https://www.youtube-nocookie.com/embed/jrlUVhLBjG0?autoplay=1&mute=1&loop=1&playlist=jrlUVhLBjG0&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&disablekb=1&showinfo=0&fs=0&title=0',NULL,NULL,'1. Lối chơi (Gameplay)\nThay vì cầm súng bắn nhau hay đua xe, bạn sẽ chơi các mini-game ngắn, mỗi trò chơi chỉ kéo dài khoảng 30 giây đến 2 phút. Các trò chơi này được thiết kế dựa trên nghiên cứu khoa học thần kinh để kích thích các vùng não cụ thể.\n\nHình thức: Bạn sẽ thực hiện các thao tác như chạm, vuốt, ghi nhớ vị trí, sắp xếp con số, hoặc nối từ vựng nhanh nhất có thể.\n\nChế độ chơi: Hàng ngày, game sẽ đưa ra cho bạn một \"Bài tập\" (Workout) bao gồm 3-5 game ngẫu nhiên để bạn hoàn thành.\n\n2. Các kỹ năng rèn luyện\nPeak tập trung vào việc cải thiện 6 kỹ năng nhận thức chính:\n\nMemory (Trí nhớ): Ghi nhớ vị trí các ô, thứ tự xuất hiện của vật thể.\n\nFocus (Sự tập trung): Phân loại hình dáng/màu sắc trong môi trường gây nhiễu, tìm điểm khác biệt.\n\nProblem Solving (Giải quyết vấn đề): Các bài toán logic, hình học không gian.\n\nMental Agility (Sự nhanh nhạy): Phản xạ nhanh, chuyển đổi quy tắc chơi liên tục.\n\nLanguage (Ngôn ngữ): Tìm từ, ghép từ (chủ yếu hỗ trợ tốt tiếng Anh).\n\nEmotion (Cảm xúc): Đây là điểm đặc biệt của Peak, giúp rèn luyện khả năng nhận diện cảm xúc khuôn mặt và kiểm soát phản ứng.\n\n3. Tính năng nổi bật\nPeak Brain Score (PBS): Sau khi chơi, game sẽ chấm điểm cho não bộ của bạn. Điểm số này sẽ thay đổi hàng ngày để bạn thấy sự tiến bộ.\n\nSo sánh: Bạn có thể so sánh điểm số của mình với những người dùng khác cùng độ tuổi hoặc cùng nghề nghiệp trên toàn thế giới.\n\nCoach (Huấn luyện viên ảo): Game có một nhân vật \"Coach\" giúp theo dõi tiến độ, nhắc nhở bạn vào tập luyện và đề xuất các bài tập phù hợp với điểm yếu của bạn.\n\nĐồ họa & Âm thanh: Thiết kế theo phong cách phẳng (Flat design), màu sắc tươi sáng, hiện đại. Âm thanh nhẹ nhàng, mang tính khích lệ, không gây căng thẳng.'),('f8eefc13-78d2-4867-88e1-2e71e445c2fb','PalWord',275000,10,10,'https://tamhongame.net/storage/games/palworld/palworld-horizontal_photo-HdHSYiLAMsEe6LAWrRyV.jpeg','https://tamhongame.net/storage/games/palworld/palworld-horizontal_photo-HdHSYiLAMsEe6LAWrRyV.jpeg',NULL,'2024-01-19','https://www.youtube-nocookie.com/embed/D9w97KSEAOo?autoplay=1&mute=1&loop=1&playlist=D9w97KSEAOo&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&disablekb=1&showinfo=0&fs=0&title=0',NULL,NULL,NULL),('fae4dfeb-591e-41f9-b001-d5da3ec2ed65','V RISING',800000,2,20,'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/06/game-v-rising-thumb.jpg','https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/06/game-v-rising-thumb.jpg',NULL,'2022-05-17','https://www.youtube-nocookie.com/embed/iCEpBpJ3paQ?autoplay=1&mute=1&loop=1&playlist=iCEpBpJ3paQ&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&disablekb=1&showinfo=0&fs=0&title=0',NULL,NULL,NULL);
/*!40000 ALTER TABLE `game` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_categories`
--

DROP TABLE IF EXISTS `game_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_categories` (
  `game_id` varchar(255) NOT NULL,
  `categories_name` varchar(255) NOT NULL,
  PRIMARY KEY (`game_id`,`categories_name`),
  KEY `FK2gkn248dkac09vu8v2t7eb641` (`categories_name`),
  CONSTRAINT `FK2gkn248dkac09vu8v2t7eb641` FOREIGN KEY (`categories_name`) REFERENCES `category` (`name`),
  CONSTRAINT `FKd6waavfh76ysrsw09jaf7tgrn` FOREIGN KEY (`game_id`) REFERENCES `game` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_categories`
--

LOCK TABLES `game_categories` WRITE;
/*!40000 ALTER TABLE `game_categories` DISABLE KEYS */;
INSERT INTO `game_categories` VALUES ('07e8b0c5-95ba-414c-b898-592fc5072aed','Action'),('8ab800a7-4bc3-4bf8-9f65-30788055bd43','Action'),('d877cbc6-ec3c-42e4-ab29-fdf8da3474af','Action'),('f171e1bc-5048-4d56-aeb2-914d301c1d14','Action'),('fae4dfeb-591e-41f9-b001-d5da3ec2ed65','Action'),('8ab800a7-4bc3-4bf8-9f65-30788055bd43','Adventure'),('f838954a-3886-4efb-80d8-08fae1ad110c','Casual'),('27ba31c7-1226-435a-bc81-4f0970efab7c','Co-op'),('f8eefc13-78d2-4867-88e1-2e71e445c2fb','Creature'),('27ba31c7-1226-435a-bc81-4f0970efab7c','Horror'),('27ba31c7-1226-435a-bc81-4f0970efab7c','Multiplayer'),('f838954a-3886-4efb-80d8-08fae1ad110c','Multiplayer'),('f8eefc13-78d2-4867-88e1-2e71e445c2fb','Open World'),('f171e1bc-5048-4d56-aeb2-914d301c1d14','Shooter'),('f8eefc13-78d2-4867-88e1-2e71e445c2fb','Survival');
/*!40000 ALTER TABLE `game_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_codes`
--

DROP TABLE IF EXISTS `game_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_codes` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `expires_at` datetime(6) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `used_at` datetime(6) DEFAULT NULL,
  `game_id` varchar(255) DEFAULT NULL,
  `order_id` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKgds89x5c55bfs4w8vddcceiy1` (`code`),
  KEY `FKg3tr3r75c45p756kf1j5w1j64` (`game_id`),
  KEY `FKc0yk9usqfc1w9jj1gqt8742hg` (`order_id`),
  KEY `FKcs7dqodnry6bv6o72e6j2lao0` (`user_id`),
  CONSTRAINT `FKc0yk9usqfc1w9jj1gqt8742hg` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `FKcs7dqodnry6bv6o72e6j2lao0` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKg3tr3r75c45p756kf1j5w1j64` FOREIGN KEY (`game_id`) REFERENCES `game` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_codes`
--

LOCK TABLES `game_codes` WRITE;
/*!40000 ALTER TABLE `game_codes` DISABLE KEYS */;
/*!40000 ALTER TABLE `game_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_rating`
--

DROP TABLE IF EXISTS `game_rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_rating` (
  `id` varchar(255) NOT NULL,
  `client_id` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `score` int DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `game_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKasi8t0ujrmp9w4pmy3bb1sjkd` (`game_id`),
  CONSTRAINT `FKasi8t0ujrmp9w4pmy3bb1sjkd` FOREIGN KEY (`game_id`) REFERENCES `game` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_rating`
--

LOCK TABLES `game_rating` WRITE;
/*!40000 ALTER TABLE `game_rating` DISABLE KEYS */;
INSERT INTO `game_rating` VALUES ('14a5cb1f-8281-4c89-b6ca-f62c8b2ab93f','6498afc7-d1ad-4c4e-852e-aca23bfb9fea','2025-10-17 06:27:38.717060',3,'2025-10-17 06:27:38.717060','f838954a-3886-4efb-80d8-08fae1ad110c'),('36c7de5a-1a0d-4914-a78b-dae2ace825e1','6498afc7-d1ad-4c4e-852e-aca23bfb9fea','2025-10-17 13:43:11.554280',4,'2025-10-17 13:43:11.554280','8ab800a7-4bc3-4bf8-9f65-30788055bd43'),('4b457594-d551-4dfe-8f26-b053fee6d265','6498afc7-d1ad-4c4e-852e-aca23bfb9fea','2025-10-17 06:22:34.477387',5,'2025-10-17 06:35:34.518762','f8eefc13-78d2-4867-88e1-2e71e445c2fb'),('9ac55ac7-18ae-4370-b57a-c01f88abe1a8','5b1fe054-362d-44d9-b04f-ce8493eb4069','2025-10-17 06:34:50.270626',5,'2025-10-17 06:34:50.270626','f838954a-3886-4efb-80d8-08fae1ad110c'),('f9a2e096-c300-41bf-bcee-31b30ef67dee','5b1fe054-362d-44d9-b04f-ce8493eb4069','2025-10-17 06:35:39.869406',1,'2025-10-17 06:35:39.869406','f8eefc13-78d2-4867-88e1-2e71e445c2fb');
/*!40000 ALTER TABLE `game_rating` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invalidated_token`
--

DROP TABLE IF EXISTS `invalidated_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invalidated_token` (
  `id` varchar(255) NOT NULL,
  `expiry_time` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invalidated_token`
--

LOCK TABLES `invalidated_token` WRITE;
/*!40000 ALTER TABLE `invalidated_token` DISABLE KEYS */;
INSERT INTO `invalidated_token` VALUES ('02702127-11a4-4621-ab0c-de3e641c79b8','2025-12-08 08:18:35.000000'),('09554e0f-ec34-4691-8947-63bf322a66af','2025-12-08 10:26:47.000000'),('11cbef47-de01-4ca7-8b0b-5f6aee8c8b73','2025-12-07 07:30:02.000000'),('12e12f2d-71af-45dc-9296-1d7443c86e81','2025-12-08 08:08:09.000000'),('155b0a51-04cf-4084-bd21-29c0f111cfef','2025-12-07 08:23:41.000000'),('17a88056-ff79-49ad-9f96-536525eee741','2025-12-04 06:00:55.000000'),('2100fdd7-c770-4b41-8fd3-c359481746df','2025-12-08 08:46:32.000000'),('2e1f660b-f6d5-48d6-95e6-0aa6c6c1d81e','2025-12-08 10:31:20.000000'),('310aded5-8165-40c9-9c96-a0d95c03a88e','2025-12-08 14:23:13.000000'),('368d41f0-4ad6-4b7b-ace8-3ce97c71b343','2025-12-08 09:09:53.000000'),('3eaca796-981e-4a6f-8323-cf5641e1d88b','2025-12-08 10:22:18.000000'),('52774147-733d-4b18-b0fd-98ba26aaf2dd','2025-12-07 08:03:13.000000'),('54d6c418-5097-473e-adba-563ee1a78610','2025-12-08 09:01:17.000000'),('579389ba-0df3-45a5-978b-179e4f6b90db','2025-12-08 10:26:29.000000'),('5811f26b-0b4b-4481-8568-42099310547b','2025-12-08 10:29:06.000000'),('5944334f-3eba-4392-9c0f-b91d66c8d737','2025-12-08 14:09:50.000000'),('62d8e0ca-e9e5-49f2-977f-c28e6ce53f25','2025-12-07 07:46:59.000000'),('659313e3-5f81-4efc-bca9-1810a653e183','2025-12-07 08:34:10.000000'),('6bfbf3d8-1665-48ac-9efb-7043d7b4e9ea','2025-12-08 08:19:39.000000'),('7fe7ee45-3f9d-475a-8d0d-cbda44ed7ce6','2025-12-08 08:29:10.000000'),('9299f8c0-3113-4fe3-9b9a-a6ad6f5630d3','2025-12-08 08:44:09.000000'),('9851146a-9eb5-4f79-b7ff-2818096d3f32','2025-12-08 10:48:29.000000'),('9cbc17f2-9570-44fd-81aa-f90745fb0c2b','2025-12-08 07:28:31.000000'),('a2dee004-b8b5-4fa1-aa12-7844b08929d3','2025-12-08 09:49:39.000000'),('aa512577-9038-4920-8669-c301937c75cb','2025-12-08 07:51:47.000000'),('ae075f6d-1b92-4d75-be68-30914548f6f9','2025-12-08 09:48:23.000000'),('b16a5ce2-bbfa-4b55-bbdb-d30e7c0037cd','2025-12-08 08:52:36.000000'),('b16c6041-e147-4127-adc9-c3510c3b7daa','2025-12-08 10:04:27.000000'),('b8d4487f-a9d4-441b-b142-f3fd7d15a807','2025-12-08 10:40:26.000000'),('bedfde72-fb79-4cef-ae98-5a28e8519e5e','2025-12-08 09:18:46.000000'),('cf05a4ec-5238-437a-a281-a9026d97dd22','2025-12-07 08:02:44.000000'),('d3180713-a0c7-4111-a9ce-6b915ad8770e','2025-12-07 07:31:13.000000'),('d7aa1018-da77-4747-819a-4fc048082823','2025-12-07 07:53:24.000000'),('d7bfbef6-3b5e-4a6e-b753-7e6ea5c8a543','2025-12-07 08:03:54.000000'),('d98616ff-e284-4b80-bb79-8692558c9fb9','2025-12-08 09:19:23.000000'),('daf24b67-8ab3-4365-b0fe-99d3069fec4f','2025-12-08 10:27:01.000000'),('e16cd93a-ac08-483b-ac29-db394cabc20c','2025-12-08 10:43:43.000000'),('e8d760dd-eb4f-4cd8-a672-8e1ac9f6960e','2025-12-08 07:58:59.000000'),('f35e9e47-720b-4dfa-9fa5-7d9a875277ac','2025-12-08 07:34:59.000000'),('fbc03a80-c15c-45ac-a048-0a3dd80a497b','2025-12-07 08:34:25.000000');
/*!40000 ALTER TABLE `invalidated_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_item`
--

DROP TABLE IF EXISTS `order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_item` (
  `id` varchar(255) NOT NULL,
  `quantity` int DEFAULT NULL,
  `total_price` double DEFAULT NULL,
  `unit_price` double DEFAULT NULL,
  `game_id` varchar(255) DEFAULT NULL,
  `order_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK9tokeo13v94je3hkblb92jyr1` (`game_id`),
  KEY `FKt4dc2r9nbvbujrljv3e23iibt` (`order_id`),
  CONSTRAINT `FK9tokeo13v94je3hkblb92jyr1` FOREIGN KEY (`game_id`) REFERENCES `game` (`id`),
  CONSTRAINT `FKt4dc2r9nbvbujrljv3e23iibt` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_item`
--

LOCK TABLES `order_item` WRITE;
/*!40000 ALTER TABLE `order_item` DISABLE KEYS */;
INSERT INTO `order_item` VALUES ('03cc9f4e-37a1-4280-a6c8-e102d6c64032',1,300000,300000,'f171e1bc-5048-4d56-aeb2-914d301c1d14','bcc7d65d-1b44-4c21-a781-b3a402ffdc09'),('186511e1-63cf-4f16-9fb3-4cbd22f7c80e',1,200000,200000,'27ba31c7-1226-435a-bc81-4f0970efab7c','b6d551b4-b141-40e2-b480-16dd550ce09c'),('3ee4134a-8550-4c78-893d-6f0e2db8fbb1',99,24750000,250000,'f838954a-3886-4efb-80d8-08fae1ad110c','b238c662-17b6-411a-9b70-02ffc8524bc8'),('4480997d-84a6-4894-978d-a1f93281e4c1',12,3000000,250000,'f838954a-3886-4efb-80d8-08fae1ad110c','764e1bf5-0204-41e9-b9d6-2e2455f7be81'),('5829d8ca-d30c-41db-b96f-ac19b61ac9aa',2,400000,200000,'27ba31c7-1226-435a-bc81-4f0970efab7c','1699e2e8-d9a5-411a-8499-5d951733c4fa'),('5aa0c363-d886-4ab0-b397-3d3854f1bf99',3,750000,250000,'f838954a-3886-4efb-80d8-08fae1ad110c','88c9480f-dc35-467f-8826-c67b06ee9d0a'),('6d84e56a-cd81-477b-8834-d85b52cb5bc0',2,550000,275000,'f8eefc13-78d2-4867-88e1-2e71e445c2fb','847908e4-247b-46a3-9c25-a3abb39cafe6'),('7cf13de9-3a0e-4947-8d05-24432aee5ac8',1,250000,250000,'f838954a-3886-4efb-80d8-08fae1ad110c','5c2d639c-a713-47f2-9c4c-d32596963d29'),('8eac7f4a-716f-44a0-8a12-09ecfa26b7ff',2,550000,275000,'f8eefc13-78d2-4867-88e1-2e71e445c2fb','0febb66f-02c7-4af7-b150-6867a3fac359'),('95ff2421-77eb-490b-a0fb-176e55647165',1,500000,500000,'07e8b0c5-95ba-414c-b898-592fc5072aed','f402e032-d33a-4bd7-b6aa-0b39e664ad2a'),('bf5c11c0-d037-4d6c-98e1-9b2882bddf60',1,300000,300000,'f171e1bc-5048-4d56-aeb2-914d301c1d14','0a587ed8-df8f-46de-b7ce-7f861a93a528'),('c7eb5e7c-3ded-43d6-bca1-2cf3f3d0cc8d',50,12500000,250000,'f838954a-3886-4efb-80d8-08fae1ad110c','de8f15cb-4b1f-4a41-a6f3-148288124c43'),('ce44a299-5fec-4f17-ba8e-e087343acb87',2,400000,200000,'27ba31c7-1226-435a-bc81-4f0970efab7c','525382ca-2c48-4388-bf97-109f8742adb3'),('dfedd9aa-e14b-4b24-94f7-70b9fa432024',1,500000,500000,'d877cbc6-ec3c-42e4-ab29-fdf8da3474af','bdf6ebf7-7850-450c-b79f-454860829874'),('fb90aaa3-3d41-4b2f-a39b-41d32ea5d3c6',30,7500000,250000,'f838954a-3886-4efb-80d8-08fae1ad110c','1d2fdab5-e877-4d53-8ac8-d6a7311eb9df');
/*!40000 ALTER TABLE `order_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` varchar(255) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `order_id` varchar(255) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `total_amount` double DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `cart_id` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `admin_notes` text,
  `codes_sent` bit(1) DEFAULT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `email_sent` bit(1) DEFAULT NULL,
  `processed_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKtpihbdn6ws0hu56camb0bg2to` (`cart_id`),
  KEY `FKel9kyl84ego2otj2accfd8mr7` (`user_id`),
  CONSTRAINT `FKel9kyl84ego2otj2accfd8mr7` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKtpihbdn6ws0hu56camb0bg2to` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES ('01e82b52-41d6-42e2-a760-c1327d7fe101','2025-12-08 07:11:07.330329','ORDER_1765177867','MOMO','PENDING',100000,'2025-12-08 07:11:07.330329',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('0a587ed8-df8f-46de-b7ce-7f861a93a528','2025-10-18 14:39:11.494586','ORDER_1760798351485','MOMO','PENDING',300000,'2025-10-18 14:39:11.494586',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('0febb66f-02c7-4af7-b150-6867a3fac359','2025-10-16 05:16:01.651804','ORDER_1760591761641','MOMO','PENDING',550000,'2025-10-16 05:16:01.651804',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('1699e2e8-d9a5-411a-8499-5d951733c4fa','2025-10-16 05:16:39.323997','ORDER_1760591799314','MOMO','PENDING',400000,'2025-10-16 05:16:39.323997',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('1d2fdab5-e877-4d53-8ac8-d6a7311eb9df','2025-10-17 16:22:16.313169','ORDER_1760718136297','MOMO','PENDING',7500000,'2025-10-17 16:22:16.313169',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('525382ca-2c48-4388-bf97-109f8742adb3','2025-10-16 05:10:02.801855','TEST123','MOMO','PENDING',400000,'2025-10-16 05:10:02.801855',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('5c2d639c-a713-47f2-9c4c-d32596963d29','2025-10-18 14:37:31.421228','ORDER_1760798251359','MOMO','PENDING',250000,'2025-10-18 14:37:31.421228',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('764e1bf5-0204-41e9-b9d6-2e2455f7be81','2025-10-18 14:22:28.986063','ORDER_1760797348894','MOMO','PENDING',3000000,'2025-10-18 14:22:28.986063',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('816a0805-ccae-4f7a-9b59-1f1025ca09c9','2025-12-04 04:59:22.746558','ORDER_1764824363','MOMO','PENDING',100000,'2025-12-04 04:59:22.746558',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('847908e4-247b-46a3-9c25-a3abb39cafe6','2025-10-16 05:13:22.612465','ORDER_1760591602568','MOMO','PENDING',550000,'2025-10-16 05:13:22.612465',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('88c9480f-dc35-467f-8826-c67b06ee9d0a','2025-10-16 05:10:23.717197','ORDER_1760591423707','MOMO','COMPLETED',750000,'2025-10-16 05:12:32.526305',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('8c407d7d-23a6-4fe0-b2b1-fb7d07fb16f9','2025-11-11 08:54:20.866096','ORDER_1762851261','MOMO','PENDING',100000,'2025-11-11 08:54:20.866096',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('91a11611-d419-40b2-82b7-593046182c80','2025-11-11 09:36:45.040294','ORDER_1762853805','MOMO','PENDING',100000,'2025-11-11 09:36:45.040294',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('99e8cf1e-60c5-4e63-8776-faa33a09bc7c','2025-12-08 07:32:05.178400','ORDER_1765179125','MOMO','PENDING',100000,'2025-12-08 07:32:05.178400',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('9f2eaad5-686a-48a8-914f-2d5dbaefa220','2025-11-11 08:43:45.006555','ORDER_1762850625','MOMO','PENDING',100000,'2025-11-11 08:43:45.006555',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('b238c662-17b6-411a-9b70-02ffc8524bc8','2025-10-17 14:03:34.234538','ORDER_1760709814226','MOMO','PENDING',24750000,'2025-10-17 14:03:34.234538',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('b6d551b4-b141-40e2-b480-16dd550ce09c','2025-10-16 05:19:36.284167','TEST_PHASMO_123','MOMO','PENDING',400000,'2025-10-16 05:19:36.284167',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('bc2c0a12-0117-47e1-a5b4-3baf996ef5ef','2025-12-08 08:55:23.358624','ORDER_1765184123','MOMO','PENDING',100000,'2025-12-08 08:55:23.358624',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('bcc7d65d-1b44-4c21-a781-b3a402ffdc09','2025-10-16 05:15:18.085808','TEST_NEW_123','MOMO','PENDING',300000,'2025-10-16 05:15:18.085808',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('bdf6ebf7-7850-450c-b79f-454860829874','2025-10-17 14:01:53.749376','ORDER_1760709713679','MOMO','PENDING',500000,'2025-10-17 14:01:53.749376',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('de8f15cb-4b1f-4a41-a6f3-148288124c43','2025-10-17 14:04:18.463122','ORDER_1760709858454','MOMO','PENDING',12500000,'2025-10-17 14:04:18.463122',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('f402e032-d33a-4bd7-b6aa-0b39e664ad2a','2025-10-17 15:07:24.748914','ORDER_1760713644684','MOMO','PENDING',350000,'2025-10-17 15:07:24.748914',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_token`
--

DROP TABLE IF EXISTS `password_reset_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_token` (
  `id` varchar(255) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `token` varchar(255) NOT NULL,
  `used` bit(1) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKg0guo4k8krgpwuagos61oc06j` (`token`),
  KEY `FK5lwtbncug84d4ero33v3cfxvl` (`user_id`),
  CONSTRAINT `FK5lwtbncug84d4ero33v3cfxvl` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_token`
--

LOCK TABLES `password_reset_token` WRITE;
/*!40000 ALTER TABLE `password_reset_token` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permission`
--

DROP TABLE IF EXISTS `permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permission` (
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permission`
--

LOCK TABLES `permission` WRITE;
/*!40000 ALTER TABLE `permission` DISABLE KEYS */;
INSERT INTO `permission` VALUES ('APP_POST','App a post'),('APP1_POST','App a post'),('APP2_POST','App a post'),('APP3_POST','App a post'),('CATEGORY_CREATE','Quyền tạo danh mục'),('CATEGORY_DELETE','Quyền xóa danh mục'),('CATEGORY_READ','Quyền xem danh mục'),('CATEGORY_UPDATE','Quyền cập nhật danh mục'),('GAME_CREATE','Quyền tạo game mới'),('GAME_DELETE','Quyền xóa game'),('GAME_READ','Quyền xem thông tin game'),('GAME_UPDATE','Quyền cập nhật game'),('PERMISSION_ASSIGN','Quyền gán quyền cho vai trò'),('PERMISSION_READ','Quyền xem danh sách quyền'),('ROLE_CREATE','Quyền tạo vai trò mới'),('ROLE_DELETE','Quyền xóa vai trò'),('ROLE_READ','Quyền xem danh sách vai trò'),('ROLE_UPDATE','Quyền cập nhật vai trò'),('USER_CREATE','Quyền tạo người dùng mới'),('USER_DELETE','Quyền xóa người dùng'),('USER_READ','Quyền xem thông tin người dùng'),('USER_UPDATE','Quyền cập nhật thông tin người dùng');
/*!40000 ALTER TABLE `permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phone_otp`
--

DROP TABLE IF EXISTS `phone_otp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phone_otp` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `expires_at` datetime(6) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `used` bit(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phone_otp`
--

LOCK TABLES `phone_otp` WRITE;
/*!40000 ALTER TABLE `phone_otp` DISABLE KEYS */;
INSERT INTO `phone_otp` VALUES ('2eeaa2a6-fb50-47f4-8172-62bfd772a44d','502743','2025-10-02 16:11:28.260618','0902381647',_binary ''),('45a9f9ca-f14c-416f-bfcf-cbf6e160847a','943632','2025-11-11 08:42:27.103368','0902580349',_binary '\0'),('6a10c0ed-67db-49f3-880a-35396819685e','794526','2025-11-11 08:43:02.869823','0902580349',_binary ''),('9ef18dc5-2f40-4de7-bb0a-2cd02447fc5f','587674','2025-10-02 15:59:11.789628','0902381647',_binary ''),('e64c8a06-d9be-49e1-af9c-0d602d0c5a1a','494952','2025-10-02 16:10:42.938441','0902381647',_binary ''),('fc82681a-8df5-4a63-af31-f47d9d3a1f9c','665462','2025-10-02 15:46:29.215457','0902381647',_binary '\0');
/*!40000 ALTER TABLE `phone_otp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES ('ADMIN','minkoi role'),('MANAGER','MANAGER role'),('MINHKHOI','minkoi role'),('MINHKHUIII','minkoi role'),('MINHKHUIIII','minkoi role'),('TEST_ROLE','Test role'),('USER','USER role');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `role_name` varchar(255) NOT NULL,
  `permissions_name` varchar(255) NOT NULL,
  PRIMARY KEY (`role_name`,`permissions_name`),
  KEY `FKf5aljih4mxtdgalvr7xvngfn1` (`permissions_name`),
  CONSTRAINT `FKcppvu8fk24eqqn6q4hws7ajux` FOREIGN KEY (`role_name`) REFERENCES `role` (`name`),
  CONSTRAINT `FKf5aljih4mxtdgalvr7xvngfn1` FOREIGN KEY (`permissions_name`) REFERENCES `permission` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES ('admin','APP_POST'),('MINHKHOI','APP_POST'),('MINHKHUIII','APP_POST'),('MANAGER','APP1_POST'),('minhkhoi','APP1_POST'),('MINHKHUIIII','APP1_POST'),('USER','APP1_POST'),('MANAGER','APP2_POST'),('USER','APP2_POST'),('MANAGER','APP3_POST'),('ADMIN','CATEGORY_CREATE'),('MANAGER','CATEGORY_CREATE'),('ADMIN','CATEGORY_DELETE'),('MANAGER','CATEGORY_DELETE'),('ADMIN','CATEGORY_READ'),('MANAGER','CATEGORY_READ'),('USER','CATEGORY_READ'),('ADMIN','CATEGORY_UPDATE'),('MANAGER','CATEGORY_UPDATE'),('ADMIN','GAME_CREATE'),('MANAGER','GAME_CREATE'),('ADMIN','GAME_DELETE'),('MANAGER','GAME_DELETE'),('ADMIN','GAME_READ'),('MANAGER','GAME_READ'),('TEST_ROLE','GAME_READ'),('USER','GAME_READ'),('ADMIN','GAME_UPDATE'),('MANAGER','GAME_UPDATE'),('ADMIN','PERMISSION_ASSIGN'),('ADMIN','PERMISSION_READ'),('ADMIN','ROLE_CREATE'),('ADMIN','ROLE_DELETE'),('ADMIN','ROLE_READ'),('ADMIN','ROLE_UPDATE'),('ADMIN','USER_CREATE'),('ADMIN','USER_DELETE'),('ADMIN','USER_READ'),('MANAGER','USER_READ'),('TEST_ROLE','USER_READ'),('USER','USER_READ'),('ADMIN','USER_UPDATE');
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` varchar(255) NOT NULL,
  `amount` double DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK9e5ssu5c6n40gw5bgt5dg4mph` (`user_id`),
  CONSTRAINT `FK9e5ssu5c6n40gw5bgt5dg4mph` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES ('0410eef5-2e54-4c9c-9c6f-a12e8eb4dcc8',50000,'2025-12-08 09:40:40.201548','Nạp tiền vào ví','MOMO','PENDING','TOPUP_user@gmail.com_1765186840200','TOPUP','2025-12-08 09:40:40.201548','cca77703-af11-4131-987a-862db7f06869'),('2012886a-db87-464e-b03e-b72ca2a99d70',50000,'2025-12-04 07:46:04.584326','Nạp tiền vào ví','MOMO','PENDING','TOPUP_cca77703-af11-4131-987a-862db7f06869_1764834364442','TOPUP','2025-12-04 07:46:04.584326','cca77703-af11-4131-987a-862db7f06869'),('2e3a034c-4021-4420-9e95-9256cc3e2348',50000,'2025-12-08 09:30:07.607613','Nạp tiền vào ví','MOMO','PENDING','TOPUP_lenguyendiephuy_1765186198631','TOPUP','2025-12-08 09:30:07.607613','dadc8a62-24ab-4996-bcbd-2ab01ee507d5'),('441e6aed-1aa6-46ed-bdad-c58f5c438e1b',50000,'2025-12-08 09:30:00.169496','Nạp tiền vào ví','MOMO','PENDING','TOPUP_lenguyendiephuy_1765186200089','TOPUP','2025-12-08 09:30:00.169496','dadc8a62-24ab-4996-bcbd-2ab01ee507d5'),('45289cf9-7b6e-405a-bcaa-0c81193b0a38',500000,'2025-12-08 09:04:31.911303','Nạp tiền vào ví','MOMO','PENDING','TOPUP_lenguyendiephuy_1765184671841','TOPUP','2025-12-08 09:04:31.911303','dadc8a62-24ab-4996-bcbd-2ab01ee507d5'),('77892497-cb87-4050-a89a-f7483339f6a7',500000,'2025-12-08 06:30:03.494740','Nạp tiền vào ví','MOMO','PENDING','TOPUP_cca77703-af11-4131-987a-862db7f06869_1765175403211','TOPUP','2025-12-08 06:30:03.494740','cca77703-af11-4131-987a-862db7f06869'),('bfb09832-6c4d-4a1e-a1c6-c07de357c33b',500000,'2025-12-07 06:30:58.959369','Nạp tiền vào ví','MOMO','PENDING','TOPUP_cca77703-af11-4131-987a-862db7f06869_1765089058497','TOPUP','2025-12-07 06:30:58.959369','cca77703-af11-4131-987a-862db7f06869'),('cb1ecae2-eef4-4eb7-b30c-ab617ccb22b9',500000,'2025-12-08 13:09:57.371455','Nạp tiền vào ví','MOMO','PENDING','TOPUP_lenguyendiephuy_1765199397358','TOPUP','2025-12-08 13:09:57.371455','dadc8a62-24ab-4996-bcbd-2ab01ee507d5'),('d2acc2f6-b85f-4796-b399-8b4e3bd8420d',10000,'2025-12-08 09:06:46.797351','Nạp tiền vào ví','MOMO','PENDING','TOPUP_lenguyendiephuy_1765184806739','TOPUP','2025-12-08 09:06:46.797351','dadc8a62-24ab-4996-bcbd-2ab01ee507d5'),('d8f60c6f-b693-4ac7-b955-50145f4e00d5',50000,'2025-12-08 09:41:14.694203','Nạp tiền vào ví','MOMO','PENDING','TOPUP_lenguyendiephuy_1765186874693','TOPUP','2025-12-08 09:41:14.694203','dadc8a62-24ab-4996-bcbd-2ab01ee507d5'),('e3d5e4ab-e698-476e-92f2-ba2d3006d427',50000,'2025-12-08 09:40:31.543499','Nạp tiền vào ví','MOMO','PENDING','TOPUP_user@gmail.com_1765186831539','TOPUP','2025-12-08 09:40:31.543499','cca77703-af11-4131-987a-862db7f06869'),('ed28ca3c-6a66-4767-a8e8-a5a070633c3e',10000,'2025-12-08 09:09:47.762611','Nạp tiền vào ví','MOMO','PENDING','TOPUP_lenguyendiephuy_1765184987369','TOPUP','2025-12-08 09:09:47.762611','dadc8a62-24ab-4996-bcbd-2ab01ee507d5');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(255) NOT NULL,
  `dob` date DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `provider_id` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `balance` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('77f34d20-05f4-4ff7-b398-5f2c94f35f23','1999-11-01','minh','khoa','$2a$10$LtGL3YqZP6JJrbulbMRje.5UGZAfZ/Kk82ypK.bTlStngOQckT3AW','minhkhoa2','0902381647',NULL,NULL,NULL,NULL,NULL),('7be8761d-5b66-409d-b817-1a1029bb6fd2','2000-01-01','A','B','$2a$10$gRwKXnM9KpU/he5jnnt8XulIgtMP33QpF4fNqoPH56J1P4s4WTENe','minhkhuu',NULL,NULL,NULL,NULL,NULL,NULL),('80207c90-b66e-4f91-988a-343a38973053',NULL,NULL,NULL,'$2a$10$MEhJjERAB89ZzDC36tLUOeM2Tthyzsed5Pr.vyFgGncBuNrW2eqW6',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('8e062aa6-457a-4351-80ac-75c744a268b2','2000-08-04','minh','khoa123','$2a$10$tRLDETIEtE9hc5DvwexuEOxszKWlQZhWreDyd8peLZoWgtEM/C74C','minhh',NULL,NULL,NULL,NULL,NULL,NULL),('97439294-71b0-48b8-bf3e-687e05d8eb86',NULL,'minh','khoa','$2a$10$XEZza11TLpCV9lYxXlEgM.iznyfKKT4yhYpE7WXQN6MoV6jxmFMk.','minhkhoa1',NULL,NULL,NULL,NULL,NULL,NULL),('97d61d63-7b66-49b8-8598-5bfc10cf2e38','1995-04-08','minh11122','khoi','$2a$10$pvL4CybyCfWu5hEWufPxcuSYJ3m5EcnvQRhqenywNphfN8PD8cPFy','minhkhuiiiii',NULL,NULL,NULL,NULL,NULL,NULL),('991510e4-88ec-4855-84cc-43d214acf0c0',NULL,NULL,NULL,'$2a$10$Hq9Xe2BlbH8TwYnHskvXRe2dLuSn2NKlf3mi0Z77LEZ3pccwBLk3y',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('99e42e1a-fa80-4650-8264-e233659136bf',NULL,NULL,NULL,'$2a$10$iOglMdw4NMUJ7ugUjiTMqeGvqs5su85h8wYdA1eamxDUGV9EwQymq',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('a4025243-545e-4861-bdcb-6607088c6b47','2013-09-29','nguoi12','dung12345','$2a$10$K/rwpluVk1LWRS9r/NtZqeNJr.ZGNM6LONdkVCoVuKdjxejbiDVxC','AnhKhoa1234','0902580349','khoaphanconghon62@gmail.com',NULL,NULL,NULL,NULL),('a7272da8-18a5-4f1f-b2d4-914b4c803664','1990-01-01','Admin','User','$2a$10$hyYyg/awtch5Zz5CMbR.OeXuqXPQ/fLAl1ha57ae0dntnMp5cHMqK','admin@gmail.com','0123456789','admin@gmail.com',NULL,NULL,NULL,NULL),('ae8ba373-ef12-40a4-bf9b-105d44fd8456',NULL,'Admin','Test','$2a$10$R6beDg5nfEEeH4KlDTSJKe8lUGLv5mflNl5C12OUs7Dx7gBbNNtZK','admintest',NULL,'admintest@test.com',NULL,NULL,'https://game-store-images-2025-vietnam.s3.ap-southeast-1.amazonaws.com/avatars/316eb811-ad41-4e2f-9001-ba4004c2ce39.jpg',NULL),('ba258aee-db9d-4b05-8f56-8f17c7355cb4','2000-01-01','A','B','$2a$10$sWQn3axgP2Lsc7xZjYV9T.FPTnwizJ9iIRKL3uXHxumxJAkHZLdIm','minhkhu',NULL,NULL,NULL,NULL,NULL,NULL),('bc94ff30-deb0-4121-a51d-a8aacb6e8738','1997-08-04','minh','minh','$2a$10$C8LdcCBW9AsqcWeSnUsUJeKla7HfmgTwQ3mNfnicLgY.1ABB8kQJa','minhhh','0938462246','minkoi0408@gmail.com',NULL,NULL,NULL,NULL),('c9ee8c71-1f13-42a5-a2a2-750bd9376ed0',NULL,NULL,NULL,'$2a$10$qxCfUhgxu4GxuwHHPhp6i.kzDqxLWiyO91e4BReKXlvu4yKI5irrK',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('cb333333-d9e5-4f10-9db8-00f1547662c6',NULL,NULL,NULL,'$2a$10$DxnLSQIcSev4iQ.OJbmK5..D1/4FkO7yNcmYiGWnJPUSKjoL9i/8C',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('cca77703-af11-4131-987a-862db7f06869','1990-01-01','Lá ','Huy','$2a$10$alqIv5Ov4sz7RQ19zjcDYe60Orsyzzx9DNoy1eTuwFkgUVOMzrKWC','user@gmail.com','0123456789',NULL,NULL,NULL,'https://game-store-images-2025-vietnam.s3.ap-southeast-1.amazonaws.com/avatars/d945a867-e548-499d-a207-ec5a7a757b4c.jpg',10000000000),('cd7aebe9-cbf8-49a1-b44a-52d022fa1be4',NULL,NULL,NULL,'$2a$10$JZxUBQTZKR1HQp1U098Lh.C.fhTXELqGP29yDtP5hqs.yDMp7erQi','hihi',NULL,NULL,NULL,NULL,NULL,NULL),('dadc8a62-24ab-4996-bcbd-2ab01ee507d5','2004-06-09','Diệp','Lục','$2a$10$MoROj14ZUXCLuxPK/L3SEOLgh4iJx3.y/ZQ1Ptv0G1/j6KAvn0lXW','lenguyendiephuy','0902580349','se182703lenguyendiephuy@gmail.com',NULL,NULL,'https://game-store-images-2025-vietnam.s3.ap-southeast-1.amazonaws.com/avatars/5c1285a4-1dec-4402-9df1-c54eb27e17cf.jpg',NULL),('ee0d73bc-aca7-49ef-8d76-b067f42332f9',NULL,'TestName','TestLastName',NULL,'admin',NULL,NULL,NULL,NULL,NULL,NULL),('f72b5364-7971-47b5-81d8-48af2b16e79b','1999-10-01','minh','khoa','$2a$10$nLJzzoDILaCf11PZ1lp7XeG/m45gg1HGwsFvgveUz53m44SXTdLuu','minhkhoa',NULL,NULL,NULL,NULL,NULL,NULL),('faabdd5a-0402-4a0e-a9e1-7426a23ef1ec',NULL,NULL,NULL,'$2a$10$ePG6E9FVOXw3jwmJzVQU8O6hFuJRf2sLvVV7afoFY0H7hvOtzjVce',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `user_id` varchar(255) NOT NULL,
  `roles_name` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`,`roles_name`),
  KEY `FK6pmbiap985ue1c0qjic44pxlc` (`roles_name`),
  CONSTRAINT `FK55itppkw3i07do3h7qoclqd4k` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FK6pmbiap985ue1c0qjic44pxlc` FOREIGN KEY (`roles_name`) REFERENCES `role` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES ('a7272da8-18a5-4f1f-b2d4-914b4c803664','ADMIN'),('ae8ba373-ef12-40a4-bf9b-105d44fd8456','ADMIN'),('ee0d73bc-aca7-49ef-8d76-b067f42332f9','ADMIN'),('7be8761d-5b66-409d-b817-1a1029bb6fd2','MANAGER'),('77f34d20-05f4-4ff7-b398-5f2c94f35f23','USER'),('80207c90-b66e-4f91-988a-343a38973053','USER'),('8e062aa6-457a-4351-80ac-75c744a268b2','USER'),('97439294-71b0-48b8-bf3e-687e05d8eb86','USER'),('97d61d63-7b66-49b8-8598-5bfc10cf2e38','USER'),('991510e4-88ec-4855-84cc-43d214acf0c0','USER'),('99e42e1a-fa80-4650-8264-e233659136bf','USER'),('a4025243-545e-4861-bdcb-6607088c6b47','USER'),('ba258aee-db9d-4b05-8f56-8f17c7355cb4','USER'),('bc94ff30-deb0-4121-a51d-a8aacb6e8738','USER'),('c9ee8c71-1f13-42a5-a2a2-750bd9376ed0','USER'),('cb333333-d9e5-4f10-9db8-00f1547662c6','USER'),('cca77703-af11-4131-987a-862db7f06869','USER'),('cd7aebe9-cbf8-49a1-b44a-52d022fa1be4','USER'),('dadc8a62-24ab-4996-bcbd-2ab01ee507d5','USER'),('f72b5364-7971-47b5-81d8-48af2b16e79b','USER'),('faabdd5a-0402-4a0e-a9e1-7426a23ef1ec','USER');
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-08 22:43:33
