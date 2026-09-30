const express = require("express");

const router = express.Router();

const {
    getAllComplaints,
    getComplaintById,
    createComplaint,
    updateComplaint,
    deleteComplaint
} = require("../controllers/complaintController");


router.get("/", getAllComplaints);

router.get("/:id", getComplaintById);

router.post("/", createComplaint);

router.put("/:id", updateComplaint);

router.delete("/:id", deleteComplaint);


module.exports = router;