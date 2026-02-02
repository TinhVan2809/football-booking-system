import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

import { RiCircleFill, RiTimer2Line, RiGroupLine } from "@remixicon/react";

// Component xem chi tiết đơn đặt lịch
import BookingCardDetail from "../../components/branch_owner/BookingCardDetail";

function BookingListBranch() {
  const { branch_id } = useParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // State lưu trạng thái xem chi tiết đơn đặt lịch
  const [bookingCardModal, setBookingCardModal] = useState(false);

  // State lưu booking_id
  const [selectedBokingId, setSelectedBookingId] = useState(null);

  const img =
    "http://localhost/football-booking-system/backend-php/uploads/fields_img";

  // Hàm fetch danh sách booking
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8081/api/bookings/branch/${branch_id}`,
        {
          credentials: "include",
        },
      );
      const data = await res.json();
      if (data.success) setBookings(data.bookings);
    } catch (err) {
      console.error("error fetching bookings ", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
    // Kết nối socket
    const socket = io("http://localhost:8081");
    socket.on("new_booking", (data) => {
      // Nếu booking thuộc chi nhánh này thì reload
      if (
        data.field_field_type_id &&
        bookings.some((b) => b.field_field_type_id == data.field_field_type_id)
      ) {
        fetchBookings();
      }
    });
    return () => socket.disconnect();
    // eslint-disable-next-line
  }, [branch_id]);

  if (loading) return <div>Đang tải...</div>;

  const getStatusBooking = (statusBooking) => {
    switch (statusBooking) {
      case "pending":
        return (
          <p className="text-white bg-[#272727] rounded-2xl text-sm px-2 py-0.5">
            Chờ xác nhận
          </p>
        );

      case "confirmed":
        return (
          <p className="bg-orange-500 text-black rounded-2xl text-sm px-2 py-0.5">
            Đã xác nhận
          </p>
        );

      case "completed":
        return (
          <p className="bg-green-900 text-white rounded-2xl text-sm px-2 py-0.5">
            Hoàn thành
          </p>
        );

      case "cancelled":
        return (
          <p className="text-white bg-red-800 rounded-2xl text-sm px-2 py-0.5">
            Đã hủy
          </p>
        );

      default:
        return null;
    }
  };

  const onBookingDetail = (selectedBokingId) => {
    setSelectedBookingId(selectedBokingId);
    setBookingCardModal(true);
  }

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-5 md:grid-cols-3 p-5 gap-y-2">
        {bookings.map((b) => {
          const date = new Date(b.created_at);
          const day = date.getDate().toString().padStart(2, "0");
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          const formatted = `${day}/${month}`;
          const formattedPrice = new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(b.final_price);

          return (
            <div
              className="p-1.5 lg:w-70 shadow-xl rounded-2xl flex flex-col gap-4"
              key={b.booking_id}
            >
              <div className="h-43 rounded-2xl">
                <img
                  src={`${img}/${b.thumbnail}`}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <div className="p-1.5 flex flex-col gap-1">
                <h3 className="text-xl font-bold">
                  {formattedPrice}{" "}
                  <span className="text-sm font-normal opacity-40">
                    List price
                  </span>
                </h3>
                <div className="flex gap-3 items-center">
                  <p>{b.field_name}</p>
                  <RiCircleFill size={5} color="gray" />
                  <p>{b.type_name}</p>
                </div>
                <div className="mt-3 mb-3 border-t border-b border-gray-300 py-1.5 flex items-center justify-between">
                  <div className="flex gap-3">
                    <p className="flex text-sm justify-center items-center gap-0.5">
                      <RiTimer2Line size={14} color="gray" />{" "}
                      {b.duration_minutes}
                    </p>
                    <span className="text-sm opacity-20">|</span>
                    <p className="flex items-center gap-1">
                      <RiGroupLine size={14} color="gray" /> {b.players}
                    </p>
                  </div>
                  {getStatusBooking(b.booking_status)}
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-semibold flex gap-1 truncate w-[81%] overflow-hidden whitespace-nowrap">
                    <span className="text-gray-400 font-normal">By</span>
                    {b.full_name}
                  </p>
                  <p className="text-sm opacity-40">{formatted}</p>
                </div>
                <button
                  className="mt-2 bg-[#272727] text-white py-1.5 rounded-[20px] cursor-pointer duration-200 hover:bg-green-700 hover:text-white"
                  onClick={() => onBookingDetail(b.booking_id)}
                >
                  Chi tiết
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {bookingCardModal && (
        <>
          <BookingCardDetail booking_id={selectedBokingId} onClose={() => setBookingCardModal(false)} />
        </>
      )}
    </>
  );
}

export default BookingListBranch;
