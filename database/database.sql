-- ==========================================================
-- SMART PROPERTY RENTAL MANAGEMENT SYSTEM
-- Database Script
-- Author : Aditi Sawant
-- ==========================================================

-- ==========================================================
-- CREATE DATABASE
-- ==========================================================

CREATE DATABASE IF NOT EXISTS property_rental_management;

USE property_rental_management;

-- ==========================================================
-- ADMIN TABLE
-- ==========================================================

CREATE TABLE IF NOT EXISTS admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    role VARCHAR(50) DEFAULT 'Owner',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- BUILDING TABLE
-- ==========================================================

CREATE TABLE IF NOT EXISTS building (
    building_id INT AUTO_INCREMENT PRIMARY KEY,
    building_name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    number_of_floors INT NOT NULL,
    total_flats INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- FLAT TABLE
-- ==========================================================

CREATE TABLE IF NOT EXISTS flat (
    flat_id INT AUTO_INCREMENT PRIMARY KEY,
    building_id INT NOT NULL,
    flat_number VARCHAR(20) NOT NULL,
    floor_number INT NOT NULL,
    flat_type VARCHAR(50),
    rent_amount DECIMAL(10,2),
    deposit_amount DECIMAL(10,2),
    status VARCHAR(30) DEFAULT 'Available',
    description TEXT,

    FOREIGN KEY (building_id)
    REFERENCES building(building_id)
);

-- ==========================================================
-- TENANT TABLE
-- ==========================================================

CREATE TABLE IF NOT EXISTS tenant (
    tenant_id INT AUTO_INCREMENT PRIMARY KEY,
    flat_id INT NOT NULL,

    full_name VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    email VARCHAR(100),

    aadhaar_number VARCHAR(20),
    pan_number VARCHAR(20),

    address TEXT,
    occupation VARCHAR(100),

    family_members INT,
    emergency_contact VARCHAR(15),

    move_in_date DATE,
    move_out_date DATE,

    status VARCHAR(30) DEFAULT 'Active',

    FOREIGN KEY (flat_id)
    REFERENCES flat(flat_id)
);

-- ==========================================================
-- RENT TABLE
-- ==========================================================

CREATE TABLE IF NOT EXISTS rent (
    rent_id INT AUTO_INCREMENT PRIMARY KEY,

    tenant_id INT NOT NULL,

    month VARCHAR(20),
    year INT,

    rent_amount DECIMAL(10,2),

    due_date DATE,
    payment_date DATE,

    payment_mode VARCHAR(30),

    status VARCHAR(30),

    remarks TEXT,

    FOREIGN KEY (tenant_id)
    REFERENCES tenant(tenant_id)
);

-- ==========================================================
-- DEPOSIT TABLE
-- ==========================================================

CREATE TABLE IF NOT EXISTS deposit (
    deposit_id INT AUTO_INCREMENT PRIMARY KEY,

    tenant_id INT NOT NULL,

    deposit_amount DECIMAL(10,2),

    received_date DATE,

    returned_date DATE,

    deduction_amount DECIMAL(10,2),

    reason TEXT,

    status VARCHAR(30),

    FOREIGN KEY (tenant_id)
    REFERENCES tenant(tenant_id)
);

-- ==========================================================
-- ELECTRICITY BILL TABLE
-- ==========================================================

CREATE TABLE IF NOT EXISTS electricity_bill (

    bill_id INT AUTO_INCREMENT PRIMARY KEY,

    flat_id INT NOT NULL,

    bill_month VARCHAR(30),

    previous_reading DECIMAL(10,2),

    current_reading DECIMAL(10,2),

    units DECIMAL(10,2),

    rate_per_unit DECIMAL(10,2),

    bill_amount DECIMAL(10,2),

    due_date DATE,

    payment_date DATE,

    status VARCHAR(30),

    FOREIGN KEY (flat_id)
    REFERENCES flat(flat_id)
);

-- ==========================================================
-- DOCUMENT TABLE
-- ==========================================================

CREATE TABLE IF NOT EXISTS documents (

    document_id INT AUTO_INCREMENT PRIMARY KEY,

    tenant_id INT NOT NULL,

    aadhaar_copy VARCHAR(255),

    pan_copy VARCHAR(255),

    agreement_copy VARCHAR(255),

    tenant_photo VARCHAR(255),

    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (tenant_id)
    REFERENCES tenant(tenant_id)
);

-- ==========================================================
-- COMPLAINT TABLE
-- ==========================================================

CREATE TABLE IF NOT EXISTS complaint (

    complaint_id INT AUTO_INCREMENT PRIMARY KEY,

    tenant_id INT NOT NULL,

    complaint_title VARCHAR(150),

    complaint_description TEXT,

    complaint_date DATE,

    priority VARCHAR(30),

    status VARCHAR(30),

    resolved_date DATE,

    FOREIGN KEY (tenant_id)
    REFERENCES tenant(tenant_id)
);

-- ==========================================================
-- MAINTENANCE TABLE
-- ==========================================================

CREATE TABLE IF NOT EXISTS maintenance (

    maintenance_id INT AUTO_INCREMENT PRIMARY KEY,

    building_id INT NOT NULL,

    title VARCHAR(100),

    description TEXT,

    maintenance_date DATE,

    amount DECIMAL(10,2),

    status VARCHAR(30),

    FOREIGN KEY (building_id)
    REFERENCES building(building_id)
);