const db = require("../config/database");


// GET all electricity bills
const getAllElectricityBills = (req, res) => {

    const sql = `
        SELECT
            e.*,
            f.flat_number,
            b.building_name
        FROM electricity_bill e
        JOIN flat f
            ON e.flat_id = f.flat_id
        JOIN building b
            ON f.building_id = b.building_id
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch electricity bills"
            });
        }

        res.json({
            success: true,
            data: results
        });
    });
};


// GET electricity bill by ID
const getElectricityBillById = (req, res) => {

    const billId = req.params.id;

    const sql = `
        SELECT
            e.*,
            f.flat_number,
            b.building_name
        FROM electricity_bill e
        JOIN flat f
            ON e.flat_id = f.flat_id
        JOIN building b
            ON f.building_id = b.building_id
        WHERE e.bill_id = ?
    `;

    db.query(sql, [billId], (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch electricity bill"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Electricity bill not found"
            });
        }

        res.json({
            success: true,
            data: results[0]
        });
    });
};


// CREATE electricity bill
const createElectricityBill = (req, res) => {

    const {
        flat_id,
        bill_month,
        previous_reading,
        current_reading,
        units,
        rate_per_unit,
        bill_amount,
        due_date,
        payment_date,
        status
    } = req.body;

    const sql = `
        INSERT INTO electricity_bill
        (
            flat_id,
            bill_month,
            previous_reading,
            current_reading,
            units,
            rate_per_unit,
            bill_amount,
            due_date,
            payment_date,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            flat_id,
            bill_month,
            previous_reading,
            current_reading,
            units,
            rate_per_unit,
            bill_amount,
            due_date,
            payment_date,
            status
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create electricity bill"
                });
            }

            res.status(201).json({
                success: true,
                message: "Electricity bill created successfully",
                bill_id: result.insertId
            });
        }
    );
};


// UPDATE electricity bill
const updateElectricityBill = (req, res) => {

    const billId = req.params.id;

    const {
        flat_id,
        bill_month,
        previous_reading,
        current_reading,
        units,
        rate_per_unit,
        bill_amount,
        due_date,
        payment_date,
        status
    } = req.body;

    const sql = `
        UPDATE electricity_bill
        SET
            flat_id = ?,
            bill_month = ?,
            previous_reading = ?,
            current_reading = ?,
            units = ?,
            rate_per_unit = ?,
            bill_amount = ?,
            due_date = ?,
            payment_date = ?,
            status = ?
        WHERE bill_id = ?
    `;

    db.query(
        sql,
        [
            flat_id,
            bill_month,
            previous_reading,
            current_reading,
            units,
            rate_per_unit,
            bill_amount,
            due_date,
            payment_date,
            status,
            billId
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to update electricity bill"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Electricity bill not found"
                });
            }

            res.json({
                success: true,
                message: "Electricity bill updated successfully"
            });
        }
    );
};


// DELETE electricity bill
const deleteElectricityBill = (req, res) => {

    const billId = req.params.id;

    const sql = "DELETE FROM electricity_bill WHERE bill_id = ?";

    db.query(sql, [billId], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to delete electricity bill"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Electricity bill not found"
            });
        }

        res.json({
            success: true,
            message: "Electricity bill deleted successfully"
        });
    });
};


module.exports = {
    getAllElectricityBills,
    getElectricityBillById,
    createElectricityBill,
    updateElectricityBill,
    deleteElectricityBill
};