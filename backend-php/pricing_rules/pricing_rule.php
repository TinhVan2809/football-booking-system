<?php

require_once '../connection.php';

class PricingRule
{
    private function roundPrice(float $price): float
    {
        return round($price / 1000) * 1000;
    }

    public function getBasePriceByFieldFieldTypeId(int $field_field_type_id)
    {
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();

            $sql = "SELECT price_per_hour
                    FROM field_field_types
                    WHERE field_field_type_id = :field_field_type_id
                    LIMIT 1";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue(':field_field_type_id', $field_field_type_id, PDO::PARAM_INT);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$row || !isset($row['price_per_hour'])) {
                return null;
            }

            return (float)$row['price_per_hour'];
        } catch (PDOException $e) {
            error_log("Error getting base price by field_field_type_id " . $e->getMessage());
            return null;
        }
    }

    private function findRuleId($connection, int $field_field_type_id, int $day_of_week, string $start_time, string $end_time)
    {
        $sql = "SELECT pricing_rule_id
                FROM field_pricing_rules
                WHERE field_field_type_id = :field_field_type_id
                  AND day_of_week = :day_of_week
                  AND start_time = :start_time
                  AND end_time = :end_time
                LIMIT 1";

        $stmt = $connection->prepare($sql);
        $stmt->bindValue(':field_field_type_id', $field_field_type_id, PDO::PARAM_INT);
        $stmt->bindValue(':day_of_week', $day_of_week, PDO::PARAM_INT);
        $stmt->bindValue(':start_time', $start_time, PDO::PARAM_STR);
        $stmt->bindValue(':end_time', $end_time, PDO::PARAM_STR);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row['pricing_rule_id'] ?? null;
    }

    // Hàm thêm bảng giá, ngày trong tuần thủ công
    private function insertRule($connection, int $field_field_type_id, int $day_of_week, string $start_time, string $end_time, float $price_per_hour, string $rule_type, string $status)
    {
        $sql = "INSERT INTO field_pricing_rules (field_field_type_id, day_of_week, start_time, end_time, price_per_hour, rule_type, status)
                VALUES (:field_field_type_id, :day_of_week, :start_time, :end_time, :price_per_hour, :rule_type, :status)";
        $stmt = $connection->prepare($sql);
        $stmt->bindValue(':field_field_type_id', $field_field_type_id, PDO::PARAM_INT);
        $stmt->bindValue(':day_of_week', $day_of_week, PDO::PARAM_INT);
        $stmt->bindValue(':start_time', $start_time, PDO::PARAM_STR);
        $stmt->bindValue(':end_time', $end_time, PDO::PARAM_STR);
        $stmt->bindValue(':price_per_hour', $price_per_hour);
        $stmt->bindValue(':rule_type', $rule_type, PDO::PARAM_STR);
        $stmt->bindValue(':status', $status, PDO::PARAM_STR);
        $stmt->execute();
    }

    private function updateRule($connection, int $pricing_rule_id, float $price_per_hour, string $rule_type, string $status)
    {
        $sql = "UPDATE field_pricing_rules
                SET price_per_hour = :price_per_hour,
                    rule_type = :rule_type,
                    status = :status
                WHERE pricing_rule_id = :pricing_rule_id";
        $stmt = $connection->prepare($sql);
        $stmt->bindValue(':price_per_hour', $price_per_hour);
        $stmt->bindValue(':rule_type', $rule_type, PDO::PARAM_STR);
        $stmt->bindValue(':status', $status, PDO::PARAM_STR);
        $stmt->bindValue(':pricing_rule_id', $pricing_rule_id, PDO::PARAM_INT);
        $stmt->execute();
    }

    // Hàm tự thêm bảng giá theo ngày trong tuần mặc định
    public function upsertDefaultRules(int $field_field_type_id)
    {
        $basePrice = $this->getBasePriceByFieldFieldTypeId($field_field_type_id);
        if ($basePrice === null) {
            return null;
        }

        $offPeak = $this->roundPrice($basePrice * 0.6);
        $offPeakFri = $this->roundPrice($basePrice * 0.67);
        $peakMonWed = $this->roundPrice($basePrice * 0.83);
        $peakThu = $this->roundPrice($basePrice * 0.9);
        $peakFri = $this->roundPrice($basePrice * 1.0);
        $satFullDay = $this->roundPrice($basePrice * 1.07);
        $satPrime = $this->roundPrice($basePrice * 1.67);
        $sunSpecial = $this->roundPrice($basePrice * 1.17);

        $rules = [];

        // Thứ 2 -> Thứ 4
        foreach ([2, 3, 4] as $dow) {
            $rules[] = [$dow, '06:00:00', '16:00:00', $offPeak, 'off_peak'];
            $rules[] = [$dow, '16:00:00', '22:00:00', $peakMonWed, 'peak'];
        }

        // Thứ 5
        $rules[] = [5, '06:00:00', '16:00:00', $offPeak, 'off_peak'];
        $rules[] = [5, '16:00:00', '22:00:00', $peakThu, 'peak'];

        // Thứ 6
        $rules[] = [6, '06:00:00', '16:00:00', $offPeakFri, 'off_peak'];
        $rules[] = [6, '16:00:00', '22:00:00', $peakFri, 'peak'];

        // Thứ 7
        $rules[] = [7, '06:00:00', '22:00:00', $satFullDay, 'peak'];
        $rules[] = [7, '18:00:00', '21:00:00', $satPrime, 'peak'];

        // Chủ nhật
        $rules[] = [8, '06:00:00', '22:00:00', $sunSpecial, 'special'];

        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();

            $connection->beginTransaction();

            $inserted = 0;
            $updated = 0;

            foreach ($rules as $rule) {
                [$dow, $start, $end, $price, $type] = $rule;

                $existingId = $this->findRuleId($connection, $field_field_type_id, $dow, $start, $end);
                if ($existingId) {
                    $this->updateRule($connection, (int)$existingId, (float)$price, (string)$type, 'active');
                    $updated++;
                } else {
                    $this->insertRule($connection, $field_field_type_id, $dow, $start, $end, (float)$price, (string)$type, 'active');
                    $inserted++;
                }
            }

            $connection->commit();

            return [
                'field_field_type_id' => $field_field_type_id,
                'base_price_per_hour' => $basePrice,
                'inserted' => $inserted,
                'updated' => $updated,
            ];
        } catch (PDOException $e) {
            if (isset($connection) && $connection->inTransaction()) {
                $connection->rollBack();
            }
            error_log("Error upserting default pricing rules " . $e->getMessage());
            return false;
        }
    }
}
