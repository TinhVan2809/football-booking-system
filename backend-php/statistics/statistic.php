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

    //# Tổng tiền thu được từ việc cho thuê sân của một chi nhánh 
    public function totalPriceFromBookings(int $branch_id)
    {
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();
            $sql = "SELECT SUM(b.final_price) as total FROM bookings b 
                JOIN field_field_types fft on b.field_field_type_id = fft.field_field_type_id 
                JOIN fields f on fft.field_id = f.field_id 
                JOIN branches br on f.branch_id = br.branch_id 
                WHERE br.branch_id = :branch_id AND b.booking_status = 'completed' ";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue(':branch_id', $branch_id, PDO::PARAM_INT);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return isset($row['total']) ? (int)$row['total'] : 0;
        } catch (PDOException $e) {
            error_log("Error total price from bookings by branch_id" . $e->getMessage());
            return null;
        }
    }

    // # Doanh thu theo tháng (mặc định 12 tháng gần nhất)
    // Tính tổng final_price của booking_status = 'completed', group theo tháng của booking_date.
    public function revenueByMonth(int $branch_id, int $months = 12)
    {
        try {
            $months = max(1, min($months, 36));
            $startDate = date('Y-m-01', strtotime('-' . ($months - 1) . ' months'));

            $db = Database::getInstance();
            $connection = $db->getConnection();

            $sql = "SELECT DATE_FORMAT(b.booking_date, '%Y-%m') AS month,
                           COALESCE(SUM(b.final_price), 0) AS revenue
                    FROM bookings b
                    JOIN field_field_types fft ON b.field_field_type_id = fft.field_field_type_id
                    JOIN fields f ON fft.field_id = f.field_id
                    WHERE f.branch_id = :branch_id
                      AND b.booking_status = 'completed'
                      AND b.booking_date >= :start_date
                    GROUP BY DATE_FORMAT(b.booking_date, '%Y-%m')
                    ORDER BY DATE_FORMAT(b.booking_date, '%Y-%m') ASC";

            $stmt = $connection->prepare($sql);
            $stmt->bindValue(':branch_id', $branch_id, PDO::PARAM_INT);
            $stmt->bindValue(':start_date', $startDate);
            $stmt->execute();

            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return array_map(function ($row) {
                return [
                    'month' => $row['month'],
                    'revenue' => (int)round((float)$row['revenue']),
                ];
            }, $rows ?: []);
        } catch (PDOException $e) {
            error_log("Error revenue by month from bookings by branch_id" . $e->getMessage());
            return [];
        }
    }
}
