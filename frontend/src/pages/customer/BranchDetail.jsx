import { useCallback, useEffect, useState, Fragment } from "react";
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
  }, [branch_id, fetchReviewsData, currentReviewPage, fetchBranchData]);

  // Phân trang cho reviews
  const handlePrevPage = () => {
    if (currentReviewPage > 1) {
      setCurrentReviewPage(currentReviewPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentReviewPage < totalReviewPages) {
      setCurrentReviewPage(currentReviewPage + 1);
    }
  };

  // Phân trang cho danh sách sân bóng của branch này
  const handlePrevFieldPage = () => {
    if (currentFieldPage > 1) {
      setCurrentFieldPage(currentFieldPage - 1);
    }
  };

  const handleNextFieldPage = () => {
    if (currentFieldPage < totalFieldPages) {
      setCurrentFieldPage(currentFieldPage + 1);
    }
  };

  return (
    <>
      {error && <div className="text-red-500">{error}</div>}
      {loading || loadingFields ? (
        <div>Loading</div>
      ) : (
        <div className="mt-5 w-full">
          <div className="relative w-full h-100 bg-amber-300">
            <img
              src="../../../assets/pexels-anaussieinvietnam-33370012.jpg"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute z-10 bottom-5 left-5 bg-black/50 p-5 rounded-xl text-white">
              <p>{branch.branch_name}</p>
              <p>
                Mở cửa từ: {branch.open_time} - {branch.close_time}
              </p>
              <p>{branch.address}</p>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Danh sách sân bóng</h3>
            {errorFields && (
              <div className="text-red-500 mb-2">{errorFields}</div>
            )}
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
                              : "pexels-pixabay-47730.jpg"
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
                        <div className="font-semibold text-lg">
                          {field.field_name}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">
                          Trạng thái: {field.status}
                        </div>
                      </div>
                    </div>
                    {Array.isArray(field.field_types) &&
                      field.field_types.length > 0 && (
                        <div className="mt-2">
                          <div className="font-medium text-gray-700 mb-1">
                            Loại sân:
                          </div>
                          <ul className="space-y-1">
                            {field.field_types.map((type) => (
                              <li
                                key={type.field_field_type_id}
                                className="flex items-center justify-between bg-gray-50 rounded px-2 py-1 border border-gray-100"
                              >
                                <span className="font-semibold">
                                  {type.type_name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {type.players} người
                                </span>
                                <span className="text-green-600 font-bold">
                                  {Number(type.price_per_hour).toLocaleString()}
                                  ₫/giờ
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                ))
              ) : (
                <div className="col-span-full text-gray-500">
                  Không có sân bóng nào
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={handlePrevFieldPage}
              disabled={currentFieldPage === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
            >
              Previous
            </button>
            <span>
              Page {currentFieldPage} of {totalFieldPages}
            </span>
            <button
              onClick={handleNextFieldPage}
              disabled={currentFieldPage === totalFieldPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Review Section */}
      <div className="mt-12">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Đánh Giá Của Khách Hàng
        </h3>

        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.review_id}
                className="bg-white rounded-lg shadow-md p-5 border border-gray-200"
              >
                <div className="flex items-center mb-3">
                  {/* Star Rating (assuming rating is out of 5) */}
                  {[...Array(5)].map((_, i) => (
                    <Fragment key={i}>
                      {i < review.rating ? (
                        <svg
                          className="w-5 h-5 text-yellow-500 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.905l6.572-.955L10 1l2.939 4.95 6.572.955-4.756 4.645 1.123 6.545z" />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5 text-gray-300 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.905l6.572-.955L10 1l2.939 4.95 6.572.955-4.756 4.645 1.123 6.545z" />
                        </svg>
                      )}
                    </Fragment>
                  ))}
                </div>
                <p className="text-gray-700 mb-2">{review.comment}</p>
                <div className="flex items-center mb-2">
                  <img
                    src={`http://localhost/football-booking-system/backend-php/uploads/avata/${review.avata}`}
                    alt={review.full_name}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span className="text-gray-600 font-semibold">
                    {review.full_name}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">Chưa có đánh giá nào.</div>
        )}

        {/* Review Form */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-5 border border-gray-200">
          <h4 className="text-lg font-semibold mb-3 text-gray-700">
            Thêm đánh giá của bạn
          </h4>
          <form>
            <div className="mb-4">
              <label
                htmlFor="comment"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Bình luận:
              </label>
              <textarea
                id="comment"
                name="comment"
                rows="4"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Nhập bình luận của bạn..."
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Gửi đánh giá
              </button>
            </div>
          </form>
        </div>

        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={handlePrevPage}
            disabled={currentReviewPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Previous
          </button>
          <span>
            Page {currentReviewPage} of {totalReviewPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentReviewPage === totalReviewPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default BranchDetail;
