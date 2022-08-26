const express = require("express");
const router = express.Router();

const { Counter } = require('../models')

router.post("/save", async (req, res) => {
    const value = req.body.value;
    const counter = await Counter.create({ value })

    res.send(counter);
});

module.exports = router;