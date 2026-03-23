import { useState, useEffect } from "react";
import UserModalDetail from "../../components/admin/UserModalDetail";


function Users() {
    const API_BASE = "http://localhost/football-booking-system/backend-php/users/api.php";
    const LIMIT = 10;
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

     const [userDetail, setUserDetail] = useState(false);
     const [selectedUserId, setSelecteduserId] = useState(null);


    // lấy danh sách tất cả users bao gồm admin và chi nhánh.
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

      if(error) {
        return <div>Something went wrong!</div>
      }

     
      const onOpenUserModalDetail = (user_id) => {
        setUserDetail(true);
        setSelecteduserId(user_id);
      }

      const onCloseUserModalDetail = () => {
        setUserDetail(false);
        selectedUserId(null);
      }

    return (
        <>
          <div className="flex flex-col gap-3">
            
            <table className="border-collapse border border-gray-400">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-4 text-left font-semibold text-gray-900 dark:border-gray-600 dark:text-gray-200">Username</th>
                  <th className="border border-gray-300 p-4 text-left font-semibold text-gray-900 dark:border-gray-600 dark:text-gray-200">Nick Name</th>
                  <th className="border border-gray-300 p-4 text-left font-semibold text-gray-900 dark:border-gray-600 dark:text-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
              {users.map(u => (
                <tr key={u.user_id}>
                  <td className="border border-gray-300 p-4 text-gray-500 dark:border-gray-700 dark:text-gray-400">{u.full_name}</td>
                  <td className="border border-gray-300 p-4 text-gray-500 dark:border-gray-700 dark:text-gray-400">{u.username}</td>
                  <td className="border border-gray-300 p-4 text-gray-500 dark:border-gray-700 dark:text-gray-400 cursor-pointer hover:underline" onClick={() => onOpenUserModalDetail(u.user_id)}>Xem chi tiết</td>
                </tr>
              ))}
              </tbody>
            </table>


           {userDetail && (
            <div>
              <UserModalDetail user_id ={selectedUserId} close={onCloseUserModalDetail}/>
            </div>
           )}


          </div>
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