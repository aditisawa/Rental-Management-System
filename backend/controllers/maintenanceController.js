const db = require("../config/database");


// GET all maintenance records
const getAllMaintenance = (req, res) => {

    const sql = `
        SELECT
            m.*,
            b.building_name
        FROM maintenance m
        JOIN building b
            ON m.building_id = b.building_id
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch maintenance records"
            });
        }

        res.json({
            success: true,
            data: results
        });
    });
};


// GET maintenance by ID
const getMaintenanceById = (req, res) => {

    const maintenanceId = req.params.id;

    const sql = `
        SELECT
            m.*,
            b.building_name
        FROM maintenance m
        JOIN building b
            ON m.building_id = b.building_id
        WHERE m.maintenance_id = ?
    `;

    db.query(sql, [maintenanceId], (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch maintenance record"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Maintenance record not found"
            });
        }

        res.json({
            success: true,
            data: results[0]
        });
    });
};


// CREATE maintenance
const createMaintenance = (req, res) => {

    const {
        building_id,
        title,
        description,
        maintenance_date,
        amount,
        status
    } = req.body;

    const sql = `
        INSERT INTO maintenance
        (
            building_id,
            title,
            description,
            maintenance_date,
            amount,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            building_id,
            title,
            description,
            maintenance_date,
            amount,
            status
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create maintenance record"
                });
            }

            res.status(201).json({
                success: true,
                message: "Maintenance record created successfully",
                maintenance_id: result.insertId
            });
        }
    );
};


// UPDATE maintenance
const updateMaintenance = (req, res) => {

    const maintenanceId = req.params.id;

    const {
        building_id,
        title,
        description,
        maintenance_date,
        amount,
        status
    } = req.body;

    const sql = `
        UPDATE maintenance
        SET
            building_id = ?,
            title = ?,
            description = ?,
            maintenance_date = ?,
            amount = ?,
            status = ?
        WHERE maintenance_id = ?
    `;

    db.query(
        sql,
        [
            building_id,
            title,
            description,
            maintenance_date,
            amount,
            status,
            maintenanceId
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to update maintenance record"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Maintenance record not found"
                });
            }

            res.json({
                success: true,
                message: "Maintenance record updated successfully"
            });
        }
    );
};


// DELETE maintenance
const deleteMaintenance = (req, res) => {

    const maintenanceId = req.params.id;

    const sql = "DELETE FROM maintenance WHERE maintenance_id = ?";

    db.query(sql, [maintenanceId], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to delete maintenance record"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Maintenance record not found"
            });
        }

        res.json({
            success: true,
            message: "Maintenance record deleted successfully"
        });
    });
};


module.exports = {
    getAllMaintenance,
    getMaintenanceById,
    createMaintenance,
    updateMaintenance,
    deleteMaintenance
};