// Trang booking chính

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CardSkeleton from "../../components/customer/CardSkeleton";
import BookingModal from "../../components/customer/BookingModal";
import { io } from "socket.io-client";

// api  lấy danh sách bảng giá
import { getPricingByFieldFieldType } from "../../api/pricing.api";

function Booking() {
  const API_BASE_BRANCH = "http://localhost/football-booking-system/backend-php/branches/api.php";
  const API_BOOKING_NODE = "http://localhost:8081/api/bookings/create"; // Đồng bộ port 8081
  const API_SERVICE = "http://localhost/football-booking-system/backend-php/services/api.php";

  const { field_field_type_id } = useParams();

  const [pricing, setPricing] = useState([]);
  const [fieldInfo, setFieldInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // State lưu trữ branch data
  const [branch, setBranch] = useState([]);
  const [services, setServices] = useState([]);

  // State cho Modal Booking
  const [selectedRule, setSelectedRule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const navigate = useNavigate();

  // Socket setup
  useEffect(() => {
    const socket = io("http://localhost:8081"); 

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("new_booking", (data) => {
      // Khi có booking mới, có thể hiện thông báo hoặc reload lại data nếu cần
      if (data.field_field_type_id == field_field_type_id) {
        console.log("Có người vừa đặt sân này:", data);
        // Ở đây có thể fetch lại pricing hoặc availability nếu API hỗ trợ realtime availability
      }
    });

    return () => socket.disconnect();
  }, [field_field_type_id]);

  //todo: Lấy danh sách bảng giá
  useEffect(() => {
    if (!field_field_type_id) return;

    const fetchPricing = async () => {
      setError(null);
      setLoading(true);
      try {
        const data = await getPricingByFieldFieldType(field_field_type_id);

        if (data.success) {
          setPricing(data.pricing);
          setFieldInfo({
            field_name: data.field_name,
            type_name: data.type_name,
            field_id: data.field_id,
            field_type_id: data.field_type_id,
          });
        } else {
          // Xử lý trường hợp API trả về 200 nhưng success = false
          setError(data.message || "Không thể lấy thông tin giá.");
        }
      } catch (err) {
        console.error("Error fetching file pricing rules ", err);
        // Lấy message lỗi từ response của server nếu có
        const errorMessage =
          err.response?.data?.message || "Đã có lỗi xảy ra khi kết nối server.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, [field_field_type_id]);

  // todo: Lấy dữ liệu chi nhánh của field_field_type_id này
  useEffect(() => {
    const fetchBranhDataByFftId = async () => {
      try {
        const res = await fetch(
          `${API_BASE_BRANCH}?action=get-branch-fftId&field_field_type_id=${field_field_type_id}`,
        );
        const data = await res.json();

        if (data.success) {
          setBranch(data.data);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching branch data by fft Id ", err);
      } 
    };

    fetchBranhDataByFftId();
  }, [field_field_type_id]);

  // todo: Lấy danh sách dịch vụ khi đã có thông tin chi nhánh
  useEffect(() => {
    if (branch.length === 0) return;
    const branchId = branch[0]?.branch_id;
    if (!branchId) return;

    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_SERVICE}?action=get&branch_id=${branchId}&limit=100`);
        const data = await res.json();
        if (data.success) {
          setServices(data.data);
        }
      } catch (err) {
        console.error("Error fetching services", err);
      }
    };
    fetchServices();
  }, [branch]);

  if (error)
    return <div className="text-center mt-10 text-red-500">Lỗi: {error}</div>;

  // Định dạng giờ (HH:MM:SS -> HH:MM)
  const formatTime = (timeStr) => timeStr.substring(0, 5);

  // Định dạng tiền
  const formatCurrency = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(price));
  };

  // Helper for rule type badge
  const getRuleTypeBadge = (ruleType) => {
    switch (ruleType) {
      case "peak":
        return (
          <span className="ml-2 text-xs font-medium bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
            Giờ cao điểm
          </span>
        );
      case "off_peak":
        return (
          <span className="ml-2 text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            Giờ thấp điểm
          </span>
        );
      case "special":
        return (
          <span className="ml-2 text-xs font-medium bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
            Ngày đặc biệt
          </span>
        );
      default:
        return null;
    }
  };

  // Xử lý khi click vào một khung giờ
  const handleRuleClick = (rule, day) => {
    setSelectedRule({ ...rule, day_name: day.day_name, day_of_week: day.day_of_week });
    setIsModalOpen(true);
  };

  // Xử lý gọi API đặt sân
  const handleConfirmBooking = async (date, startTime, endTime, selectedServices) => {
    if (!selectedRule) return;

    // Tính duration (đơn giản hóa)
    // Cần xử lý start_time end_time dạng "HH:MM:SS" -> Date object để trừ
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const durationMinutes = (end - start) / 60000;
    const totalPrice = (selectedRule.price_per_hour / 60) * durationMinutes;

    const payload = {
      field_field_type_id: field_field_type_id,
      booking_date: date,
      start_time: startTime,
      end_time: endTime,
      price_per_hour: selectedRule.price_per_hour,
      duration_minutes: durationMinutes,
      total_price: totalPrice,
      booking_services: selectedServices // Gửi kèm danh sách dịch vụ đã chọn
    };

    console.log("Sending booking payload:", payload); // Debug payload

    try {
      // Lưu ý: Cần gửi kèm credentials (cookie token)
      const res = await fetch(API_BOOKING_NODE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include" 
      });

      const data = await res.json();
      if (res.ok) {
        alert("Đặt sân thành công! Mã đơn: " + data.booking_id);
        setIsModalOpen(false);
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("Lỗi kết nối server: " + (err.message || "Vui lòng kiểm tra lại Backend Node.js"));
    }
  };

  return (
    <>
      <div className="container mx-auto md:p-8">
        <div className="bg-black/70 w-fit p-4 rounded-2xl flex flex-col gap-3 justify-center items-center">
          <h1 className="text-white">Bảng giá & Khung giờ</h1>
          <div className="rounded-2xl text-white flex gap-2">
            <span className="bg-green-600 rounded-2xl px-3 py-1">
              {fieldInfo?.field_name}
            </span>
            <span className="bg-red-700 rounded-2xl px-3 py-1">
              Loại {fieldInfo?.type_name}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))
            : pricing.map((day) => (
                <div
                  key={day.day_of_week}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <h3 className="text-xl font-bold text-gray-800 border-b-2 border-gray-100 pb-3 mb-4">
                    {day.day_name}
                  </h3>
                  <div className="space-y-4">
                    {day.rules.map((rule) => (
                      <div
                        key={rule.pricing_rule_id}
                        className="flex justify-between items-center bg-gray-50 p-3 rounded-md cursor-pointer hover:bg-green-50 border border-transparent hover:border-green-200 transition-colors"
                        onClick={() => handleRuleClick(rule, day)}
                      >
                        <span className="text-gray-600 font-medium">
                          {formatTime(rule.start_time)} -{" "}
                          {formatTime(rule.end_time)}
                        </span>
                        <div className="text-right">
                          <strong className="text-lg text-green-600">
                            {formatCurrency(rule.price_per_hour)} / Giờ
                          </strong>
                          {getRuleTypeBadge(rule.rule_type)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* Modal đặt sân */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        rule={selectedRule}
        fieldInfo={fieldInfo}
        onConfirm={handleConfirmBooking}
        services={services}
      />
    </>
  );
}

export default Booking;
