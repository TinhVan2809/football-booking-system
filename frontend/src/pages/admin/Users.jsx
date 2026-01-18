import { useState, useEffect } from "react";

function Users() {
    const API_BASE = "http://localhost/football-booking-system/backend-php/users/api.php";
    const LIMIT = 10;
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchUsersData = async (page = 1) => {
            try{
                const res = await fetch(`${API_BASE}?action=get&limit=${LIMIT}&page=${page}`);
                if(!res.ok) {
                    throw new Error ("Error http ", res.status);
                }

                const data = await res.json();
                if(data.success) {
                    setUsers(data.data);
                    setTotalPages(data.total_pages || 1);
                }
            } catch(err) {  
                setError(err.message);
                console.error("Error fetching users ", err)
            }
        }

        fetchUsersData(currentPage);
    }, [currentPage]);


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
           {users.map(u => (
            <div className="" key={u.username}>
                <span>{u.username}</span>
                <span>{u.full_name}</span>
            </div>
           ))}
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
        </>
    );
}

export default Users;