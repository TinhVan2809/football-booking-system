import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserContext from "../../context/UserContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";
const DEFAULT_LIMIT = 10;

function BranchNotifications() {
  const { branch_id } = useParams();
  const { user } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(DEFAULT_LIMIT);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  const emitUnreadCount = (count) => {
    window.dispatchEvent(
      new CustomEvent("branch-noti-unread", { detail: count }),
    );
  };

  useEffect(() => {
    
    if (!branch_id) return;
  
    const controller = new AbortController();
    const url = `${API_BASE_URL}/api/bookings/branch/${branch_id}/notifications?limit=${limit}&page=${page}`;

      //! Calling setState synchronously within an effect
      //? Có thể dùng try catch 
    setLoading(true); //eslint-disable-line
    setError("");

    fetch(url, { credentials: "include", signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (!data?.success) {
          setError(data?.message || "Khong the tai thong bao");
          return;
        }
        setNotifications(data.notifications || []);
        const totalCount = Number(data.total || 0);
        const unread = Number(data.unread_count || 0);
        setTotal(totalCount);
        setUnreadCount(unread);
        emitUnreadCount(unread);
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        setError("Khong the tai thong bao");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [branch_id, limit, page]);

  if (!user?.branch_id) return null;

  const totalPages = Math.max(1, Math.ceil(total / limit));

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

  const updateUnreadCount = (next) => {
    const safe = Math.max(0, next);
    setUnreadCount(safe);
    emitUnreadCount(safe);
  };

  const handleToggleRead = async (id, isRead) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/bookings/branch/${branch_id}/notifications/read`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ ids: [id], is_read: isRead ? 0 : 1 }),
        },
      );
      const data = await res.json();
      if (!data?.success) return;

      setNotifications((prev) =>
        prev.map((n) =>
          n.branch_notification_id === id
            ? { ...n, is_read: isRead ? 0 : 1 }
            : n,
        ),
      );

      setUnreadCount((prev) => {
        const next = isRead ? prev + 1 : Math.max(0, prev - 1);
        emitUnreadCount(next);
        return next;
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/bookings/branch/${branch_id}/notifications/read`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ all: true, is_read: 1 }),
        },
      );
      const data = await res.json();
      if (!data?.success) return;

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
      updateUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearHistory = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/bookings/branch/${branch_id}/notifications`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      const data = await res.json();
      if (!data?.success) return;

      setNotifications([]);
      setTotal(0);
      updateUnreadCount(0);
      setPage(1);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="px-6 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Thống báo đặt sân
            </h2>
            <p className="text-sm text-gray-500">
              Chưa đọc: {unreadCount}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"
              onClick={handleMarkAllRead}
            >
              Đánh dấu đã đọc 
            </button>
            <button
              className="text-sm px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
              onClick={handleClearHistory}
            >
              Xóa lịch sử
            </button>
          </div>
        </div>

        {loading && (
          <p className="text-sm text-gray-500">Dang tai thong bao...</p>
        )}

        {!loading && error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {!loading && !error && notifications.length === 0 && (
          <p className="text-sm text-gray-500">Chưa có thông báo nào.</p>
        )}

        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.branch_notification_id || n.booking_id}
              className={`bg-white rounded-xl border shadow-sm px-4 py-3 ${
                Number(n.is_read) === 0
                  ? "border-green-200 bg-green-50/40"
                  : "border-gray-100"
              }`}
            >
              <p className="text-sm font-medium text-gray-800">
                {n.content || "Co thong bao moi"}
              </p>
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>{formatTime(n.created_at)}</span>
                <div className="flex items-center gap-2">
                  {n.booking_id && (
                    <span className="px-2 py-0.5 rounded-full bg-gray-100">
                      Booking #{n.booking_id}
                    </span>
                  )}
                  <button
                    className="px-2 py-0.5 rounded-full bg-gray-100 hover:bg-gray-200"
                    onClick={() =>
                      handleToggleRead(
                        n.branch_notification_id,
                        Number(n.is_read) === 1,
                      )
                    }
                  >
                    {Number(n.is_read) === 1 ? "Da doc" : "Chua doc"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Trước
            </button>
            <span className="text-sm text-gray-600">
              Trang {page} / {totalPages}
            </span>
            <button
              className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BranchNotifications;
