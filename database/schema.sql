-- ============================================================
-- MEDISTOCK Database Schema
-- Pharmacy Inventory and Medicine Stock Management System
-- ============================================================

CREATE DATABASE IF NOT EXISTS medistock_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE medistock_db;

-- ============================================================
-- TABLE: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)    NOT NULL,
    email       VARCHAR(150)    NOT NULL UNIQUE,
    password    VARCHAR(255)    NOT NULL,
    role        VARCHAR(20)     NOT NULL DEFAULT 'STAFF',
    active      BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: categories
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)    NOT NULL UNIQUE,
    description TEXT,
    active      BOOLEAN         NOT NULL DEFAULT TRUE,
    INDEX idx_categories_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: medicines
-- ============================================================
CREATE TABLE IF NOT EXISTS medicines (
    id                   BIGINT AUTO_INCREMENT PRIMARY KEY,
    medicine_name        VARCHAR(200)    NOT NULL,
    generic_name         VARCHAR(200),
    category_id          BIGINT          NOT NULL,
    manufacturer         VARCHAR(200)    NOT NULL,
    batch_number         VARCHAR(100)    NOT NULL,
    price                DECIMAL(10,2)   NOT NULL,
    quantity             INT             NOT NULL DEFAULT 0,
    minimum_stock_level  INT             NOT NULL DEFAULT 10,
    expiry_date          DATE            NOT NULL,
    prescription_required BOOLEAN        NOT NULL DEFAULT FALSE,
    description          TEXT,
    active               BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_medicines_category (category_id),
    INDEX idx_medicines_expiry (expiry_date),
    INDEX idx_medicines_active (active),
    INDEX idx_medicines_name (medicine_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: stock_transactions
-- ============================================================
CREATE TABLE IF NOT EXISTS stock_transactions (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    medicine_id         BIGINT          NOT NULL,
    transaction_type    VARCHAR(20)     NOT NULL,  -- STOCK_IN or STOCK_OUT
    quantity            INT             NOT NULL,
    previous_quantity   INT             NOT NULL,
    new_quantity        INT             NOT NULL,
    reason              VARCHAR(500),
    performed_by        BIGINT          NOT NULL,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE RESTRICT,
    FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_stock_txn_medicine (medicine_id),
    INDEX idx_stock_txn_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: orders
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number    VARCHAR(50)     NOT NULL UNIQUE,
    customer_name   VARCHAR(200)    NOT NULL,
    customer_phone  VARCHAR(20)     NOT NULL,
    total_amount    DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    status          VARCHAR(20)     NOT NULL DEFAULT 'PENDING',
    processed_by    BIGINT          NOT NULL,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_orders_status (status),
    INDEX idx_orders_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: order_items
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id    BIGINT          NOT NULL,
    medicine_id BIGINT          NOT NULL,
    quantity    INT             NOT NULL,
    unit_price  DECIMAL(10,2)   NOT NULL,
    subtotal    DECIMAL(10,2)   NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE RESTRICT,
    INDEX idx_order_items_order (order_id),
    INDEX idx_order_items_medicine (medicine_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- End of Schema
-- ============================================================
