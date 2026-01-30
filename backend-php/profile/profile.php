<?php

// Chỉnh sửa trang cá nhân dành cho khách hàng
// Thông tin khách hàng (Đã lưu vào jwt)

require_once '../connection.php';

class Profile
{

    // Lấy danh sách booking theo user_id
    public function getBookingsByUser(int $user_id, int $limit = 10, $offset = 0)
    {
        if (empty($user_id)) {
            return false;
        }

        try {
            $db = Database::getInstance();
            $connection  = $db->getConnection();

            $sql = "SELECT booking_id, booking_date, start_time, end_time, total_price FROM bookings WHERE user_id = :user_id ORDER BY booking_date DESC LIMIT :limit OFFSET :offset";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_OBJ);
        } catch (Exception $e) {
            error_log("Error getting profile by user_id " . $e->getMessage());
            return [];
        }
    }

    public function coutBookingByUser(int $user_id)
    {
        try {
            $db = Database::getInstance();
            $connection  = $db->getConnection();
            $sql = "SELECT COUNT(booking_id) AS total FROM bookings WHERE user_id = :user_id";
            $stmt =  $connection->prepare($sql);
            $stmt->bindValue(":user_id", $user_id, PDO::PARAM_INT);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return isset($row['total']) ? (int)$row['total'] : 0;
        } catch (PDOException $e) {
            error_log("Error couting bookings by user " . $e->getMessage());
            return [];
        }
    }
}
