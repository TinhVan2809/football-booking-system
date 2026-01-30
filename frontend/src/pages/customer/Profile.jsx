import { useEffect, useState } from "react";
import { data, useParams } from "react-router-dom";

import {RiArrowLeftSLine, RiArrowRightSLine} from "@remixicon/react";

function Profile() {
  const API_BASE =
    "http://localhost/football-booking-system/backend-php/profile/api.php";
  const LIMIT = 10;

  const { user_id } = useParams();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  //TODO: lấy danh sách đơn đặt lịch thuê sân của người dùng này
  useEffect(() => {
    const fetchBookingByUserData = async (page = 1) => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}?action=get&user_id=${user_id}&limit=${LIMIT}&page=${page}`,
        );

        if(!res.ok) {
            throw new Error("ERROR HTTP", res.status);
        }

        const data = await res.json();

        if (data.success) {
          setBookings(data.data);
          setLoading(false);
          setTotalPages(data.total_pages || 1);

        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching booking by user in profile", err);
      } 
    };
    fetchBookingByUserData();
  }, [user_id]);


    // Xử lý chuyển trang
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
     <div className="">
        <div className="">
            {bookings.map(b => (
                <div className="" key={b.booking_id}>
                   <p>{b.booking_id}</p>
                   <p>{b.booking_date}</p>
                </div>
            )) }
        </div>
        
        <div className="w-full flex justify-center items-center gap-4 mt-6">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded cursor-pointer disabled:opacity-50"
          >
            <RiArrowLeftSLine />
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded cursor-pointer disabled:opacity-50"
          >
            <RiArrowRightSLine />
          </button>
        </div>
     </div>
    </>
  );
}

export default Profile;
