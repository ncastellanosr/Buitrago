DROP SCHEMA IF EXISTS ubudget_database;
CREATE SCHEMA ubudget_database;
USE ubudget_database;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS preferencia_noticia;
DROP TABLE IF EXISTS noticia;
DROP TABLE IF EXISTS simulacion_financiera;
DROP TABLE IF EXISTS notification_log;
DROP TABLE IF EXISTS reminder;
DROP TABLE IF EXISTS balance_history;
DROP TABLE IF EXISTS budget;
DROP TABLE IF EXISTS obligation;
DROP TABLE IF EXISTS transaction_tbl;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS account;
DROP TABLE IF EXISTS auth_user;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE auth_user (
  user_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(200),
  role ENUM('user','admin','guest') DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME NULL,
  is_active TINYINT(1) DEFAULT 1,
  metadata JSON NULL,
  INDEX (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE account (
  account_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  account_name VARCHAR(150) NOT NULL,
  account_type ENUM('cash','savings','checking','credit_card','investment','other') DEFAULT 'other',
  currency CHAR(3) DEFAULT 'USD',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active TINYINT(1) DEFAULT 1,
  cached_balance DECIMAL(20,4) DEFAULT 0.0000,
  CONSTRAINT fk_account_user FOREIGN KEY (user_id) REFERENCES auth_user(user_id) ON DELETE CASCADE,
  INDEX (user_id, account_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE category (
  category_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type ENUM('income','expense','transfer','other') NOT NULL,
  parent_category_id INT UNSIGNED NULL,
  description VARCHAR(255),
  UNIQUE KEY (name, type),
  CONSTRAINT fk_category_parent FOREIGN KEY (parent_category_id) REFERENCES category(category_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE transaction_tbl (
  transaction_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  account_id BIGINT UNSIGNED NOT NULL,
  related_account_id BIGINT UNSIGNED NULL,
  category_id INT UNSIGNED NULL,
  type ENUM('income','expense','transfer') NOT NULL,
  amount DECIMAL(20,4) NOT NULL,
  currency CHAR(3) DEFAULT 'USD',
  description TEXT NULL,
  occurred_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_reconciled TINYINT(1) DEFAULT 0,
  metadata JSON NULL,
  CONSTRAINT fk_tx_account FOREIGN KEY (account_id) REFERENCES account(account_id) ON DELETE CASCADE,
  CONSTRAINT fk_tx_related_account FOREIGN KEY (related_account_id) REFERENCES account(account_id) ON DELETE SET NULL,
  CONSTRAINT fk_tx_category FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE SET NULL,
  INDEX (account_id, occurred_at),
  INDEX (category_id),
  INDEX (type, occurred_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE obligation (
  obligation_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(200) NOT NULL,
  amount_total DECIMAL(20,4) NOT NULL,
  amount_remaining DECIMAL(20,4) NOT NULL,
  currency CHAR(3) DEFAULT 'USD',
  due_date DATETIME NULL,
  frequency ENUM('one_time','monthly','quarterly','yearly','custom') DEFAULT 'one_time',
  state ENUM('open','paid','overdue','cancelled') DEFAULT 'open',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_obligation_user FOREIGN KEY (user_id) REFERENCES auth_user(user_id) ON DELETE CASCADE,
  INDEX (user_id, due_date, state)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE budget (
  budget_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  period ENUM('monthly','quarterly','yearly') DEFAULT 'monthly',
  amount_limit DECIMAL(20,4) NOT NULL,
  start_date DATE DEFAULT (CURRENT_DATE),
  end_date DATE NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_budget_user FOREIGN KEY (user_id) REFERENCES auth_user(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_budget_category FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE,
  UNIQUE KEY (user_id, category_id, period, start_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE balance_history (
  snapshot_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  snapshot_date DATETIME NOT NULL,
  total_balance DECIMAL(20,4) NOT NULL,
  payload JSON NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_snapshot_user FOREIGN KEY (user_id) REFERENCES auth_user(user_id) ON DELETE CASCADE,
  INDEX (user_id, snapshot_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE reminder (
  reminder_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  obligation_id BIGINT UNSIGNED NULL,
  account_id BIGINT UNSIGNED NULL,
  title VARCHAR(200),
  message TEXT,
  remind_at DATETIME NOT NULL,
  channel_set JSON NULL,
  is_sent TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reminder_user FOREIGN KEY (user_id) REFERENCES auth_user(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_reminder_obligation FOREIGN KEY (obligation_id) REFERENCES obligation(obligation_id) ON DELETE SET NULL,
  CONSTRAINT fk_reminder_account FOREIGN KEY (account_id) REFERENCES account(account_id) ON DELETE SET NULL,
  INDEX (user_id, remind_at, is_sent)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE notification_log (
  notification_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  reminder_id BIGINT UNSIGNED NULL,
  obligation_id BIGINT UNSIGNED NULL,
  transaction_id BIGINT UNSIGNED NULL,
  channel ENUM('email','sms','push','in_app','system') NOT NULL,
  status ENUM('pending','sent','failed') DEFAULT 'pending',
  payload JSON NULL,
  attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES auth_user(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_notification_reminder FOREIGN KEY (reminder_id) REFERENCES reminder(reminder_id) ON DELETE SET NULL,
  CONSTRAINT fk_notification_obligation FOREIGN KEY (obligation_id) REFERENCES obligation(obligation_id) ON DELETE SET NULL,
  CONSTRAINT fk_notification_transaction FOREIGN KEY (transaction_id) REFERENCES transaction_tbl(transaction_id) ON DELETE SET NULL,
  INDEX (user_id, attempted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE noticia (
  noticia_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  source VARCHAR(200),
  title VARCHAR(300) NOT NULL,
  content TEXT,
  category VARCHAR(100),
  url VARCHAR(500),
  published_at DATETIME,
  fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  raw_payload JSON NULL,
  INDEX (category),
  INDEX (published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE preferencia_noticia (
  preferencia_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  category VARCHAR(100) NOT NULL,
  priority TINYINT UNSIGNED DEFAULT 1,
  CONSTRAINT fk_pref_user FOREIGN KEY (user_id) REFERENCES auth_user(user_id) ON DELETE CASCADE,
  UNIQUE KEY (user_id, category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE simulacion_financiera (
  simulacion_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  sim_type ENUM('cdt','credit_line','stock_eval','loan_calc','custom') DEFAULT 'custom',
  parameters JSON NOT NULL,
  result JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sim_user FOREIGN KEY (user_id) REFERENCES auth_user(user_id) ON DELETE CASCADE,
  INDEX (user_id, sim_type, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE OR REPLACE VIEW v_account_balance AS
SELECT
  a.account_id,
  a.user_id,
  a.account_name,
  a.currency,
  COALESCE(SUM(
     CASE WHEN t.type = 'income' THEN t.amount
          WHEN t.type = 'expense' THEN -t.amount
          WHEN t.type = 'transfer' AND t.related_account_id IS NOT NULL AND t.account_id = a.account_id THEN -t.amount
          WHEN t.type = 'transfer' AND t.related_account_id IS NOT NULL AND t.related_account_id = a.account_id THEN t.amount
          ELSE 0 END
  ), 0) AS balance
FROM account a
LEFT JOIN transaction_tbl t ON (t.account_id = a.account_id OR t.related_account_id = a.account_id)
GROUP BY a.account_id;

DELIMITER $$

CREATE PROCEDURE sp_snapshot_user_balance(IN p_user_id BIGINT)
BEGIN
  INSERT INTO balance_history (user_id, snapshot_date, total_balance, payload, created_at)
  SELECT
    user_id,
    NOW(),
    SUM(balance) AS total_balance,
    JSON_ARRAYAGG(JSON_OBJECT('account_id', account_id, 'name', account_name, 'balance', balance)),
    NOW()
  FROM (
    SELECT
      a.user_id,
      a.account_id,
      a.account_name,
      COALESCE(SUM(
         CASE 
            WHEN t.type = 'income' THEN t.amount
            WHEN t.type = 'expense' THEN -t.amount
            WHEN t.type = 'transfer' AND t.related_account_id IS NOT NULL AND t.account_id = a.account_id THEN -t.amount
            WHEN t.type = 'transfer' AND t.related_account_id IS NOT NULL AND t.related_account_id = a.account_id THEN t.amount
            ELSE 0 
         END
      ), 0) AS balance
    FROM account a
    LEFT JOIN transaction_tbl t 
      ON (t.account_id = a.account_id OR t.related_account_id = a.account_id)
    WHERE a.user_id = p_user_id
    GROUP BY a.user_id, a.account_id, a.account_name
  ) AS per_account
  GROUP BY user_id;
END$$

DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_transaction_after_insert
AFTER INSERT ON transaction_tbl
FOR EACH ROW
BEGIN
  DECLARE uid BIGINT;
  SET uid = (SELECT user_id FROM account WHERE account_id = NEW.account_id);
  IF NEW.type = 'expense' AND NEW.amount > 1000 THEN
    INSERT INTO notification_log (user_id, transaction_id, channel, status, payload, attempted_at)
    VALUES (uid, NEW.transaction_id, 'in_app', 'pending', JSON_OBJECT('message','Large expense detected','amount',NEW.amount), NOW());
  END IF;
END$$
DELIMITER ;

-- === TESTING ===

INSERT INTO auth_user (email, password_hash, name, role)
VALUES ('alice@example.com','$2y$...','Alice Ramos','user'),
       ('prof@example.com','$2y$...','Dr. Profesor','admin');

INSERT INTO category (name, type) VALUES
('Salary','income'),('Groceries','expense'),('Rent','expense'),('Investments','income'),('Transfer','other');

INSERT INTO account (user_id, account_name, account_type, currency)
VALUES (1,'Main Checking','checking','USD'),
       (1,'Savings','savings','USD'),
       (1,'Credit Card','credit_card','USD');

INSERT INTO transaction_tbl (account_id, category_id, type, amount, occurred_at, description)
VALUES (1,1,'income',3000.00,'2025-01-01 09:00:00','Monthly salary'),
       (1,2,'expense',45.30,'2025-01-02 12:34:00','Grocery shopping'),
       (3,NULL,'expense',120.00,'2025-01-03 10:00:00','Credit card payment');

CALL sp_snapshot_user_balance(1);

INSERT INTO noticia (source,title,content,category,url,published_at)
VALUES ('Reuters','Market opens higher','Markets rallied ...','markets','https://...','2025-01-03 08:00:00');

INSERT INTO preferencia_noticia (user_id, category, priority)
VALUES (1,'markets',1);

SELECT * FROM v_account_balance;
