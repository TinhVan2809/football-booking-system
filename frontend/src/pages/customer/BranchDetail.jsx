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
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Danh sách sân bóng</h3>
            {errorFields && <div className="text-red-500 mb-2">{errorFields}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(fieldsByBranch) && fieldsByBranch.length > 0 ? (
                fieldsByBranch.map((field) => (
                  <div
                    key={field.field_id}
                    className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-2 border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      {field.thumbnail ? (
                        <img
                          src={
                            field.thumbnail
                              ? `http://localhost/football-booking-system/backend-php/uploads/fields_img/${field.thumbnail}`
                              : 'pexels-pixabay-47730.jpg'
                          }
                          alt={field.field_name}
                          className="w-20 h-20 object-cover rounded"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded text-gray-400 text-sm">
                          No Image
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-lg">{field.field_name}</div>
                        <div className="text-sm text-gray-500 capitalize">Trạng thái: {field.status}</div>
                      </div>
                    </div>
                    {Array.isArray(field.field_types) && field.field_types.length > 0 && (
                      <div className="mt-2">
                        <div className="font-medium text-gray-700 mb-1">Loại sân:</div>
                        <ul className="space-y-1">
                          {field.field_types.map((type) => (
                            <li
                              key={type.field_field_type_id}
                              className="flex items-center justify-between bg-gray-50 rounded px-2 py-1 border border-gray-100"
                            >
                              <span className="font-semibold">{type.type_name}</span>
                              <span className="text-xs text-gray-500">{type.players} người</span>
                              <span className="text-green-600 font-bold">{Number(type.price_per_hour).toLocaleString()}₫/giờ</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full text-gray-500">Không có sân bóng nào</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BranchDetail;
