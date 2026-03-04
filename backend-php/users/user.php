<?php

    require_once '../connection.php';

    class User  {
            
        public function getUsers(int $limit = 10, $offset = 0) {
            try {
                $db = Database::getInstance();
                $connection = $db->getConnection();

                $sql = "SELECT username, full_name FROM users LIMIT :limit OFFSET :offset";
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

        public function coutUsers() {
            try{
                $db = Database::getInstance();
                $connection = $db->getConnection();

                $sql = "SELECT COUNT(*) as total FROM users";
                $stmt = $connection->prepare($sql);
                $stmt->execute();
                $row = $stmt->fetch(PDO::FETCH_ASSOC);

                return isset($row['total']) ? (int)$row['total'] : 0;
            } catch(PDOException $e) {
                error_log("Error getting users " . $e->getMessage());
                return 0;
            }
        }

        public function getUserId(int $user_id) {
            try{
                $db = Database::getInstance();
                $connection = $db->getConnection();

                $sql = "SELECT user_id, username, email, avata, phone, created_at FROM users where user_id = :user_id";
                $stmt = $connection->prepare($sql);
                $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
                $stmt->execute();
        
                return $stmt->fetch(PDO::FETCH_ASSOC);

            }catch(PDOException $e) {
                error_log("error geting user data by id" . $e->getMessage());
                return null;
            }
        }
    }

?>