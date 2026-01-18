import { useState, useEffect } from "react";

function FieldList() {
    const API_BASE = 'http://localhost/football-booking-system/backend-php/fields/api.php';
    const LIMIT = 25;
    const [fields, setFields] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchFildes = async (page =1) => {
            try{
                const res = await fetch (`${API_BASE}?action=get&limit=${LIMIT}&page=${page}`);

                if(!res.ok) {
                    throw new Error("ERROR HTTP ", res.status);
                }

                const data = await res.json();
                if(data.success) {
                    setFields(data.data);
                    setTotalPages(data.total_pages || 1);
                }
            } catch(err) {
                setError(err.message);
                console.error("Error fetching fildes ", err);
            }
        } 
        fetchFildes(currentPage);
    },[currentPage]);

     const handlePrevPage = () => {
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      };

      const handleNextPage = () => {
        if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
        }
      };

    return (
        <>
        </>
    );
}

export default FieldList;