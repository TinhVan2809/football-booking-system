import { useState, useEffect } from "react";
import { RiCloseLine, RiCalendarCheckLine } from "@remixicon/react";

function BookingModal({ isOpen, onClose, rule, fieldInfo, onConfirm, services = [] }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errors, setErrors] = useState({});
  const [serviceQuantities, setServiceQuantities] = useState({}); // { service_id: quantity }

  // Reset giờ khi mở modal hoặc đổi rule
  useEffect(() => {
    if (isOpen && rule) {
      setStartTime(rule.start_time.slice(0, 5));
      setEndTime(rule.end_time.slice(0, 5));
      setErrors({});
      setServiceQuantities({});
    }
  }, [isOpen, rule]);

  if (!isOpen || !rule) return null;

  // Hàm tính toán ngày tiếp theo dựa trên thứ (day_of_week: 2=Thứ 2, ..., 8=CN)
  // Lưu ý: Javascript getDay(): 0=CN, 1=Thứ 2...
  const getNextDateForDay = (dayOfWeekDB) => {
    if (!dayOfWeekDB) return new Date().toISOString().split('T')[0];
    const day = Number(dayOfWeekDB);
    // Map DB day (2-8) to JS day (1-6, 0)
    const targetDay = day === 8 ? 0 : day - 1;
    const today = new Date();
    const resultDate = new Date();
    
    // Tính khoảng cách ngày
    const currentDay = today.getDay();
    let distance = targetDay - currentDay;
    
    // Nếu ngày đã qua trong tuần hoặc là hôm nay nhưng giờ đã qua (xử lý đơn giản là +7 ngày nếu trùng thứ)
    // Ở đây logic đơn giản: Nếu distance <= 0 (đã qua hoặc hôm nay), cộng thêm 7 ngày để lấy tuần sau
    // Hoặc nếu muốn cho phép đặt hôm nay thì cần check giờ. Tạm thời lấy ngày gần nhất sắp tới.
    if (distance < 0) {
        distance += 7;
    }
    
    resultDate.setDate(today.getDate() + distance);
    return resultDate.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  // Tự động gợi ý ngày gần nhất
  const suggestedDate = getNextDateForDay(rule.day_of_week);

  const handleConfirm = () => {
    const dateToBook = selectedDate || suggestedDate;
    const newErrors = {};

    const now = new Date();
    const bookingTime = new Date(`${dateToBook}T${startTime}`);
    const diffMinutes = (bookingTime - now) / (1000 * 60);

    if (diffMinutes < 30) {
      newErrors.general = "Vui lòng đặt sân trước ít nhất 30 phút so với giờ hiện tại.";
    }

    // Validate giờ
    const ruleStart = rule.start_time.slice(0, 5);
    const ruleEnd = rule.end_time.slice(0, 5);

    if (startTime < ruleStart) {
      newErrors.startTime = `Giờ mở cửa: ${ruleStart}`;
    }
    if (endTime > ruleEnd) {
      newErrors.endTime = `Giờ đóng cửa: ${ruleEnd}`;
    }

    if (startTime >= endTime) {
      newErrors.endTime = "Giờ kết thúc phải sau giờ bắt đầu";
    } else {
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      const duration = (end - start) / (1000 * 60); // Tính ra phút
      if (duration < 60) {
        newErrors.endTime = "Thời lượng đặt sân tối thiểu là 60 phút";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Chuẩn bị dữ liệu dịch vụ để gửi đi
    const selectedServices = services
      .filter(s => serviceQuantities[s.service_id] > 0)
      .map(s => ({
        branch_service_id: s.branch_service_id || s.service_id, // Tùy vào API trả về, cần ID của bảng branch_services
        quantity: serviceQuantities[s.service_id],
        service_name: s.service_name, // Thêm tên dịch vụ để gửi email
        price: s.price
      }));

    onConfirm(dateToBook, startTime, endTime, selectedServices);
  };

  // Tính tổng tiền dự kiến
  const calculateTotal = () => {
    let total = 0;
    
    // Tiền sân
    if (startTime && endTime) {
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      if (end > start) {
        const diffMinutes = (end - start) / (1000 * 60);
        const hours = diffMinutes / 60;
        total += hours * rule.price_per_hour;
      }
    }

    // Tiền dịch vụ
    services.forEach(s => {
      const qty = serviceQuantities[s.service_id] || 0;
      total += qty * Number(s.price);
    });

    return total;
  };

  return (
    <div className="fixed inset-0 z-500 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-xl font-bold text-gray-800">Xác nhận đặt sân</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">
            <RiCloseLine size={24} />
          </button>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Sân bóng</p>
            <p className="font-semibold text-gray-800">{fieldInfo?.field_name} - {fieldInfo?.type_name}</p>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 bg-blue-50 p-3 rounded-lg">
              <label className="text-sm text-blue-600 block mb-1">Giờ bắt đầu</label>
              <input 
                type="time" 
                className={`font-bold text-blue-800 text-lg bg-transparent outline-none w-full border-b ${errors.startTime ? 'border-red-500' : 'border-blue-200'} focus:border-blue-500`}
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  setErrors(prev => ({ ...prev, startTime: null, general: null }));
                }}
              />
              {errors.startTime && <p className="text-xs text-red-500 mt-1 font-medium">{errors.startTime}</p>}
              <p className="text-xs text-gray-500 mt-1">Mở cửa: {rule.start_time.slice(0, 5)}</p>
            </div>
            <div className="flex-1 bg-blue-50 p-3 rounded-lg">
              <label className="text-sm text-blue-600 block mb-1">Giờ kết thúc</label>
              <input 
                type="time" 
                className={`font-bold text-blue-800 text-lg bg-transparent outline-none w-full border-b ${errors.endTime ? 'border-red-500' : 'border-blue-200'} focus:border-blue-500`}
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                  setErrors(prev => ({ ...prev, endTime: null, general: null }));
                }}
              />
              {errors.endTime && <p className="text-xs text-red-500 mt-1 font-medium">{errors.endTime}</p>}
              <p className="text-xs text-gray-500 mt-1">Đóng cửa: {rule.end_time.slice(0, 5)}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chọn ngày đá ({rule.day_name})
            </label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={selectedDate || suggestedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setErrors(prev => ({ ...prev, general: null }));
              }}
              // Chỉ cho phép chọn ngày tương lai (cơ bản)
              min={new Date().toISOString().split('T')[0]}
            />
            <p className="text-xs text-gray-500 mt-1">
              *Hệ thống tự động gợi ý ngày {rule.day_name} gần nhất.
            </p>
          </div>

          {/* Danh sách dịch vụ */}
          {services && services.length > 0 && (
            <div className="border-t pt-3">
              <p className="font-medium text-gray-700 mb-2">Dịch vụ đi kèm</p>
              <div className="space-y-2">
                {services.map((service) => (
                  <div key={service.service_id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{service.service_name}</p>
                      <p className="text-xs text-gray-500">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(service.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        min="0" 
                        className="w-16 p-1 border rounded text-center text-sm"
                        placeholder="0"
                        value={serviceQuantities[service.service_id] || ""}
                        onChange={(e) => setServiceQuantities({
                          ...serviceQuantities,
                          [service.service_id]: Math.max(0, parseInt(e.target.value) || 0)
                        })}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <span className="text-gray-600">Tổng tiền tạm tính:</span>
            <span className="text-xl font-bold text-green-600">
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(calculateTotal())}
            </span>
          </div>
          {errors.general && <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-100 text-center">{errors.general}</div>}
          <p className="text-xs text-right text-gray-500">Đơn giá: {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(rule.price_per_hour)}/giờ</p>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex justify-center items-center gap-2 cursor-pointer"
          >
            <RiCalendarCheckLine size={18} />
            Đặt ngay
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingModal;
