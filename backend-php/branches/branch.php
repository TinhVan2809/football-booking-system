<?php

require_once '../connection.php';

class Branch
{
    public function getBranchById(int $branch_id, int $limit = 10, $offset = 0)
    {
        if (empty($branch_id)) {
            return false;
        }
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();

            // 1. Fetch fields with pagination
            $sql = "SELECT f.field_id, f.field_name, f.status, f.thumbnail
                    FROM fields f
                    WHERE f.branch_id = :branch_id
                    LIMIT :limit OFFSET :offset";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue(':branch_id', $branch_id, PDO::PARAM_INT);
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            $fields = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (empty($fields)) {
                return [];
            }

            // 2. Fetch field types for these fields
            $fieldIds = array_column($fields, 'field_id');
            $placeholders = implode(',', array_fill(0, count($fieldIds), '?'));

            $sqlTypes = "SELECT 
                            fft.field_id,
                            ft.field_type_id,
                            ft.type_name,
                            ft.players,
                            fft.price_per_hour
                        FROM field_field_types fft
                        JOIN field_types ft ON ft.field_type_id = fft.field_type_id
                        WHERE fft.field_id IN ($placeholders)";

            $stmtTypes = $connection->prepare($sqlTypes);
            $stmtTypes->execute($fieldIds);
            $types = $stmtTypes->fetchAll(PDO::FETCH_ASSOC);

            // 3. Aggregate types into fields
            $fieldMap = [];
            foreach ($fields as $field) {
                $field['field_types'] = [];
                $fieldMap[$field['field_id']] = $field;
            }

            foreach ($types as $type) {
                $fId = $type['field_id'];
                if (isset($fieldMap[$fId])) {
                    $fieldMap[$fId]['field_types'][] = [
                        'field_type_id' => $type['field_type_id'],
                        'type_name' => $type['type_name'],
                        'players' => $type['players'],
                        'price_per_hour' => $type['price_per_hour']
                    ];
                }
            }

            // Convert to array of objects
            $result = [];
            foreach ($fieldMap as $field) {
                $result[] = (object)$field;
            }

            return $result;
        } catch (PDOException $e) {
            error_log("Error getting branches " . $e->getMessage());
            return [];
        }
    }

    public function getBranches(int $limit = 20, $offset = 0)
    {
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();
            $sql = "SELECT branch_id, branch_name, address, phone, open_time, close_time FROM branches LIMIT :limit OFFSET :offset";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
            $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_OBJ);
        } catch (PDOException $e) {
            error_log("Erro getting branches " . $e->getMessage());
            return [];
        }
    }

    public function countBranches()
    {
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();

            $sql = "SELECT COUNT(branch_id) FROM branches";
            $stmt = $connection->prepare($sql);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            return isset($row['total']) ? (int)$row['total'] : 0;
        } catch (PDOException $e) {
            error_log("Error counting branches " . $e->getMessage());
            return [];
        }
    }

    public function countFieldsByBranch(int $branch_id)
    {
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();

            $sql = "SELECT COUNT(field_id) as total FROM fields WHERE branch_id = :branch_id";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue(':branch_id', $branch_id, PDO::PARAM_INT);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            return isset($row['total']) ? (int)$row['total'] : 0;
        } catch (PDOException $e) {
            error_log("Error counting fields " . $e->getMessage());
            return 0;
        }
    }

    public function addBranch($branch_name, $address, $phone, $open_time, $close_time)
    {
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();
            $sql = "INSERT INTO branches (branch_name, address, phone, open_time, close_time)
                    VALUES (:branch_name, :address, :phone, :open_time, :close_time)";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue(":branch_name", trim($branch_name), PDO::PARAM_STR);
            $stmt->bindValue(":address", trim($address), PDO::PARAM_STR);
            $stmt->bindValue(":phone", trim($phone), PDO::PARAM_STR);
            $stmt->bindValue(":open_time", trim($open_time), PDO::PARAM_STR);
            $stmt->bindValue(":close_time", trim($close_time), PDO::PARAM_STR);
            $stmt->execute();
            return $connection->lastInsertId();
        } catch (PdoException $e) {
            error_log("Error adding branch " . $e->getMessage());
            return false;
        }
    }

    public function updateBranch($branch_id, $branch_name, $address, $phone, $open_time, $close_time)
    {
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();
            $sql = "UPDATE branches
                    SET branch_name = :branch_name,
                        address = :address,
                        phone = :phone,
                        open_time = :open_time,
                        close_time = :close_time
                    WHERE branch_id = :branch_id";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue(":branch_name", trim($branch_name), PDO::PARAM_STR);
            $stmt->bindValue(":address", trim($address), PDO::PARAM_STR);
            $stmt->bindValue(":phone", trim($phone), PDO::PARAM_STR);
            $stmt->bindValue(":open_time", trim($open_time), PDO::PARAM_STR);
            $stmt->bindValue(":close_time", trim($close_time), PDO::PARAM_STR);
            $stmt->bindValue(":branch_id", $branch_id, PDO::PARAM_INT);
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error updating branch " . $e->getMessage());
            return false;
        }
    }

    // Lấy dữ liệu chi nhánh theo field_field_type_id 
    public function getBranchByFieldFieldTypeId(int $field_field_type_id)
    {
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();
            $sql = "SELECT fft.field_field_type_id, f.field_id, b.branch_id, b.branch_name, b.address, b.open_time, b.close_time 
                    FROM field_field_types fft 
                    JOIN fields f ON fft.field_id = f.field_id 
                    JOIN branches b ON f.branch_id = b.branch_id 
                    WHERE fft.field_field_type_id = :field_field_type_id";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue(":field_field_type_id", $field_field_type_id, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_OBJ);
        } catch (Exception $e) {
            error_log("Error getting branch by ffft" . $e->getMessage());
            return [];
        }
    }
}
