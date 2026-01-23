import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import UserContext from "../context/UserContext";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { RiPhoneLine, RiEyeLine, RiEyeOffLine } from "@remixicon/react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);
  const [errorUsername, setErrorUserName] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

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
        } else if (data.user.role === "branch_owner") {
          navigate("/branch_owner"); //[DASHBROAD] Trang pages/branch_owner/Dashbroad.jsx
        } else {
          navigate("/"); //[HOME] Trang pages/customer/Home.jsx
        }
      } else {
        if (data.message == "User not found") {
          setErrorUserName(data.message);
          setErrorPassword(null);
        } else {
          setErrorPassword(data.message);
          setErrorUserName(null);
        }
        console.error(data.message || "Lỗi khi đăng nhập!");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Có lỗi xảy ra khi kết nối server");
    }
  };

  return (
    <>
      <div className="w-full h-screen flex justify-center items-center">
        <section className="w-fit h-150 flex justify-between gap-10">
          <div className="w-100 h-full flex flex-col justify-center items-center">
            <div className="flex gap-2 items-center w-full">
              <img
                src="../../assets/HASEBOOKING-Photoroom.png"
                className="w-10"
              />
              <p className="text-2xl font-bold">HASEBOOKNG</p>
            </div>
            <div className="">
              <h2 className="text-gray-400">
                Welcom back! Đăng nhập để trải nghiệm những tính năg mới mẽ
              </h2>
            </div>
            <form
              onSubmit={handleLogin}
              className="w-full flex flex-col gap-10 mt-10"
            >
              <label htmlFor="">
                <input
                  type="text"
                  placeholder="Username"
                  className="border-b-2 w-full px-1 py-2  outline-0"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {errorUsername ? (
                 
                    <span className="text-red-500 text-sm">
                      {errorUsername}
                    </span>
               
                ) : (
                  ""
                )}
              </label>
              <label htmlFor="" className="relative flex justify-center items-center flex-col">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="border-b-2 w-full px-1 py-2  outline-0"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {showPassword ? (
                  <RiEyeLine
                    size={20}
                    className="absolute right-0 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <RiEyeOffLine
                    size={20}
                    className="absolute right-0 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                )} 
               {errorPassword ? (
                    <span className="text-red-500 text-sm">
                      {errorPassword}
                    </span>

                ) : (
                  ""
                )}
              </label>
              <div className="w-full flex items-center justify-between ">
                <label htmlFor="" className="flex items-center">
                  <input type="checkbox" className="w-5.5 cursor-pointer" />
                  <span>Remenber me</span>
                </label>
                <Link className="hover:underline">Forgot Password?</Link>
              </div>
              <div className="w-full flex  items-end gap-3">
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-1 cursor-pointer rounded-2xl hover:bg-green-700"
                >
                  Đăng Nhập
                </button>
                <p className="text-sm">
                  Chưa có tài khoản?{" "}
                  <span
                    className="text-green-800 hover:underline hover:cursor-pointer"
                    onClick={() => navigate("/register")}
                  >
                    Đăng ký
                  </span>
                </p>
              </div>
            </form>
          </div>

          <div className="w-110 h-full relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              slidesPerView={1}
              loop={true}
              autoplay={{ delay: 3500 }}
              className="w-full h-full rounded-xl"
            >
              <SwiperSlide>
                <img
                  src="../../assets/pexels-furknsaglam-1596977-3131406.jpg"
                  className="w-full  h-full object-cover"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="../../assets/pexels-matheus-oliveira-930042-16247310.jpg"
                  className=" w-full h-full object-cover"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="../../assets/pexels-viselaba-8470980.jpg"
                  className=" w-full  h-full object-cover"
                />
              </SwiperSlide>
            </Swiper>
            <div className="absolute h-full w-full z-100 top-0 flex flex-col justify-between p-4">
              <div className="">
                <h2 className="text-white text-3xl font-semibold">Login</h2>
              </div>
              <div className="flex w-full justify-between items-center">
                <Link className="back-to-website px-3 py-1 rounded-[20px] font-bold text-white flex gap-1 items-center">
                  <RiPhoneLine size={19} /> Contact me
                </Link>
                <Link className="text-white">Learn more</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Login;
