<?php
require_once '../connection.php';

class Field
{
    // Lấy danh sách sân bóng 
    public function getFields(int $limit = 25, $offset = 0)
    {
        try {
            $db = Database::getInstance();
            $conn = $db->getConnection();
            $stmt = $conn->prepare("SELECT f.field_id, f.field_name, f.thumbnail, b.branch_name, b.address, b.open_time, b.close_time 
                                            FROM fields f  
                                            JOIN branches b ON f.branch_id = b.branch_id 
                                            LIMIT :limit OFFSET :offset");
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        } catch (PDOException $e) {
            error_log("Error getting fields " . $e->getMessage());
            return [];
        }
    }

    public function coutFields()
    {
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();

            $sql = "SELECT COUNT(*) as total FROM fields";
            $stmt = $connection->prepare($sql);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            return isset($row['total']) ? (int)$row['total'] : 0;
        } catch (PDOException $e) {
            error_log("Error couting fields " . $e->getMessage());
            return 0;
        }
    }

    public function getFieldTypes()
    {
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();

            $sql = "SELECT field_type_id, type_name, players, type_code, thumbnail, description, created_at
                    FROM field_types
                    ORDER BY created_at DESC";
            $stmt = $connection->prepare($sql);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error getting field types " . $e->getMessage());
            return [];
        }
    }

    public function addFieldType(string $type_name, int $players, ?string $type_code = null, ?string $thumbnail = null, ?string $description = null)
    {
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();

            $sql = "INSERT INTO field_types (type_name, players, type_code, thumbnail, description)
                    VALUES (:type_name, :players, :type_code, :thumbnail, :description)";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue(':type_name', trim($type_name), PDO::PARAM_STR);
            $stmt->bindValue(':players', $players, PDO::PARAM_INT);
            $stmt->bindValue(':type_code', $type_code !== null ? trim($type_code) : null, PDO::PARAM_STR);
            $stmt->bindValue(':thumbnail', $thumbnail !== null ? trim($thumbnail) : null, PDO::PARAM_STR);
            $stmt->bindValue(':description', $description !== null ? trim($description) : null, PDO::PARAM_STR);
            $stmt->execute();

            return $connection->lastInsertId();
        } catch (PDOException $e) {
            error_log("Error adding field type " . $e->getMessage());
            return false;
        }
    }

    public function addField(int $branch_id, string $field_name, ?string $thumbnail = null, string $status = 'available', ?string $description = null)
    {
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();

            $sql = "INSERT INTO fields (branch_id, field_name, thumbnail, status, description)
                    VALUES (:branch_id, :field_name, :thumbnail, :status, :description)";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue(':branch_id', $branch_id, PDO::PARAM_INT);
            $stmt->bindValue(':field_name', trim($field_name), PDO::PARAM_STR);
            $stmt->bindValue(':thumbnail', $thumbnail !== null ? trim($thumbnail) : null, PDO::PARAM_STR);
            $stmt->bindValue(':status', trim($status), PDO::PARAM_STR);
            $stmt->bindValue(':description', $description !== null ? trim($description) : null, PDO::PARAM_STR);
            $stmt->execute();

            return $connection->lastInsertId();
        } catch (PDOException $e) {
            error_log("Error adding field " . $e->getMessage());
            return false;
        }
    }

    public function upsertFieldFieldType(int $field_id, int $field_type_id, float $price_per_hour, ?string $max_players = null, string $status = 'available')
    {
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();

            $sql = "INSERT INTO field_field_types (field_id, field_type_id, price_per_hour, max_players, status)
                    VALUES (:field_id, :field_type_id, :price_per_hour, :max_players, :status)
                    ON DUPLICATE KEY UPDATE
                        price_per_hour = :price_per_hour_u,
                        max_players = :max_players_u,
                        status = :status_u";

            $stmt = $connection->prepare($sql);
            $stmt->bindValue(':field_id', $field_id, PDO::PARAM_INT);
            $stmt->bindValue(':field_type_id', $field_type_id, PDO::PARAM_INT);
            $stmt->bindValue(':price_per_hour', $price_per_hour);
            $stmt->bindValue(':max_players', $max_players !== null ? trim($max_players) : null, PDO::PARAM_STR);
            $stmt->bindValue(':status', trim($status), PDO::PARAM_STR);

            $stmt->bindValue(':price_per_hour_u', $price_per_hour);
            $stmt->bindValue(':max_players_u', $max_players !== null ? trim($max_players) : null, PDO::PARAM_STR);
            $stmt->bindValue(':status_u', trim($status), PDO::PARAM_STR);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error upserting field_field_types " . $e->getMessage());
            return false;
        }
    }

    public function getFieldFieldTypeId(int $field_id, int $field_type_id)
    {
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();

            $sql = "SELECT field_field_type_id
                    FROM field_field_types
                    WHERE field_id = :field_id AND field_type_id = :field_type_id
                    LIMIT 1";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue(':field_id', $field_id, PDO::PARAM_INT);
            $stmt->bindValue(':field_type_id', $field_type_id, PDO::PARAM_INT);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            return $row['field_field_type_id'] ?? null;
        } catch (PDOException $e) {
            error_log("Error getting field_field_type_id " . $e->getMessage());
            return null;
        }
    }

}
