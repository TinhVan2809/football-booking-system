import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8081/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
                credentials: "include", // Để nhận cookie từ backend
            });

            const data = await response.json();

            if (response.ok) {
                // Lưu thông tin user (không bao gồm token vì token nằm trong cookie httpOnly)
                localStorage.setItem("user", JSON.stringify(data.user));
                setUser(data.user); // Cập nhật user vào context
                
                if (data.user.role === "admin") {
                    navigate("/admin"); //[DASHBROAD] Trang pages/admin/Dashbroad.jsx
                } else if(data.user.role === "branch_owner") {
                    navigate("/branch_owner"); //[DASHBROAD] Trang pages/branch_owner/Dashbroad.jsx
                } else {
                    navigate("/"); //[HOME] Trang pages/customer/Home.jsx 
                }
            } else {
                alert(data.message || "Đăng nhập thất bại");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Có lỗi xảy ra khi kết nối server");
        }
    };

    return (

        <>
            <div className="w-full h-screen flex justify-center items-center">
                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    <label htmlFor="" className="flex flex-col">
                        <span>Username</span>
                        <input 
                            type="text" 
                            placeholder="Username" 
                            className="border w-40"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>
                    <label htmlFor="" className="flex flex-col">
                        <span>Password</span>
                        <input 
                            type="password" 
                            placeholder="password" 
                            className="border w-40"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    <div className="">
                        <button type="submit" className="bg-black text-white px-4 py-1 cursor-pointer">Đăng Nhập</button>
                    </div>
                    <p className="text-sm">
                        Chưa có tài khoản? <span className="text-blue-600 cursor-pointer" onClick={() => navigate('/register')}>Đăng ký ngay</span>
                    </p>
                    <a onClick={() => navigate('/')}>Quay lại trang chủ</a>
                </form>
            </div>
        </>
    );
}

export default Login;