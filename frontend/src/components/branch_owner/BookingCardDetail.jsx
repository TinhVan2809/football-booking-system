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

function BookingCardDetail({ booking_id, onClose, onFetchBookings }) {
  console.log(booking_id);

  const [detailBooking, setDetailBooking] = useState([]);
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);

  const [seletedBookingId, setSelectedBookingId] = useState(null);

  // state lưu trạng thái popup xác nhận bookings
  const [confirm, setConfirm] = useState(false);

  // state lưu trạng thái popup xác nhận hoàn thành bookings
  const [completed, setCompleted] = useState(false);

  // state lưu trạng thái popup hủy bookings
  const [cancelled, setCancelled] = useState(false);

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
    fetchBookingDetailData();
  }, [booking_id, fetchBookingDetailData]);

  const booking = detailBooking[0];

  const getStatusBooking = (bookingStatus) => {
    switch (bookingStatus) {
      // Nếu đơn đang chờ xác nhận => xác nhận || hủy
      case "pending":
        return (
          <>
            <button
              className="bg-gray-100 py-2 px-3 rounded-md text-sm font-semibold cursor-pointer"
              onClick={() => {
                onOpenConfirmBookingPopup(booking.booking_id);
              }}
            >
              Xác nhận
            </button>
            <button
              className="bg-gray-100 py-2 px-3 rounded-md text-sm font-semibold cursor-pointer"
              onClick={() => onOpenCancelledPopup(booking.booking_id)}
            >
              Hủy
            </button>
          </>
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
            <button
              className="bg-gray-100 py-2 px-3 rounded-md text-sm font-semibold cursor-pointer"
              onClick={() => onIsOpenCompletedPopup(booking.booking_id)}
            >
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

  if (error) {
    return <p>something went wrong {error}</p>;
  }

  // Hàm mở popup xác nhận bookings
  const onOpenConfirmBookingPopup = (booking_id) => {
    setConfirm(true);
    setSelectedBookingId(booking_id);
  };
  // Hàm mở popup xác nhận hoàn thành booking
  const onIsOpenCompletedPopup = (booking_id) => {
    setCompleted(true);
    setSelectedBookingId(booking_id);
  };
  // Hàm mở popup hủy bookings
  const onOpenCancelledPopup = (booking_id) => {
    setCancelled(true);
    setSelectedBookingId(booking_id);
  };

  // Hàm xác nhận bookings (Chưa xác nhận => đã xác nhận)
  const handleConfirmBooking = async () => {
    if (!seletedBookingId) return;
    try {
      const res = await fetch(
        `http://localhost:8081/confirm-bookings/${seletedBookingId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!res.ok) {
        throw new Error(`ERROR HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setConfirm(false);
        setSelectedBookingId(null);
        fetchBookingDetailData();
        if (onFetchBookings) onFetchBookings();
      }
    } catch (error) {
      setError(error.message);
      console.error("Error fetching confirm bookings", error);
    }
  };

  // Hàm xác nhận hoàn thành đơn (Đã xác nhận => hoàn thành)
  const handleCompletedBookings = async () => {
    if (!seletedBookingId) return;
    try {
      const res = await fetch(
        `http://localhost:8081/completed-bookings/${seletedBookingId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!res.ok) {
        throw new Error(`ERROR HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setCompleted(false);
        setSelectedBookingId(null);
        fetchBookingDetailData();
        if (onFetchBookings) onFetchBookings();
      }
    } catch (error) {
      setError(error.message);
      console.error("Error fetching completed bookings", error);
    }
  };

  // Hàm xác nhận hủy bookings (Chờ xác nhận => Hủy)
  const handleCancelledBooking = async () => {
    if (!seletedBookingId) return;
    try {
      const res = await fetch(
        `http://localhost:8081/cancelled-bookings/${seletedBookingId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) {
        throw new Error(`ERROR HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setCancelled(false);
        setSelectedBookingId(null);
        fetchBookingDetailData();
        if (onFetchBookings) onFetchBookings();
      }
    } catch (error) {
      console.error("Error fetching cancelled bookings", error);
      setError(error.message);
    }
  };

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

      {/* Pupop xác nhận bookings  */}
      {confirm && (
        <div className="fixed z-10000 top-0 flex justify-center items-center w-full h-full  bg-black/20">
          <div className="bg-white p-5 rounded-2xl flex flex-col gap-10 border-3 border-orange-500">
            <p>Bạn có muốn xác nhận đơn đặt lịch này?</p>
            <div className="flex justify-end items-center gap-3">
              <button
                className="border border-gray-300 px-4 py-1 rounded-sm cursor-pointer shadow-2xl"
                onClick={handleConfirmBooking}
              >
                Yes
              </button>
              <button
                className="border border-gray-300 px-4 py-1 rounded-sm cursor-pointer shadow-2xl"
                onClick={() => setConfirm(false)}
                style={{ marginLeft: 8 }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup xác nhận hoàn thành bookings */}
      {completed && (
        <div className="fixed z-10000 top-0 flex justify-center items-center h-full w-full bg-black/20">
          <div className="bg-white p-5 rounded-2xl flex flex-col gap-10 border-3 border-green-500">
            <p>Bạn có muốn xác nhận hoàn thành đơn đặt lịch này?</p>
            <div className="flex justify-end items-center gap-3">
              <button
                className="border border-gray-300 px-4 py-1 rounded-sm cursor-pointer shadow-2xl"
                onClick={handleCompletedBookings}
              >
                Yes
              </button>
              <button
                className="border border-gray-300 px-4 py-1 rounded-sm cursor-pointer shadow-2xl"
                onClick={() => setCompleted(false)}
                style={{ marginLeft: 8 }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup xác nhận hủy bookings */}
      {cancelled && (
        <div className="fixed z-10000 top-0 flex justify-center items-center h-full w-full bg-black/20">
          <div className="bg-white p-5 rounded-2xl flex flex-col gap-10 border-3 border-red-500">
            <p>Bạn có muốn xác nhận hủy đơn đặt lịch này?</p>
            <div className="flex justify-end items-center gap-3">
              <button
                className="border border-gray-300 px-4 py-1 rounded-sm cursor-pointer shadow-2xl"
                onClick={handleCancelledBooking}
              >
                Yes
              </button>
              <button
                className="border border-gray-300 px-4 py-1 rounded-sm cursor-pointer shadow-2xl"
                onClick={() => setCancelled(false)}
                style={{ marginLeft: 8 }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BookingCardDetail;
