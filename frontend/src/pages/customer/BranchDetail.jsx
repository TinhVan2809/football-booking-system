import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function BranchDetail() {
  const { branch_id } = useParams();
  const API_BASE =
    "http://localhost/football-booking-system/backend-php/branches/api.php";
  const LIMIT = 10;

  const [fieldByBranch, setFieldByBranch] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);


  // TODO: lấy danh sách sân bóng của chi nhánh này
  useEffect(() => {
    setLoading(true);
    const fetchFieldByBranch = async(page = 1) => {
        try{
            const res = await fetch(`${API_BASE}?action=getById&branch_id=${branch_id}&limit=${LIMIT}&page=${page}`);
            if(!res.ok) {
                throw new Error("ERROR HTTP ", res.status);
            }

            const data = await res.json();
            if(data.success) {
                setFieldByBranch(data.data);
                setTotalPages(data.total_pages || 1);
                setLoading(false);
            }
        } catch(err) {

            setError(err.message);
            console.error("Error fetching field by branch ", err);
        }
    }
    fetchFieldByBranch(currentPage);
  }, [currentPage, branch_id]);

  return (
    <>
      
    </>
  );
}

export default BranchDetail;
