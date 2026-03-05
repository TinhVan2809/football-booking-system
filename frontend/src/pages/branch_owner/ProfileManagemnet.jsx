import { useContext } from "react";
import { useParams } from "react-router-dom";
import UserContext from "../../context/UserContext";
import useUserData from "../../hooks/usersHook";

function ProfileManagement() {
  const { logout } = useContext(UserContext);
  const API_USER =
    "http://localhost/football-booking-system/backend-php/users/api.php";

  const { user_id } = useParams();
  const { user, loading, error } = useUserData(
    user_id ? `${API_USER}?action=id&user_id=${user_id}` : null,
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Failed to fetch: {error}</p>;
  if (!user) return <p>Không tìm thấy thông tin người dùng.</p>;

  const avatarUrl = user.avata
    ? `http://localhost/football-booking-system/backend-php/uploads/avata/${user.avata}`
    : null;
  const initial = (user.username || "?").slice(0, 1).toUpperCase();

  return (
    <div className="w-full mt-10 px-10">
      <div className="bg-[#e9e9e9] rounded-[20px] p-6 max-w-xl">
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-xl font-semibold text-gray-700">
              {initial}
            </div>
          )}

          <div>
            <p className="text-lg font-semibold">{user.username}</p>
            <p className="text-sm text-gray-600">{user.email || "-"}</p>
          </div>
        </div>

        <hr className="border border-gray-200 my-5" />

        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <p className="text-sm text-gray-600">User ID</p>
            <p className="text-sm font-semibold">{user.user_id}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-gray-600">Phone</p>
            <p className="text-sm font-semibold">{user.phone || "-"}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-gray-600">Created at</p>
            <p className="text-sm font-semibold">
              {user.created_at?.slice(0, 10) || "-"}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button
            className="border border-red-300 w-full py-2 text-red-500 cursor-pointer hover:bg-red-500 hover:text-white duration-200 rounded-lg"
            onClick={logout}
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileManagement;
