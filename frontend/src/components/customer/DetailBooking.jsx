import { useCallback, useEffect, useState } from "react";
import {
  RiCloseLine,
  RiMapPinLine,
  RiTimeLine,
  RiCalendarLine,
  RiMoneyDollarCircleLine,
  RiFootballLine,
  RiServiceLine,
} from "@remixicon/react";

import DepositInfo from "./DepositInfo";

function DetailBooking({ booking_id, user_id, close }) {
  const API_BASE =
    "http://localhost/football-booking-system/backend-php/profile/api.php";

  const [detail, setDetail] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [depositInfoIsOpen, setDepositInfoIsOpen] = useState(false);

  // Helper formatting
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Status Badge Helper
  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || "";
    let styles = "bg-gray-100 text-gray-600 border-gray-200";
    let label = s;

    if (s === "pending") {
      styles =
        "bg-yellow-50 text-yellow-700 border-yellow-200 ring-yellow-500/30";
      label = "Chờ xác nhận";
    } else if (s === "confirmed" || s === "confirm") {
      styles = "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/30";
      label = "Đã xác nhận";
    } else if (s === "completed") {
      styles = "bg-green-50 text-green-700 border-green-200 ring-green-500/30";
      label = "Hoàn thành";
    } else if (s === "cancelled" || s === "cancel") {
      styles = "bg-red-50 text-red-700 border-red-200 ring-red-500/30";
      label = "Đã hủy";
    }

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ring-1 ${styles} uppercase tracking-wider`}
      >
        {label}
      </span>
    );
  };

  const fetchDetailBooking = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE}?action=detail&user_id=${user_id}&booking_id=${booking_id}`,
      );
      if (!res.ok) throw new Error(`Error http ${res.status}`);
      const data = await res.json();
      if (data.success) {
        // Đảm bảo lấy đúng object dù API trả về mảng hay object
        setDetail(Array.isArray(data.data) ? data.data[0] : data.data);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error fetching detail booking ", error);
    } finally {
      setLoading(false);
    }
  }, [user_id, booking_id]);

  const fetchServicesByBooking = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_BASE}?action=services&booking_id=${booking_id}&user_id=${user_id}`,
      );
      if (!res.ok) throw new Error(`Error http ${res.status}`);
      const data = await res.json();
      if (data.success) {
        setServices(data.data);
      }
    } catch (error) {
      console.error("Error fetching services by booking ", error);
    }
  }, [user_id, booking_id]);

  useEffect(() => {
    fetchDetailBooking();
    fetchServicesByBooking();
  }, [fetchDetailBooking, fetchServicesByBooking]);

  // Prevent click propagation
  const handleContentClick = (e) => e.stopPropagation();

  // Hàm mở thông tin đặt cọc
  const onDepositInfo = () => {
    setDepositInfoIsOpen(true);
  };

  // Hàm đóng thông tin đặt cọc 
  const onCloseDepositInfo = () => {
    setDepositInfoIsOpen(false);
  }

  if (loading && !detail) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-2000 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity p-4 animate-fade-in"
        onClick={close}
      >
        <div
          className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-scale-in flex flex-col max-h-[90vh]"
          onClick={handleContentClick}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Chi tiết đặt sân
              </h2>
              <p className="text-sm text-gray-500">Mã đơn: #{booking_id}</p>
            </div>
            <button
              onClick={close}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
            >
              <RiCloseLine size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : error ? (
              <p className="text-center text-red-500 py-4">{error}</p>
            ) : detail ? (
              <div className="space-y-6">
                {/* Status Section */}
                <div className="flex justify-between items-center bg-white p-1 rounded-lg">
                  <span className="text-sm font-medium text-gray-500">
                    Trạng thái đơn
                  </span>
                  {getStatusBadge(detail.booking_status)}
                </div>

                {/* Field Info Card */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-bl-full -mr-8 -mt-8 opacity-50"></div>
                  <div className="flex items-start gap-3 relative z-10">
                    <div className="mt-1 bg-white p-2.5 rounded-xl shadow-sm text-green-600 border border-green-100">
                      <RiFootballLine size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg leading-tight">
                        {detail.field_name}
                      </h3>
                      <p className="text-sm text-green-700 font-medium mt-0.5">
                        {detail.type_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm pl-1 pt-2 border-t border-gray-100 border-dashed">
                    <RiMapPinLine
                      size={16}
                      className="text-gray-400 shrink-0"
                    />
                    <span className="line-clamp-1">
                      {detail.branch_name} - {detail.address}
                    </span>
                  </div>
                </div>

                {/* Time Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:border-green-200 transition-colors">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1 uppercase tracking-wide font-semibold">
                      <RiCalendarLine size={14} />
                      Ngày đá
                    </div>
                    <p className="font-bold text-gray-800 text-base">
                      {formatDate(detail.booking_date || detail.created_at)}
                    </p>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:border-green-200 transition-colors">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1 uppercase tracking-wide font-semibold">
                      <RiTimeLine size={14} />
                      Khung giờ
                    </div>
                    <p className="font-bold text-gray-800 text-base">
                      {detail.start_time?.slice(0, 5)} -{" "}
                      {detail.end_time?.slice(0, 5) ||
                        detail.end_tine?.slice(0, 5)}
                    </p>
                  </div>
                </div>

                {/* Services List */}
                {services.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
                      <RiServiceLine size={16} className="text-blue-500" /> Dịch
                      vụ đi kèm
                    </h4>
                    <div className="space-y-2">
                      {services.map((s, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-400"></div>
                            <span className="text-gray-700 font-medium text-sm">
                              {s.service_name}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">
                              x{s.quantity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pricing Summary */}
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Giá sân</span>
                    <span className="font-medium text-gray-700">
                      {formatCurrency(detail.price_per_hour)}
                    </span>
                  </div>
                  {services.length > 0 && (
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Phí dịch vụ</span>
                      <span className="font-medium text-gray-700">
                        {formatCurrency(
                          Number(detail.final_price) -
                            Number(detail.total_price),
                        )}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 mt-2 border-t border-dashed border-gray-200">
                    <span className="font-bold text-gray-800 flex items-center gap-2">
                      <RiMoneyDollarCircleLine
                        className="text-green-600"
                        size={20}
                      />{" "}
                      Tổng thanh toán
                    </span>
                    <span className="text-xl font-extrabold text-green-600">
                      {formatCurrency(detail.final_price)}
                    </span>
                  </div>
                  <p className="text-xs text-right text-gray-400 italic">
                    Đã bao gồm thuế và phí
                  </p>
                </div>

                {detail.booking_status == "pending" ? (
                  <div className="flex w-full justify-center items-center gap-5">
                    <span>Đặt cọc để giữ sân ngay</span>
                    <button
                      className="bg-green-600 rounded-sm p-2 text-white cursor-pointer hover:bg-green-700"
                      onClick={() => onDepositInfo(detail.booking_id)}
                    >
                      Đặt cọc
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <RiFootballLine size={40} className="mb-2 opacity-50" />
                <p>Không tìm thấy thông tin đơn hàng.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {depositInfoIsOpen && <DepositInfo booking_id = {detail.booking_id} final_price ={detail.final_price} phone={detail.phone} close={onCloseDepositInfo}/>}
    </>
  );
}

export default DetailBooking;
