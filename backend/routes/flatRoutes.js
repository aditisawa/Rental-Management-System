const express = require("express");

const router = express.Router();

const {
    getAllFlats,
    getFlatById,
    createFlat,
    updateFlat,
    deleteFlat
} = require("../controllers/flatController");


router.get("/", getAllFlats);

router.get("/:id", getFlatById);

router.post("/", createFlat);

router.put("/:id", updateFlat);

router.delete("/:id", deleteFlat);


module.exports = router;