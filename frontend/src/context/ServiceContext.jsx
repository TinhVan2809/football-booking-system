import { createContext, useState } from "react";

const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
    const API_BASE = 'http://localhost/football-booking-system/backend-php/services/api/php';
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({});

    const fetchServicesByBranch = async({
        page = 1,
        limit = 25,
        branch_id,
    }) => {
        try{
            setLoading(true);
            const res = await fetch(`${API_BASE}?action=get&branch_id=${branch_id}&limit=${limit}&page=${page}`);
            if(!res.ok) {
                throw new Error("ERROR HTTP ", res.status);
            }

            const data = await res.json();
            if(data.success) {
                setServices(data.data);
                setPagination(data.pagination);
                setLoading(false);
            }

        } catch(err) {
            console.error("Error fetching services by branch", err);
            setLoading(false);
        }
    }
   
    
    return (
        <ServiceContext.Provider value={{ services, fetchServicesByBranch, loading, pagination  }}>
            {children}
        </ServiceContext.Provider>
    );
};

export default ServiceContext;