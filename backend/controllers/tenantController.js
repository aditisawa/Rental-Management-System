const db = require("../config/database");


// GET all tenants
const getAllTenants = (req, res) => {

    const sql = `
        SELECT
            t.*,
            f.flat_number,
            b.building_name
        FROM tenant t
        JOIN flat f
            ON t.flat_id = f.flat_id
        JOIN building b
            ON f.building_id = b.building_id
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch tenants"
            });
        }

        res.json({
            success: true,
            data: results
        });
    });
};


// GET tenant by ID
const getTenantById = (req, res) => {

    const tenantId = req.params.id;

    const sql = `
        SELECT
            t.*,
            f.flat_number,
            b.building_name
        FROM tenant t
        JOIN flat f
            ON t.flat_id = f.flat_id
        JOIN building b
            ON f.building_id = b.building_id
        WHERE t.tenant_id = ?
    `;

    db.query(sql, [tenantId], (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch tenant"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tenant not found"
            });
        }

        res.json({
            success: true,
            data: results[0]
        });
    });
};


// CREATE tenant
const createTenant = (req, res) => {

    const {
        flat_id,
        full_name,
        mobile,
        email,
        aadhaar_number,
        pan_number,
        address,
        occupation,
        family_members,
        emergency_contact,
        move_in_date,
        move_out_date,
        status
    } = req.body;

    const sql = `
        INSERT INTO tenant
        (
            flat_id,
            full_name,
            mobile,
            email,
            aadhaar_number,
            pan_number,
            address,
            occupation,
            family_members,
            emergency_contact,
            move_in_date,
            move_out_date,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            flat_id,
            full_name,
            mobile,
            email,
            aadhaar_number,
            pan_number,
            address,
            occupation,
            family_members,
            emergency_contact,
            move_in_date,
            move_out_date,
            status || "Active"
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create tenant"
                });
            }

            res.status(201).json({
                success: true,
                message: "Tenant created successfully",
                tenant_id: result.insertId
            });
        }
    );
};


// UPDATE tenant
const updateTenant = (req, res) => {

    const tenantId = req.params.id;

    const {
        flat_id,
        full_name,
        mobile,
        email,
        aadhaar_number,
        pan_number,
        address,
        occupation,
        family_members,
        emergency_contact,
        move_in_date,
        move_out_date,
        status
    } = req.body;

    const sql = `
        UPDATE tenant
        SET
            flat_id = ?,
            full_name = ?,
            mobile = ?,
            email = ?,
            aadhaar_number = ?,
            pan_number = ?,
            address = ?,
            occupation = ?,
            family_members = ?,
            emergency_contact = ?,
            move_in_date = ?,
            move_out_date = ?,
            status = ?
        WHERE tenant_id = ?
    `;

    db.query(
        sql,
        [
            flat_id,
            full_name,
            mobile,
            email,
            aadhaar_number,
            pan_number,
            address,
            occupation,
            family_members,
            emergency_contact,
            move_in_date,
            move_out_date,
            status,
            tenantId
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update tenant"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Tenant not found"
                });
            }

            res.json({
                success: true,
                message: "Tenant updated successfully"
            });
        }
    );
};


// DELETE tenant
const deleteTenant = (req, res) => {

    const tenantId = req.params.id;

    const sql = "DELETE FROM tenant WHERE tenant_id = ?";

    db.query(sql, [tenantId], (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Failed to delete tenant"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Tenant not found"
            });
        }

        res.json({
            success: true,
            message: "Tenant deleted successfully"
        });
    });
};


module.exports = {
    getAllTenants,
    getTenantById,
    createTenant,
    updateTenant,
    deleteTenant
};