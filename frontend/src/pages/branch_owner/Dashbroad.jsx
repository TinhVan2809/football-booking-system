//[Trang Dasbroad Admin]
import { useState, useEffect, useCallback, useContext } from "react";
import UserContext from "../../context/UserContext";

function DashbroadBranch() {
  const API_BASE_STATISTIC =
    "http://localhost/football-booking-system/backend-php/statistics/api.php";
  const { user } = useContext(UserContext);

  const branch_id = user?.branch_id;

  const [statisticFields, setStatisticFields] = useState(0);
  const [statisticBookings, setStatisticBookings] = useState(0);
  const [error, setError] = useState(null);

  //TODO: Lấy tổng sân bóng có trong một chi nhánh để làm card thống kê
  const fetchStatisticFieldsData = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_STATISTIC}?action=statistic-fields&branch_id=${branch_id}`);
      if (!res.ok) {
        throw new Error(`ERROR HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setStatisticFields(data.data);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching StatisticFieldsData ", err);
    }
  }, [branch_id]);

  const fetchStatisticBookingsData = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_BASE_STATISTIC}?action=statistic-bookings&branch_id=${branch_id}`,
      );
      if (!res.ok) {
        throw new Error(`ERROR HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setStatisticBookings(data.data);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching StatisticBookingsData ", err);
    }
  }, [branch_id]);

  useEffect(() => {
    fetchStatisticFieldsData();
    fetchStatisticBookingsData();
  }, [branch_id, fetchStatisticFieldsData, fetchStatisticBookingsData]);

  if(error) return <p className="text-red-600">Faile to fetch: {error}</p>;

  return (
    <>
      
    </>
  );
}

export default DashbroadBranch;
