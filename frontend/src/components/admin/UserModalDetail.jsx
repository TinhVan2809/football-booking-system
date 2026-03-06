import { useCallback, useEffect, useState } from "react";
import useUserData from "../../hooks/usersHook";

function Loading() {
  return (
    <div className="">
      <p>Loading...</p>
    </div>
  );
}

function UserModalDetail({ user_id, close }) {
  const API_BASE =
    "http://localhost/football-booking-system/backend-php/users/api.php";
  
  const img ="http://localhost/football-booking-system/backend-php/uploads/fields_img";
  const [userBooking, setUserBooking] = useState([]);
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [errorBooking, setErrorBooking] = useState(null);

  const fetchUserData = useCallback(
    async (page = 1) => {
      setLoadingBooking(true);
      setErrorBooking(null);
      try {
        const res = await fetch(
          `${API_BASE}?action=getAllBookingsByUser&user_id=${user_id}&limit=12&page=${page}`,
        );

        if (!res.ok) {
          throw new Error(`Error HTTP ${res.status}`);
        }

        const data = await res.json();

        if (data.success) {
          setUserBooking(data.data);
        }
      } catch (error) {
        console.error("Error fetching user data ", error);
        setErrorBooking(error);
      } finally {
        setLoadingBooking(false);
      }
    },
    [user_id],
  );

   //TODO: Lấy dữ liệu user
  const { user, loading: userLoading, error: userError } = useUserData(
    user_id ? `${API_BASE}?action=id&user_id=${user_id}` : null,
  );


  useEffect(() => {
    fetchUserData();
  }, [user_id, fetchUserData]);

  if(errorBooking) {
    return <p>Something went wrong: {errorBooking}</p>
  }

  if (userLoading) {
    return <Loading />;
  }
  if (userError) {
    return <p>Something went wrong: {userError}</p>;
  }
  if (!user) {
    return null;
  }

  return (
    <>
      <div className="fixed z-3000 top-0 right-0 flex justify-center items-center w-full h-full bg-black/50">
        <div className="bg-white grid grid-cols-4 p-7.5 rounded-xl shadow-2xl w-fit max-h-250 h-fit gap-11 overflow-auto">
          <div className="col-span-1 flex flex-col gap-3">
            <div className="">
              <img src={`http://localhost/football-booking-system/backend-php/uploads/avata/${user.avata}`} className="w-30 rounded-[50%]"/>
            </div>
            <div className="flex mt-5 flex-col gap-1 justify-start items-start">
              <p className="text-sm text-stone-400">{user.username}</p>
              <p className="text-sm text-stone-400">{user.gmail}</p>
              <p className="text-sm text-stone-400">{user.phone}</p>
            </div>
            <div className="flex mt-5 gap-3 flex-col w-full">
              <button className="w-full border border-gray-200/30 shadow-xl py-1 rounded-2xl cursor-pointer duration-300 hover:bg-red-500 hover:text-white">Khóa</button>
              <button className="w-full border border-gray-200/30 shadow-xl py-1 rounded-2xl cursor-pointer duration-300 hover:bg-blue-500 hover:text-white">Edit</button>
              <button className="w-full border border-gray-200/30 shadow-xl py-1 rounded-2xl cursor-pointer duration-300" onClick={close}>Đóng</button>
            </div>
          </div>
          <div className="col-span-3 grid-cols-2 grid md:grid-cols-4 gap-3">
            {userBooking.length > 0 ? (
              userBooking.map(b => (
                <div className="relative w-40 h-fit" key={b.booking_id}>
                  <img src={`${img}/${b.thumbnail}`} className="w-full"/>
                  <div className="absolute bottom-0 w-full h-full flex justify-between items-end p-2">
                    <p className="text-white text-sm">#{b.booking_id}</p>
                    <button className="bg-amber-400 text-sm rounded-2xl px-2 py-0.5 cursor-pointer">Chi tiết</button>
                  </div>
                </div>
              ))
            ) : 'Không có đơn nào!'}
          </div>
        </div>
      </div>
    </>
  );
}

export default UserModalDetail;
