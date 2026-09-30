const express = require("express");

const router = express.Router();

const {
    getAllBuildings,
    getBuildingById,
    createBuilding,
    updateBuilding,
    deleteBuilding
} = require("../controllers/buildingController");


// GET all buildings
router.get("/", getAllBuildings);

// GET building by ID
router.get("/:id", getBuildingById);

// CREATE building
router.post("/", createBuilding);

// UPDATE building
router.put("/:id", updateBuilding);

// DELETE building
router.delete("/:id", deleteBuilding);


module.exports = router;