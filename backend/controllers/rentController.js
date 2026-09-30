const db = require("../config/database");


// GET all rent records
const getAllRents = (req, res) => {

    const sql = `
        SELECT
            r.*,
            t.full_name,
            f.flat_number
        FROM rent r
        JOIN tenant t
            ON r.tenant_id = t.tenant_id
        JOIN flat f
            ON t.flat_id = f.flat_id
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch rent records"
            });
        }

        res.json({
            success: true,
            data: results
        });
    });
};


// GET rent by ID
const getRentById = (req, res) => {

    const rentId = req.params.id;

    const sql = `
        SELECT
            r.*,
            t.full_name,
            f.flat_number
        FROM rent r
        JOIN tenant t
            ON r.tenant_id = t.tenant_id
        JOIN flat f
            ON t.flat_id = f.flat_id
        WHERE r.rent_id = ?
    `;

    db.query(sql, [rentId], (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch rent record"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Rent record not found"
            });
        }

        res.json({
            success: true,
            data: results[0]
        });
    });
};


// CREATE rent
const createRent = (req, res) => {

    const {
        tenant_id,
        month,
        year,
        rent_amount,
        due_date,
        payment_date,
        payment_mode,
        status,
        remarks
    } = req.body;

    const sql = `
        INSERT INTO rent
        (
            tenant_id,
            month,
            year,
            rent_amount,
            due_date,
            payment_date,
            payment_mode,
            status,
            remarks
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            tenant_id,
            month,
            year,
            rent_amount,
            due_date,
            payment_date,
            payment_mode,
            status,
            remarks
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create rent record"
                });
            }

            res.status(201).json({
                success: true,
                message: "Rent record created successfully",
                rent_id: result.insertId
            });
        }
    );
};


// UPDATE rent
const updateRent = (req, res) => {

    const rentId = req.params.id;

    const {
        tenant_id,
        month,
        year,
        rent_amount,
        due_date,
        payment_date,
        payment_mode,
        status,
        remarks
    } = req.body;

    const sql = `
        UPDATE rent
        SET
            tenant_id = ?,
            month = ?,
            year = ?,
            rent_amount = ?,
            due_date = ?,
            payment_date = ?,
            payment_mode = ?,
            status = ?,
            remarks = ?
        WHERE rent_id = ?
    `;

    db.query(
        sql,
        [
            tenant_id,
            month,
            year,
            rent_amount,
            due_date,
            payment_date,
            payment_mode,
            status,
            remarks,
            rentId
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update rent record"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Rent record not found"
                });
            }

            res.json({
                success: true,
                message: "Rent record updated successfully"
            });
        }
    );
};


// DELETE rent
const deleteRent = (req, res) => {

    const rentId = req.params.id;

    const sql = "DELETE FROM rent WHERE rent_id = ?";

    db.query(sql, [rentId], (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Failed to delete rent record"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Rent record not found"
            });
        }

        res.json({
            success: true,
            message: "Rent record deleted successfully"
        });
    });
};


module.exports = {
    getAllRents,
    getRentById,
    createRent,
    updateRent,
    deleteRent
};