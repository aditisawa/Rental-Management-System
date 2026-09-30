const express = require("express");

const router = express.Router();

const {
    getAllRents,
    getRentById,
    createRent,
    updateRent,
    deleteRent
} = require("../controllers/rentController");


router.get("/", getAllRents);

router.get("/:id", getRentById);

router.post("/", createRent);

router.put("/:id", updateRent);

router.delete("/:id", deleteRent);


module.exports = router;