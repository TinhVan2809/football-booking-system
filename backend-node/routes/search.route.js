//[Route tìm kiếm sân bóng]

const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/available-fields", async (req, res) => {
  try {
    const { branch_id } = req.query;

    if (!branch_id) {
      return res.status(400).json({ message: "Thiếu tham số" });
    }

    const sql = `
      SELECT
          f.field_id,
          f.field_name,
          b.branch_name,
          ft.type_name,
          fft.price_per_hour
      FROM fields f
      JOIN branches b ON b.branch_id = f.branch_id
      JOIN field_field_types fft ON fft.field_id = f.field_id
      JOIN field_types ft ON ft.field_type_id = fft.field_type_id
      WHERE
          b.branch_id = ?
          AND f.status = 'available'
    `;

    const [rows] = await db.promise().execute(sql, [branch_id]);

    res.json({
      total: rows.length,
      data: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
