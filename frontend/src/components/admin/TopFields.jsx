//[compoent bản hiển thị top sân bóng được bookings nhiều nhất]
//? Đang sử dụng dữ liệu tỉnh để test UI

import { useEffect, useState } from "react";

function TopFields() {
  const API_BASE =
    "http://localhost/football-booking-system/backend-php/fields/api.php";
  const [top, setTop] = useState([]);

  useEffect(() => {
    const fetchTopFieldsData = async () => {
      const res = await fetch(`${API_BASE}?action=get-fields-most-bookings`);

      if (!res.ok) {
        throw new Error(`ERROR HTTP: ${res.status}`);
      }

      const data = await res.json();
      if (data.success && Array.isArray(data.data)) setTop(data.data);
      else setTop([]);
    };
    fetchTopFieldsData();
  }, []);

  return (
    <>
      <table className="w-full">
        <thead>
          <tr className="h-10">
            <th className="text-gray-500 font-bold text-start">#</th>
            <th className="text-gray-500 font-bold text-start">Name</th>
            <th className="text-gray-500 font-bold text-start">
              Total bookings
            </th>
          </tr>
        </thead>

        <tbody className="">
          {top.map((t, i) => (
            <tr key={t.field_id ?? i}>
              <td>{i + 1}</td>
              <td>{t.field_name}</td>
              <td>{t.booking_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default TopFields;
