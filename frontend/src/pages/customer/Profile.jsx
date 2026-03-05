import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useUserData from "../../hooks/usersHook";

import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiPhoneFill,
  RiMapPinTimeFill,
} from "@remixicon/react";
import UserContext from "../../context/UserContext";

function Profile() {
  const API_BASE =
    "http://localhost/football-booking-system/backend-php/profile/api.php";
  const API_USER =
    "http://localhost/football-booking-system/backend-php/users/api.php";
  const LIMIT = 9;

  const { user_id } = useParams();
  const [bookings, setBookings] = useState([]);
  const [bookingsError, setBookingsError] = useState(null);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const { logout } = useContext(UserContext);

  //TODO: Lấy dữ liệu user
  const { user, loading: userLoading, error: userError } = useUserData(
    user_id ? `${API_USER}?action=id&user_id=${user_id}` : null,

  );

  //TODO: lấy danh sách đơn đặt lịch thuê sân của người dùng này
  useEffect(() => {
    const fetchBookingByUserData = async (page = 1) => {
      setBookingsLoading(true);
      setBookingsError(null);
      try {
        const res = await fetch(
          `${API_BASE}?action=get&user_id=${user_id}&limit=${LIMIT}&page=${page}`,
        );

        if (!res.ok) {
          throw new Error(`ERROR HTTP ${res.status}`);
        }

        const data = await res.json();

        if (data.success) {
          setBookings(data.data);
          setTotalPages(data.total_pages || 1);
        }
      } catch (err) {
        setBookingsError(err.message);
        console.error("Error fetching booking by user in profile", err);
      } finally {
        setBookingsLoading(false);
      }
    };
    fetchBookingByUserData(currentPage);
  }, [user_id, currentPage]);


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

  if (userLoading || bookingsLoading) {
    return <div>Loading</div>;
  }
  if (userError || bookingsError) {
    return <div>{userError || bookingsError}</div>;
  }
  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <>
      <div className="w-full mt-20 grid grid-cols-4 gap-10 px-10">
        <div className="col-span-1">
          <div className="w-full flex flex-col justify-center items-center">
            <img
              src={`http://localhost/football-booking-system/backend-php/uploads/avata/${user.avata}`}
              className="w-25 rounded-[50%]"
            />
            <p className="text-sm text-gray-400">{user.username}</p>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
          <div className="flex mt-5 mb-5 justify-center items-center">
            <button className="border border-stone-300 px-3 py-1 text-sm ">
              Preview Fiverr Profile
            </button>
          </div>
          <hr className="border border-gray-200" />
          <div className="mt-5 mb-5 flex flex-col justify-center items-start gap-5">
            <div className="flex w-full justify-between items-center">
              <p className="flex gap-1 text-sm text-gray-500">
                <RiPhoneFill size={20} className="text-gray-500" />
                phone
              </p>
              <p className="text-sm font-semibold">{user.phone}</p>
            </div>
            <div className="flex w-full justify-between items-center">
              <p className="flex gap-1 text-sm text-gray-500">
                <RiMapPinTimeFill size={20} className="text-gray-500" />
                created at
              </p>
              <p className="text-sm font-semibold">
                {user.created_at?.slice(0, 10)}
              </p>
            </div>
          </div>
          <hr className="border border-gray-200" />
          <div className="flex mt-5 mb-5 justify-between items-center flex-col gap-3">
            <button className="border border-gray-300 w-full py-1">Edit</button>
            <button className="border border-red-300 w-full py-1 text-red-300 cursor-pointer hover:bg-red-500 hover:text-white duration-200" onClick={logout}>Log out</button>
          </div>
        </div>

        <div className="col-span-3">
          <div className="md:grid grid-cols-3 gap-y-3 gap-3">
            {bookings.map((b) => (
              <div className="relative rounded-xl" key={b.booking_id}>
                <img
                  src={`http://localhost/football-booking-system/backend-php/uploads/fields_img/${b.thumbnail}`}
                  className="rounded-xl"
                />
                <div className="absolute bottom-0 p-2 flex right-0 items-center justify-between w-full px-5">
                  <p className="text-white md:text-2xl">#{b.booking_id}</p>
                  <button className="text-white bg-black/50 cursor-pointer rounded-2xl py-2 text-sm w-[40%]">Chi tiết</button>
                </div>
              </div>
            ))}
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
      </div>
    </>
  );
}

export default Profile;
