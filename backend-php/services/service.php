<?php

    require '../connection.php';

    class Service {

        //# Lấy 25 dịch vụ của một chi nhánh
        public function getServicesByBranchId(int $branch_id, int $limit = 25, $offset = 0){
            try{
                $db = Database::getInstance();
                $connection = $db->getConnection();

                $sql = "SELECT service_id, service_name, price, service_type FROM services WHERE branch_id = :branch_id ORDER BY add_at DESC LIMIT :limit OFFSET :offset";
                $stmt = $connection->prepare($sql);
                $stmt->bindValue(':branch_id', $branch_id, PDO::PARAM_INT);
                $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
                $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);

                $stmt->execute();
                return $stmt->fetchAll(PDO::FETCH_OBJ);
            } catch(PDOException $e) {
                error_log("Error getting services by branch Id " . $e->getMessage());
                return [];
            }
        }

            public function coutServicesBybranch(int $branch_id)  {
                try{
                    $db = Database::getInstance();
                    $connection = $db->getConnection();
                    // chỉ đếm một column không đếm hết tránh tốn hiệu năng
                    $sql = "SELECT COUNT(service_id) AS total 
                            FROM services 
                            WHERE branch_id = :branch";
                    $stmt = $connection->prepare($sql);
                    $stmt->bindValue(':branch_id', $branch_id, PDO::PARAM_INT); // Phải là kiểu int số nguyên.
                    
                    $stmt->execute();
                    $row = $stmt->fetch(PDO::FETCH_ASSOC);
                    return isset($row['total']) ? (int)$row['total'] : 0;

                } catch(PDOException $e) {
                    error_log("Error counting service by branch " . $e->getMessage());
                    return [];
                }
            }
    }

?>