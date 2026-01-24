<?php

require_once '../connection.php';

class Detail
{
    //# Lấy danh sách các loại sân theo field_id
    public function getFieldDetail(int $field_id, int $limit, $offset)
    {
        if (empty($field_id)) {
            return false;
        }
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();

            //? f.status => Đây là trạng thái của một field của một chi nhánh cụ thể, nó bao gồm các loại field_type khác, nếu field này status.maintenance thì các field_type đều maintenance hết
            //? fft.status => trạng thái của field_type của một field_id tại một branch_id “Loại chơi X của sân Y tại chi nhánh Z”
            $sql = "SELECT
                        f.field_id,
                        f.field_name,
                        f.status AS field_status,

                        b.branch_id,
                        b.branch_name,
                        b.address,

                        ft.field_type_id,
                        ft.type_name,
                        ft.players,
                        ft.thumbnail,
                        ft.description,

                        fft.price_per_hour,
                        fft.max_players,
                        fft.status
                    FROM field_field_types fft
                    JOIN fields f ON f.field_id = fft.field_id
                    JOIN branches b ON b.branch_id = f.branch_id
                    JOIN field_types ft ON ft.field_type_id = fft.field_type_id
                    WHERE f.field_id = :field_id
                    ORDER BY ft.created_at
                    DESC LIMIT :limit OFFSET :offset";

            $stmt = $connection->prepare($sql);
            $stmt->bindValue(':field_id', $field_id, PDO::PARAM_INT);
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_OBJ);
        } catch (PDOException $e) {
            error_log("Error getting detail field " . $e->getMessage());
            return [];
        }
    }

    public function countFields(int $field_id)
    {
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();

            $sql = "SELECT COUNT(ft.field_type_id) as total FROM field_field_types fft 
                    JOIN field_types ft ON fft.field_type_id = ft.field_type_id 
                    WHERE fft.field_id = :field_id";

            $stmt = $connection->prepare($sql);
            $stmt->bindValue(':field_id', $field_id, PDO::PARAM_INT);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return isset($row['total']) ? (int)$row['total'] : 0;
        } catch (PDOException $e) {
            error_log("Error counting fields " . $e->getMessage());
            return 0;
        }
    }
}
