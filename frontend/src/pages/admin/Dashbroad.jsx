import { useState, useEffect } from "react";

import Card from "../../components/admin/Card";
import TopFields from "../../components/admin/TopFields";
import {
  RiUserCommunityLine,
  RiGitMergeLine,
  RiEditBoxLine,
  RiShape2Line,
} from "@remixicon/react";

// Trang Dashbroad admin
function Dashbroad() {
  const API_BASE_STATISIC =
    "http://localhost/football-booking-system/backend-php/statistics/api.php";
  const [statisticUsers, setStatisticUsers] = useState(0);
  const [statisticBranches, setStatisticBranches] = useState(0);
  const [statisticFieldFieldTypes, setStatisticFieldFieldTypes] = useState(0);

  const [error, setError] = useState(null);

  // TODO: Fetch thống kê cho trang admin
  const fetchStatisicData = async () => {
    try {
      const [usersRes, branchesRes, fieldFieldTypesRes] = await Promise.all([
        fetch(`${API_BASE_STATISIC}?action=statistic-users`),
        fetch(`${API_BASE_STATISIC}?action=statistic-branches`),
        fetch(`${API_BASE_STATISIC}?action=statistic-ffts`),
      ]);

      if (!usersRes.ok || !branchesRes.ok || fieldFieldTypesRes.ok) {
        throw new Error("HTTP ERROR");
      }

      const usersData = await usersRes.json();
      if (usersData.success) {
        setStatisticUsers(usersData.data);
      }

      const branchesData = await branchesRes.json();
      if (branchesData.success) {
        setStatisticBranches(branchesData.data);
      }

      const fieldFieldTypesData = await fieldFieldTypesRes.json();
      if (fieldFieldTypesData.success) {
        setStatisticFieldFieldTypes(fieldFieldTypesData.data);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching statisic data ", err);
    }
  };

  useEffect(() => {
    fetchStatisicData();
  }, []);

  return (
    <>
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-6">
        <section className="xl:col-span-8 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-5">
            <div>
              <h3 className="text-lg font-semibold">Thống kê hôm nay</h3>
              <span className="text-gray-500 text-sm">Sales Summary</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <RiUserCommunityLine size={24} className="text-yellow-500" />
              <p className="mt-3 text-lg font-bold">{statisticUsers}</p>
              <p className="text-sm text-slate-700">Total Users</p>
              <p className="text-xs text-yellow-500">+10% from yesterday</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <RiGitMergeLine size={24} className="text-blue-700" />
              <p className="mt-3 text-lg font-bold">{statisticBranches}</p>
              <p className="text-sm text-slate-700">Total Branches</p>
              <p className="text-xs text-blue-700">+10% from yesterday</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <RiEditBoxLine size={24} className="text-green-700" />
              <p className="mt-3 text-lg font-bold">
                {statisticFieldFieldTypes}
              </p>
              <p className="text-sm text-slate-700">Total Fields</p>
              <p className="text-xs text-green-700">+10% from yesterday</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <RiShape2Line size={24} className="text-cyan-700" />
              <p className="mt-3 text-lg font-bold">12</p>
              <p className="text-sm text-slate-700">New bookings</p>
              <p className="text-xs text-cyan-700">+10% from yesterday</p>
            </div>
          </div>
        </section>

        <div className="xl:col-span-4 flex justify-center xl:justify-end">
          <Card />
        </div>

        <section className="xl:col-span-8 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold">Top Fields</p>
          </div>
          <div className="mt-4 overflow-x-auto">
            <TopFields />
          </div>
        </section>

        <div className="xl:col-span-4 flex justify-center xl:justify-end">
          <Card />
        </div>
      </div>
    </>
  );
}

export default Dashbroad;
