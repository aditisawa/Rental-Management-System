const db = require("../config/database");


// GET all complaints
const getAllComplaints = (req, res) => {

    const sql = `
        SELECT
            c.*,
            t.full_name,
            f.flat_number
        FROM complaint c
        JOIN tenant t
            ON c.tenant_id = t.tenant_id
        JOIN flat f
            ON t.flat_id = f.flat_id
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch complaints"
            });
        }

        res.json({
            success: true,
            data: results
        });
    });
};


// GET complaint by ID
const getComplaintById = (req, res) => {

    const complaintId = req.params.id;

    const sql = `
        SELECT
            c.*,
            t.full_name,
            f.flat_number
        FROM complaint c
        JOIN tenant t
            ON c.tenant_id = t.tenant_id
        JOIN flat f
            ON t.flat_id = f.flat_id
        WHERE c.complaint_id = ?
    `;

    db.query(sql, [complaintId], (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch complaint"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        res.json({
            success: true,
            data: results[0]
        });
    });
};


// CREATE complaint
const createComplaint = (req, res) => {

    const {
        tenant_id,
        complaint_title,
        complaint_description,
        complaint_date,
        priority,
        status,
        resolved_date
    } = req.body;

    const sql = `
        INSERT INTO complaint
        (
            tenant_id,
            complaint_title,
            complaint_description,
            complaint_date,
            priority,
            status,
            resolved_date
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            tenant_id,
            complaint_title,
            complaint_description,
            complaint_date,
            priority,
            status,
            resolved_date
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create complaint"
                });
            }

            res.status(201).json({
                success: true,
                message: "Complaint created successfully",
                complaint_id: result.insertId
            });
        }
    );
};


// UPDATE complaint
const updateComplaint = (req, res) => {

    const complaintId = req.params.id;

    const {
        tenant_id,
        complaint_title,
        complaint_description,
        complaint_date,
        priority,
        status,
        resolved_date
    } = req.body;

    const sql = `
        UPDATE complaint
        SET
            tenant_id = ?,
            complaint_title = ?,
            complaint_description = ?,
            complaint_date = ?,
            priority = ?,
            status = ?,
            resolved_date = ?
        WHERE complaint_id = ?
    `;

    db.query(
        sql,
        [
            tenant_id,
            complaint_title,
            complaint_description,
            complaint_date,
            priority,
            status,
            resolved_date,
            complaintId
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to update complaint"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Complaint not found"
                });
            }

            res.json({
                success: true,
                message: "Complaint updated successfully"
            });
        }
    );
};


// DELETE complaint
const deleteComplaint = (req, res) => {

    const complaintId = req.params.id;

    const sql = "DELETE FROM complaint WHERE complaint_id = ?";

    db.query(sql, [complaintId], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to delete complaint"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        res.json({
            success: true,
            message: "Complaint deleted successfully"
        });
    });
};


module.exports = {
    getAllComplaints,
    getComplaintById,
    createComplaint,
    updateComplaint,
    deleteComplaint
};