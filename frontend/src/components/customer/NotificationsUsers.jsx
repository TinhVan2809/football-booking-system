import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function NotificationsUsers() {
  const { user_id } = useParams();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchNotificationsData = async () => {
      try {
        const res = await fetch(
          `http://localhost:8081/notifications/${user_id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
        );

        if (!res.ok) {
          throw new Error(`HTTP ERROR ${res.status}`);
        }

        const data = await res.json();
          if (data.success) {
            setNotifications(data.notifications);
          }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching notifications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotificationsData();
  }, [user_id]);

  return <>
    <div className="">
        {notifications.map(n => (
            <div className="" key={n.notification_id}>
                <p>{n.content}</p>
            </div>
        ))}
    </div>
  </>;
}

export default NotificationsUsers;
