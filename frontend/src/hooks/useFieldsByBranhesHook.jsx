
import { useState, useEffect, useCallback } from "react";

function useFieldsByBranches({ branch_id }) {
  const API_BASE =
    "http://localhost/football-booking-system/backend-php/branches/api.php";
  const LIMIT = 10;

  const [fieldsByBranch, setFieldsByBranch] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Lấy danh sách sân bóng của chi nhánh này
  const fetchFieldsByBranch = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}?action=getById&branch_id=${branch_id}&limit=${LIMIT}&page=${page}`
        );
        if (!res.ok) {
          throw new Error(`ERROR HTTP ${res.status}`);
        }
        const data = await res.json();
        if (data.success) {
          setFieldsByBranch(data.data);
          setTotalPages(data.total_pages || 1);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching field by branch ", err);
      } finally {
        setLoading(false);
      }
    },
    [branch_id]
  );

  useEffect(() => {
    fetchFieldsByBranch(currentPage);
  }, [branch_id, currentPage, fetchFieldsByBranch]);

  return {
    fieldsByBranch,
    loading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    fetchFieldsByBranch,
  };
}

export default useFieldsByBranches;

