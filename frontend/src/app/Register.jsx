import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { RiAppleFill, RiArrowRightLine } from "@remixicon/react";

import "../styles/Register.css";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    phone: "",
    role: "customer", // Mặc định là khách hàng
  });
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confimPassword').value;

  if(password != confirmPassword) {
    console.log("Mật khẩu xác nhận không khớp");
    return;
  }

    try {
      const response = await fetch("http://localhost:8081/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
       setSuccess(true);
      } else {
        // Hiển thị lỗi từ backend (ví dụ: Duplicate entry)
        alert(
          data.message ||
            (data.error && data.error.sqlMessage) ||
            "Đăng ký thất bại",
        );
      }
    } catch (error) {
      console.error("Register error:", error);
      alert("Có lỗi xảy ra khi kết nối server");
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[#5c566d]">
      <section className="w-[70%] h-[90%] flex bg-[#2c2638] p-4 rounded-xl gap-2">
        <div className="relative w-110 h-full">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 3500 }}
            pagination={{ clickable: true, el: ".custom-pagination" }}
            className="absolute top-0 z-100 h-full rounded-xl"
          >
            <SwiperSlide>
              <img
                src="../../assets/pexels-rick98-10751047.jpg"
                className="w-110 h-full object-cover"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="../../assets/pexels-unknown6user-1657334.jpg"
                className="w-110 h-full object-cover"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="../../assets/pexels-zynaly-27915835.jpg"
                className="w-110 h-full object-cover"
              />
            </SwiperSlide>
          </Swiper>
          <div className="absolute top-0 z-200 w-full h-full flex flex-col justify-between p-5  ">
            <div className="flex justify-between item-center">
              <p className="text-white text-xl font-bold">HASEBOOKING</p>
              <Link className="back-to-website text-white text-sm flex gap-2 px-2 py-0.5 bg-amber-50 rounded-2xl" onClick={() => navigate('/')}>
                Back to website <RiArrowRightLine />
              </Link>
            </div>
            <div className="flex justify-center items-center mb-5">
              <p className="text-white text-sm">
                Đăng ký tài khoản để trải nghiệm tốt hơn
              </p>
            </div>
          </div>
          <div
            className="custom-pagination absolute bottom-4 left-0 z-300 flex w-full justify-center gap-2"
            style={{
              "--swiper-pagination-color": "#ffffff", // Màu chấm đang active (Trắng)
              "--swiper-pagination-bullet-inactive-color": "#999999", // Màu chấm inactive (Xám)
              "--swiper-pagination-bullet-inactive-opacity": "0.5", // Độ mờ chấm inactive
              "--swiper-pagination-bullet-width": "30px", // Chiều rộng dài ra
              "--swiper-pagination-bullet-height": "3px", // Chiều cao thấp hơn
              "--swiper-pagination-bullet-border-radius": "6px", // Bo góc để tạo hình viên thuốc
            }}
          ></div>
        </div>

        <div className="flex flex-col items-center justify-center flex-1">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-white text-4xl font-medium">
              Create an account
            </h1>
            <span className="text-[#7e7988] text-sm flex gap-2">
              Đã có tài khoản?{" "}
              <Link className="text-purple-600 underline" onClick={() => navigate('/login')}>Login</Link>
            </span>
          </div>
          <form
            id="register"
            onSubmit={handleRegister}
            className="flex flex-col mt-10 gap-5"
          >
            <div className="flex w-full justify-center items-center gap-3">
              <label className="">
                <input
                  type="text"
                  name="full_name"
                  className="bg-[#3c364c] px-3 py-2.5 rounded-md text-white font-light outline-0 focus:border-violet-500 focus:border-2 border-transparent border-2 duration-200"
                  onChange={handleChange}
                  required
                  placeholder="Họ và Tên"
                />
              </label>

              <label className="">
                <input
                  type="text"
                  name="phone"
                  className="bg-[#3c364c] px-3 py-2.5 rounded-md text-white font-light outline-0 focus:border-violet-500 focus:border-2 border-transparent border-2 duration-200"
                  onChange={handleChange}
                  required
                  placeholder="(+84) Số điện thoại"
                />
              </label>
            </div>

            <label className="">
              <input
                type="text"
                name="username"
                className="bg-[#3c364c] px-3 py-2.5 rounded-md text-white font-light outline-0 focus:border-violet-500 focus:border-2 border-transparent border-2 w-full duration-200"
                onChange={handleChange}
                required
                placeholder="Email hoặc Username"
              />
            </label>

            <div className="flex gap-3">
              <label className="">
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="bg-[#3c364c] px-3 py-2.5 rounded-md text-white font-light outline-0 focus:border-violet-500 focus:border-2 border-transparent border-2 duration-200"
                  onChange={handleChange}
                  required
                  placeholder="Password"
                />
              </label>

              <label htmlFor="">
                <input
                  type="password"
                  id="confimPassword"
                  className="bg-[#3c364c] px-3 py-2.5 rounded-md text-white font-light outline-0 focus:border-violet-500 focus:border-2 border-transparent border-2 duration-200"
                  required
                  placeholder="Xác nhận mật khẩu"
                />
              </label>
            </div>

           <div className="w-full flex justify-center items-center">
             <button type="submit" className="px-4 py-2 bg-[#6d54b5] text-white w-full rounded-sm cursor-pointer duration-200 hover:bg-[#6c4fc5]">
              Đăng Ký
            </button>
           </div>
          </form>
          <div className="flex w-full mt-10 flex-col px-12">
            <div className="flex w-full justify-between items-center">
              <hr className="w-45 border border-[#7c7787] rounded-2xl"/>
              <span className="text-[#7c7787] text-sm">Or register with</span>
              <hr className="w-45 border border-[#7c7787] rounded-2xl"/>
            </div>
            <div className="flex w-full justify-center item-center gap-5 mt-4">
              <button className="border-2 border-[#7c7787] px-9 py-2 flex justify-center items-center gap-2 text-white rounded-md cursor-pointer">
                <img
                  src="../../assets/google-lens-icon-logo-symbol-free-png.png"
                  className="w-5.5"
                />{" "}
                Google
              </button>
              <button className="border-2 border-[#7c7787] px-9 py-2 flex justify-center items-center gap-2 text-white rounded-md cursor-pointer">
                <RiAppleFill /> Apple
              </button>
            </div>
          </div>
        </div>
      </section>

      {success && (
        <div className="w-screen h-screen flex fixed z-400 justify-center items-center">
          <div className="bg-[#30224b] flex flex-col justify-center items-center gap-9 shadow-2xl rounded-xl p-10">
            <span className="text-white text-2xl font-semibold">Đăng ký thành công!</span>
            <button className="bg-violet-700 text-white rounded-md w-full py-2 flex justify-center items-center cursor-pointer" onClick={() => navigate('/login')}>Quay lại trang đăng nhập</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
