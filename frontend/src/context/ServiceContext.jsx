import { createContext, useCallback, useState } from "react";

const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
  const API_BASE =
    "http://localhost/football-booking-system/backend-php/services/api.php";
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});

  const fetchServicesByBranch = useCallback(async ({ page = 1, limit = 25, branch_id }) => {
    if (!branch_id) {
      console.warn("branch_id is required");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE}?action=get&branch_id=${branch_id}&limit=${limit}&page=${page}`,
      );
      if (!res.ok) {
        throw new Error(`ERROR HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setServices(data.data);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error("Error fetching services by branch", err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  },[]);

  return (
    <ServiceContext.Provider
      value={{ services, fetchServicesByBranch, loading, pagination }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export default ServiceContext;
