CREATE DATABASE IF NOT EXISTS nest_events;
CREATE DATABASE IF NOT EXISTS nest_events_test;

CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin';
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%';