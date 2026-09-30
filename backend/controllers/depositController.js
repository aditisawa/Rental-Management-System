const db = require("../config/database");


// GET all deposits
const getAllDeposits = (req, res) => {

    const sql = `
        SELECT
            d.*,
            t.full_name,
            f.flat_number
        FROM deposit d
        JOIN tenant t
            ON d.tenant_id = t.tenant_id
        JOIN flat f
            ON t.flat_id = f.flat_id
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch deposits"
            });
        }

        res.json({
            success: true,
            data: results
        });
    });
};


// GET deposit by ID
const getDepositById = (req, res) => {

    const depositId = req.params.id;

    const sql = `
        SELECT
            d.*,
            t.full_name,
            f.flat_number
        FROM deposit d
        JOIN tenant t
            ON d.tenant_id = t.tenant_id
        JOIN flat f
            ON t.flat_id = f.flat_id
        WHERE d.deposit_id = ?
    `;

    db.query(sql, [depositId], (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch deposit"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Deposit not found"
            });
        }

        res.json({
            success: true,
            data: results[0]
        });
    });
};


// CREATE deposit
const createDeposit = (req, res) => {

    const {
        tenant_id,
        deposit_amount,
        received_date,
        returned_date,
        deduction_amount,
        reason,
        status
    } = req.body;

    const sql = `
        INSERT INTO deposit
        (
            tenant_id,
            deposit_amount,
            received_date,
            returned_date,
            deduction_amount,
            reason,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            tenant_id,
            deposit_amount,
            received_date,
            returned_date,
            deduction_amount,
            reason,
            status
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create deposit"
                });
            }

            res.status(201).json({
                success: true,
                message: "Deposit created successfully",
                deposit_id: result.insertId
            });
        }
    );
};


// UPDATE deposit
const updateDeposit = (req, res) => {

    const depositId = req.params.id;

    const {
        tenant_id,
        deposit_amount,
        received_date,
        returned_date,
        deduction_amount,
        reason,
        status
    } = req.body;

    const sql = `
        UPDATE deposit
        SET
            tenant_id = ?,
            deposit_amount = ?,
            received_date = ?,
            returned_date = ?,
            deduction_amount = ?,
            reason = ?,
            status = ?
        WHERE deposit_id = ?
    `;

    db.query(
        sql,
        [
            tenant_id,
            deposit_amount,
            received_date,
            returned_date,
            deduction_amount,
            reason,
            status,
            depositId
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to update deposit"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Deposit not found"
                });
            }

            res.json({
                success: true,
                message: "Deposit updated successfully"
            });
        }
    );
};


// DELETE deposit
const deleteDeposit = (req, res) => {

    const depositId = req.params.id;

    const sql = "DELETE FROM deposit WHERE deposit_id = ?";

    db.query(sql, [depositId], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to delete deposit"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Deposit not found"
            });
        }

        res.json({
            success: true,
            message: "Deposit deleted successfully"
        });
    });
};


module.exports = {
    getAllDeposits,
    getDepositById,
    createDeposit,
    updateDeposit,
    deleteDeposit
};