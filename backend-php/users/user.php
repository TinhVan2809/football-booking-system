<?php

require_once '../connection.php';

class User
{

    public function getUsers(int $limit = 10, $offset = 0)
    {
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();

            $sql = "SELECT user_id, username, full_name FROM users LIMIT :limit OFFSET :offset";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_OBJ);
        } catch (PDOException $e) {
            error_log("Error getting users " . $e->getMessage());
            return [];
        }
    }

    public function coutUsers()
    {
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();

            $sql = "SELECT COUNT(*) as total FROM users";
            $stmt = $connection->prepare($sql);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            return isset($row['total']) ? (int)$row['total'] : 0;
        } catch (PDOException $e) {
            error_log("Error getting users " . $e->getMessage());
            return 0;
        }
    }

    public function getUserId(int $user_id)
    {
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();

            $sql = "SELECT user_id, username, email, avata, phone, created_at FROM users where user_id = :user_id";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("error geting user data by id" . $e->getMessage());
            return null;
        }
    }

    // Lấy danh sách số lượng booking mà user này đã đặt 
    public function getAllBookingsByUser(int $user_id, int $limit = 10, $offset = 0)
    {
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();

            $sql = "SELECT b.booking_id, f.thumbnail, f.field_name, ft.type_name, b.start_time, b.end_time, b.final_price
                FROM bookings b 
                join field_field_types fft ON b.field_field_type_id = fft.field_field_type_id 
                join fields f ON fft.field_id = f.field_id 
                join field_types ft ON fft.field_type_id = ft.field_type_id 
                WHERE b.user_id = :user_id
                ORDER BY b.created_at LIMIT :limit OFFSET :offset";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_OBJ);
        } catch (Exception $e) {
            error_log("Error geting all bookings by user id " . $e->getMessage());
            return [];
        }
    }
        public function countAllBookingsByUser(int $user_id)
    {
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();

            $sql = "SELECT COUNT(*) as total FROM bookings WHERE user_id = :user_id";
            $stmt = $connection->prepare($sql);
             $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            return isset($row['total']) ? (int)$row['total'] : 0;
        } catch (PDOException $e) {
            error_log("Error getting users " . $e->getMessage());
            return 0;
        }
    }
}
