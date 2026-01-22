<?php

    require_once '../connection.php';

    class Detail {
        public function getFieldDetail(int $field_id) {
        if(empty($field_id)) {
            return false;
        }    
        try{
            $db = Database::getInstance();
            $connection = $db->getConnection();
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
                        ft.status,
                        ft.thumbnail,
                        ft.description,

                        fft.price_per_hour,
                        fft.max_players
                    FROM field_field_types fft
                    JOIN fields f ON f.field_id = fft.field_id
                    JOIN branches b ON b.branch_id = f.branch_id
                    JOIN field_types ft ON ft.field_type_id = fft.field_type_id
                    WHERE f.field_id = :field_id
                    ";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue(':field_id', $field_id, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_OBJ);

            } catch(PDOException $e) {
            error_log("Error getting detail field " . $e->getMessage());
            return [];
      }
        }
    }

?>