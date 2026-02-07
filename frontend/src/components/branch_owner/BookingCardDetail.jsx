import { useState, useEffect, useCallback } from "react";

import {
  RiArrowDownCircleLine,
  RiCheckLine,
  RiArrowDownSLine,
  RiTimer2Line,
  RiContractRightFill,
  RiUserLine,
  RiBaseballLine,
} from "@remixicon/react";

function BookingCardDetail({ booking_id, onClose }) {
  console.log(booking_id);

  const [detailBooking, setDetailBooking] = useState([]);
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);

  const fetchBookingDetailData = useCallback(async () => {
    try {
      const res = await fetch(
        `http://localhost:8081/api/booking/branch/${booking_id}`,
        {
          credentials: "include",
        },
      );
      const data = await res.json();
      if (data.success) {
        setDetailBooking(data.bookings);
        setServices(data.services); // lưu danh sách dịch vụ
      }
    } catch (error) {
      setError(error.message);
      console.error("error fetching bookings ", error);
    }
  }, [booking_id]);

  useEffect(() => {
    fetchBookingDetailData(); //eslint-disable-line
  }, [booking_id, fetchBookingDetailData]);

  const booking = detailBooking[0];

  const getStatusBooking = (bookingStatus) => {
    switch (bookingStatus) {
      // Nếu đơn đang chờ xác nhận => xác nhận
      case "pending":
        return (
          <button className="bg-gray-100 py-2 px-3 rounded-md text-sm font-semibold cursor-pointer">
            Xác nhận
          </button>
        );

      // Nếu đơn đã xác nhận => hoàn thành
      case "confirmed":
        return (
          <>
            <button className="bg-gray-100 py-2 px-3 rounded-md text-sm font-semibold cursor-pointer">
              Thêm dịch vụ
            </button>
            <button className="bg-gray-100 py-2 px-3 rounded-md text-sm font-semibold cursor-pointer">
              Thêm giờ
            </button>
            <button className="bg-gray-100 py-2 px-3 rounded-md text-sm font-semibold cursor-pointer">
              Hoàn thành
            </button>
          </>
        );

      // Nếu đơn hoàn thành => gửi yêu cầu đánh giá
      case "completed":
        return (
          <button className="bg-gray-100 py-2 px-3 rounded-md text-sm font-semibold cursor-pointer">
            Gửi yêu cầu đánh giá
          </button>
        );

      case "cancelled":
        return <button>Đã hủy</button>;

      default:
        return null;
    }
  };

  // Hàm định dạng ngày/tháng/năm
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if(error) {
    return <p>something went wrong {error}</p>
  }

  return (
    <>
      <div className="fixed z-400 top-0 w-full h-screen flex justify-center items-center bg-black/40">
        {booking && (
          <div className="bg-white rounded-2xl lg:w-[50%] h-fit flex flex-col gap-5">
            <div className="bg-[#097271] p-5 rounded-tr-2xl rounded-tl-2xl">
              <div className="flex justify-between items-center border-b border-gray-300/30 pb-2.5">
                <p className="text-2xl font-semibold text-white/90">
                  Booking Detail{" "}
                  <span className="text-sm text-gray-400">
                    #{booking.booking_id}
                  </span>
                </p>
                <span
                  className="text-2xl text-white/60 px-2 rounded-[50%] border cursor-pointer"
                  onClick={onClose}
                >
                  &times;
                </span>
              </div>

              <div className="pt-9">
                <h2 className="text-white/90 text-2xl">
                  {booking.field_name} - {booking.type_name}
                </h2>
                <div className="flex gap-3 items-center mt-1">
                  <p className="text-sm text-white flex items-center gap-1">
                    <RiTimer2Line size={14} />{" "}
                    {formatDate(booking.booking_date)}
                  </p>
                  <p className="text-sm text-white">
                    Giờ chơi: {booking.start_time}
                  </p>
                  <p className="text-sm text-white">
                    Giờ kết thúc: {booking.end_time}
                  </p>
                  <p className="text-sm text-white">
                    {booking.duration_minuutes}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-5.5">
                  <div className="flex gap-3">
                    <button className="py-2 px-4 rounded-md bg-white/30 text-white text-sm flex items-center gap-1 cursor-pointer">
                      <RiContractRightFill /> Lorem ipsum dolor sit
                    </button>
                    <button className="p-2 bg-white/30 text-white rounded-xl cursor-pointer">
                      <RiArrowDownCircleLine />
                    </button>
                  </div>
                  <button className="flex items-center gap-2 py-1.5 px-2 border border-gray-100/20 text-white rounded-md text-sm cursor-pointer">
                    <RiCheckLine
                      className="bg-gray-300/50 rounded-[50%]"
                      size={19}
                    />{" "}
                    Going <RiArrowDownSLine className="text-gray-300" />
                  </button>
                </div>
              </div>
            </div>
            <div className="px-5">
              <p className="flex items-center gap-0.5">
                <RiUserLine size={17} /> Người đặt
              </p>
              <p>{booking.full_name}</p>
              <p>{booking.phone}</p>
              {booking.email ? <p>{booking.email}</p> : ""}
            </div>
            {services.length > 0 && (
              <div className="px-5">
                <h4 className="flex items-center gap-0.5">
                  <RiBaseballLine size={17} /> Dịch vụ đi kèm:
                </h4>
                <ul className="flex flex-col gap-1">
                  {services.map((s) => (
                    <li key={s.booking_service_id}>
                      {s.service_name} x {s.quantity} (
                      {Number(s.total_price).toLocaleString()}đ)
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="px-5 border-t pt-6 pb-6 border-gray-300 flex gap-3 items-cemter">
              {getStatusBooking(booking.booking_status)}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default BookingCardDetail;
