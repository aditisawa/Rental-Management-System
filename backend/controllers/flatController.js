const db = require("../config/database");


// GET all flats
const getAllFlats = (req, res) => {

    const sql = `
        SELECT
            f.*,
            b.building_name
        FROM flat f
        JOIN building b
            ON f.building_id = b.building_id
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch flats"
            });
        }

        res.json({
            success: true,
            data: results
        });
    });
};


// GET flat by ID
const getFlatById = (req, res) => {

    const flatId = req.params.id;

    const sql = `
        SELECT
            f.*,
            b.building_name
        FROM flat f
        JOIN building b
            ON f.building_id = b.building_id
        WHERE f.flat_id = ?
    `;

    db.query(sql, [flatId], (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch flat"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Flat not found"
            });
        }

        res.json({
            success: true,
            data: results[0]
        });
    });
};


// CREATE flat
const createFlat = (req, res) => {

    const {
        building_id,
        flat_number,
        floor_number,
        flat_type,
        rent_amount,
        deposit_amount,
        status,
        description
    } = req.body;

    const sql = `
        INSERT INTO flat
        (
            building_id,
            flat_number,
            floor_number,
            flat_type,
            rent_amount,
            deposit_amount,
            status,
            description
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            building_id,
            flat_number,
            floor_number,
            flat_type,
            rent_amount,
            deposit_amount,
            status || "Available",
            description
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create flat"
                });
            }

            res.status(201).json({
                success: true,
                message: "Flat created successfully",
                flat_id: result.insertId
            });
        }
    );
};


// UPDATE flat
const updateFlat = (req, res) => {

    const flatId = req.params.id;

    const {
        building_id,
        flat_number,
        floor_number,
        flat_type,
        rent_amount,
        deposit_amount,
        status,
        description
    } = req.body;

    const sql = `
        UPDATE flat
        SET
            building_id = ?,
            flat_number = ?,
            floor_number = ?,
            flat_type = ?,
            rent_amount = ?,
            deposit_amount = ?,
            status = ?,
            description = ?
        WHERE flat_id = ?
    `;

    db.query(
        sql,
        [
            building_id,
            flat_number,
            floor_number,
            flat_type,
            rent_amount,
            deposit_amount,
            status,
            description,
            flatId
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update flat"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Flat not found"
                });
            }

            res.json({
                success: true,
                message: "Flat updated successfully"
            });
        }
    );
};


// DELETE flat
const deleteFlat = (req, res) => {

    const flatId = req.params.id;

    const sql = "DELETE FROM flat WHERE flat_id = ?";

    db.query(sql, [flatId], (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Failed to delete flat"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Flat not found"
            });
        }

        res.json({
            success: true,
            message: "Flat deleted successfully"
        });
    });
};


module.exports = {
    getAllFlats,
    getFlatById,
    createFlat,
    updateFlat,
    deleteFlat
};