const express = require("express");

const router = express.Router();

const {
    getAllDeposits,
    getDepositById,
    createDeposit,
    updateDeposit,
    deleteDeposit
} = require("../controllers/depositController");


router.get("/", getAllDeposits);

router.get("/:id", getDepositById);

router.post("/", createDeposit);

router.put("/:id", updateDeposit);

router.delete("/:id", deleteDeposit);


module.exports = router;