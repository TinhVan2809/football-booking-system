import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination, Autoplay } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// api  lấy danh sách bảng giá
import { getPricingByFieldFieldType } from "../../api/pricing.api";

function Booking() {
  const { field_field_type_id } = useParams();

  const [pricing, setPricing] = useState([]);
  const [fieldInfo, setFieldInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!field_field_type_id) return;

    const fetchPricing = async () => {
      setLoading(true);
      setError(null);
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

  if (loading)
    return <div className="text-center mt-10">Đang tải dữ liệu...</div>;
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

  return (
    <>
      <div className="container mx-auto md:p-8">
        <div className="bg-black/70 w-fit p-4 rounded-2xl flex flex-col gap-3 justify-center items-center">
          <h1 className="text-white">Bảng giá & Khung giờ</h1>
          <div className="rounded-2xl text-white flex gap-2">
            <span className="bg-green-600 rounded-2xl px-3 py-1">{fieldInfo?.field_name}</span>
            <span className="bg-red-700 rounded-2xl px-3 py-1">Loại {fieldInfo?.type_name}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pricing.map((day) => (
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
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-md"
                  >
                    <span className="text-gray-600 font-medium">
                      {formatTime(rule.start_time)} -{" "}
                      {formatTime(rule.end_time)}
                    </span>
                    <div className="text-right">
                      <strong className="text-lg text-green-600">
                        {formatCurrency(rule.price_per_hour)}
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
    </>
  );
}

export default Booking;
