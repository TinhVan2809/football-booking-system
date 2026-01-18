import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        full_name: "",
        phone: "",
        role: "customer" // Mặc định là khách hàng
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8081/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Đăng ký thành công! Vui lòng đăng nhập.");
                navigate("/login");
            } else {
                // Hiển thị lỗi từ backend (ví dụ: Duplicate entry)
                alert(data.message || (data.error && data.error.sqlMessage) || "Đăng ký thất bại");
            }
        } catch (error) {
            console.error("Register error:", error);
            alert("Có lỗi xảy ra khi kết nối server");
        }
    };

    return (
        <div className="w-full h-screen flex justify-center items-center">
            <form onSubmit={handleRegister} className="flex flex-col gap-4 border p-8 rounded shadow-md bg-white w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Đăng Ký</h2>
                
                <label className="flex flex-col">
                    <span className="font-medium text-sm mb-1">Username</span>
                    <input 
                        type="text" 
                        name="username" 
                        className="border p-2 rounded"
                        onChange={handleChange}
                        required
                    />
                </label>
                
                <label className="flex flex-col">
                    <span className="font-medium text-sm mb-1">Password</span>
                    <input 
                        type="password" 
                        name="password" 
                        className="border p-2 rounded"
                        onChange={handleChange}
                        required
                    />
                </label>

                <label className="flex flex-col">
                    <span className="font-medium text-sm mb-1">Họ và tên</span>
                    <input 
                        type="text" 
                        name="full_name" 
                        className="border p-2 rounded"
                        onChange={handleChange}
                        required
                    />
                </label>

                <label className="flex flex-col">
                    <span className="font-medium text-sm mb-1">Số điện thoại</span>
                    <input 
                        type="text" 
                        name="phone" 
                        className="border p-2 rounded"
                        onChange={handleChange}
                        required
                    />
                </label>

                <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-800 mt-4">
                    Đăng Ký
                </button>
                
                <p className="text-sm text-center mt-2">
                    Đã có tài khoản? <span className="text-blue-600 cursor-pointer font-medium" onClick={() => navigate('/login')}>Đăng nhập</span>
                </p>
            </form>
        </div>
    );
}

export default Register;
