-- MySQL dump 10.13  Distrib 8.0.38, for macos14 (arm64)
--
-- Host: localhost    Database: leaderboard_db
-- ------------------------------------------------------
-- Server version	5.5.5-10.11.6-MariaDB-0+deb12u1

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
-- Dumping routines for database 'leaderboard_db'
--
/*!50003 DROP PROCEDURE IF EXISTS `InsertMockPlayers` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertMockPlayers`()
BEGIN
    DECLARE counter INT DEFAULT 0;
    DECLARE random_name VARCHAR(50);

    WHILE counter < 10000000 DO
      
       SET random_name = CASE FLOOR(1 + RAND() * 29)
            WHEN 1 THEN 'Alice'
            WHEN 2 THEN 'Bob'
            WHEN 3 THEN 'Charlie'
            WHEN 4 THEN 'David'
            WHEN 5 THEN 'Eve'
            WHEN 6 THEN 'Frank'
            WHEN 7 THEN 'Grace'
            WHEN 8 THEN 'Hannah'
            WHEN 9 THEN 'Ivy'
            WHEN 10 THEN 'Jack'
            WHEN 11 THEN 'Karen'
            WHEN 12 THEN 'Leo'
            WHEN 13 THEN 'Mary'
            WHEN 14 THEN 'Nancy'
            WHEN 15 THEN 'Oscar'
            WHEN 16 THEN 'Paul'
            WHEN 17 THEN 'Queenie'
            WHEN 18 THEN 'Rachel'
            WHEN 19 THEN 'Sam'
            WHEN 20 THEN 'Tina'
            WHEN 21 THEN 'Uma'
            WHEN 22 THEN 'Victor'
            WHEN 23 THEN 'Wendy'
            WHEN 24 THEN 'Xavier'
            WHEN 25 THEN 'Yvonne'
            WHEN 26 THEN 'Zoe'
            WHEN 27 THEN 'Brian'
            WHEN 28 THEN 'Linda'
            WHEN 29 THEN 'George'
        END;

        INSERT INTO players (name, country_id, balance)
        VALUES (
			CONCAT(random_name,'_', counter),
            FLOOR(1 + RAND() * 15),   
            FLOOR(RAND() * 5000)       
        );
        

        SET counter = counter + 1;
    END WHILE;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-09 11:39:58
