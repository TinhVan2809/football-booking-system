<?php

require_once '../connection.php';

class Statistic
{
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
    public function statisticFieldFieldTypes() {
        try{
            $db = Database::getInstance();
            $connection = $db->getConnection();

            $sql = "SELECT COUNT(field_field_type_id) AS total FROM field_field_types";
            $stmt = $connection->prepare($sql);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return isset($row['total']) ? (int)$row['total'] : 0;
            
        } catch(PDOException $e) {
            error_log("Error statisic field_field_types" . $e->getMessage());
            return [];
        }
    }
}
