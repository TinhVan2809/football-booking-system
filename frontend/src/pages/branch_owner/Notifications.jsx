import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import { RiNotification3Line } from "@remixicon/react";
import UserContext from "../../context/UserContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8081";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

function Notifications() {
  const { user } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const [modalNotification, setModalNotification] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const modalTimerRef = useRef(null);

  const emitUnreadCount = (count) => {
    window.dispatchEvent(
      new CustomEvent("branch-noti-unread", { detail: count }),
    );
  };

  useEffect(() => {
    if (!user?.branch_id) return;

    const controller = new AbortController();
    const url = `${API_BASE_URL}/api/bookings/branch/${user.branch_id}/notifications?limit=20`;

    fetch(url, { credentials: "include", signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (!data?.success) return;
        const normalized = (data.notifications || []).map((n) => ({
          id:
            n.branch_notification_id ||
            n.booking_id ||
            `${n.created_at}-${Math.random()}`,
          content: n.content,
          created_at: n.created_at,
          booking_id: n.booking_id,
          is_read: n.is_read ?? 0,
        }));
        setNotifications(normalized);
        const unread = Number(data.unread_count || 0);
        setUnreadCount(unread);
        emitUnreadCount(unread);
      })
      .catch(() => {});

    return () => controller.abort();
  }, [user?.branch_id]);

  useEffect(() => {
    const onUnreadUpdate = (event) => {
      if (typeof event?.detail === "number") {
        setUnreadCount(event.detail);
      }
    };
    window.addEventListener("branch-noti-unread", onUnreadUpdate);
    return () => window.removeEventListener("branch-noti-unread", onUnreadUpdate);
  }, []);

  useEffect(() => {
    if (!user?.branch_id) return;

    const socket = io(SOCKET_URL, { withCredentials: true });

    socket.on("connect", () => {
      socket.emit("join_branch", { branch_id: user.branch_id });
    });

    socket.on("branch_new_booking", (payload) => {
      const item = {
        id: payload?.booking_id || `${Date.now()}-${Math.random()}`,
        received_at: new Date().toISOString(),
        content: payload?.message,
        is_read: 0,
        ...payload,
      };
      let isDuplicate = false;
      setNotifications((prev) => {
        if (item.booking_id && prev.some((p) => p.booking_id === item.booking_id)) {
          isDuplicate = true;
          return prev;
        }
        return [item, ...prev].slice(0, 20);
      });
      if (!isDuplicate) {
        setUnreadCount((prev) => {
          const next = prev + 1;
          emitUnreadCount(next);
          return next;
        });
        setModalNotification(item);
      }

      if (modalTimerRef.current) {
        clearTimeout(modalTimerRef.current);
      }
      modalTimerRef.current = setTimeout(() => {
        setModalNotification(null);
      }, 10000);
    });

    return () => {
      if (modalTimerRef.current) clearTimeout(modalTimerRef.current);
      socket.disconnect();
    };
  }, [user?.branch_id]);


  if (!user?.branch_id) return null;

  const formatTime = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const time = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const day = date.toLocaleDateString("vi-VN");
    return `${time} ${day}`;
  };

  return (
    <>
      {/* <div className="fixed top-20 right-4 z-400 w-80">
        <div className="bg-white/95 backdrop-blur rounded-xl shadow-xl border border-gray-100">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <RiNotification3Line size={18} className="text-green-700" />
              <p className="text-sm font-semibold text-gray-800">
                Thông báo đặt sân
              </p>
            </div>
            {notifications.length > 0 && (
              <button
                className="text-xs text-gray-500 hover:text-gray-800"
                onClick={() => setNotifications([])}
              >
                Xóa
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-4 text-sm text-gray-500">
                Chưa có thông báo mới.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="px-4 py-3 border-b border-gray-100 last:border-b-0"
                >
                  <p className="text-sm font-medium text-gray-800">
                    {n.content ||
                      n.message ||
                      `Co khach dat ${n.field_name || "san"} ngay ${n.booking_date || ""}`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTime(n.created_at || n.received_at)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div> */}

      {modalNotification && (
      
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5 fixed z-400 top-0 right-0 mt-10 mr-10">
            <div className="flex items-center gap-2 mb-2">
              <RiNotification3Line size={20} className="text-green-700" />
              <h3 className="text-base font-semibold text-gray-800">
                Thông báo mới
              </h3>
            </div>
            <p className="text-sm text-gray-700">
              {modalNotification.content ||
                modalNotification.message ||
                "Co thong bao dat san moi"}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {formatTime(
                modalNotification.created_at || modalNotification.received_at,
              )}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <Link
                to={`/branch_owner/bookings/${user?.branch_id}`}
                className="text-sm text-green-700 hover:text-green-800"
              >
                Xem danh sach dat san
              </Link>
              <button
                className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"
                onClick={() => setModalNotification(null)}
              >
                Dong
              </button>
            </div>
          </div>
       
      )}
    </>
  );
}

export default Notifications;
