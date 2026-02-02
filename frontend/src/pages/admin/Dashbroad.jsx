import { useState, useEffect } from "react";

// Trang Dashbroad admin
function Dashbroad() {
  const API_BASE_STATISIC =
    "http://localhost/football-booking-system/backend-php/statistics/api.php";
  const [statisticUsers, setStatisticUsers] = useState(0);
  const [statisticBranches, setStatisticBranches] = useState(0);
  const [statisticFieldFieldTypes, setStatisticFieldFieldTypes] = useState(0);

  const [error, setError] = useState(null);
  
// TODO: Fetch toàn bộ thống kê cho trang admin
  const fetchStatisicData = async () => {
  
    try {
      const [usersRes, branchesRes, fieldFieldTypesRes] = await Promise.all([
        fetch(`${API_BASE_STATISIC}?action=statistic-users`),
        fetch(`${API_BASE_STATISIC}?action=statistic-branches`),
        fetch(`${API_BASE_STATISIC}?action=statistic-ffts`),
      ]);

      if (!usersRes.ok || !branchesRes.ok) {
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

      const fieldFieldTypesData  = await fieldFieldTypesRes.json();
      if(fieldFieldTypesData.success) {
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
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h2 className="text-gray-500 text-sm font-medium uppercase">Total Users</h2>
            <span className="text-3xl font-bold text-gray-800">{statisticUsers}</span>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <h2 className="text-gray-500 text-sm font-medium uppercase">Total Branches</h2>
            <span className="text-3xl font-bold text-gray-800">{statisticBranches}</span>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <h2 className="text-gray-500 text-sm font-medium uppercase">Total Field types</h2>
            <span className="text-3xl font-bold text-gray-800">{statisticFieldFieldTypes}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashbroad;
