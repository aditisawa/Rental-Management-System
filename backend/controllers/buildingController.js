const db = require("../config/database");

// GET all buildings
const getAllBuildings = (req, res) => {
    const sql = "SELECT * FROM building";

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch buildings"
            });
        }

        res.json({
            success: true,
            data: results
        });
    });
};


// GET building by ID
const getBuildingById = (req, res) => {
    const buildingId = req.params.id;

    const sql = "SELECT * FROM building WHERE building_id = ?";

    db.query(sql, [buildingId], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch building"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Building not found"
            });
        }

        res.json({
            success: true,
            data: results[0]
        });
    });
};


// CREATE building
const createBuilding = (req, res) => {
    const {
        building_name,
        address,
        number_of_floors,
        total_flats,
        description
    } = req.body;

    const sql = `
        INSERT INTO building
        (
            building_name,
            address,
            number_of_floors,
            total_flats,
            description
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            building_name,
            address,
            number_of_floors,
            total_flats,
            description
        ],
        (err, result) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create building"
                });
            }

            res.status(201).json({
                success: true,
                message: "Building created successfully",
                building_id: result.insertId
            });
        }
    );
};


// UPDATE building
const updateBuilding = (req, res) => {
    const buildingId = req.params.id;

    const {
        building_name,
        address,
        number_of_floors,
        total_flats,
        description
    } = req.body;

    const sql = `
        UPDATE building
        SET
            building_name = ?,
            address = ?,
            number_of_floors = ?,
            total_flats = ?,
            description = ?
        WHERE building_id = ?
    `;

    db.query(
        sql,
        [
            building_name,
            address,
            number_of_floors,
            total_flats,
            description,
            buildingId
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to update building"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Building not found"
                });
            }

            res.json({
                success: true,
                message: "Building updated successfully"
            });
        }
    );
};


// DELETE building
const deleteBuilding = (req, res) => {
    const buildingId = req.params.id;

    const sql = "DELETE FROM building WHERE building_id = ?";

    db.query(sql, [buildingId], (err, result) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Failed to delete building"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Building not found"
            });
        }

        res.json({
            success: true,
            message: "Building deleted successfully"
        });
    });
};


module.exports = {
    getAllBuildings,
    getBuildingById,
    createBuilding,
    updateBuilding,
    deleteBuilding
};