const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/database");

// Import routes
const buildingRoutes = require("./routes/buildingRoutes");
const flatRoutes = require("./routes/flatRoutes");
const tenantRoutes = require("./routes/tenantRoutes");
const rentRoutes = require("./routes/rentRoutes");
const depositRoutes = require("./routes/depositRoutes");
const electricityRoutes = require("./routes/electricityRoutes");
const documentRoutes = require("./routes/documentRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");

const app = express();

const PORT = process.env.PORT || 5000;


// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());

app.use(express.json());


// ===============================
// HOME / SERVER TEST
// ===============================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Smart Property Rental Management Backend is running!"
    });
});


// ===============================
// DATABASE TEST
// ===============================

app.get("/api/test-db", (req, res) => {

    db.query("SELECT 1 AS test", (err, results) => {

        if (err) {

            console.error("Database test failed:", err);

            return res.status(500).json({
                success: false,
                message: "Database connection failed"
            });
        }

        res.json({
            success: true,
            message: "Database connected successfully",
            result: results
        });

    });

});


// ===============================
// API ROUTES
// ===============================

app.use("/api/buildings", buildingRoutes);

app.use("/api/flats", flatRoutes);

app.use("/api/tenants", tenantRoutes);

app.use("/api/rents", rentRoutes);

app.use("/api/deposits", depositRoutes);

app.use("/api/electricity", electricityRoutes);

app.use("/api/documents", documentRoutes);

app.use("/api/complaints", complaintRoutes);

app.use("/api/maintenance", maintenanceRoutes);


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {

    console.log(`Server running on http://localhost:${PORT}`);

});