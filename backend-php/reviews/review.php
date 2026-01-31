<?php

require_once '../connection.php';

class Review
{
    public function getReviewsByBranch(int $branch_id, int $limit = 10, $offset = 0)
    {
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();

            $sql = "SELECT r.review_id, r.rating, r.comment, u.user_id, u.full_name, u.avata 
                        FROM reviews r 
                        JOIN users u ON u.user_id = r.user_id 
                        WHERE r.branch_id = :branch_id ORDER BY r.created_at DESC LIMIT :limit OFFSET :offset";

            $stmt = $connection->prepare($sql);
            $stmt->bindValue(':branch_id', $branch_id, PDO::PARAM_INT);
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_OBJ);
        } catch (PDOException $e) {
            error_log("Error getting reviews by branch " . $e->getMessage());
            return [];
        }
    }

    public function countReviewsByBranch(int $branch_id)
    {
        try {
            $db = Database::getInstance();
            $connection  = $db->getConnection();
            $sql = "SELECT COUNT(review_id) AS total FROM reviews WHERE branch_id = :branch_id";
            $stmt =  $connection->prepare($sql);
            $stmt->bindValue(":branch_id", $branch_id, PDO::PARAM_INT);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return isset($row['total']) ? (int)$row['total'] : 0;
        } catch (PDOException $e) {
            error_log("Error counting reviews by branch " . $e->getMessage());
            return false;
        }
    }
}
