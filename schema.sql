CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` mediumtext COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB
