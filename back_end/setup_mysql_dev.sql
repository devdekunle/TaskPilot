-- prepares a MySQL server for the project

CREATE DATABASE IF NOT EXISTS tpilot_dev_db;
CREATE USER IF NOT EXISTS 'tpilot_dev'@'localhost' IDENTIFIED BY 'tpilot_dev_pwd';
GRANT ALL PRIVILEGES ON `tpilot_dev_db`.* TO 'tpilot_dev'@'localhost';
GRANT SELECT ON `performance_schema`.* TO 'tpilot_dev'@'localhost';
FLUSH PRIVILEGES;
