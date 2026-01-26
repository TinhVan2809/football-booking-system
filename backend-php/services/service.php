<?php

require '../connection.php';

class Service
{

    //# Lấy 25 dịch vụ của một chi nhánh
    public function getServicesByBranchId(int $branch_id, int $limit = 25, $offset = 0)
    {
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();

            $sql = "SELECT 
                        s.service_name,
                        s.service_id,
                        bs.branch_service_id,
                        b.branch_id,
                        bs.price,
                        bs.status
                    FROM branch_services bs
                    JOIN services s ON s.service_id = bs.service_id
                    JOIN branches b ON b.branch_id = bs.branch_id
                    WHERE bs.branch_id = :branch_id
                    ORDER BY bs.created_at DESC
                    LIMIT :limit OFFSET :offset;
                    ";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue(':branch_id', $branch_id, PDO::PARAM_INT);
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);

            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_OBJ);
        } catch (PDOException $e) {
            error_log("Error getting services by branch Id " . $e->getMessage());
            return [];
        }
    }

    //# Đếm số lượng dịch vụ có trong một chi nhánh 
    public function coutServicesBybranch(int $branch_id)
    {
        if (empty($branch_id)) {
            error_log("branch_id undefine");
            return false;
        }
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();
            // chỉ đếm một column không đếm hết tránh tốn hiệu năng
            $sql = "SELECT COUNT(service_id) AS total 
                            FROM services 
                            WHERE branch_id = :branch_id";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue(':branch_id', $branch_id, PDO::PARAM_INT); // Phải là kiểu int số nguyên.

            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return isset($row['total']) ? (int)$row['total'] : 0;
        } catch (PDOException $e) {
            error_log("Error counting service by branch " . $e->getMessage());
            return false;
        }
    }

    //# Xóa một dịch vụ của một chi nhánh
    public function deleteService(int $service_id, int $branch_id)
    {
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();
            $sql = "DELETE FROM services WHERE service_id = :service_id AND branch_id = :branch_id";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue(':service_id', $service_id, PDO::PARAM_INT);
            $stmt->bindValue(':branch_id', $branch_id, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->rowCount() > 0;
        } catch (PDOException $e) {
            error_log("Error deleting service " . $e->getMessage());
            return [];
        }
    }
}
