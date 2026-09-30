const express = require("express");

const router = express.Router();

const {
    getAllElectricityBills,
    getElectricityBillById,
    createElectricityBill,
    updateElectricityBill,
    deleteElectricityBill
} = require("../controllers/electricityController");


router.get("/", getAllElectricityBills);

router.get("/:id", getElectricityBillById);

router.post("/", createElectricityBill);

router.put("/:id", updateElectricityBill);

router.delete("/:id", deleteElectricityBill);


module.exports = router;