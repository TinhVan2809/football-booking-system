//[Trang Dasbroad Admin]
import { useState, useEffect, useCallback, useContext } from "react";
import UserContext from "../../context/UserContext";

import {
  RiSearch2Line,
  RiCurrencyLine,
  RiEditBoxLine,
  RiBookmarkLine,
} from "@remixicon/react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function DashbroadBranch() {
  const API_BASE_STATISTIC =
    "http://localhost/football-booking-system/backend-php/statistics/api.php";
  const { user } = useContext(UserContext);

  const branch_id = user?.branch_id;
  const MONTHS_WINDOW = 12;

  const [statisticFields, setStatisticFields] = useState(0);
  const [statisticBookings, setStatisticBookings] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [revenueByMonth, setRevenueByMonth] = useState([]);
  const [error, setError] = useState(null);

  const formatVnd = useCallback(
    (value) => `${new Intl.NumberFormat("vi-VN").format(value ?? 0)} VND`,
    [],
  );

  const buildLastMonths = useCallback((count) => {
    const now = new Date();
    const months = [];

    for (let i = count - 1; i >= 0; i -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");

      months.push({
        key: `${year}-${month}`,
        label: `${month}/${year}`,
        shortLabel: month,
      });
    }

    return months;
  }, []);

  //TODO: Lấy tổng sân bóng có trong một chi nhánh để làm card thống kê
  const fetchStatisticFieldsData = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_BASE_STATISTIC}?action=statistic-fields&branch_id=${branch_id}`,
      );
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

  //TODO: Lấy tổng số bookings của mộtc chi nhánh
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

  //TODO: Lấy tổng tiền
  const fetchRevenue = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_BASE_STATISTIC}?action=revenue&branch_id=${branch_id}`,
      );

      if (!res.ok) {
        throw new Error(`Error http ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setRevenue(data.data);
      }
    } catch (error) {
      console.error("Lỗi khi tính tổng doanh thu", error);
    }
  }, [branch_id]);

  //TODO: Doanh thu theo tháng (biểu đồ)
  const fetchRevenueByMonth = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_BASE_STATISTIC}?action=revenue-by-month&branch_id=${branch_id}&months=${MONTHS_WINDOW}`,
      );

      if (!res.ok) {
        throw new Error(`Error http ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setRevenueByMonth(Array.isArray(data.data) ? data.data : []);
      }
    } catch (error) {
      console.error("Lỗi khi lấy doanh thu theo tháng", error);
    }
  }, [branch_id]);

  useEffect(() => {
    fetchStatisticFieldsData();
    fetchStatisticBookingsData();
    fetchRevenue();
    fetchRevenueByMonth();
  }, [
    branch_id,
    fetchStatisticFieldsData,
    fetchStatisticBookingsData,
    fetchRevenue,
    fetchRevenueByMonth,
  ]);

  if (error) return <p className="text-red-600">Faile to fetch: {error}</p>;

  const monthSlots = buildLastMonths(MONTHS_WINDOW);
  const revenueMap = new Map(
    (revenueByMonth || []).map((row) => [row.month, Number(row.revenue) || 0]),
  );
  const chartData = monthSlots.map((m) => ({
    ...m,
    value: revenueMap.get(m.key) ?? 0,
  }));
  const lineData = chartData.map((d) => ({ month: d.label, revenue: d.value }));
  const totalRevenueByMonth = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <>
      <div className="flex flex-col gap-y-5 mt-10 mb-10 px-40">
        <div className="bg-[#e9e9e9] flex w-85 px-2 py-3 rounded-2xl gap-2">
          <RiSearch2Line />
          <input
            type="text"
            placeholder="Search property..."
            className="w-full outline-0 "
          />
        </div>
        <div className="grid md:grid-cols-3 gap-2">
          <div className="bg-[#e9e9e9] rounded-[20px] p-4.5 gap-y-20 flex flex-col">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Total Balance</p>
              <RiCurrencyLine className="border border-gray-400 w-9 h-9 rounded-[50%] p-2" />
            </div>
            <div className="">
              <p className="text-[25px]">{revenue} VND</p>
              <p className="text-sm">In the past 12 months</p>
            </div>
          </div>
          <div className="bg-[#e9e9e9] rounded-[20px] p-4.5 gap-y-20 flex flex-col">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Sân bóng </p>
              <RiEditBoxLine className="border border-gray-400 w-9 h-9 rounded-[50%] p-2" />
            </div>
            <div className="">
              <p className="text-[25px]">{statisticFields}</p>
              <p className="text-sm">In the past 12 months</p>
            </div>
          </div>
          <div className="bg-[#e9e9e9] rounded-[20px] p-4.5 gap-y-20 flex flex-col">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Bookings</p>
              <RiBookmarkLine className="border border-gray-400 w-9 h-9 rounded-[50%] p-2" />
            </div>
            <div className="">
              <p className="text-[25px]">{statisticBookings}</p>
              <p className="text-sm">In the past 12 months</p>
            </div>
          </div>
        </div>

        <div className="bg-[#e9e9e9] rounded-[20px] p-6">
          <div className="flex justify-between items-center mb-4">
            <p className="font-semibold">Doanh thu theo tháng</p>
            <p className="text-sm text-gray-600">
              {MONTHS_WINDOW} tháng gần nhất
            </p>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lineData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) =>
                    new Intl.NumberFormat("vi-VN").format(v)
                  }
                />
                <Tooltip
                  formatter={(value) => formatVnd(value)}
                  labelFormatter={(label) => `Tháng ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            Tổng: {formatVnd(totalRevenueByMonth)}
          </p>
        </div>
      </div>
    </>
  );
}

export default DashbroadBranch;
