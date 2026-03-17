import { useCallback, useEffect, useState } from "react";

function DetailBooking({ booking_id, user_id, close }) {
  const API_BASE =
    "http://localhost/football-booking-system/backend-php/profile/api.php";

  const [detail, setDetail] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // TODO: fetch xem chi tiết booking
  const fetchDetailBooking = useCallback(async () => {
    setLoading(false);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE}?action=detail&user_id=${user_id}&booking_id=${booking_id}`,
      );

      if (!res.ok) {
        throw new Error(`Error http ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setDetail(data.data);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error fetching detail booking ", error);
    } finally {
      setLoading(false);
    }
  }, [user_id, booking_id]);

  // TODO: fetch danh sách dịch vụ đi kèm theo booking
  // ? Có thể Cần thêm phân trang
  const fetchServicesByBooking = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_BASE}?action=services&booking_id=${booking_id}&user_id=${user_id}`,
      );

      if (!res.ok) {
        throw new Error(`Error http ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setServices(data.data);
      }
    } catch (error) {
      console.error("Error fething services by booking ", error);
    }
  }, [user_id, booking_id]);

  useEffect(() => {
    fetchDetailBooking();
    fetchServicesByBooking();
  }, [user_id, booking_id, fetchDetailBooking, fetchServicesByBooking]);

  if(loading) {
    return <p>Loading...</p>
  }
  if(error) {
    return <p>Faile to fetch: {error}</p>
  }

  return (
    <>
      <div className="fixed flex w-full h-full top-0 justify-center items-center z-2000 bg-black/40">
        <div className="bg-white w-fit p-5 rounded-2xl relative ">
          <p
            onClick={close}
            className="absolute top-0 right-5 text-3xl cursor-pointer"
          >
            &times;
          </p>
          <div className="flex mt-5 flex-col gap-5">
            <div className="">
              <span>{detail.field_name}</span>
              <span>{detail.type_name}</span>
              <span>{detail.branch_name}</span>
            </div>
            <div className="">
              <span>{detail.start_time}</span>
              <span>{detail.end_tine}</span>
            </div>

            {services.map((s) => (
              <div className="">
                <span>{s.service_name}</span>
                <span>{s.quantity}</span>
              </div>
            ))}

            <div className="">
              <span>Giá trên giờ: {detail.price_per_hour}</span>
              <span>Tổng tiền {detail.final_price}</span>
            </div>
            <div className="">
              <span>{detail.booking_status}</span>
              <span>{detail.created_at}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailBooking;
