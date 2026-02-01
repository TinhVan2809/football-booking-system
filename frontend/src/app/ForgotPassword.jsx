import { useState } from "react";
import { Link } from "react-router-dom";
import { RiArrowLeftLine } from "@remixicon/react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("http://localhost:8081/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error connect to server ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[#f3f4f6]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <Link to="/login" className="flex items-center gap-2 text-gray-500 mb-6 hover:text-black">
          <RiArrowLeftLine size={20} /> Quay lại đăng nhập
        </Link>
        
        <h2 className="text-2xl font-bold text-center mb-2">Quên mật khẩu?</h2>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label>
            <span className="block text-sm font-medium text-gray-700 mb-1">Email</span>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
              placeholder="nhapemailcuaban@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          {message && <div className="p-3 bg-green-100 text-green-700 rounded text-sm">{message}</div>}
          {error && <div className="p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700 transition disabled:bg-gray-400"
          >
            {loading ? "Đang gửi..." : "Gửi link xác nhận"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
