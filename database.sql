CREATE TABLE IF NOT EXISTS user_lang (
  id varchar(50) NOT NULL PRIMARY KEY,
  lang varchar(25) NOT NULL
)

CREATE TABLE IF NOT EXISTS user_balance (
  id varchar(50) NOT NULL PRIMARY KEY,
  val int NOT NULL
)

CREATE TABLE IF NOT EXISTS guild_prefix (
  id varchar(50) NOT NULL PRIMARY KEY,
  prefix varchar(3) NOT NULL
)
