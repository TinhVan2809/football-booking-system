<?php
    require_once '../connection.php';

    class Field
 {
    public function getFields(int $limit = 25, $offset = 0) {
        try{
            $db = Database::getInstance();           
            $conn = $db->getConnection();
            $stmt = $conn->prepare("SELECT f.field_name, f.thumbnail, b.branch_name, b.address, b.open_time, b.close_time 
                                            FROM fields f  
                                            JOIN branches b ON f.branch_id = b.branch_id LIMIT :limit OFFSET :offset");
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        } catch(PDOException $e) {
            error_log("Error getting fields " . $e->getMessage());
            return [];
        }
    }

    public function coutFields() {
            try{
                $db = Database::getInstance();
                $connection = $db->getConnection();

                $sql = "SELECT COUNT(*) as total FROM fields";
                $stmt = $connection->prepare($sql);
                $stmt->execute();
                $row = $stmt->fetch(PDO::FETCH_ASSOC);

                return isset($row['total']) ? (int)$row['total'] : 0;
            } catch(PDOException $e) {
                error_log("Error couting fields " . $e->getMessage());
                return 0;
            }
        }
 }
?>