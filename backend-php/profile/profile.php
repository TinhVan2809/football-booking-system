<?php

// Chỉnh sửa trang cá nhân dành cho khách hàng
// Thông tin khách hàng (Đã lưu vào jwt)

require_once '../connection.php';

class Profile
{

    // Lấy danh sách booking theo user_id
    public function getBookingsByUser(int $user_id, int $limit = 9, $offset = 0)
    {
        if (empty($user_id)) {
            return false;
        }

        try {
            $db = Database::getInstance();
            $connection  = $db->getConnection();

            $sql = "SELECT b.booking_id, f.thumbnail 
                    FROM bookings b 
                    JOIN field_field_types fft ON b.field_field_type_id = fft.field_field_type_id
                    JOIN fields f ON fft.field_id = f.field_id
                    WHERE b.user_id = :user_id ORDER BY booking_date DESC LIMIT :limit OFFSET :offset";
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

    // Lấy chi tiết booking theo user_id và booking_id
    public function  getDetaiBookingByUserAndBooking(int $user_id, int $booking_id)
    {
        try {
            $db = Database::getInstance();
            $connection  = $db->getConnection();
            $sql = "SELECT b.booking_id, b.start_time, b.end_time, b.price_per_hour, final_price, b.booking_status, b.created_at, f.field_name, ft.type_name, br.branch_name 
                    FROM bookings b 
                    JOIN field_field_types fft ON b.field_field_type_id = fft.field_field_type_id 
                    JOIN fields f ON fft.field_id = f.field_id 
                    JOIN field_types ft ON fft.field_type_id = ft.field_type_id 
                    JOIN branches br ON f.field_id = br.branch_id 
                    WHERE b.user_id = :user_id AND b.booking_id = :booking_id";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue(":user_id", $user_id, PDO::PARAM_INT);
            $stmt->bindValue(":booking_id", $booking_id, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error geting detail booking by user and booking" . $e->getMessage());
            return null;
        }
    }
    //  Lấy danh sách dịch vụ kèm theo 
    public function getServiceByBooking(int $booking_id, int $user_id)
    {
        try {
            $db = Database::getInstance();
            $connection  = $db->getConnection();
            $sql = "SELECT bs.booking_service_id, brs.branch_service_id, s.service_name, bs.quantity 
                    FROM booking_services bs
                     JOIN branch_services brs ON bs.branch_service_id = brs.branch_service_id
                     JOIN bookings b ON bs.booking_id = b.booking_id
                     JOIN services s ON brs.service_id = s.service_id WHERE bs.booking_id = :booking_id AND b.user_id = :user_id";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue(":booking_id", $booking_id, PDO::PARAM_INT);
            $stmt->bindValue(":user_id", $user_id, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_OBJ);
        } catch (PDOException $e) {
            error_log("error getting service by booking", $e->getMessage());
            return [];
        }
    }
}
