CREATE TABLE IF NOT EXISTS user_lang (
  id varchar(50) NOT NULL PRIMARY KEY,
  lang varchar(25) NOT NULL
)

CREATE TABLE IF NOT EXISTS user_balance (
  id varchar(50) NOT NULL PRIMARY KEY,
  val int NOT NULL
)

CREATE TABLE IF NOT EXISTS blacklist_user (
  id varchar(50) NOT NULL PRIMARY KEY,
  ban BOOLEAN
)

CREATE TABLE IF NOT EXISTS blacklist_guild (
  id varchar(50) NOT NULL PRIMARY KEY,
  ban BOOLEAN
)

CREATE TABLE IF NOT EXISTS backups (
  id varchar(100) NOT NULL PRIMARY KEY,
  url varchar(255) NOT NULL
)
