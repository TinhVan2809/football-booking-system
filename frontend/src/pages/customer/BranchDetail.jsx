import { use, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function BranchDetail() {
  const { branch_id } = useParams();
  const API_BASE =
    "http://localhost/football-booking-system/backend-php/branches/api.php";

  const API_REVIEW =
    "http://localhost/football-booking-system/backend-php/reviews/api.php";
  const LIMIT = 10;

  //state lưu danh sách sân bóng của branch này
  const [fieldByBranch, setFieldByBranch] = useState([]);

  //state lưu danh sách reviews
  const [reviews, setReviews] = useState([]);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  //state phân trang cho danh sách sân bóng
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  //state phân trang cho reviews
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const [totalReviewPages, setTotalReviewPages] = useState(0);

  // TODO: lấy danh sách sân bóng của chi nhánh này
  const fetchFieldByBranch = useCallback(
    async (page = 1) => {
      try {
        const res = await fetch(
          `${API_BASE}?action=getById&branch_id=${branch_id}&limit=${LIMIT}&page=${page}`,
        );
        if (!res.ok) {
          throw new Error("ERROR HTTP ", res.status);
        }

        const data = await res.json();
        if (data.success) {
          setFieldByBranch(data.data);
          setTotalPages(data.total_pages || 1);
          setLoading(false);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching field by branch ", err);
      }
    },
    [branch_id],
  );

  //TODO: Fetch reviews
  const fetchReviewsData = useCallback(async(page =1) => {
    setLoading(true);
      try{
        const res = await fetch(`${API_REVIEW}?action=get&branch_id=${branch_id}&limit=${LIMIT}&page=${page}`);
        if(!res.ok){
          throw new Error(`ERROR HTTP ${res.status}`);  
        }
        const data = await res.json();
        if(data.success) {
          setLoading(false);
          setReviews(data.data);
          setTotalReviewPages(data.total_pages);
        }
      } catch(err) {
        setError(err.message);
        console.error("Error fetching review data ", err);
      }
  },[branch_id]);


  // TODO: fetch data
  useEffect(() => {
    setLoading(true);
    fetchFieldByBranch(currentPage);
    fetchReviewsData(currentReviewPage);
  }, [currentPage, branch_id, fetchFieldByBranch, fetchReviewsData, currentReviewPage]);

  return(
    <>
      <p>Branch detail</p>
    </>
  )
}

export default BranchDetail;
