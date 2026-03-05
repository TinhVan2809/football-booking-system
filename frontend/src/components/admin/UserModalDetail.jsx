import { useCallback, useEffect, useState } from "react";
import useUserData from "../../hooks/usersHook";

function Loading() {
  return (
    <div className="">
      <p>Loading...</p>
    </div>
  );
}

function UserModalDetail({ user_id, close }) {
  const API_BASE =
    "http://localhost/football-booking-system/backend-php/users/api.php";
  const [userBooking, setUserBooking] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserData = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API_BASE}?action=getAllBookingsByUser&user_id=${user_id}&limit=10&page=${page}`,
        );

        if (!res.ok) {
          throw new Error(`Error HTTP ${res.status}`);
        }

        const data = await res.json();

        if (data.success) {
          setUserBooking(data.data);
        }
      } catch (error) {
        console.error("Error fetching user data ", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [user_id],
  );

  useEffect(() => {
    fetchUserData();
  }, [user_id, fetchUserData]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="">
          <div>
            {userBooking.map((b) => (
              <p>{b.booking_id}</p>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default UserModalDetail;
