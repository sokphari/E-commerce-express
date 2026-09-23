const express = require("express");
const pool = require("../config/database");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PhoneHub API is healthy",
  });
});

router.get("/db", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT NOW() AS current_time");

    res.status(200).json({
      success: true,
      message: "PostgreSQL connected successfully",
      data: {
        databaseTime: result.rows[0].current_time,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
