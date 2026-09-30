const db = require("../config/database");


// GET all documents
const getAllDocuments = (req, res) => {

    const sql = `
        SELECT
            d.*,
            t.full_name
        FROM documents d
        JOIN tenant t
            ON d.tenant_id = t.tenant_id
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch documents"
            });
        }

        res.json({
            success: true,
            data: results
        });
    });
};


// GET document by ID
const getDocumentById = (req, res) => {

    const documentId = req.params.id;

    const sql = `
        SELECT
            d.*,
            t.full_name
        FROM documents d
        JOIN tenant t
            ON d.tenant_id = t.tenant_id
        WHERE d.document_id = ?
    `;

    db.query(sql, [documentId], (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch document"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        res.json({
            success: true,
            data: results[0]
        });
    });
};


// CREATE document record
const createDocument = (req, res) => {

    const {
        tenant_id,
        aadhaar_copy,
        pan_copy,
        agreement_copy,
        tenant_photo
    } = req.body;

    const sql = `
        INSERT INTO documents
        (
            tenant_id,
            aadhaar_copy,
            pan_copy,
            agreement_copy,
            tenant_photo
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            tenant_id,
            aadhaar_copy,
            pan_copy,
            agreement_copy,
            tenant_photo
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create document record"
                });
            }

            res.status(201).json({
                success: true,
                message: "Document record created successfully",
                document_id: result.insertId
            });
        }
    );
};


// UPDATE document
const updateDocument = (req, res) => {

    const documentId = req.params.id;

    const {
        tenant_id,
        aadhaar_copy,
        pan_copy,
        agreement_copy,
        tenant_photo
    } = req.body;

    const sql = `
        UPDATE documents
        SET
            tenant_id = ?,
            aadhaar_copy = ?,
            pan_copy = ?,
            agreement_copy = ?,
            tenant_photo = ?
        WHERE document_id = ?
    `;

    db.query(
        sql,
        [
            tenant_id,
            aadhaar_copy,
            pan_copy,
            agreement_copy,
            tenant_photo,
            documentId
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to update document"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Document not found"
                });
            }

            res.json({
                success: true,
                message: "Document updated successfully"
            });
        }
    );
};


// DELETE document
const deleteDocument = (req, res) => {

    const documentId = req.params.id;

    const sql = "DELETE FROM documents WHERE document_id = ?";

    db.query(sql, [documentId], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to delete document"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        res.json({
            success: true,
            message: "Document deleted successfully"
        });
    });
};


module.exports = {
    getAllDocuments,
    getDocumentById,
    createDocument,
    updateDocument,
    deleteDocument
};