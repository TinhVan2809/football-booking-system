import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFieldsByBranches from "../../hooks/useFieldsByBranhesHook";

function BranchDetail() {
  const { branch_id } = useParams();
  const API_BASE =
    "http://localhost/football-booking-system/backend-php/branches/api.php";

  const API_REVIEW =
    "http://localhost/football-booking-system/backend-php/reviews/api.php";
  const LIMIT = 10;

  // state lưu dữ liệu chi nhánh
  const [branch, setBranch] = useState([]);


  // Lấy danh sách sân bóng của branch này bằng custom hook
  const {
    fieldsByBranch,
    loading: loadingFields,
    error: errorFields,
    currentPage: currentFieldPage,
    totalPages: totalFieldPages,
    setCurrentPage: setCurrentFieldPage,
  } = useFieldsByBranches({ branch_id });

  //state lưu danh sách reviews
  const [reviews, setReviews] = useState([]);

  //state phân trang cho reviews
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const [totalReviewPages, setTotalReviewPages] = useState(0);

  //state lưu trạng thái error, loading
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);



  //TODO: Fetch reviews
  const fetchReviewsData = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_REVIEW}?action=get&branch_id=${branch_id}&limit=${LIMIT}&page=${page}`,
        );
        if (!res.ok) {
          throw new Error(`ERROR HTTP ${res.status}`);
        }
        const data = await res.json();
        if (data.success) {
          setLoading(false);
          setReviews(data.data);
          setTotalReviewPages(data.total_pages);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching review data ", err);
      }
    },
    [branch_id],
  );

  //TODO: Lấy dữ liệu chi tiết của một chi nhánh
  const fetchBranchData = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_BASE}?action=get-branch-data&branch_id=${branch_id}`,
      );
      if (!res.ok) {
        throw new Error(`ERROR HTTP ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        setBranch(data.data);
      }
    } catch (error) {
      console.error("Error fetching branch data ", error);
    }
  }, [branch_id]);


  // TODO: fetch data
  useEffect(() => {
    setLoading(true);
    fetchReviewsData(currentReviewPage);
    fetchBranchData();
    setLoading(false);
  }, [
    branch_id,
    fetchReviewsData,
    currentReviewPage,
    fetchBranchData,
  ]);

  return (
    <>
      {error && <div>{error}</div>}
      {loading || loadingFields ? (
        <div>Loading</div>
      ) : (
        <div className="">
          <div className="">{branch.thumbnail}</div>
          <div className="">
            <p>{branch.branch_name}</p>
            <p>
              {branch.open_time} - {branch.close_time}
            </p>
            <p>{branch.address}</p>
          </div>
          <div>
            <h3>Danh sách sân bóng</h3>
            {errorFields && <div>{errorFields}</div>}
            <ul>
              {fieldsByBranch && fieldsByBranch.length > 0 ? (
                fieldsByBranch.map((field) => (
                  <li key={field.field_id}>{field.field_name}</li>
                ))
              ) : (
                <li>Không có sân bóng nào</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default BranchDetail;
