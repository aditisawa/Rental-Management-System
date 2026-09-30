# 🏠 Rental Management System

A web-based Rental Management System designed to help property owners manage buildings, flats, tenants, rent, deposits, electricity bills, maintenance, complaints, and related documents in one centralized system.

## 🚧 Project Status

**Currently in Development**

The core backend, database structure, API routes, and initial frontend functionality have been implemented. Additional features and improvements are currently being developed.

---

## 🎯 Problem Statement

Managing multiple rental properties manually can become difficult when tenant information, rent payments, deposits, electricity bills, complaints, and documents are maintained using notebooks or separate records.

This project aims to provide a centralized digital system that helps property owners maintain and manage rental property information efficiently.

---

## 💡 Main Objectives

- Manage multiple buildings and flats
- Maintain tenant information digitally
- Track tenant move-in and move-out details
- Manage rent payment records
- Track security deposits
- Manage electricity bill information
- Record maintenance requests
- Manage tenant complaints
- Store and manage important tenant documents
- Provide APIs for communication between frontend and backend
- Reduce manual record keeping

---

## ✨ Planned Features

### 🏢 Building Management

- Add buildings
- Store building details
- Manage flats under each building

### 🏠 Flat Management

- Add and manage flats
- Track flat availability
- Store flat-related information

### 👤 Tenant Management

- Add tenant information
- Update tenant details
- Track active and previous tenants
- Manage move-in and move-out information

### 💰 Rent Management

- Record monthly rent
- Track paid/unpaid rent
- Maintain rent payment history

### 💵 Deposit Management

- Record security deposits
- Track deposit status
- Manage deposit information after tenant move-out

### ⚡ Electricity Management

- Maintain electricity bill records
- Track payment status

### 🔧 Maintenance Management

- Record maintenance requests
- Track maintenance status

### 📢 Complaint Management

- Record tenant complaints
- Track complaint status

### 📄 Document Management

- Manage tenant-related documents

---

## 🛠️ Technologies Used

### Frontend

- HTML
- CSS
- JavaScript

### Backend

- Node.js
- Express.js

### Database

- MySQL

### Development Tools

- Visual Studio Code
- Git & GitHub
- Postman

---

## 📂 Project Structure

```text
Rental-Management-System/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── css/
│   ├── js/
│   └── index.html
│
├── database/
│   ├── database.sql
│   └── database-design.md
│
├── documents/
│   └── PROJECT_PLAN.md
│
├── postman/
│
├── .gitignore
└── README.md

🔄 System Flow
User
  ↓
Frontend
  ↓
API Requests
  ↓
Node.js + Express Backend
  ↓
Controllers
  ↓
MySQL Database
  ↓
Response
  ↓
Frontend

🔌 Backend API Modules

The backend currently contains API modules for:

Buildings
Flats
Tenants
Rent
Deposits
Electricity
Maintenance
Complaints
Documents
