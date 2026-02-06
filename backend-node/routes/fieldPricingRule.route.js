//[Route lấy bảng giá, của một field_field_type_id]

const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/:field_field_type_id", async (req, res) => {
  try {
    const { field_field_type_id } = req.params;

    const sql = `
      SELECT
        f.field_id,
        f.field_name,
        ft.field_type_id,
        ft.type_name,
        fpt.pricing_rule_id,
        fpt.day_of_week,
        fpt.start_time,
        fpt.end_time,
        fpt.price_per_hour,
        fpt.rule_type,
        fpt.status
      FROM field_pricing_rules fpt
      JOIN field_field_types fft 
        ON fft.field_field_type_id = fpt.field_field_type_id
      JOIN fields f 
        ON f.field_id = fft.field_id
      JOIN field_types ft 
        ON ft.field_type_id = fft.field_type_id
      WHERE fpt.field_field_type_id = ?
        AND fpt.status = 'active'
      ORDER BY fpt.day_of_week, fpt.start_time;
    `;

    const rows = await new Promise((resolve, reject) => {
      db.query(sql, [field_field_type_id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bảng giá",
      });
    }

    const { field_name, type_name, field_id, field_type_id } = rows[0];

    const dayMap = {
      2: "Thứ 2",
      3: "Thứ 3",
      4: "Thứ 4",
      5: "Thứ 5",
      6: "Thứ 6",
      7: "Thứ 7",
      8: "Chủ nhật",
    };

    const grouped = {};

    rows.forEach((r) => {
      if (!grouped[r.day_of_week]) {
        grouped[r.day_of_week] = {
          day_of_week: r.day_of_week,
          day_name: dayMap[r.day_of_week],
          rules: [],
        };
      }

      grouped[r.day_of_week].rules.push({
        pricing_rule_id: r.pricing_rule_id,
        start_time: r.start_time,
        end_time: r.end_time,
        price_per_hour: r.price_per_hour,
        rule_type: r.rule_type,
      });
    });

    res.json({
      success: true,
      field_field_type_id,
      field_name,
      field_id,
      field_type_id,
      type_name,
      pricing: Object.values(grouped),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


module.exports = router;
