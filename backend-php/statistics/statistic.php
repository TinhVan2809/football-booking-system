<?php

require_once '../connection.php';

class Statistic
{
    //-----Thống kê trong trang Admin-------
    // #Thống kê toàn bộ số lượng users
    public function statisticUser()
    {
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();

            $sql = "SELECT COUNT(user_id) AS total FROM users";
            $stmt = $connection->prepare($sql);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return isset($row['total']) ? (int)$row['total'] : 0;
        } catch (PDOException $e) {
            error_log("Error statisic users" . $e->getMessage());
            return [];
        }
    }

    // #Thống kê toàn bộ chi nhánh 
    public function statisticBranches()
    {
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();

            $sql = "SELECT COUNT(branch_id) AS total FROM branches";
            $stmt = $connection->prepare($sql);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return isset($row['total']) ? (int)$row['total'] : 0;
        } catch (PDOException $e) {
            error_log("Error statisic branches" . $e->getMessage());
            return [];
        }
    }

    // #Thống kế toàn bộ sân bóng và loại sân (field_field_type_id)
    public function statisticFieldFieldTypes()
    {
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();

            $sql = "SELECT COUNT(field_field_type_id) AS total FROM field_field_types";
            $stmt = $connection->prepare($sql);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return isset($row['total']) ? (int)$row['total'] : 0;
        } catch (PDOException $e) {
            error_log("Error statisic field_field_types" . $e->getMessage());
            return [];
        }
    }
    //-------Kết thúc thống kế trong trang Admin---------//



    //------ Thống kế trong trang Chi nhánh------//
    //# Thống kế toàn bộ sân bóng có trong branch_id
    public function statisticFieldsByBranch(int $branch_id)
    {
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();
            $sql = "SELECT COUNT(field_id) AS total FROM fields WHERE branch_id = :branch_id";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue(':branch_id', $branch_id, PDO::PARAM_INT);
            $stmt->execute();

           $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return isset($row['total']) ? (int)$row['total'] : 0;
        } catch (Exception $e) {
            error_log("Error statistic Fields in branch_id" . $e->getMessage());
            return [];
        }
    }

    //# Thống kê toàn bộ bookings có trong chi nhánh này
    public function statisticBookingsByBranch(int $branch_id)
    {
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();
            $sql = "SELECT COUNT(booking_id) AS total FROM bookings b 
                    JOIN field_field_types fft ON fft.field_field_type_id = b.field_field_type_id 
                    JOIN fields f ON f.field_id = fft.field_id 
                    WHERE f.branch_id = :branch_id";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue(':branch_id', $branch_id, PDO::PARAM_INT);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return isset($row['total']) ? (int)$row['total'] : 0;
        } catch (Exception $e) {
            error_log("Error statistic Bookins in branch_id" . $e->getMessage());
            return [];
        }
    }
}
